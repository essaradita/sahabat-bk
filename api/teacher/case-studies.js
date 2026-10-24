// Vercel Serverless Function: Case Studies Management
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    verifyTeacher(req)

    // GET - Get all case studies
    if (req.method === 'GET') {
      const cases = await query(`
        SELECT * FROM case_studies
        ORDER BY created_at DESC
      `)
      return res.json(cases)
    }

    // POST - Create case study
    if (req.method === 'POST') {
      const { title, description, category, story, missionsCount, status } = req.body

      if (!title) {
        return res.status(400).json({ error: 'Judul studi kasus wajib diisi' })
      }

      const caseId = `case-${Date.now()}`

      await query(
        `INSERT INTO case_studies (id, title, description, category, story, missions_count, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          caseId,
          title,
          description || '',
          category || 'Sosial Emosional',
          story || '',
          missionsCount || 4,
          status || 'active'
        ]
      )

      const cases = await query('SELECT * FROM case_studies WHERE id = $1', [caseId])

      return res.json({ success: true, caseStudy: cases[0] })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Case studies error:', err)
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
