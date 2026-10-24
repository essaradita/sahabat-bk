// Vercel Serverless Function: Login Teacher
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db-postgres.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }

    const users = await query(
      "SELECT * FROM profiles WHERE email = $1 AND role = 'teacher'",
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      user: { id: user.id, email: user.email },
      profile: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        school: user.school
      },
      token
    })
  } catch (err) {
    console.error('Login teacher error:', err)
    res.status(500).json({ error: 'Gagal login' })
  }
}
