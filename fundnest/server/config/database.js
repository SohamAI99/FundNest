const { Pool } = require('pg');
require('dotenv').config();

// Create a simple in-memory storage for development
let memoryDb = {
  users: [],
  startups: [],
  investors: [],
  matches: [],
  analytics_events: []
};

let userIdCounter = 1;
let startupIdCounter = 1;
let investorIdCounter = 1;

// Mock database functions for development
const dbGet = async (query, params = []) => {
  try {
    console.log('DB Query:', query, 'Params:', params);
    
    // Handle different query types
    if (query.includes('SELECT * FROM users WHERE email =')) {
      const email = params[0];
      return memoryDb.users.find(user => user.email === email);
    }
    
    if (query.includes('SELECT * FROM users WHERE id =')) {
      const id = parseInt(params[0]);
      return memoryDb.users.find(user => user.id === id);
    }
    
    if (query.includes('SELECT * FROM users WHERE reset_token =')) {
      const token = params[0];
      return memoryDb.users.find(user => user.reset_token === token && new Date(user.reset_token_expiry) > new Date());
    }
    
    return null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const dbRun = async (query, params = []) => {
  try {
    console.log('DB Run:', query, 'Params:', params);
    
    // Handle INSERT INTO users
    if (query.includes('INSERT INTO users')) {
      const [email, password_hash, first_name, last_name, role] = params;
      const newUser = {
        id: userIdCounter++,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        is_active: true,
        reset_token: null,
        reset_token_expiry: null,
        created_at: new Date()
      };
      memoryDb.users.push(newUser);
      return {
        rows: [newUser]
      };
    }
    
    // Handle INSERT INTO startups
    if (query.includes('INSERT INTO startups')) {
      const [user_id, company_name, company_description, industry, funding_stage, funding_amount_range, funding_amount_min, funding_amount_max, founded_year, team_size] = params;
      const newStartup = {
        id: startupIdCounter++,
        user_id,
        company_name,
        company_description,
        industry,
        funding_stage,
        funding_amount_range,
        funding_amount_min,
        funding_amount_max,
        founded_year,
        team_size,
        location: 'Mumbai, India',
        website_url: '',
        is_funded: false,
        created_at: new Date()
      };
      memoryDb.startups.push(newStartup);
      return { rows: [newStartup] };
    }
    
    // Handle INSERT INTO investors
    if (query.includes('INSERT INTO investors')) {
      const [user_id, investment_focus, check_size_range, check_size_min, check_size_max, experience_years, preferred_sectors, preferred_stages] = params;
      const newInvestor = {
        id: investorIdCounter++,
        user_id,
        investment_focus,
        check_size_range,
        check_size_min,
        check_size_max,
        experience_years,
        preferred_sectors,
        preferred_stages,
        location: 'Mumbai, India',
        is_accredited: false,
        created_at: new Date()
      };
      memoryDb.investors.push(newInvestor);
      return { rows: [newInvestor] };
    }
    
    // Handle UPDATE users for password reset
    if (query.includes('UPDATE users') && query.includes('reset_token')) {
      if (params.length === 3) {
        // Setting reset token
        const [reset_token, reset_token_expiry, user_id] = params;
        const user = memoryDb.users.find(u => u.id === user_id);
        if (user) {
          user.reset_token = reset_token;
          user.reset_token_expiry = reset_token_expiry;
        }
      } else if (params.length === 2) {
        // Clearing reset token and updating password
        const [password_hash, user_id] = params;
        const user = memoryDb.users.find(u => u.id === user_id);
        if (user) {
          user.password_hash = password_hash;
          user.reset_token = null;
          user.reset_token_expiry = null;
        }
      }
      return { rows: [] };
    }
    
    return { rows: [] };
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
};

// Create sample data
const initializeSampleData = () => {
  console.log('🗄️ Initializing sample database data...');
  
  // Add some sample users for testing
  memoryDb.users = [
    {
      id: 1,
      email: 'startup@demo.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfA3TFx.D9A3MwO', // password: demo123
      first_name: 'John',
      last_name: 'Doe',
      role: 'startup',
      is_active: true,
      reset_token: null,
      reset_token_expiry: null,
      created_at: new Date()
    },
    {
      id: 2,
      email: 'investor@demo.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfA3TFx.D9A3MwO', // password: demo123
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'investor',
      is_active: true,
      reset_token: null,
      reset_token_expiry: null,
      created_at: new Date()
    }
  ];
  
  memoryDb.startups = [
    {
      id: 1,
      user_id: 1,
      company_name: 'TechStart AI',
      company_description: 'AI-powered productivity platform for modern teams',
      industry: 'technology',
      funding_stage: 'seed',
      funding_amount_range: '500k-2M',
      funding_amount_min: 41500000, // 5L in paisa
      funding_amount_max: 20000000000, // 2Cr in paisa
      founded_year: 2023,
      team_size: 8,
      location: 'Bangalore, India',
      website_url: 'https://techstart.ai',
      is_funded: false,
      created_at: new Date()
    }
  ];
  
  memoryDb.investors = [
    {
      id: 1,
      user_id: 2,
      investment_focus: 'angel',
      check_size_range: '100k-500k',
      check_size_min: 830000, // 1L in paisa
      check_size_max: 4150000, // 5L in paisa
      experience_years: 5,
      preferred_sectors: JSON.stringify(['technology', 'healthcare']),
      preferred_stages: JSON.stringify(['seed', 'pre-seed']),
      location: 'Mumbai, India',
      is_accredited: true,
      created_at: new Date()
    }
  ];
  
  userIdCounter = 3;
  startupIdCounter = 2;
  investorIdCounter = 2;
  
  console.log('✅ Sample data initialized!');
  console.log(`👥 Users: ${memoryDb.users.length}`);
  console.log(`🚀 Startups: ${memoryDb.startups.length}`);
  console.log(`💼 Investors: ${memoryDb.investors.length}`);
};

// Initialize sample data
initializeSampleData();

module.exports = {
  dbGet,
  dbRun,
  memoryDb
};