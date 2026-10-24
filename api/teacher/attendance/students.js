// Vercel Serverless Function: Attendance Students Management
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    verifyTeacher(req)

    // GET - Get all attendance students
    if (req.method === 'GET') {
      const students = await query(`
        SELECT * FROM attendance_students
        ORDER BY kelas, name
      `)

      // Get attendance records for each student
      const studentsWithAttendance = await Promise.all(
        students.map(async (student) => {
          const records = await query(`
            SELECT date, status FROM attendance_records
            WHERE student_id = $1
            ORDER BY date DESC
          `, [student.id])

          return {
            ...student,
            attendance: records
          }
        })
      )

      return res.json(studentsWithAttendance)
    }

    // POST - Add attendance student
    if (req.method === 'POST') {
      const { name, kelas } = req.body

      if (!name || !kelas) {
        return res.status(400).json({ error: 'Nama dan kelas wajib diisi' })
      }

      const studentId = `att-${Date.now()}`

      await query(
        `INSERT INTO attendance_students (id, name, kelas)
         VALUES ($1, $2, $3)`,
        [studentId, name.trim(), kelas.trim()]
      )

      const students = await query('SELECT * FROM attendance_students WHERE id = $1', [studentId])

      return res.json({ success: true, student: { ...students[0], attendance: [] } })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Attendance students error:', err)
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
