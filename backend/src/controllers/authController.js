const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, cookieOptions, COOKIE } = require('../middleware/auth');
const { str, EMAIL_RE } = require('../utils/validators');

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12); // keeps login timing similar for unknown emails
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

exports.signup = async (req, res) => {
  const email = str(req.body.email, 254).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const name = str(req.body.name, 80);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password must be 8–128 characters.' });
  if (await db.users.findByEmail(email)) return res.status(409).json({ error: 'An account with that email already exists.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.users.create({ name, email, passwordHash });
  res.cookie(COOKIE, signToken(user), cookieOptions());
  res.status(201).json({ user: publicUser(user) });
};

exports.login = async (req, res) => {
  const email = str(req.body.email, 254).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const user = await db.users.findByEmail(email);
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) return res.status(401).json({ error: 'Incorrect email or password.' });
  res.cookie(COOKIE, signToken(user), cookieOptions());
  res.json({ user: publicUser(user) });
};

exports.logout = (req, res) => {
  res.clearCookie(COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
};

exports.me = (req, res) => res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
