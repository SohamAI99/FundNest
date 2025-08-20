const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Initialize Prisma client
const prisma = new PrismaClient();

// Get all investors
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, investmentFocus, preferredStages } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (investmentFocus) where.investment_focus = investmentFocus;
    if (preferredStages) where.preferred_stages = { hasSome: preferredStages.split(',') };

    const [investors, total] = await Promise.all([
      prisma.investor.findMany({
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
      prisma.investor.count({ where })
    ]);

    res.json({
      success: true,
      investors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get investors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting investors'
    });
  }
});

// Get investor by ID
router.get('/:id', async (req, res) => {
  try {
    const investor = await prisma.investor.findUnique({
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

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    res.json({
      success: true,
      investor
    });
  } catch (error) {
    console.error('Get investor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting investor'
    });
  }
});

// Create investor profile (for registered users)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      investmentFocus,
      checkSize,
      experienceYears,
      preferredSectors,
      preferredStages
    } = req.body;

    // Check if user already has an investor profile
    const existingInvestor = await prisma.investor.findUnique({
      where: { user_id: req.user.id }
    });

    if (existingInvestor) {
      return res.status(400).json({
        success: false,
        message: 'Investor profile already exists for this user'
      });
    }

    const investor = await prisma.investor.create({
      data: {
        user_id: req.user.id,
        investment_focus: investmentFocus || 'angel',
        check_size_range: checkSize || '50k-250k',
        check_size_min: 415000, // Default min in paisa
        check_size_max: 2075000, // Default max in paisa
        experience_years: experienceYears || 1,
        preferred_sectors: preferredSectors || ['technology'],
        preferred_stages: preferredStages || ['seed']
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
      investor,
      message: 'Investor profile created successfully'
    });
  } catch (error) {
    console.error('Create investor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating investor profile'
    });
  }
});

// Update investor profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const investorId = parseInt(req.params.id);
    
    // Check if investor exists and belongs to user
    const investor = await prisma.investor.findUnique({
      where: { id: investorId }
    });

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    if (investor.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this investor profile'
      });
    }

    const {
      investmentFocus,
      checkSize,
      experienceYears,
      preferredSectors,
      preferredStages
    } = req.body;

    const updatedInvestor = await prisma.investor.update({
      where: { id: investorId },
      data: {
        investment_focus: investmentFocus,
        check_size_range: checkSize,
        check_size_min: checkSize ? 415000 : undefined,
        check_size_max: checkSize ? 2075000 : undefined,
        experience_years: experienceYears,
        preferred_sectors: preferredSectors,
        preferred_stages: preferredStages
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
      investor: updatedInvestor,
      message: 'Investor profile updated successfully'
    });
  } catch (error) {
    console.error('Update investor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating investor profile'
    });
  }
});

// Delete investor profile
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const investorId = parseInt(req.params.id);
    
    // Check if investor exists and belongs to user
    const investor = await prisma.investor.findUnique({
      where: { id: investorId }
    });

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    if (investor.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this investor profile'
      });
    }

    await prisma.investor.delete({
      where: { id: investorId }
    });

    res.json({
      success: true,
      message: 'Investor profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete investor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting investor profile'
    });
  }
});

module.exports = router;
