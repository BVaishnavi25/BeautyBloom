const db = require('../db');
const { cleanProfile } = require('../utils/validators');

/* Saves a Skin Quiz result into the user's profile. The quiz owns skin type and sensitivity; its concern
   is added to whatever concerns the user already chose. Goals, makeup styles and age range are untouched. */
async function applyQuizToProfile(userId, quizResult, previousQuiz = null) {
  const base = (await db.profiles.get(userId)) || { makeupPreferences: [], beautyGoals: [], skinConcerns: [] };
  const merged = cleanProfile({
    ...base,
    skinType: quizResult.resultSkinType,
    sensitivity: quizResult.resultSensitivity,
    // On a retake, the previous quiz's concern is replaced by the new one instead of piling up.
    skinConcerns: Array.from(new Set([...(quizResult.resultConcerns || []), ...(base.skinConcerns || []).filter((c) => !(previousQuiz && (previousQuiz.resultConcerns || []).includes(c)))])),
    completedOnboarding: true,
  });
  return db.profiles.save(userId, merged);
}

module.exports = { applyQuizToProfile };
