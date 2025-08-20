const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Initialize Prisma client
const prisma = new PrismaClient();

// Get all startups
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, fundingStage } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (industry) where.industry = industry;
    if (fundingStage) where.funding_stage = fundingStage;

    const [startups, total] = await Promise.all([
      prisma.startup.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true
            }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.startup.count({ where })
    ]);

    res.json({
      success: true,
      startups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get startups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting startups'
    });
  }
});

// Get startup by ID
router.get('/:id', async (req, res) => {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    res.json({
      success: true,
      startup
    });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting startup'
    });
  }
});

// Create startup profile (for registered users)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      companyName,
      companyDescription,
      industry,
      fundingStage,
      fundingAmount,
      foundedYear,
      teamSize
    } = req.body;

    // Check if user already has a startup profile
    const existingStartup = await prisma.startup.findUnique({
      where: { user_id: req.user.id }
    });

    if (existingStartup) {
      return res.status(400).json({
        success: false,
        message: 'Startup profile already exists for this user'
      });
    }

    const startup = await prisma.startup.create({
      data: {
        user_id: req.user.id,
        company_name: companyName || '',
        company_description: companyDescription || '',
        industry: industry || 'technology',
        funding_stage: fundingStage || 'pre-seed',
        funding_amount_range: fundingAmount || '100k-500k',
        funding_amount_min: 830000, // Default min in paisa
        funding_amount_max: 4150000, // Default max in paisa
        founded_year: foundedYear || new Date().getFullYear(),
        team_size: teamSize || 5
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      startup,
      message: 'Startup profile created successfully'
    });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating startup profile'
    });
  }
});

// Update startup profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const startupId = parseInt(req.params.id);
    
    // Check if startup exists and belongs to user
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    if (startup.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this startup profile'
      });
    }

    const {
      companyName,
      companyDescription,
      industry,
      fundingStage,
      fundingAmount,
      foundedYear,
      teamSize
    } = req.body;

    const updatedStartup = await prisma.startup.update({
      where: { id: startupId },
      data: {
        company_name: companyName,
        company_description: companyDescription,
        industry,
        funding_stage: fundingStage,
        funding_amount_range: fundingAmount,
        funding_amount_min: fundingAmount ? 830000 : undefined,
        funding_amount_max: fundingAmount ? 4150000 : undefined,
        founded_year: foundedYear,
        team_size: teamSize
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    res.json({
      success: true,
      startup: updatedStartup,
      message: 'Startup profile updated successfully'
    });
  } catch (error) {
    console.error('Update startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating startup profile'
    });
  }
});

// Delete startup profile
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const startupId = parseInt(req.params.id);
    
    // Check if startup exists and belongs to user
    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    if (startup.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this startup profile'
      });
    }

    await prisma.startup.delete({
      where: { id: startupId }
    });

    res.json({
      success: true,
      message: 'Startup profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting startup profile'
    });
  }
});

module.exports = router;
