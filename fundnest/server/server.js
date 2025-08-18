const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Load environment variables first
dotenv.config();

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const startupRoutes = require("./routes/startups.js");
const investorRoutes = require("./routes/investors.js");
const statsRoutes = require("./routes/stats.js");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());

// ---------- Routes ----------

// Root welcome endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FundNest Backend 🚀",
    docs: "/api",
    health: "/health",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// API base
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to FundNest API 🚀" });
});

// API sub-routes
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

// ---------- Start Server ----------
async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔴 Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔴 Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
