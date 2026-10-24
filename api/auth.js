// Vercel Serverless Function: All Authentication Endpoints
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { query } from '../lib/db-postgres.js'

// Helper function
function generateToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  try {
    // POST /api/auth/register-student
    if (pathname === '/api/auth/register-student' && req.method === 'POST') {
      const { name, username, password, kelas, gender } = req.body

      if (!name || !username || !password || !kelas) {
        return res.status(400).json({ error: 'Semua field wajib diisi' })
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password minimal 8 karakter' })
      }

      const existing = await query('SELECT id FROM profiles WHERE username = $1', [username])
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Username sudah dipakai' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const userId = randomUUID()
      const avatarType = gender === 'female' ? 'girl1' : 'boy1'
      const email = `${username}@sahabatbk.internal`

      await query(
        `INSERT INTO profiles (id, role, name, username, email, password, kelas, avatar, gender) 
         VALUES ($1, 'student', $2, $3, $4, $5, $6, $7, $8)`,
        [userId, name, username, email, hashedPassword, kelas, avatarType, gender || 'male']
      )

      await query(
        `INSERT INTO student_progress (id, student_id, xp, level, coins) 
         VALUES ($1, $2, 0, 1, 0)`,
        [randomUUID(), userId]
      )

      const token = generateToken(userId, 'student')
      const profiles = await query('SELECT id, role, name, username, kelas, avatar, gender FROM profiles WHERE id = $1', [userId])

      return res.json({
        user: { id: userId, email },
        profile: profiles[0],
        token
      })
    }

    // POST /api/auth/register-teacher
    if (pathname === '/api/auth/register-teacher' && req.method === 'POST') {
      const { name, email, password, school } = req.body

      if (!name || !email || !password || !school) {
        return res.status(400).json({ error: 'Semua field wajib diisi' })
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password minimal 8 karakter' })
      }

      const existing = await query('SELECT id FROM profiles WHERE email = $1', [email])
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email sudah terdaftar' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const userId = randomUUID()

      await query(
        `INSERT INTO profiles (id, role, name, email, password, school) 
         VALUES ($1, 'teacher', $2, $3, $4, $5)`,
        [userId, name, email, hashedPassword, school]
      )

      const token = generateToken(userId, 'teacher')
      const profiles = await query('SELECT id, role, name, email, school FROM profiles WHERE id = $1', [userId])

      return res.json({
        user: { id: userId, email },
        profile: profiles[0],
        token
      })
    }

    // POST /api/auth/login-student
    if (pathname === '/api/auth/login-student' && req.method === 'POST') {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password wajib diisi' })
      }

      const users = await query(
        "SELECT * FROM profiles WHERE username = $1 AND role = 'student'",
        [username]
      )

      if (users.length === 0) {
        return res.status(401).json({ error: 'Username atau password salah' })
      }

      const user = users[0]
      const validPassword = await bcrypt.compare(password, user.password)
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Username atau password salah' })
      }

      const token = generateToken(user.id, user.role)
      const progress = await query('SELECT * FROM student_progress WHERE student_id = $1', [user.id])

      return res.json({
        user: { id: user.id, email: user.email },
        profile: {
          id: user.id,
          role: user.role,
          name: user.name,
          username: user.username,
          kelas: user.kelas,
          avatar: user.avatar,
          gender: user.gender,
          xp: progress[0]?.xp || 0,
          level: progress[0]?.level || 1,
          coins: progress[0]?.coins || 0
        },
        token
      })
    }

    // POST /api/auth/login-teacher
    if (pathname === '/api/auth/login-teacher' && req.method === 'POST') {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi' })
      }

      const users = await query(
        "SELECT * FROM profiles WHERE email = $1 AND role = 'teacher'",
        [email]
      )

      if (users.length === 0) {
        return res.status(401).json({ error: 'Email atau password salah' })
      }

      const user = users[0]
      const validPassword = await bcrypt.compare(password, user.password)
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Email atau password salah' })
      }

      const token = generateToken(user.id, user.role)

      return res.json({
        user: { id: user.id, email: user.email },
        profile: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          school: user.school
        },
        token
      })
    }

    // GET /api/auth/profile
    if (pathname === '/api/auth/profile' && req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) return res.status(401).json({ error: 'Token tidak ditemukan' })
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      const users = await query(
        'SELECT id, role, name, username, email, school, kelas, avatar, gender FROM profiles WHERE id = $1',
        [decoded.userId]
      )

      if (users.length === 0) {
        return res.status(404).json({ error: 'User tidak ditemukan' })
      }

      const user = users[0]

      if (user.role === 'student') {
        const progress = await query('SELECT * FROM student_progress WHERE student_id = $1', [user.id])
        if (progress[0]) {
          user.xp = progress[0].xp || 0
          user.level = progress[0].level || 1
          user.coins = progress[0].coins || 0
        }
      }

      return res.json(user)
    }

    return res.status(404).json({ error: 'Endpoint not found' })

  } catch (err) {
    console.error('Auth error:', err)
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal memproses permintaan' })
  }
}
