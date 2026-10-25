// Vercel Serverless Function: All Teacher Endpoints
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const pathname = req.url.split('?')[0]
  const pathParts = pathname.split('/').filter(Boolean)
  
  // Vercel automatically parses body
  const body = req.body || {}

  try {
    verifyTeacher(req)

    // GET /api/teacher/students
    if (pathname === '/api/teacher/students' && req.method === 'GET') {
      const students = await query(`
        SELECT 
          p.id, p.name, p.username, p.kelas, p.gender, p.avatar, p.created_at,
          sp.xp, sp.level, sp.coins
        FROM profiles p
        LEFT JOIN student_progress sp ON p.id = sp.student_id
        WHERE p.role = 'student'
        ORDER BY p.created_at DESC
      `)

      // Hitung misi yang completed untuk setiap siswa
      const studentsWithStats = await Promise.all(
        students.map(async (student) => {
          const completedMissions = await query(
            `SELECT COUNT(*) as count FROM mission_progress 
             WHERE student_id = $1 AND status = 'completed'`,
            [student.id]
          )
          
          return {
            ...student,
            missionsCompleted: parseInt(completedMissions[0]?.count || 0),
            lastActive: student.created_at
          }
        })
      )

      return res.json(studentsWithStats)
    }

    // POST /api/teacher/students - Add new student
    if (pathname === '/api/teacher/students' && req.method === 'POST') {
      const { name, kelas } = body

      if (!name || !kelas) {
        return res.status(400).json({ error: 'Nama dan kelas wajib diisi' })
      }

      // Generate username dari nama (lowercase, no space)
      const username = name.toLowerCase().replace(/\s+/g, '.')
      const password = 'siswa123' // Default password

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      const studentId = randomUUID()
      const avatarType = 'boy1' // Default avatar
      const email = `${username}@sahabatbk.internal`

      // Insert ke profiles
      await query(
        `INSERT INTO profiles (id, role, name, username, email, password, kelas, avatar, gender) 
         VALUES ($1, 'student', $2, $3, $4, $5, $6, $7, 'male')`,
        [studentId, name, username, email, hashedPassword, kelas, avatarType]
      )

      // Insert ke student_progress
      await query(
        `INSERT INTO student_progress (id, student_id, xp, level, coins) 
         VALUES ($1, $2, 0, 1, 0)`,
        [randomUUID(), studentId]
      )

      // Insert ke attendance_students untuk sinkronisasi
      const attendanceId = `att-${Date.now()}`
      await query(
        'INSERT INTO attendance_students (id, name, kelas) VALUES ($1, $2, $3)',
        [attendanceId, name, kelas]
      )

      return res.json({ 
        success: true, 
        student: {
          id: studentId,
          name,
          username,
          kelas,
          password: 'siswa123', // Return default password untuk dikasih tahu ke siswa
          message: 'Siswa berhasil ditambahkan. Password default: siswa123'
        }
      })
    }

    // GET /api/teacher/missions
    if (pathname === '/api/teacher/missions' && req.method === 'GET') {
      const missions = await query('SELECT * FROM missions ORDER BY created_at DESC')
      return res.json(missions)
    }

    // POST /api/teacher/missions
    if (pathname === '/api/teacher/missions' && req.method === 'POST') {
      const { title, description, category, difficulty, worldId, xpReward, coinReward, estimatedMinutes, status } = body

      if (!title) {
        return res.status(400).json({ error: 'Judul misi wajib diisi' })
      }

      const missionId = `mission-${Date.now()}`

      await query(
        `INSERT INTO missions (id, title, description, category, difficulty, world_id, xp_reward, coin_reward, estimated_minutes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [missionId, title, description || '', category || 'pribadi', difficulty || 'mudah', worldId || 'world-1', xpReward || 20, coinReward || 50, estimatedMinutes || 10, status || 'active']
      )

      const missions = await query('SELECT * FROM missions WHERE id = $1', [missionId])
      return res.json({ success: true, mission: missions[0] })
    }

    // PUT /api/teacher/missions/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'missions' && pathParts[3] && req.method === 'PUT') {
      const id = pathParts[3]
      const { title, description, category, difficulty, worldId, xpReward, coinReward, estimatedMinutes, status } = body

      const existing = await query('SELECT id FROM missions WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Misi tidak ditemukan' })
      }

      await query(
        `UPDATE missions 
         SET title = $1, description = $2, category = $3, difficulty = $4, world_id = $5, 
             xp_reward = $6, coin_reward = $7, estimated_minutes = $8, status = $9, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10`,
        [title, description, category, difficulty, worldId, xpReward, coinReward, estimatedMinutes, status, id]
      )

      const missions = await query('SELECT * FROM missions WHERE id = $1', [id])
      return res.json({ success: true, mission: missions[0] })
    }

    // DELETE /api/teacher/missions/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'missions' && pathParts[3] && req.method === 'DELETE') {
      const id = pathParts[3]

      const existing = await query('SELECT id FROM missions WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Misi tidak ditemukan' })
      }

      await query('DELETE FROM missions WHERE id = $1', [id])
      return res.json({ success: true, message: 'Misi berhasil dihapus' })
    }

    // GET /api/teacher/case-studies
    if (pathname === '/api/teacher/case-studies' && req.method === 'GET') {
      const cases = await query('SELECT * FROM case_studies ORDER BY created_at DESC')
      return res.json(cases)
    }

    // POST /api/teacher/case-studies
    if (pathname === '/api/teacher/case-studies' && req.method === 'POST') {
      const { title, description, category, story, missionsCount, status } = body

      if (!title) {
        return res.status(400).json({ error: 'Judul studi kasus wajib diisi' })
      }

      const caseId = `case-${Date.now()}`

      await query(
        `INSERT INTO case_studies (id, title, description, category, story, missions_count, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [caseId, title, description || '', category || 'Sosial Emosional', story || '', missionsCount || 4, status || 'active']
      )

      const cases = await query('SELECT * FROM case_studies WHERE id = $1', [caseId])
      return res.json({ success: true, caseStudy: cases[0] })
    }

    // PUT /api/teacher/case-studies/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'case-studies' && pathParts[3] && req.method === 'PUT') {
      const id = pathParts[3]
      const { title, description, category, story, missionsCount, status } = body

      const existing = await query('SELECT id FROM case_studies WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Studi kasus tidak ditemukan' })
      }

      await query(
        `UPDATE case_studies 
         SET title = $1, description = $2, category = $3, story = $4, missions_count = $5, status = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7`,
        [title, description, category, story, missionsCount, status, id]
      )

      const cases = await query('SELECT * FROM case_studies WHERE id = $1', [id])
      return res.json({ success: true, caseStudy: cases[0] })
    }

    // DELETE /api/teacher/case-studies/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'case-studies' && pathParts[3] && req.method === 'DELETE') {
      const id = pathParts[3]

      const existing = await query('SELECT id FROM case_studies WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Studi kasus tidak ditemukan' })
      }

      await query('DELETE FROM case_studies WHERE id = $1', [id])
      return res.json({ success: true, message: 'Studi kasus berhasil dihapus' })
    }

    // GET /api/teacher/classes
    if (pathname === '/api/teacher/classes' && req.method === 'GET') {
      const classes = await query('SELECT * FROM classes ORDER BY grade, name')
      return res.json(classes)
    }

    // POST /api/teacher/classes
    if (pathname === '/api/teacher/classes' && req.method === 'POST') {
      const decoded = verifyTeacher(req)
      const { name, grade, teacherName, studentCount } = body

      if (!name || !grade) {
        return res.status(400).json({ error: 'Nama dan tingkat kelas wajib diisi' })
      }

      const classId = `cls-${Date.now()}`

      await query(
        `INSERT INTO classes (id, name, grade, teacher_name, teacher_id, student_count)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [classId, name, parseInt(grade), teacherName || 'Ibu Rina', decoded.userId, studentCount || 0]
      )

      const classes = await query('SELECT * FROM classes WHERE id = $1', [classId])
      return res.json({ success: true, class: classes[0] })
    }

    // PUT /api/teacher/classes/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'classes' && pathParts[3] && req.method === 'PUT') {
      const id = pathParts[3]
      const { name, grade, teacherName, studentCount } = body

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

    // DELETE /api/teacher/classes/:id
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'classes' && pathParts[3] && req.method === 'DELETE') {
      const id = pathParts[3]

      const existing = await query('SELECT id FROM classes WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Kelas tidak ditemukan' })
      }

      await query('DELETE FROM classes WHERE id = $1', [id])
      return res.json({ success: true, message: 'Kelas berhasil dihapus' })
    }

    // GET /api/teacher/attendance/students
    if (pathname === '/api/teacher/attendance/students' && req.method === 'GET') {
      const students = await query('SELECT * FROM attendance_students ORDER BY kelas, name')

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
    if (pathname === '/api/teacher/attendance/students' && req.method === 'POST') {
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
      const url = new URL(req.url, `http://${req.headers.host}`)
      const date = url.searchParams.get('date')

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

    // GET /api/teacher/missions/:missionId/questions
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'missions' && pathParts[3] && pathParts[4] === 'questions' && req.method === 'GET') {
      const missionId = pathParts[3]

      const questions = await query(
        'SELECT * FROM mission_questions WHERE mission_id = $1 ORDER BY order_num ASC',
        [missionId]
      )

      // Parse options JSONB to array
      const parsedQuestions = questions.map(q => ({
        ...q,
        options: q.options || null,
        order: q.order_num
      }))

      return res.json(parsedQuestions)
    }

    // POST /api/teacher/missions/:missionId/questions - Bulk save all questions
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'missions' && pathParts[3] && pathParts[4] === 'questions' && req.method === 'POST') {
      const missionId = pathParts[3]
      const { questions: questionsData } = body

      if (!Array.isArray(questionsData)) {
        return res.status(400).json({ error: 'Questions must be an array' })
      }

      // Check if mission exists
      const missionExists = await query('SELECT id FROM missions WHERE id = $1', [missionId])
      if (missionExists.length === 0) {
        return res.status(404).json({ error: 'Mission not found' })
      }

      // Delete existing questions for this mission
      await query('DELETE FROM mission_questions WHERE mission_id = $1', [missionId])

      // Insert all questions
      for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i]
        const questionId = q.id && !q.id.startsWith('new-') && !q.id.startsWith('dup-') ? q.id : `q-${Date.now()}-${i}`

        await query(
          `INSERT INTO mission_questions (id, mission_id, type, question, options, correct_answer, explanation, order_num)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            questionId,
            missionId,
            q.type || 'multiple_choice',
            q.question || '',
            JSON.stringify(q.options || []),
            q.correctAnswer || null,
            q.explanation || '',
            i + 1
          ]
        )
      }

      return res.json({ 
        success: true, 
        message: `${questionsData.length} soal berhasil disimpan`,
        count: questionsData.length 
      })
    }

    // DELETE /api/teacher/missions/:missionId/questions/:questionId
    if (pathParts[0] === 'api' && pathParts[1] === 'teacher' && pathParts[2] === 'missions' && pathParts[3] && pathParts[4] === 'questions' && pathParts[5] && req.method === 'DELETE') {
      const questionId = pathParts[5]

      const existing = await query('SELECT id FROM mission_questions WHERE id = $1', [questionId])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Question not found' })
      }

      await query('DELETE FROM mission_questions WHERE id = $1', [questionId])
      return res.json({ success: true, message: 'Question deleted' })
    }

    return res.status(404).json({ error: 'Endpoint not found' })

  } catch (err) {
    console.error('Teacher error:', err)
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
