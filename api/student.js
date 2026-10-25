// Vercel Serverless Function: Student Missions
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { query } from '../lib/db-postgres.js'

function verifyStudent(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'student') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const pathname = req.url.split('?')[0]
  
  // Vercel automatically parses body
  const body = req.body || {}

  try {
    const decoded = verifyStudent(req)
    const studentId = decoded.userId

    console.log('👤 Student API request:', { studentId, pathname, method: req.method })

    // GET /api/student/missions
    if (pathname === '/api/student/missions' && req.method === 'GET') {
      console.log('📋 Getting student missions for:', studentId)
      
      const missionProgress = await query(
        'SELECT mission_id, status, score, completed_at FROM mission_progress WHERE student_id = $1',
        [studentId]
      )

      console.log('📊 Mission progress from DB:', missionProgress)
      return res.json(missionProgress)
    }

    // POST /api/student/missions/complete
    if (pathname === '/api/student/missions/complete' && req.method === 'POST') {
      const { missionId, score, xpReward, coinReward } = body

      console.log('🎯 Complete mission request:', { studentId, missionId, score, xpReward, coinReward })

      if (!missionId) {
        console.log('❌ Mission ID missing')
        return res.status(400).json({ error: 'Mission ID required' })
      }

      const existing = await query(
        'SELECT id FROM mission_progress WHERE student_id = $1 AND mission_id = $2',
        [studentId, missionId]
      )

      console.log('🔍 Existing progress:', existing)

      if (existing.length > 0) {
        console.log('📝 Updating existing mission progress...')
        await query(
          `UPDATE mission_progress 
           SET status = 'completed', score = $1, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
           WHERE student_id = $2 AND mission_id = $3`,
          [score || 100, studentId, missionId]
        )
        console.log('✅ Mission progress updated')
      } else {
        console.log('📝 Inserting new mission progress...')
        const progressId = randomUUID()
        await query(
          `INSERT INTO mission_progress (id, student_id, mission_id, status, score, completed_at)
           VALUES ($1, $2, $3, 'completed', $4, CURRENT_TIMESTAMP)`,
          [progressId, studentId, missionId, score || 100]
        )
        console.log('✅ Mission progress inserted with ID:', progressId)
      }

      console.log('💰 Updating student progress (XP + coins)...')
      await query(
        `UPDATE student_progress 
         SET xp = xp + $1, coins = coins + $2, updated_at = CURRENT_TIMESTAMP
         WHERE student_id = $3`,
        [xpReward || 20, coinReward || 50, studentId]
      )

      const updatedProgress = await query('SELECT * FROM student_progress WHERE student_id = $1', [studentId])

      console.log('✅ Mission completed successfully!', updatedProgress[0])
      return res.json({
        success: true,
        message: 'Misi berhasil diselesaikan!',
        progress: updatedProgress[0]
      })
    }

    // GET /api/student/missions/:missionId/questions
    if (pathname.match(/^\/api\/student\/missions\/[^/]+\/questions$/) && req.method === 'GET') {
      const missionId = pathname.split('/')[4]
      console.log('📝 Getting questions for mission:', missionId)

      const questions = await query(
        'SELECT * FROM mission_questions WHERE mission_id = $1 ORDER BY order_num ASC',
        [missionId]
      )

      const parsedQuestions = questions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options || null,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        order: q.order_num
      }))

      console.log('✅ Found', parsedQuestions.length, 'questions')
      return res.json(parsedQuestions)
    }

    // GET /api/student/journals - Get all journals for logged-in student
    if (pathname === '/api/student/journals' && req.method === 'GET') {
      console.log('📔 Getting journals for student:', studentId)

      const journals = await query(
        `SELECT id, title, content, mood, is_private, mission_id, 
                DATE(created_at) as date, created_at, updated_at 
         FROM reflections 
         WHERE student_id = $1 
         ORDER BY created_at DESC`,
        [studentId]
      )

      console.log('✅ Found', journals.length, 'journals')
      return res.json(journals)
    }

    // POST /api/student/journals - Create new journal entry
    if (pathname === '/api/student/journals' && req.method === 'POST') {
      const { title, content, mood, isPrivate, missionId } = body

      console.log('📝 Creating journal for student:', studentId)

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
      }

      const journalId = `journal-${Date.now()}`

      await query(
        `INSERT INTO reflections (id, student_id, title, content, mood, is_private, mission_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [journalId, studentId, title.trim(), content.trim(), mood || null, isPrivate !== false, missionId || null]
      )

      const newJournal = await query('SELECT * FROM reflections WHERE id = $1', [journalId])

      console.log('✅ Journal created:', journalId)
      return res.json({ success: true, journal: newJournal[0] })
    }

    // PUT /api/student/journals/:id - Update existing journal
    if (pathname.match(/^\/api\/student\/journals\/[^/]+$/) && req.method === 'PUT') {
      const journalId = pathname.split('/')[4]
      const { title, content, mood, isPrivate } = body

      console.log('📝 Updating journal:', journalId)

      // Verify ownership
      const existing = await query(
        'SELECT id FROM reflections WHERE id = $1 AND student_id = $2',
        [journalId, studentId]
      )

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Journal not found or access denied' })
      }

      await query(
        `UPDATE reflections 
         SET title = $1, content = $2, mood = $3, is_private = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 AND student_id = $6`,
        [title.trim(), content.trim(), mood || null, isPrivate !== false, journalId, studentId]
      )

      const updated = await query('SELECT * FROM reflections WHERE id = $1', [journalId])

      console.log('✅ Journal updated:', journalId)
      return res.json({ success: true, journal: updated[0] })
    }

    // DELETE /api/student/journals/:id - Delete journal
    if (pathname.match(/^\/api\/student\/journals\/[^/]+$/) && req.method === 'DELETE') {
      const journalId = pathname.split('/')[4]

      console.log('🗑️ Deleting journal:', journalId)

      // Verify ownership
      const existing = await query(
        'SELECT id FROM reflections WHERE id = $1 AND student_id = $2',
        [journalId, studentId]
      )

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Journal not found or access denied' })
      }

      await query('DELETE FROM reflections WHERE id = $1 AND student_id = $2', [journalId, studentId])

      console.log('✅ Journal deleted:', journalId)
      return res.json({ success: true, message: 'Journal deleted' })
    }

    console.log('❌ Endpoint not found:', pathname)
    return res.status(404).json({ error: 'Endpoint not found' })

  } catch (err) {
    console.error('❌ Student API error:', err)
    console.error('Error stack:', err.stack)
    
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal memproses permintaan', detail: err.message })
  }
}
