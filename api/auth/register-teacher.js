// Vercel Serverless Function: Register Teacher
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
    const { name, email, password, school } = req.body

    // Validasi
    if (!name || !email || !password || !school) {
      return res.status(400).json({ error: 'Semua field wajib diisi' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' })
    }

    // Cek email sudah dipakai
    const existing = await query('SELECT id FROM profiles WHERE email = $1', [email])

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = randomUUID()

    // Insert user
    await query(
      `INSERT INTO profiles (id, role, name, email, password, school) 
       VALUES ($1, 'teacher', $2, $3, $4, $5)`,
      [userId, name, email, hashedPassword, school]
    )

    // Generate token
    const token = jwt.sign({ userId, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Get profile
    const profiles = await query('SELECT id, role, name, email, school FROM profiles WHERE id = $1', [userId])

    res.json({
      user: { id: userId, email },
      profile: profiles[0],
      token
    })
  } catch (err) {
    console.error('Register teacher error:', err)
    res.status(500).json({ error: 'Gagal mendaftar' })
  }
}
