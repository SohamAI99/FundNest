const app = require("../server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Ensure DB connection on cold start
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");
  } catch (err) {
    console.error("❌ Failed to connect DB:", err);
  }
})();

module.exports = (req, res) => app(req, res);
