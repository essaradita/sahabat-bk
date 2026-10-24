// Vercel Serverless Function: Case Study Operations by ID
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
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    verifyTeacher(req)

    const { id } = req.query

    // PUT - Update case study
    if (req.method === 'PUT') {
      const { title, description, category, story, missionsCount, status } = req.body

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

    // DELETE - Delete case study
    if (req.method === 'DELETE') {
      const existing = await query('SELECT id FROM case_studies WHERE id = $1', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Studi kasus tidak ditemukan' })
      }

      await query('DELETE FROM case_studies WHERE id = $1', [id])

      return res.json({ success: true, message: 'Studi kasus berhasil dihapus' })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('Case study operations error:', err)
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
