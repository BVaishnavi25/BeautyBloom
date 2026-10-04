const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const wrap = require('../utils/asyncHandler');
const { requireAuth, requireClientHeader } = require('../middleware/auth');

const auth = require('../controllers/authController');
const contentC = require('../controllers/contentController');
const stateC = require('../controllers/stateController');
const profileC = require('../controllers/profileController');
const quizC = require('../controllers/quizController');
const coll = require('../controllers/collectionsController');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Please wait a few minutes.' } });

router.get('/health', (req, res) => res.json({ ok: true }));
router.get('/content', contentC.getContent); // public reference content

router.post('/auth/signup', authLimiter, requireClientHeader, wrap(auth.signup));
router.post('/auth/login', authLimiter, requireClientHeader, wrap(auth.login));
router.post('/auth/logout', requireClientHeader, auth.logout);

// Everything below requires a signed-in user.
router.use(requireAuth, requireClientHeader);
router.get('/auth/me', auth.me);
router.get('/state', wrap(stateC.getState));
router.get('/personalization', wrap(stateC.getPersonalization));

router.get('/profile', wrap(profileC.get));
router.put('/profile', wrap(profileC.save));
router.post('/profile/apply-quiz', wrap(profileC.applyQuiz));

router.post('/quiz', wrap(quizC.submit));

router.get('/journal', wrap(coll.getJournal));
router.put('/journal', wrap(coll.putJournal));
router.get('/favorites', wrap(coll.getFavorites));
router.post('/favorites', wrap(coll.addFavorite));
router.delete('/favorites/:itemType/:itemId', wrap(coll.removeFavorite));
router.get('/routine', wrap(coll.getRoutine));
router.put('/routine', wrap(coll.putRoutine));

router.get('/account/export', wrap(stateC.exportData));
router.delete('/account', wrap(stateC.deleteAccount));

module.exports = router;
