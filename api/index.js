// Vercel Serverless Function: Root API endpoint & Health Check
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  // GET /api/health
  if (pathname === '/api/health') {
    return res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  }

  // GET /api
  res.json({
    status: 'OK',
    message: 'SAHABAT BK API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/register-student',
      'POST /api/auth/register-teacher',
      'POST /api/auth/login-student',
      'POST /api/auth/login-teacher',
      'GET  /api/auth/profile',
      'GET  /api/teacher/students',
      'GET  /api/teacher/missions',
      'POST /api/teacher/missions',
      'PUT  /api/teacher/missions/:id',
      'DELETE /api/teacher/missions/:id',
      'GET  /api/teacher/case-studies',
      'POST /api/teacher/case-studies',
      'PUT  /api/teacher/case-studies/:id',
      'DELETE /api/teacher/case-studies/:id',
      'GET  /api/teacher/classes',
      'POST /api/teacher/classes',
      'PUT  /api/teacher/classes/:id',
      'DELETE /api/teacher/classes/:id',
      'GET  /api/teacher/attendance/students',
      'POST /api/teacher/attendance/students',
      'DELETE /api/teacher/attendance/students/:id',
      'POST /api/teacher/attendance/mark',
      'GET  /api/teacher/attendance/records',
      'GET  /api/student/missions',
      'POST /api/student/missions/complete'
    ]
  })
}
