const db = require('../db');
const P = require('../services/personalizationEngine');
const { resolveList } = require('../services/favoritesService');

async function loadState(userId) {
  const [profile, allModules, journal, favorites, routineEntries] = await Promise.all([
    db.profiles.get(userId), db.history.list(userId), db.journal.list(userId), db.favorites.list(userId), db.routine.get(userId),
  ]);
  // History only ever contains Skin Quiz modules.
  const historyModules = allModules.filter((m) => m.type === 'quiz');
  const lastQuiz = [...historyModules].reverse()[0];
  const quizResult = lastQuiz ? lastQuiz.quiz : null;
  return { profile, quizResult, historyModules, journal, favorites: resolveList(favorites), routineEntries };
}

// One request that bootstraps the whole app after sign-in.
exports.getState = async (req, res) => {
  const state = await loadState(req.user.id);
  res.json({ ...state, personalization: P.computePersonalization(state.profile, state.quizResult) });
};

exports.getPersonalization = async (req, res) => {
  const s = await loadState(req.user.id);
  res.json(P.computePersonalization(s.profile, s.quizResult));
};

// Privacy controls
exports.exportData = async (req, res) => {
  const state = await loadState(req.user.id);
  res.set('Content-Disposition', 'attachment; filename="beautybloom-data.json"');
  res.json({ account: { email: req.user.email, name: req.user.name }, ...state });
};
exports.deleteAccount = async (req, res) => {
  await db.wipeUser(req.user.id);
  res.clearCookie('bb_session', { path: '/' });
  res.json({ ok: true });
};
exports.loadState = loadState;
