// Vercel Serverless Function: Get Attendance Records
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    verifyTeacher(req)

    const { date } = req.query

    if (date) {
      // Get records for specific date
      const records = await query(`
        SELECT ar.*, ats.name, ats.kelas
        FROM attendance_records ar
        JOIN attendance_students ats ON ar.student_id = ats.id
        WHERE ar.date = $1
        ORDER BY ats.kelas, ats.name
      `, [date])

      return res.json(records)
    } else {
      // Get all unique dates with summary
      const dates = await query(`
        SELECT 
          date,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
          SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin,
          SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
          SUM(CASE WHEN status = 'alpa' THEN 1 ELSE 0 END) as alpa
        FROM attendance_records
        GROUP BY date
        ORDER BY date DESC
      `)

      return res.json(dates)
    }
  } catch (err) {
    console.error('Get attendance records error:', err)
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal mengambil data absensi' })
  }
}
