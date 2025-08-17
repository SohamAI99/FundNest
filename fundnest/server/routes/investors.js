const express = require('express');
const { dbGet, dbRun, memoryDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all investors
router.get('/', async (req, res) => {
  try {
    // Return mock data for now
    const investors = memoryDb.investors.map(investor => {
      const user = memoryDb.users.find(u => u.id === investor.user_id);
      return {
        id: investor.id,
        investmentFocus: investor.investment_focus,
        checkSizeRange: investor.check_size_range,
        experienceYears: investor.experience_years,
        preferredSectors: JSON.parse(investor.preferred_sectors || '[]'),
        preferredStages: JSON.parse(investor.preferred_stages || '[]'),
        location: investor.location,
        isAccredited: investor.is_accredited,
        name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        email: user ? user.email : '',
        createdAt: investor.created_at
      };
    });

    res.json({
      success: true,
      investors,
      total: investors.length
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
    const investorId = parseInt(req.params.id);
    const investor = memoryDb.investors.find(i => i.id === investorId);
    
    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    const user = memoryDb.users.find(u => u.id === investor.user_id);

    res.json({
      success: true,
      investor: {
        id: investor.id,
        investmentFocus: investor.investment_focus,
        checkSizeRange: investor.check_size_range,
        experienceYears: investor.experience_years,
        preferredSectors: JSON.parse(investor.preferred_sectors || '[]'),
        preferredStages: JSON.parse(investor.preferred_stages || '[]'),
        location: investor.location,
        isAccredited: investor.is_accredited,
        name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        email: user ? user.email : '',
        createdAt: investor.created_at
      }
    });
  } catch (error) {
    console.error('Get investor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting investor'
    });
  }
});

module.exports = router;
