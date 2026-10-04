const jwt = require('jsonwebtoken');
const env = require('../config/env');
const db = require('../db');

const COOKIE = 'bb_session';

function cookieOptions() {
  return { httpOnly: true, secure: env.isProd, sameSite: env.isProd ? 'none' : 'lax', maxAge: 7 * 24 * 3600 * 1000, path: '/' };
}
function signToken(user) { return jwt.sign({ sub: user._id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn, algorithm: 'HS256' }); }

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = (header.startsWith('Bearer ') ? header.slice(7) : null) || (req.cookies && req.cookies[COOKIE]);
    if (!token) return res.status(401).json({ error: 'Please sign in.' });
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    const user = await db.users.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch { res.status(401).json({ error: 'Session expired. Please sign in again.' }); }
}

/** CSRF defence for cookie auth: browsers can't add custom headers cross-site without a CORS preflight. */
function requireClientHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers['x-bb-client'] !== 'web') return res.status(403).json({ error: 'Blocked request.' });
  next();
}

module.exports = { requireAuth, requireClientHeader, signToken, cookieOptions, COOKIE };
