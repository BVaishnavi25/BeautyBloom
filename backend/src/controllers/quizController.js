const db = require('../db');
const { QUIZ_QUESTIONS, scoreQuiz } = require('../data/content');
const { buildQuizRecommendations } = require('../services/personalizationEngine');
const { applyQuizToProfile } = require('../services/profileSync');

// Body: { answers: { q1: <optionIndex>, ... } } — the server maps indexes to options, so scoring can't be forged.
// Completing the quiz saves the result to history AND to the profile, so every page personalizes from it immediately.
exports.submit = async (req, res) => {
  const raw = req.body && typeof req.body.answers === 'object' ? req.body.answers : null;
  if (!raw) return res.status(400).json({ error: 'Missing answers.' });
  const answers = {};
  for (const q of QUIZ_QUESTIONS) {
    const idx = raw[q.id];
    if (!Number.isInteger(idx) || idx < 0 || idx >= q.options.length) return res.status(400).json({ error: 'Please answer every question.' });
    answers[q.id] = q.options[idx];
  }
  const quiz = scoreQuiz(answers);
  const previous = (await db.history.list(req.user.id)).filter((m) => m.type === 'quiz').pop();
  const module = await db.history.add(req.user.id, { type: 'quiz', quiz, recommendations: buildQuizRecommendations(quiz) });
  const profile = await applyQuizToProfile(req.user.id, quiz, previous ? previous.quiz : null);
  res.status(201).json({ quizResult: quiz, module, profile });
};
