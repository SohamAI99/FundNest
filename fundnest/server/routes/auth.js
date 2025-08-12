const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { dbGet, dbRun } = require('../config/database');
const { authenticateToken, createRateLimiter } = require('../middleware/auth');
const router = express.Router();

// Rate limiting for auth endpoints
const authRateLimit = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes
const loginRateLimit = createRateLimiter(15 * 60 * 1000, 3); // 3 login attempts per 15 minutes

// Register endpoint
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, ...additionalData } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate role
    if (!['startup', 'investor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if user already exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await dbRun(`
      INSERT INTO users (email, password_hash, first_name, last_name, role) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, email, first_name, last_name, role, created_at
    `, [email, hashedPassword, firstName, lastName, role]);

    const userId = userResult.rows[0].id;
    const userData = userResult.rows[0];

    // Create role-specific profile
    if (role === 'startup') {
      await dbRun(`
        INSERT INTO startups (user_id, company_name, company_description, industry, funding_stage, funding_amount_range, funding_amount_min, funding_amount_max, founded_year, team_size) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        userId,
        additionalData.companyName || '',
        additionalData.companyDescription || '',
        additionalData.industry || 'technology',
        additionalData.fundingStage || 'pre-seed',
        additionalData.fundingAmount || '100k-500k',
        830000, // Default min in paisa
        4150000, // Default max in paisa
        additionalData.foundedYear || new Date().getFullYear(),
        5 // Default team size
      ]);
    } else if (role === 'investor') {
      await dbRun(`
        INSERT INTO investors (user_id, investment_focus, check_size_range, check_size_min, check_size_max, experience_years, preferred_sectors, preferred_stages) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        userId,
        additionalData.investmentFocus || 'angel',
        additionalData.checkSize || '50k-250k',
        415000, // Default min in paisa
        2075000, // Default max in paisa
        additionalData.experienceYears || 1,
        JSON.stringify(additionalData.preferredSectors || ['technology']),
        JSON.stringify(additionalData.preferredStages || ['seed'])
      ]);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email,
        role: userData.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login endpoint
router.post('/login', loginRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Forgot password endpoint
router.post('/forgot-password', authRateLimit, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await dbGet('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account with this email exists, you will receive password reset instructions',
        resetLink: `http://localhost:4028/reset-password?token=demo-token-for-${email}`
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await dbRun(`
      UPDATE users 
      SET reset_token = $1, reset_token_expiry = $2 
      WHERE id = $3
    `, [resetToken, resetTokenExpiry, user.id]);

    // In a real application, you would send an email here
    console.log(`Password reset link: http://localhost:4028/reset-password?token=${resetToken}`);

    res.json({
      success: true,
      message: 'If an account with this email exists, you will receive password reset instructions',
      // For demo purposes only - remove in production
      resetLink: `http://localhost:4028/reset-password?token=${resetToken}`
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request'
    });
  }
});

// Reset password endpoint
router.post('/reset-password', authRateLimit, async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user with valid reset token
    const user = await dbGet(`
      SELECT * FROM users 
      WHERE reset_token = $1 AND reset_token_expiry > NOW()
    `, [token]);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await dbRun(`
      UPDATE users 
      SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id = $2
    `, [hashedPassword, user.id]);

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
});

// Verify token endpoint (for protected routes)
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', 
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying token'
    });
  }
});

module.exports = router;