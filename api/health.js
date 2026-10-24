// Vercel Serverless Function: Health Check
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  })
}
