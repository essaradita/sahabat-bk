// Vercel Serverless Function: Root API endpoint & Health Check
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { pathname } = new URL(req.url, `http://${req.headers.host}`)

  // GET /api/debug - Check environment variables
  if (pathname === '/api/debug' || pathname === '/debug') {
    return res.json({
      status: 'debug',
      env_vars: {
        POSTGRES_URL: process.env.POSTGRES_URL ? `✅ SET (${process.env.POSTGRES_URL.substring(0, 25)}...)` : '❌ MISSING - Set ini di Vercel Dashboard!',
        JWT_SECRET: process.env.JWT_SECRET ? `✅ SET (length: ${process.env.JWT_SECRET.length} chars)` : '❌ MISSING - Set ini di Vercel Dashboard!',
        NODE_ENV: process.env.NODE_ENV || '❌ not set',
        VERCEL: process.env.VERCEL || 'not on vercel',
        VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
      },
      instructions: process.env.POSTGRES_URL && process.env.JWT_SECRET 
        ? '✅ Environment variables OK!' 
        : '⚠️ Set POSTGRES_URL dan JWT_SECRET di Vercel Dashboard → Settings → Environment Variables, lalu Redeploy!',
      timestamp: new Date().toISOString()
    })
  }

  // GET /api/health
  if (pathname === '/api/health') {
    return res.json({
      status: 'healthy',
      database: process.env.POSTGRES_URL ? 'configured' : 'NOT CONFIGURED',
      timestamp: new Date().toISOString()
    })
  }

  // GET /api
  res.json({
    status: 'OK',
    message: 'SAHABAT BK API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env_check: {
      postgres_url: process.env.POSTGRES_URL ? '✅ SET' : '❌ MISSING',
      jwt_secret: process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING'
    },
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
