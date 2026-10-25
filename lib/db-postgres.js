
 // PostgreSQL Database Connection for Vercel
import { neon } from '@neondatabase/serverless'

// Get connection string from environment
const sql = neon(process.env.POSTGRES_URL)

// Helper function to execute queries
export async function query(text, params = []) {
  try {
    const result = await sql.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function to get single row
export async function queryOne(text, params = []) {
  const result = await query(text, params)
  return result[0] || null
}

export default { query, queryOne }

