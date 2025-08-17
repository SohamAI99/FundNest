// Vercel Serverless Function catch-all that wraps the Express app
// This allows deploying the backend as a Vercel project with root at `server/`
// All requests to /api/* will be handled by Express routes defined in server/server.js

const serverless = require('serverless-http');
const app = require('../server');

module.exports = serverless(app);