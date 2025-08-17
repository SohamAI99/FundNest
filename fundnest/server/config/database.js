const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL pool using DATABASE_URL
// SSL is enabled in production (Vercel/Neon) and disabled locally
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper to run a query that returns a single row (or null)
const dbGet = async (query, params = []) => {
  const result = await pool.query(query, params);
  return result.rows?.[0] || null;
};

// Helper to run a query that may return multiple rows
const dbRun = async (query, params = []) => {
  return pool.query(query, params);
};

module.exports = {
  db: pool,
  dbGet,
  dbRun,
};