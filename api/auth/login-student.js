// Vercel Serverless Function: Login Student
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db-postgres.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
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

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    const progress = await query('SELECT * FROM student_progress WHERE student_id = $1', [user.id])

    res.json({
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
  } catch (err) {
    console.error('Login student error:', err)
    res.status(500).json({ error: 'Gagal login' })
  }
}
