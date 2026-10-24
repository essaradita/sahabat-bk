// Vercel Serverless Function: Complete Mission
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { query } from '../../../lib/db-postgres.js'

function verifyStudent(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'student') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const decoded = verifyStudent(req)
    const { missionId, score, xpReward, coinReward } = req.body
    const studentId = decoded.userId

    if (!missionId) {
      return res.status(400).json({ error: 'Mission ID required' })
    }

    // Check if mission progress exists
    const existing = await query(`
      SELECT id FROM mission_progress 
      WHERE student_id = $1 AND mission_id = $2
    `, [studentId, missionId])

    if (existing.length > 0) {
      // Update existing progress
      await query(`
        UPDATE mission_progress 
        SET status = 'completed', score = $1, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = $2 AND mission_id = $3
      `, [score || 100, studentId, missionId])
    } else {
      // Insert new progress
      await query(`
        INSERT INTO mission_progress (id, student_id, mission_id, status, score, completed_at)
        VALUES ($1, $2, $3, 'completed', $4, CURRENT_TIMESTAMP)
      `, [randomUUID(), studentId, missionId, score || 100])
    }

    // Update student XP and coins
    await query(`
      UPDATE student_progress 
      SET xp = xp + $1, coins = coins + $2, updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $3
    `, [xpReward || 20, coinReward || 50, studentId])

    // Get updated progress
    const updatedProgress = await query('SELECT * FROM student_progress WHERE student_id = $1', [studentId])

    res.json({
      success: true,
      message: 'Misi berhasil diselesaikan!',
      progress: updatedProgress[0]
    })
  } catch (err) {
    console.error('Complete mission error:', err)
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal menyelesaikan misi' })
  }
}
