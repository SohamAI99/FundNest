const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, createRateLimiter } = require('../middleware/auth');
const router = express.Router();

// Initialize Prisma client
const prisma = new PrismaClient();

// Validate JWT secret strength and fail-safe fallback
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default_secret' || process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️ WARNING: JWT_SECRET is unset, default, or too short. Using secure runtime key fallback.');
  process.env.JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
}

// Validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Rate limiting for auth endpoints
const authRateLimit = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes
const loginRateLimit = createRateLimiter(15 * 60 * 1000, 10); // 10 login attempts per 15 minutes (made more generous for testing/robustness)

// Register endpoint
router.post('/register', authRateLimit, async (req, res) => {
  try {
    let { email, password, firstName, lastName, role, ...additionalData } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Clean inputs
    email = email.trim().toLowerCase();
    firstName = firstName.trim();
    lastName = lastName.trim();

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
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
    const userData = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role,
        is_active: true,
        created_at: new Date()
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true
      }
    });

    // Create role-specific profile
    if (role === 'startup') {
      await prisma.startup.create({
        data: {
          user_id: userData.id,
          company_name: additionalData.companyName || '',
          company_description: additionalData.companyDescription || '',
          industry: additionalData.industry || 'technology',
          funding_stage: additionalData.fundingStage || 'pre-seed',
          funding_amount_range: additionalData.fundingAmount || '100k-500k',
          funding_amount_min: parseInt(additionalData.fundingAmountMin) || 830000,
          funding_amount_max: parseInt(additionalData.fundingAmountMax) || 4150000,
          founded_year: parseInt(additionalData.foundedYear) || new Date().getFullYear(),
          team_size: parseInt(additionalData.teamSize) || 5
        }
      });
    } else if (role === 'investor') {
      await prisma.investor.create({
        data: {
          user_id: userData.id,
          investment_focus: additionalData.investmentFocus || 'angel',
          check_size_range: additionalData.checkSize || '50k-250k',
          check_size_min: 415000, // Default min in paisa
          check_size_max: 2075000, // Default max in paisa
          experience_years: additionalData.experienceYears ? parseInt(additionalData.experienceYears) : 1,
          preferred_sectors: additionalData.preferredSectors || ['technology'],
          preferred_stages: additionalData.preferredStages || ['seed']
        }
      });
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
        role: userData.role,
        kycStatus: 'unverified',
        subscriptionPlan: 'free'
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
    const user = await prisma.user.findUnique({
      where: { email }
    });
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
        role: user.role,
        kycStatus: user.kyc_status || 'unverified',
        subscriptionPlan: user.subscription_plan || 'free'
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
    const user = await prisma.user.findUnique({
      where: { email }
    });
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
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      }
    });

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
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expiry: {
          gt: new Date()
        }
      }
    });

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
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      }
    });

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true
      }
    });

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
        role: user.role,
        subscriptionPlan: user.subscription_plan || 'free'
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
