// Vercel Serverless Function: Missions Management
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db-postgres.js'

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

  try {
    verifyTeacher(req)

    // GET - Get all missions
    if (req.method === 'GET') {
      const missions = await query(`
        SELECT * FROM missions
        ORDER BY created_at DESC
      `)
      return res.json(missions)
    }

    // POST - Create mission
    if (req.method === 'POST') {
      const { title, description, category, difficulty, worldId, xpReward, coinReward, estimatedMinutes, status } = req.body

      if (!title) {
        return res.status(400).json({ error: 'Judul misi wajib diisi' })
      }

      const missionId = `mission-${Date.now()}`

      await query(
        `INSERT INTO missions (id, title, description, category, difficulty, world_id, xp_reward, coin_reward, estimated_minutes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          missionId,
          title,
          description || '',
          category || 'pribadi',
          difficulty || 'mudah',
          worldId || 'world-1',
          xpReward || 20,
          coinReward || 50,
          estimatedMinutes || 10,
          status || 'active'
        ]
      )

      const missions = await query('SELECT * FROM missions WHERE id = $1', [missionId])

      return res.json({ success: true, mission: missions[0] })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Missions error:', err)
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
