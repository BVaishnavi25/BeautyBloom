const db = require('../db');
const { cleanProfile } = require('../utils/validators');
const { loadState } = require('./stateController');
const { applyQuizToProfile } = require('../services/profileSync');

exports.get = async (req, res) => res.json({ profile: await db.profiles.get(req.user.id) });

// The Skin Quiz is the source of truth for skin type and sensitivity: once a quiz exists, profile edits can't override them.
exports.save = async (req, res) => {
  const { quizResult } = await loadState(req.user.id);
  const clean = cleanProfile(req.body);
  if (quizResult) { clean.skinType = quizResult.resultSkinType; clean.sensitivity = quizResult.resultSensitivity; }
  res.json({ profile: await db.profiles.save(req.user.id, clean) });
};

// Re-applies the latest Skin Quiz result to the profile (the quiz already does this on submit; kept for the "Save to My Profile" button).
exports.applyQuiz = async (req, res) => {
  const { quizResult } = await loadState(req.user.id);
  if (!quizResult) return res.status(400).json({ error: 'Take the Skin Quiz first.' });
  res.json({ profile: await applyQuizToProfile(req.user.id, quizResult) });
};
