const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Initialize Prisma client
const prisma = new PrismaClient();

// Get platform statistics
router.get('/platform-stats', async (req, res) => {
  try {
    const [totalUsers, totalStartups, totalInvestors] = await Promise.all([
      prisma.user.count(),
      prisma.startup.count(),
      prisma.investor.count()
    ]);

    const stats = {
      totalUsers,
      totalStartups,
      totalInvestors,
      totalMatches: 0, // Will be implemented later
      fundingRaised: '₹2.5Cr+',
      successfulDeals: 12,
      averageTicketSize: '₹25L'
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting platform stats'
    });
  }
});

// Get dashboard statistics for a user
router.get('/dashboard-stats/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let stats = {};
    
    if (user.role === 'startup') {
      const startup = await prisma.startup.findUnique({
        where: { user_id: userId }
      });
      stats = {
        profileViews: 245,
        interestedInvestors: 12,
        pitchesReceived: 8,
        meetingsScheduled: 3,
        fundingGoal: startup?.funding_amount_range || '500k-2M',
        currentStage: startup?.funding_stage || 'seed'
      };
    } else if (user.role === 'investor') {
      const investor = await prisma.investor.findUnique({
        where: { user_id: userId }
      });
      stats = {
        startupsViewed: 156,
        pitchesSent: 23,
        meetingsScheduled: 8,
        dealsCompleted: 2,
        portfolioSize: 5,
        investmentFocus: investor?.investment_focus || 'angel'
      };
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard stats'
    });
  }
});

// Get activity feed for a user
router.get('/activity-feed/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit) || 10;
    
    // Mock activity data
    const activities = [
      {
        id: 1,
        type: 'profile_view',
        message: 'Your profile was viewed by TechVentures Capital',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: 'eye'
      },
      {
        id: 2,
        type: 'pitch_received',
        message: 'New pitch received from AI Startup Inc.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        icon: 'mail'
      },
      {
        id: 3,
        type: 'meeting_scheduled',
        message: 'Meeting scheduled with Bangalore Angels',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        icon: 'calendar'
      },
      {
        id: 4,
        type: 'profile_updated',
        message: 'You updated your company profile',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        icon: 'user'
      }
    ];

    res.json({
      success: true,
      activities: activities.slice(0, limit)
    });
  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting activity feed'
    });
  }
});

module.exports = router;
