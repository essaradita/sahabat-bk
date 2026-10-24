// Vercel Serverless Function: Get All Students
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
    
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    // Get all students with their progress
    const students = await query(`
      SELECT 
        p.id,
        p.name,
        p.username,
        p.kelas,
        p.gender,
        p.avatar,
        p.created_at,
        sp.xp,
        sp.level,
        sp.coins
      FROM profiles p
      LEFT JOIN student_progress sp ON p.id = sp.student_id
      WHERE p.role = 'student'
      ORDER BY p.created_at DESC
    `)

    const studentsWithStats = students.map(student => ({
      ...student,
      missionsCompleted: 0,
      lastActive: student.created_at
    }))

    res.json(studentsWithStats)
  } catch (err) {
    console.error('Get students error:', err)
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal mengambil data siswa' })
  }
}
