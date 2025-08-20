const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables first
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test`);
});
