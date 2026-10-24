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

// Helper to get request body
async function getBody(req) {
  if (req.body) return req.body
  
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)
  
  // Parse body for POST requests
  let body = {}
  if (req.method === 'POST') {
    body = await getBody(req)
  }

  try {
    const decoded = verifyStudent(req)
    const studentId = decoded.userId

    // GET /api/student/missions
    if (pathname === '/api/student/missions' && req.method === 'GET') {
      const missionProgress = await query(
        'SELECT mission_id, status, score, completed_at FROM mission_progress WHERE student_id = $1',
        [studentId]
      )

      return res.json(missionProgress)
    }

    // POST /api/student/missions/complete
    if (pathname === '/api/student/missions/complete' && req.method === 'POST') {
      const { missionId, score, xpReward, coinReward } = body

      if (!missionId) {
        return res.status(400).json({ error: 'Mission ID required' })
      }

      const existing = await query(
        'SELECT id FROM mission_progress WHERE student_id = $1 AND mission_id = $2',
        [studentId, missionId]
      )

      if (existing.length > 0) {
        await query(
          `UPDATE mission_progress 
           SET status = 'completed', score = $1, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
           WHERE student_id = $2 AND mission_id = $3`,
          [score || 100, studentId, missionId]
        )
      } else {
        await query(
          `INSERT INTO mission_progress (id, student_id, mission_id, status, score, completed_at)
           VALUES ($1, $2, $3, 'completed', $4, CURRENT_TIMESTAMP)`,
          [randomUUID(), studentId, missionId, score || 100]
        )
      }

      await query(
        `UPDATE student_progress 
         SET xp = xp + $1, coins = coins + $2, updated_at = CURRENT_TIMESTAMP
         WHERE student_id = $3`,
        [xpReward || 20, coinReward || 50, studentId]
      )

      const updatedProgress = await query('SELECT * FROM student_progress WHERE student_id = $1', [studentId])

      return res.json({
        success: true,
        message: 'Misi berhasil diselesaikan!',
        progress: updatedProgress[0]
      })
    }

    return res.status(404).json({ error: 'Endpoint not found' })

  } catch (err) {
    console.error('Student error:', err)
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
