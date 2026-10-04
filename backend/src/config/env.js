require('dotenv').config();
const crypto = require('crypto');

const isProd = process.env.NODE_ENV === 'production';

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (isProd) {
    console.error('FATAL: JWT_SECRET must be set in production.');
    process.exit(1);
  }
  // Development convenience only: a random secret per process (all sessions reset on restart).
  jwtSecret = crypto.randomBytes(48).toString('hex');
  console.warn('[env] JWT_SECRET not set — using a temporary random secret (dev only).');
}

const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean);

module.exports = {
  port: Number(process.env.PORT) || 4000,
  isProd,
  clientOrigins,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongoUri: process.env.MONGODB_URI || '',
};
