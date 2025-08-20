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

// Mock user database
const mockUsers = [];

// Auth endpoints
app.post("/auth/login", (req, res) => {
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

app.post("/auth/register", (req, res) => {
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

// Stats endpoint
app.get("/stats/platform-stats", (req, res) => {
  res.json({
    success: true,
    data: mockStats
  });
});

// User profile endpoint
app.get("/users/profile", (req, res) => {
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

// Export the Express app as a Vercel serverless function
module.exports = app;
