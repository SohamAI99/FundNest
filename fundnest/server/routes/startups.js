const express = require('express');
const { dbGet, dbRun, memoryDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all startups
router.get('/', async (req, res) => {
  try {
    // Return mock data for now
    const startups = memoryDb.startups.map(startup => {
      const user = memoryDb.users.find(u => u.id === startup.user_id);
      return {
        id: startup.id,
        companyName: startup.company_name,
        companyDescription: startup.company_description,
        industry: startup.industry,
        fundingStage: startup.funding_stage,
        fundingAmountRange: startup.funding_amount_range,
        foundedYear: startup.founded_year,
        teamSize: startup.team_size,
        location: startup.location,
        websiteUrl: startup.website_url,
        isFunded: startup.is_funded,
        founder: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        createdAt: startup.created_at
      };
    });

    res.json({
      success: true,
      startups,
      total: startups.length
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
    const startupId = parseInt(req.params.id);
    const startup = memoryDb.startups.find(s => s.id === startupId);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }

    const user = memoryDb.users.find(u => u.id === startup.user_id);

    res.json({
      success: true,
      startup: {
        id: startup.id,
        companyName: startup.company_name,
        companyDescription: startup.company_description,
        industry: startup.industry,
        fundingStage: startup.funding_stage,
        fundingAmountRange: startup.funding_amount_range,
        foundedYear: startup.founded_year,
        teamSize: startup.team_size,
        location: startup.location,
        websiteUrl: startup.website_url,
        isFunded: startup.is_funded,
        founder: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        createdAt: startup.created_at
      }
    });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting startup'
    });
  }
});

module.exports = router;
