// Vercel Serverless Function: Mark Attendance
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    verifyTeacher(req)

    const { studentId, date, status } = req.body

    if (!studentId || !date || !status) {
      return res.status(400).json({ error: 'Student ID, date, dan status wajib diisi' })
    }

    if (!['hadir', 'sakit', 'izin', 'alpa'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }

    const recordId = `rec-${Date.now()}`

    // Check if record exists
    const existing = await query(`
      SELECT id FROM attendance_records
      WHERE student_id = $1 AND date = $2
    `, [studentId, date])

    if (existing.length > 0) {
      // Update existing
      await query(`
        UPDATE attendance_records
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = $2 AND date = $3
      `, [status, studentId, date])
    } else {
      // Insert new
      await query(`
        INSERT INTO attendance_records (id, student_id, date, status)
        VALUES ($1, $2, $3, $4)
      `, [recordId, studentId, date, status])
    }

    res.json({ success: true, message: 'Absensi berhasil disimpan' })
  } catch (err) {
    console.error('Mark attendance error:', err)
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal menyimpan absensi' })
  }
}
