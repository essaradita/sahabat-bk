// Vercel Serverless Function: Classes Management
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db-postgres.js'

function verifyTeacher(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'teacher') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const decoded = verifyTeacher(req)

    // GET - Get all classes
    if (req.method === 'GET') {
      const classes = await query(`
        SELECT * FROM classes
        ORDER BY grade, name
      `)
      return res.json(classes)
    }

    // POST - Create class
    if (req.method === 'POST') {
      const { name, grade, teacherName, studentCount } = req.body

      if (!name || !grade) {
        return res.status(400).json({ error: 'Nama dan tingkat kelas wajib diisi' })
      }

      const classId = `cls-${Date.now()}`

      await query(
        `INSERT INTO classes (id, name, grade, teacher_name, teacher_id, student_count)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          classId,
          name,
          parseInt(grade),
          teacherName || 'Ibu Rina',
          decoded.userId,
          studentCount || 0
        ]
      )

      const classes = await query('SELECT * FROM classes WHERE id = $1', [classId])

      return res.json({ success: true, class: classes[0] })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Classes error:', err)
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal memproses permintaan' })
  }
}
