const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'BeautyBloom API is running',
    status: 'ok'
  });
});

app.disable('x-powered-by');

if (env.isProd) {
  app.set('trust proxy', 1);
}

app.use(helmet());

app.use(cors({
  origin: env.clientOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-BB-Client']
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(cookieParser());

app.use(express.json({
  limit: '200kb'
}));

app.use('/api', (req, res, next) => {
  if (req.path !== '/content') {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
