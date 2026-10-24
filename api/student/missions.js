// Vercel Serverless Function: Student Missions
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db-postgres.js'

function verifyStudent(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token tidak ditemukan')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.role !== 'student') throw new Error('Akses ditolak')
  
  return decoded
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const decoded = verifyStudent(req)
    const studentId = decoded.userId
    
    // Get all mission progress for this student
    const missionProgress = await query(`
      SELECT mission_id, status, score, completed_at
      FROM mission_progress
      WHERE student_id = $1
    `, [studentId])

    res.json(missionProgress)
  } catch (err) {
    console.error('Get missions error:', err)
    if (err.message === 'Token tidak ditemukan') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message === 'Akses ditolak') {
      return res.status(403).json({ error: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid' })
    }
    res.status(500).json({ error: 'Gagal mengambil data misi' })
  }
}
