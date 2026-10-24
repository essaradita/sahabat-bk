// Vercel Serverless Function: Register Student
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { query } from '../../lib/db-postgres.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { name, username, password, kelas, gender } = req.body

    // Validasi
    if (!name || !username || !password || !kelas) {
      return res.status(400).json({ error: 'Semua field wajib diisi' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' })
    }

    // Cek username sudah dipakai
    const existing = await query('SELECT id FROM profiles WHERE username = $1', [username])

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username sudah dipakai' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = randomUUID()
    const avatarType = gender === 'female' ? 'girl1' : 'boy1'
    const email = `${username}@sahabatbk.internal`

    // Insert user
    await query(
      `INSERT INTO profiles (id, role, name, username, email, password, kelas, avatar, gender) 
       VALUES ($1, 'student', $2, $3, $4, $5, $6, $7, $8)`,
      [userId, name, username, email, hashedPassword, kelas, avatarType, gender || 'male']
    )

    // Insert progress
    await query(
      `INSERT INTO student_progress (id, student_id, xp, level, coins) 
       VALUES ($1, $2, 0, 1, 0)`,
      [randomUUID(), userId]
    )

    // Generate token
    const token = jwt.sign({ userId, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Get profile
    const profiles = await query('SELECT id, role, name, username, kelas, avatar, gender FROM profiles WHERE id = $1', [userId])

    res.json({
      user: { id: userId, email },
      profile: profiles[0],
      token
    })
  } catch (err) {
    console.error('Register student error:', err)
    res.status(500).json({ error: 'Gagal mendaftar' })
  }
}
