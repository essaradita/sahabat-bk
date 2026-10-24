// Vercel Serverless Function: Class Operations by ID
import jwt from 'jsonwebtoken'
import { query } from '../../../lib/db-postgres.js'

function verifyTeacher(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'teacher') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    verifyTeacher(req)

    const { id } = req.query

    // PUT - Update class
    if (req.method === 'PUT') {
      const { name, grade, teacherName, studentCount } = req.body

      const existing = await query('SELECT id FROM classes WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Kelas tidak ditemukan' })
      }

      await query(
        `UPDATE classes 
         SET name = $1, grade = $2, teacher_name = $3, student_count = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5`,
        [name, parseInt(grade), teacherName, studentCount || 0, id]
      )

      const classes = await query('SELECT * FROM classes WHERE id = $1', [id])

      return res.json({ success: true, class: classes[0] })
    }

    // DELETE - Delete class
    if (req.method === 'DELETE') {
      const existing = await query('SELECT id FROM classes WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Kelas tidak ditemukan' })
      }

      await query('DELETE FROM classes WHERE id = $1', [id])

      return res.json({ success: true, message: 'Kelas berhasil dihapus' })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Class operations error:', err)
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
