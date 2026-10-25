// Vercel Serverless Function: Attendance Management
import jwt from 'jsonwebtoken'
import { query } from '../lib/db-postgres.js'

function verifyTeacher(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'teacher') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname
  const searchParams = url.searchParams
  const pathParts = pathname.split('/').filter(Boolean)
  
  // Vercel automatically parses body
  const body = req.body || {}

  try {
    verifyTeacher(req)

    console.log('📍 Attendance request:', { pathname, method: req.method })

    // GET /api/teacher/attendance/students
    if ((pathname === '/api/teacher/attendance/students' || pathname.includes('/attendance/students')) && req.method === 'GET') {
      console.log('📋 Getting attendance students...')
      const students = await query('SELECT * FROM attendance_students ORDER BY kelas, name')
      console.log(`✅ Found ${students.length} attendance students`)

      const studentsWithAttendance = await Promise.all(
        students.map(async (student) => {
          const records = await query(
            'SELECT date, status FROM attendance_records WHERE student_id = $1 ORDER BY date DESC',
            [student.id]
          )
          return { ...student, attendance: records }
        })
      )

      return res.json(studentsWithAttendance)
    }

    // POST /api/teacher/attendance/students
    if ((pathname === '/api/teacher/attendance/students' || pathname.includes('/attendance/students')) && req.method === 'POST') {
      console.log('➕ Adding attendance student...')
      const { name, kelas } = body

      if (!name || !kelas) {
        return res.status(400).json({ error: 'Nama dan kelas wajib diisi' })
      }

      const studentId = `att-${Date.now()}`

      await query(
        'INSERT INTO attendance_students (id, name, kelas) VALUES ($1, $2, $3)',
        [studentId, name.trim(), kelas.trim()]
      )

      const students = await query('SELECT * FROM attendance_students WHERE id = $1', [studentId])
      return res.json({ success: true, student: { ...students[0], attendance: [] } })
    }

    // DELETE /api/teacher/attendance/students/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'attendance' && pathParts[3] === 'students' && pathParts[4] && req.method === 'DELETE') {
      const id = pathParts[4]

      const existing = await query('SELECT id FROM attendance_students WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Siswa tidak ditemukan' })
      }

      await query('DELETE FROM attendance_students WHERE id = $1', [id])
      return res.json({ success: true, message: 'Siswa berhasil dihapus' })
    }

    // POST /api/teacher/attendance/mark
    if (pathname === '/api/teacher/attendance/mark' && req.method === 'POST') {
      const { studentId, date, status } = body

      if (!studentId || !date || !status) {
        return res.status(400).json({ error: 'Student ID, date, dan status wajib diisi' })
      }

      if (!['hadir', 'sakit', 'izin', 'alpa'].includes(status)) {
        return res.status(400).json({ error: 'Status tidak valid' })
      }

      const recordId = `rec-${Date.now()}`

      const existing = await query(
        'SELECT id FROM attendance_records WHERE student_id = $1 AND date = $2',
        [studentId, date]
      )

      if (existing.length > 0) {
        await query(
          'UPDATE attendance_records SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE student_id = $2 AND date = $3',
          [status, studentId, date]
        )
      } else {
        await query(
          'INSERT INTO attendance_records (id, student_id, date, status) VALUES ($1, $2, $3, $4)',
          [recordId, studentId, date, status]
        )
      }

      return res.json({ success: true, message: 'Absensi berhasil disimpan' })
    }

    // GET /api/teacher/attendance/records
    if (pathname === '/api/teacher/attendance/records' && req.method === 'GET') {
      const date = searchParams.get('date')

      if (date) {
        const records = await query(`
          SELECT ar.*, ats.name, ats.kelas
          FROM attendance_records ar
          JOIN attendance_students ats ON ar.student_id = ats.id
          WHERE ar.date = $1
          ORDER BY ats.kelas, ats.name
        `, [date])

        return res.json(records)
      } else {
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
    }

    return res.status(404).json({ error: 'Endpoint not found' })

  } catch (err) {
    console.error('Attendance error:', err)
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
