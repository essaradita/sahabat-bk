// Vercel Serverless Function: Delete Attendance Student
import jwt from 'jsonwebtoken'
import { query } from '../../../../lib/db-postgres.js'

function verifyTeacher(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'teacher') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    verifyTeacher(req)

    const { id } = req.query

    // DELETE - Delete attendance student
    if (req.method === 'DELETE') {
      const existing = await query('SELECT id FROM attendance_students WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Siswa tidak ditemukan' })
      }

      // Delete student (cascade will delete attendance records)
      await query('DELETE FROM attendance_students WHERE id = $1', [id])

      return res.json({ success: true, message: 'Siswa berhasil dihapus' })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Delete attendance student error:', err)
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal menghapus siswa' })
  }
}
