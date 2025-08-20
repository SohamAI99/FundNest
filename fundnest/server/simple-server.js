const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables first
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:4028", "http://localhost:5000"],
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

// Mock user database
const mockUsers = [];

// Test endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FundNest Backend 🚀",
    docs: "/api",
    health: "/health",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Stats endpoint
app.get("/api/stats/platform-stats", (req, res) => {
  res.json({
    success: true,
    data: mockStats
  });
});

// Auth endpoints
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  // Mock user - in real app, this would check database
  const mockUser = {
    id: 1,
    email: email,
    firstName: "Test",
    lastName: "User",
    role: email.includes("startup") ? "startup" : "investor"
  };

  // Generate mock token
  const mockToken = "mock-jwt-token-" + Date.now();

  res.json({
    success: true,
    token: mockToken,
    user: mockUser
  });
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  
  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided"
    });
  }

  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists"
    });
  }

  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    email,
    firstName,
    lastName,
    role,
    created_at: new Date()
  };

  mockUsers.push(newUser);

  // Generate mock token
  const mockToken = "mock-jwt-token-" + Date.now();

  res.status(201).json({
    success: true,
    token: mockToken,
    user: newUser
  });
});

// User profile endpoint
app.get("/api/users/profile", (req, res) => {
  // Mock user data
  const mockUser = {
    id: 1,
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    role: "investor",
    created_at: new Date(),
    updated_at: new Date()
  };

  res.json({
    success: true,
    user: mockUser
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 FundNest Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Test stats: http://localhost:${PORT}/api/stats/platform-stats`);
  console.log(`📍 Test login: http://localhost:${PORT}/api/auth/login`);
});
