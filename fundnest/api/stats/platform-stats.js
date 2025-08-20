const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(",") || ["https://fundnest.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Mock data for testing
const mockStats = {
  startups: 0,
  investors: 0,
  matches: 0,
  funding: 0
};

// Stats endpoint
app.get("/stats/platform-stats", (req, res) => {
  res.json({
    success: true,
    data: mockStats
  });
});

// Export the Express app as a Vercel serverless function
module.exports = app;
