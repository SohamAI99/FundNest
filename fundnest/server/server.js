const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { PrismaClient } = require("@prisma/client");
const serverless = require("serverless-http");

// Load environment variables first
dotenv.config();

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const startupRoutes = require("./routes/startups.js");
const investorRoutes = require("./routes/investors.js");
const statsRoutes = require("./routes/stats.js");
const subscriptionRoutes = require("./routes/subscriptions.js");

const app = express();
const prisma = new PrismaClient();

// ---------- Hardening & Middlewares ----------
// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Global Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});
app.use("/api", apiLimiter);

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || ["https://fundnest.vercel.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin || 
      allowedOrigins.indexOf(origin) !== -1 || 
      origin.endsWith('.builtwithrocket.new') || 
      origin.endsWith('.rocket.new') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' || duration > 1000) {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

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
app.use("/api/subscriptions", subscriptionRoutes);

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
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
  module.exports.handler = serverless(app);
} else {
  // For local development
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log("👋 Shutting down gracefully...");
    server.close(async () => {
      console.log("HTTP server closed.");
      await prisma.$disconnect();
      console.log("Database connection closed.");
      process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
      console.error("Forcefully shutting down because shutdown timed out");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  module.exports = app;
}
