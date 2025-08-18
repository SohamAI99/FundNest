const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const serverless = require("serverless-http");

// Load environment variables first
dotenv.config();

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const startupRoutes = require("./routes/startups.js");
const investorRoutes = require("./routes/investors.js");
const statsRoutes = require("./routes/stats.js");

const app = express();
const prisma = new PrismaClient();

// ---------- Middlewares ----------
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(","),
  credentials: true,
}));
app.use(express.json());

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FundNest Backend 🚀",
    docs: "/api",
    health: "/health",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to FundNest API 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/stats", statsRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// ✅ Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
