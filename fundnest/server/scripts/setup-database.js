const { db, dbRun, dbGet } = require('../config/database');

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up FundNest Neon PostgreSQL database...');

    // Create Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('startup', 'investor')) NOT NULL,
        profile_image TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Startups table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS startups (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        company_description TEXT,
        industry VARCHAR(100) NOT NULL,
        funding_stage VARCHAR(50) NOT NULL,
        funding_amount_range VARCHAR(50) NOT NULL,
        funding_amount_min BIGINT, -- in INR
        funding_amount_max BIGINT, -- in INR
        founded_year INTEGER,
        location VARCHAR(255),
        website VARCHAR(255),
        team_size INTEGER,
        revenue_last_year BIGINT, -- in INR
        is_funded BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Investors table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS investors (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        investment_focus VARCHAR(100) NOT NULL,
        check_size_range VARCHAR(50) NOT NULL,
        check_size_min BIGINT, -- in INR
        check_size_max BIGINT, -- in INR
        experience_years INTEGER,
        preferred_sectors JSONB, -- JSON array of sectors
        preferred_stages JSONB, -- JSON array of stages
        location VARCHAR(255),
        portfolio_size INTEGER DEFAULT 0,
        total_invested BIGINT DEFAULT 0, -- in INR
        linkedin_url VARCHAR(255),
        is_accredited BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Newsletter Subscriptions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Matches table (for AI matching)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        investor_id INTEGER REFERENCES investors(id) ON DELETE CASCADE,
        match_score DECIMAL(3,2), -- 0.00 to 1.00
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'interested', 'rejected', 'meeting_scheduled', 'deal_closed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, investor_id)
      )
    `);

    // Create Messages table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create comprehensive indexes for better performance
    await dbRun('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token)');
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_user_id ON startups(user_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_industry ON startups(industry)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_funding_stage ON startups(funding_stage)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_location ON startups(location)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_funding_range ON startups(funding_amount_range)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_is_funded ON startups(is_funded)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_startups_created_at ON startups(created_at)');
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_investors_user_id ON investors(user_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_investors_focus ON investors(investment_focus)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_investors_check_size ON investors(check_size_range)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_investors_location ON investors(location)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_investors_accredited ON investors(is_accredited)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_investors_created_at ON investors(created_at)');
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_matches_startup_id ON matches(startup_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_matches_investor_id ON matches(investor_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(match_score)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at)');
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(is_active)');

    // Create Analytics table for tracking events
    await dbRun(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        session_id VARCHAR(255),
        event_name VARCHAR(100) NOT NULL,
        event_data JSONB,
        page_path VARCHAR(500),
        user_agent TEXT,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events(session_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at)');

    // Create User Sessions table for security tracking
    await dbRun(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        refresh_token VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at)');

    // Create API Rate Limiting table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL, -- IP or user ID
        endpoint VARCHAR(255) NOT NULL,
        request_count INTEGER DEFAULT 1,
        window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(identifier, endpoint, window_start)
      )
    `);
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON rate_limits(endpoint)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start)');

    // Create File Uploads table for tracking uploads
    await dbRun(`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        original_filename VARCHAR(255) NOT NULL,
        stored_filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_hash VARCHAR(64), -- SHA-256 hash for deduplication
        upload_type VARCHAR(50) NOT NULL, -- 'avatar', 'pitch_deck', 'document'
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON file_uploads(user_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_uploads_type ON file_uploads(upload_type)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_uploads_hash ON file_uploads(file_hash)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_uploads_active ON file_uploads(is_active)');

    // Create Audit Log table for tracking important actions
    await dbRun(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50) NOT NULL,
        resource_id INTEGER,
        old_values JSONB,
        new_values JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at)');

    // Create Performance Metrics table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(50) NOT NULL,
        metric_value DECIMAL(10,3) NOT NULL,
        metric_unit VARCHAR(20),
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        session_id VARCHAR(255),
        page_path VARCHAR(500),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await dbRun('CREATE INDEX IF NOT EXISTS idx_perf_metric_name ON performance_metrics(metric_name)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_perf_created_at ON performance_metrics(created_at)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_perf_page_path ON performance_metrics(page_path)');

    console.log('✅ Database setup completed successfully with production optimizations!');
    
    // Insert sample data for development
    if (process.env.NODE_ENV === 'development') {
      await insertSampleData();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    console.log('🔄 Inserting sample data...');
    
    // Check if data already exists
    const existingUser = await dbGet('SELECT COUNT(*) as count FROM users');

    if (existingUser && existingUser.count > 0) {
      console.log('📊 Sample data already exists, skipping...');
      return;
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Insert realistic sample users
    const users = [
      { email: 'rajkumar@techflow.com', firstName: 'Raj', lastName: 'Kumar', role: 'startup' },
      { email: 'priya@greentech.in', firstName: 'Priya', lastName: 'Sharma', role: 'startup' },
      { email: 'arjun@ventures.com', firstName: 'Arjun', lastName: 'Patel', role: 'investor' },
      { email: 'sneha@capitalfund.in', firstName: 'Sneha', lastName: 'Gupta', role: 'investor' },
      { email: 'vikram@ainovate.com', firstName: 'Vikram', lastName: 'Singh', role: 'startup' },
      { email: 'meera@impactvc.com', firstName: 'Meera', lastName: 'Jain', role: 'investor' }
    ];

    const userIds = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const result = await dbRun(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) VALUES
        ($1, $2, $3, $4, $5, TRUE) RETURNING id
      `, [user.email, hashedPassword, user.firstName, user.lastName, user.role]);
      
      userIds.push({ ...user, id: result.rows[0].id });
    }

    // Insert realistic startup companies
    const startups = userIds.filter(u => u.role === 'startup');
    const startupData = [
      {
        userId: startups[0]?.id,
        companyName: 'TechFlow Solutions',
        description: 'AI-powered workflow automation platform helping businesses streamline operations and boost productivity by 40%',
        industry: 'technology',
        stage: 'seed',
        fundingRange: '500k-1m',
        min: 4150000, max: 8300000,
        foundedYear: 2023,
        teamSize: 8,
        revenue: 1200000,
        isFunded: false
      },
      {
        userId: startups[1]?.id,
        companyName: 'GreenTech Innovations',
        description: 'Revolutionary solar panel recycling technology reducing e-waste while creating sustainable energy solutions for smart cities',
        industry: 'sustainability',
        stage: 'pre-seed',
        fundingRange: '100k-500k',
        min: 830000, max: 4150000,
        foundedYear: 2024,
        teamSize: 5,
        revenue: 0,
        isFunded: false
      },
      {
        userId: startups[2]?.id,
        companyName: 'AInovate Labs',
        description: 'Machine learning solutions for healthcare diagnostics, helping doctors detect diseases 3x faster with 95% accuracy',
        industry: 'healthcare',
        stage: 'series-a',
        fundingRange: '1m-5m',
        min: 8300000, max: 41500000,
        foundedYear: 2022,
        teamSize: 15,
        revenue: 3500000,
        isFunded: true
      }
    ];

    for (const startup of startupData) {
      if (startup.userId) {
        await dbRun(`
          INSERT INTO startups (user_id, company_name, company_description, industry, funding_stage, funding_amount_range, funding_amount_min, funding_amount_max, founded_year, team_size, revenue_last_year, is_funded) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [startup.userId, startup.companyName, startup.description, startup.industry, startup.stage, startup.fundingRange, startup.min, startup.max, startup.foundedYear, startup.teamSize, startup.revenue, startup.isFunded]);
      }
    }

    // Insert realistic investor profiles  
    const investors = userIds.filter(u => u.role === 'investor');
    const investorData = [
      {
        userId: investors[0]?.id,
        focus: 'angel',
        checkRange: '50k-250k',
        min: 415000, max: 2075000,
        experience: 7,
        sectors: ['technology', 'fintech', 'saas'],
        stages: ['seed', 'pre-seed'],
        portfolioSize: 12,
        totalInvested: 15000000
      },
      {
        userId: investors[1]?.id,
        focus: 'vc',
        checkRange: '500k-2m',
        min: 4150000, max: 16600000,
        experience: 12,
        sectors: ['sustainability', 'healthcare', 'cleantech'],
        stages: ['series-a', 'seed'],
        portfolioSize: 8,
        totalInvested: 45000000
      },
      {
        userId: investors[2]?.id,
        focus: 'angel',
        checkRange: '100k-500k',
        min: 830000, max: 4150000,
        experience: 5,
        sectors: ['healthcare', 'biotech', 'medtech'],
        stages: ['pre-seed', 'seed'],
        portfolioSize: 6,
        totalInvested: 8500000
      }
    ];

    for (const investor of investorData) {
      if (investor.userId) {
        await dbRun(`
          INSERT INTO investors (user_id, investment_focus, check_size_range, check_size_min, check_size_max, experience_years, preferred_sectors, preferred_stages, portfolio_size, total_invested, is_accredited) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
        `, [investor.userId, investor.focus, investor.checkRange, investor.min, investor.max, investor.experience, JSON.stringify(investor.sectors), JSON.stringify(investor.stages), investor.portfolioSize, investor.totalInvested]);
      }
    }

    // Create some sample matches
      const startupIds = await dbGet('SELECT id FROM startups LIMIT 3');
      const investorIds = await dbGet('SELECT id FROM investors LIMIT 3');
    
    if (startupIds.length > 0 && investorIds.length > 0) {
      await dbRun(`
        INSERT INTO matches (startup_id, investor_id, match_score, status) VALUES
        ($1, $2, 0.92, 'interested')
      `, [startupIds[0].id, investorIds[0].id]);
      
      await dbRun(`
        INSERT INTO matches (startup_id, investor_id, match_score, status) VALUES
        ($1, $2, 0.87, 'meeting_scheduled')
      `, [startupIds[1].id, investorIds[1].id]);
      
      await dbRun(`
        INSERT INTO matches (startup_id, investor_id, match_score, status) VALUES
        ($1, $2, 0.95, 'deal_closed')
      `, [startupIds[2].id, investorIds[2].id]);
    }

    console.log('✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error);
  }
};

setupDatabase();
