// Vercel Serverless Function: Get Profile
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db-postgres.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
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

    // Jika student, ambil progress
    if (user.role === 'student') {
      const progress = await query('SELECT * FROM student_progress WHERE student_id = $1', [user.id])
      if (progress[0]) {
        user.xp = progress[0].xp || 0
        user.level = progress[0].level || 1
        user.coins = progress[0].coins || 0
      }
    }

    res.json(user)
  } catch (err) {
    console.error('Get profile error:', err)
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal mengambil profil' })
  }
}
