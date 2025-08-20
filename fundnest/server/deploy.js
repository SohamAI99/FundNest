// This script is used to deploy the backend to Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('⚠️ Vercel CLI is not installed. Installing...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Deploy to Vercel
console.log('🚀 Deploying to Vercel...');
try {
  // Deploy with production flag
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}