// Vercel Serverless Function catch-all that wraps the Express app
// All requests to /api/* are forwarded to the Express server defined in server/server.js

const serverless = require('serverless-http');
const app = require('../server/server');

module.exports = serverless(app);