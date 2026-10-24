// Vercel Serverless Function: All Teacher Endpoints
import jwt from 'jsonwebtoken'
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

      const studentsWithStats = students.map(student => ({
        ...student,
        missionsCompleted: 0,
        lastActive: student.created_at
      }))

      return res.json(studentsWithStats)
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
