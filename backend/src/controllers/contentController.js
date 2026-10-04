const content = require('../data/content');
// Public reference content (no personal data). QUIZ answers' scoring keys are stripped to option text only.
exports.getContent = (req, res) => {
  const { scoreQuiz, CONCERN_GUIDANCE, SENSITIVITY_GUIDANCE, ...rest } = content;
  const QUIZ_QUESTIONS = content.QUIZ_QUESTIONS.map((q) => ({ id: q.id, question: q.question, options: q.options.map((o) => ({ text: o.text })) }));
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ ...rest, QUIZ_QUESTIONS });
};
