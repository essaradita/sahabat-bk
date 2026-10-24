import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import db from './db-sqlite.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware - CORS with detailed config
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} from ${req.ip}`)
  next()
})

app.use(express.json())

// ============================================================
// HEALTH CHECK & ROOT ROUTE
// ============================================================

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SAHABAT BK API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SAHABAT BK API',
    endpoints: [
      'POST /api/auth/register/student',
      'POST /api/auth/register/teacher',
      'POST /api/auth/login/student',
      'POST /api/auth/login/teacher',
      'GET  /api/auth/profile'
    ]
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  })
})

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token tidak ditemukan' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid' })
  }
}

// ============================================================
// AUTH ROUTES
// ============================================================

// Register Student
app.post('/api/auth/register/student', async (req, res) => {
  try {
    const { name, username, password, kelas, gender } = req.body

    // Validasi
    if (!name || !username || !password || !kelas) {
      return res.status(400).json({ error: 'Semua field wajib diisi' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' })
    }

    // Cek username sudah dipakai
    const existing = db.prepare('SELECT id FROM profiles WHERE username = ?').get(username)

    if (existing) {
      return res.status(400).json({ error: 'Username sudah dipakai' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = randomUUID()
    const avatarType = gender === 'female' ? 'girl1' : 'boy1'

    // Insert user
    db.prepare(`
      INSERT INTO profiles (id, role, name, username, email, password, kelas, avatar, gender) 
      VALUES (?, 'student', ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, username, `${username}@sahabatbk.internal`, hashedPassword, kelas, avatarType, gender || 'male')

    // Insert progress
    db.prepare(`
      INSERT INTO student_progress (id, student_id, xp, level, coins) 
      VALUES (?, ?, 0, 1, 0)
    `).run(randomUUID(), userId)

    // Generate token
    const token = generateToken(userId, 'student')

    // Get profile
    const profile = db.prepare('SELECT id, role, name, username, kelas, avatar, gender FROM profiles WHERE id = ?').get(userId)

    res.json({
      user: { id: userId, email: `${username}@sahabatbk.internal` },
      profile,
      token
    })
  } catch (err) {
    console.error('Register student error:', err)
    res.status(500).json({ error: 'Gagal mendaftar' })
  }
})

// Register Teacher
app.post('/api/auth/register/teacher', async (req, res) => {
  try {
    const { name, email, password, school } = req.body

    // Validasi
    if (!name || !email || !password || !school) {
      return res.status(400).json({ error: 'Semua field wajib diisi' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' })
    }

    // Cek email sudah dipakai
    const existing = db.prepare('SELECT id FROM profiles WHERE email = ?').get(email)

    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = randomUUID()

    // Insert user
    db.prepare(`
      INSERT INTO profiles (id, role, name, email, password, school) 
      VALUES (?, 'teacher', ?, ?, ?, ?)
    `).run(userId, name, email, hashedPassword, school)

    // Generate token
    const token = generateToken(userId, 'teacher')

    // Get profile
    const profile = db.prepare('SELECT id, role, name, email, school FROM profiles WHERE id = ?').get(userId)

    res.json({
      user: { id: userId, email },
      profile,
      token
    })
  } catch (err) {
    console.error('Register teacher error:', err)
    res.status(500).json({ error: 'Gagal mendaftar' })
  }
})

// Login Student
app.post('/api/auth/login/student', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' })
    }

    // Cari user
    const user = db.prepare("SELECT * FROM profiles WHERE username = ? AND role = 'student'").get(username)

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' })
    }

    // Cek password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Username atau password salah' })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    // Get progress
    const progress = db.prepare('SELECT * FROM student_progress WHERE student_id = ?').get(user.id)

    console.log('📤 Login response - user:', { 
      id: user.id, 
      username: user.username, 
      gender: user.gender,
      avatar: user.avatar 
    })

    res.json({
      user: { id: user.id, email: user.email },
      profile: {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        kelas: user.kelas,
        avatar: user.avatar,
        gender: user.gender,
        xp: progress?.xp || 0,
        level: progress?.level || 1,
        coins: progress?.coins || 0
      },
      token
    })
  } catch (err) {
    console.error('Login student error:', err)
    res.status(500).json({ error: 'Gagal login' })
  }
})

// Login Teacher
app.post('/api/auth/login/teacher', async (req, res) => {
  try {
    const { email, password } = req.body

    console.log('🔍 Login attempt:', { email, password: '***' })

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }

    // Cari user
    const user = db.prepare("SELECT * FROM profiles WHERE email = ? AND role = 'teacher'").get(email)

    console.log('👤 User found:', user ? 'YES' : 'NO')

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    // Cek password
    const validPassword = await bcrypt.compare(password, user.password)
    
    console.log('🔐 Password valid:', validPassword ? 'YES' : 'NO')

    if (!validPassword) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    console.log('✅ Login successful')

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
    console.error('❌ Login teacher error:', err)
    res.status(500).json({ error: 'Gagal login' })
  }
})

// Get Profile
app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = db.prepare('SELECT id, role, name, username, email, school, kelas, avatar FROM profiles WHERE id = ?').get(req.user.userId)

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' })
    }

    // Jika student, ambil progress
    if (user.role === 'student') {
      const progress = db.prepare('SELECT * FROM student_progress WHERE student_id = ?').get(user.id)
      user.xp = progress?.xp || 0
      user.level = progress?.level || 1
      user.coins = progress?.coins || 0
    }

    res.json(user)
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ error: 'Gagal mengambil profil' })
  }
})

// ============================================================
// TEACHER ROUTES
// ============================================================

// Get All Students (for teacher dashboard)
app.get('/api/teacher/students', verifyToken, async (req, res) => {
  try {
    // Verify teacher role
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    // Get all students with their progress
    const students = db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.username,
        p.kelas,
        p.gender,
        p.avatar,
        p.created_at,
        sp.xp,
        sp.level,
        sp.coins
      FROM profiles p
      LEFT JOIN student_progress sp ON p.id = sp.student_id
      WHERE p.role = 'student'
      ORDER BY p.created_at DESC
    `).all()

    // Count missions completed per student (will be 0 for now, but ready for future)
    const studentsWithStats = students.map(student => ({
      ...student,
      missionsCompleted: 0, // TODO: implement mission tracking
      lastActive: student.created_at
    }))

    res.json(studentsWithStats)
  } catch (err) {
    console.error('Get students error:', err)
    res.status(500).json({ error: 'Gagal mengambil data siswa' })
  }
})

// ============================================================
// MISSION PROGRESS ROUTES
// ============================================================

// Get student's mission progress
app.get('/api/student/missions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const studentId = req.user.userId
    
    // Get all mission progress for this student
    const missionProgress = db.prepare(`
      SELECT mission_id, status, score, completed_at
      FROM mission_progress
      WHERE student_id = ?
    `).all(studentId)

    res.json(missionProgress)
  } catch (err) {
    console.error('Get missions error:', err)
    res.status(500).json({ error: 'Gagal mengambil data misi' })
  }
})

// Update mission progress (complete a mission)
app.post('/api/student/missions/complete', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { missionId, score, xpReward, coinReward } = req.body
    const studentId = req.user.userId

    if (!missionId) {
      return res.status(400).json({ error: 'Mission ID required' })
    }

    // Check if mission progress exists
    const existing = db.prepare(`
      SELECT id FROM mission_progress 
      WHERE student_id = ? AND mission_id = ?
    `).get(studentId, missionId)

    if (existing) {
      // Update existing progress
      db.prepare(`
        UPDATE mission_progress 
        SET status = 'completed', score = ?, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND mission_id = ?
      `).run(score || 100, studentId, missionId)
    } else {
      // Insert new progress
      db.prepare(`
        INSERT INTO mission_progress (id, student_id, mission_id, status, score, completed_at)
        VALUES (?, ?, ?, 'completed', ?, CURRENT_TIMESTAMP)
      `).run(randomUUID(), studentId, missionId, score || 100)
    }

    // Update student XP and coins
    db.prepare(`
      UPDATE student_progress 
      SET xp = xp + ?, coins = coins + ?, updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ?
    `).run(xpReward || 20, coinReward || 50, studentId)

    // Get updated progress
    const updatedProgress = db.prepare('SELECT * FROM student_progress WHERE student_id = ?').get(studentId)

    res.json({
      success: true,
      message: 'Misi berhasil diselesaikan!',
      progress: updatedProgress
    })
  } catch (err) {
    console.error('Complete mission error:', err)
    res.status(500).json({ error: 'Gagal menyelesaikan misi' })
  }
})

// ============================================================
// MISSION MANAGEMENT ROUTES (Teacher)
// ============================================================

// Get all missions
app.get('/api/teacher/missions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const missions = db.prepare(`
      SELECT * FROM missions
      ORDER BY created_at DESC
    `).all()

    res.json(missions)
  } catch (err) {
    console.error('Get missions error:', err)
    res.status(500).json({ error: 'Gagal mengambil data misi' })
  }
})

// Create mission
app.post('/api/teacher/missions', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { title, description, category, difficulty, worldId, xpReward, coinReward, estimatedMinutes, status } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Judul misi wajib diisi' })
    }

    const missionId = `mission-${Date.now()}`

    db.prepare(`
      INSERT INTO missions (id, title, description, category, difficulty, world_id, xp_reward, coin_reward, estimated_minutes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    )

    const mission = db.prepare('SELECT * FROM missions WHERE id = ?').get(missionId)

    res.json({ success: true, mission })
  } catch (err) {
    console.error('Create mission error:', err)
    res.status(500).json({ error: 'Gagal membuat misi' })
  }
})

// Update mission
app.put('/api/teacher/missions/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params
    const { title, description, category, difficulty, worldId, xpReward, coinReward, estimatedMinutes, status } = req.body

    const existing = db.prepare('SELECT id FROM missions WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Misi tidak ditemukan' })
    }

    db.prepare(`
      UPDATE missions 
      SET title = ?, description = ?, category = ?, difficulty = ?, world_id = ?, 
          xp_reward = ?, coin_reward = ?, estimated_minutes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      description,
      category,
      difficulty,
      worldId,
      xpReward,
      coinReward,
      estimatedMinutes,
      status,
      id
    )

    const mission = db.prepare('SELECT * FROM missions WHERE id = ?').get(id)

    res.json({ success: true, mission })
  } catch (err) {
    console.error('Update mission error:', err)
    res.status(500).json({ error: 'Gagal mengupdate misi' })
  }
})

// Delete mission
app.delete('/api/teacher/missions/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params

    const existing = db.prepare('SELECT id FROM missions WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Misi tidak ditemukan' })
    }

    db.prepare('DELETE FROM missions WHERE id = ?').run(id)

    res.json({ success: true, message: 'Misi berhasil dihapus' })
  } catch (err) {
    console.error('Delete mission error:', err)
    res.status(500).json({ error: 'Gagal menghapus misi' })
  }
})

// ============================================================
// CASE STUDY MANAGEMENT ROUTES (Teacher)
// ============================================================

// Get all case studies
app.get('/api/teacher/case-studies', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const cases = db.prepare(`
      SELECT * FROM case_studies
      ORDER BY created_at DESC
    `).all()

    res.json(cases)
  } catch (err) {
    console.error('Get case studies error:', err)
    res.status(500).json({ error: 'Gagal mengambil data studi kasus' })
  }
})

// Create case study
app.post('/api/teacher/case-studies', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { title, description, category, story, missionsCount, status } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Judul studi kasus wajib diisi' })
    }

    const caseId = `case-${Date.now()}`

    db.prepare(`
      INSERT INTO case_studies (id, title, description, category, story, missions_count, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      caseId,
      title,
      description || '',
      category || 'Sosial Emosional',
      story || '',
      missionsCount || 4,
      status || 'active'
    )

    const caseStudy = db.prepare('SELECT * FROM case_studies WHERE id = ?').get(caseId)

    res.json({ success: true, caseStudy })
  } catch (err) {
    console.error('Create case study error:', err)
    res.status(500).json({ error: 'Gagal membuat studi kasus' })
  }
})

// Update case study
app.put('/api/teacher/case-studies/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params
    const { title, description, category, story, missionsCount, status } = req.body

    const existing = db.prepare('SELECT id FROM case_studies WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Studi kasus tidak ditemukan' })
    }

    db.prepare(`
      UPDATE case_studies 
      SET title = ?, description = ?, category = ?, story = ?, missions_count = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, category, story, missionsCount, status, id)

    const caseStudy = db.prepare('SELECT * FROM case_studies WHERE id = ?').get(id)

    res.json({ success: true, caseStudy })
  } catch (err) {
    console.error('Update case study error:', err)
    res.status(500).json({ error: 'Gagal mengupdate studi kasus' })
  }
})

// Delete case study
app.delete('/api/teacher/case-studies/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params

    const existing = db.prepare('SELECT id FROM case_studies WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Studi kasus tidak ditemukan' })
    }

    db.prepare('DELETE FROM case_studies WHERE id = ?').run(id)

    res.json({ success: true, message: 'Studi kasus berhasil dihapus' })
  } catch (err) {
    console.error('Delete case study error:', err)
    res.status(500).json({ error: 'Gagal menghapus studi kasus' })
  }
})

// ============================================================
// CLASS MANAGEMENT ROUTES (Teacher)
// ============================================================

// Get all classes
app.get('/api/teacher/classes', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const classes = db.prepare(`
      SELECT * FROM classes
      ORDER BY grade, name
    `).all()

    res.json(classes)
  } catch (err) {
    console.error('Get classes error:', err)
    res.status(500).json({ error: 'Gagal mengambil data kelas' })
  }
})

// Create class
app.post('/api/teacher/classes', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { name, grade, teacherName, studentCount } = req.body

    if (!name || !grade) {
      return res.status(400).json({ error: 'Nama dan tingkat kelas wajib diisi' })
    }

    const classId = `cls-${Date.now()}`

    db.prepare(`
      INSERT INTO classes (id, name, grade, teacher_name, teacher_id, student_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      classId,
      name,
      parseInt(grade),
      teacherName || 'Ibu Rina',
      req.user.userId,
      studentCount || 0
    )

    const newClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId)

    res.json({ success: true, class: newClass })
  } catch (err) {
    console.error('Create class error:', err)
    res.status(500).json({ error: 'Gagal membuat kelas' })
  }
})

// Update class
app.put('/api/teacher/classes/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params
    const { name, grade, teacherName, studentCount } = req.body

    const existing = db.prepare('SELECT id FROM classes WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Kelas tidak ditemukan' })
    }

    db.prepare(`
      UPDATE classes 
      SET name = ?, grade = ?, teacher_name = ?, student_count = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, parseInt(grade), teacherName, studentCount || 0, id)

    const updatedClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(id)

    res.json({ success: true, class: updatedClass })
  } catch (err) {
    console.error('Update class error:', err)
    res.status(500).json({ error: 'Gagal mengupdate kelas' })
  }
})

// Delete class
app.delete('/api/teacher/classes/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params

    const existing = db.prepare('SELECT id FROM classes WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Kelas tidak ditemukan' })
    }

    db.prepare('DELETE FROM classes WHERE id = ?').run(id)

    res.json({ success: true, message: 'Kelas berhasil dihapus' })
  } catch (err) {
    console.error('Delete class error:', err)
    res.status(500).json({ error: 'Gagal menghapus kelas' })
  }
})

// ============================================================
// ATTENDANCE MANAGEMENT ROUTES (Teacher)
// ============================================================

// Get all attendance students
app.get('/api/teacher/attendance/students', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const students = db.prepare(`
      SELECT * FROM attendance_students
      ORDER BY kelas, name
    `).all()

    // Get attendance records for each student
    const studentsWithAttendance = students.map(student => {
      const records = db.prepare(`
        SELECT date, status FROM attendance_records
        WHERE student_id = ?
        ORDER BY date DESC
      `).all(student.id)

      return {
        ...student,
        attendance: records
      }
    })

    res.json(studentsWithAttendance)
  } catch (err) {
    console.error('Get attendance students error:', err)
    res.status(500).json({ error: 'Gagal mengambil data siswa' })
  }
})

// Add attendance student
app.post('/api/teacher/attendance/students', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { name, kelas } = req.body

    if (!name || !kelas) {
      return res.status(400).json({ error: 'Nama dan kelas wajib diisi' })
    }

    const studentId = `att-${Date.now()}`

    db.prepare(`
      INSERT INTO attendance_students (id, name, kelas)
      VALUES (?, ?, ?)
    `).run(studentId, name.trim(), kelas.trim())

    const student = db.prepare('SELECT * FROM attendance_students WHERE id = ?').get(studentId)

    res.json({ success: true, student: { ...student, attendance: [] } })
  } catch (err) {
    console.error('Add attendance student error:', err)
    res.status(500).json({ error: 'Gagal menambah siswa' })
  }
})

// Delete attendance student
app.delete('/api/teacher/attendance/students/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { id } = req.params

    const existing = db.prepare('SELECT id FROM attendance_students WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Siswa tidak ditemukan' })
    }

    // Delete student (cascade will delete attendance records)
    db.prepare('DELETE FROM attendance_students WHERE id = ?').run(id)

    res.json({ success: true, message: 'Siswa berhasil dihapus' })
  } catch (err) {
    console.error('Delete attendance student error:', err)
    res.status(500).json({ error: 'Gagal menghapus siswa' })
  }
})

// Mark attendance
app.post('/api/teacher/attendance/mark', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { studentId, date, status } = req.body

    if (!studentId || !date || !status) {
      return res.status(400).json({ error: 'Student ID, date, dan status wajib diisi' })
    }

    if (!['hadir', 'sakit', 'izin', 'alpa'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }

    const recordId = `rec-${Date.now()}`

    // Check if record exists
    const existing = db.prepare(`
      SELECT id FROM attendance_records
      WHERE student_id = ? AND date = ?
    `).get(studentId, date)

    if (existing) {
      // Update existing
      db.prepare(`
        UPDATE attendance_records
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND date = ?
      `).run(status, studentId, date)
    } else {
      // Insert new
      db.prepare(`
        INSERT INTO attendance_records (id, student_id, date, status)
        VALUES (?, ?, ?, ?)
      `).run(recordId, studentId, date, status)
    }

    res.json({ success: true, message: 'Absensi berhasil disimpan' })
  } catch (err) {
    console.error('Mark attendance error:', err)
    res.status(500).json({ error: 'Gagal menyimpan absensi' })
  }
})

// Get attendance records by date
app.get('/api/teacher/attendance/records', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const { date } = req.query

    if (date) {
      // Get records for specific date
      const records = db.prepare(`
        SELECT ar.*, ats.name, ats.kelas
        FROM attendance_records ar
        JOIN attendance_students ats ON ar.student_id = ats.id
        WHERE ar.date = ?
        ORDER BY ats.kelas, ats.name
      `).all(date)

      res.json(records)
    } else {
      // Get all unique dates with summary
      const dates = db.prepare(`
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
      `).all()

      res.json(dates)
    }
  } catch (err) {
    console.error('Get attendance records error:', err)
    res.status(500).json({ error: 'Gagal mengambil data absensi' })
  }
})

// ============================================================
// SERVER START
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
  console.log(`📱 Akses dari HP: http://192.168.1.10:${PORT}`)
  console.log(`📊 Database: SQLite (database.sqlite)`)
  console.log(`✅ Siap digunakan!`)
})
