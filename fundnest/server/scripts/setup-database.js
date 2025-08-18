const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Setting up database...');

  try {
    // Create tables if they don't exist
    console.log('📊 Creating database tables...');
    
    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('startup', 'investor')),
        is_active BOOLEAN DEFAULT true,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create startups table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS startups (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        company_description TEXT,
        industry VARCHAR(100) NOT NULL,
        funding_stage VARCHAR(50) NOT NULL,
        funding_amount_range VARCHAR(50) NOT NULL,
        funding_amount_min INTEGER NOT NULL,
        funding_amount_max INTEGER NOT NULL,
        founded_year INTEGER NOT NULL,
        team_size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create investors table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS investors (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        investment_focus VARCHAR(50) NOT NULL,
        check_size_range VARCHAR(50) NOT NULL,
        check_size_min INTEGER NOT NULL,
        check_size_max INTEGER NOT NULL,
        experience_years INTEGER NOT NULL,
        preferred_sectors JSON NOT NULL,
        preferred_stages JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('✅ Database tables created successfully');

    // Create sample users
    console.log('👥 Creating sample users...');
    
    // Hash password for sample users
    const hashedPassword = await bcrypt.hash('test123456', 12);
    
    // Create sample startup user
    const startupUser = await prisma.user.upsert({
      where: { email: 'startup@example.com' },
      update: {},
      create: {
        email: 'startup@example.com',
        password_hash: hashedPassword,
        first_name: 'Startup',
        last_name: 'Founder',
        role: 'startup',
        is_active: true,
      },
    });

    // Create sample investor user
    const investorUser = await prisma.user.upsert({
      where: { email: 'investor@example.com' },
      update: {},
      create: {
        email: 'investor@example.com',
        password_hash: hashedPassword,
        first_name: 'Angel',
        last_name: 'Investor',
        role: 'investor',
        is_active: true,
      },
    });

    // Create sample startup profile
    await prisma.startup.upsert({
      where: { user_id: startupUser.id },
      update: {},
      create: {
        user_id: startupUser.id,
        company_name: 'Tech Innovations Inc.',
        company_description: 'Building the future with AI and machine learning solutions.',
        industry: 'technology',
        funding_stage: 'seed',
        funding_amount_range: '500k-2M',
        funding_amount_min: 4150000,
        funding_amount_max: 16600000,
        founded_year: 2023,
        team_size: 8,
      },
    });

    // Create sample investor profile
    await prisma.investor.upsert({
      where: { user_id: investorUser.id },
      update: {},
      create: {
        user_id: investorUser.id,
        investment_focus: 'angel',
        check_size_range: '100k-500k',
        check_size_min: 830000,
        check_size_max: 4150000,
        experience_years: 5,
        preferred_sectors: ['technology', 'healthcare', 'fintech'],
        preferred_stages: ['seed', 'pre-seed'],
      },
    });

    console.log('✅ Sample users created successfully');
    console.log('📝 Sample credentials:');
    console.log('   Startup: startup@example.com / test123456');
    console.log('   Investor: investor@example.com / test123456');

    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
