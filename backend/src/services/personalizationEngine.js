/* =====================================================================
   PERSONALIZATION ENGINE — the core of BeautyBloom
   The Skin Quiz is the single source of truth. The user's latest saved quiz result
   (skin type, sensitivity, concern) is turned into the one "effective" skin profile
   that drives every guidance page: skincare routines, makeup looks, the ingredient
   guide, the beauty guide and recommendations. Profile fields that are not skin
   results (beauty goals, makeup style preferences, extra concerns) are layered on top.
   ===================================================================== */
const {
  SKIN_TYPES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, CONCERN_GUIDANCE, SENSITIVITY_GUIDANCE,
} = require('../data/content');

const skinLabel = (id) => ((SKIN_TYPES.find((s) => s.id === id) || {}).label || 'Normal').toLowerCase();
const uniq = (list) => Array.from(new Set(list));

/* Short recommendations stored with each Skin Quiz module in Profile -> History. */
function buildQuizRecommendations(q) {
  if (!q) return [];
  const bank = ROUTINE_BANK[q.resultSkinType] || ROUTINE_BANK.normal;
  const recs = bank.principles.slice(0, 2);
  const top = q.resultConcerns && q.resultConcerns[0];
  if (top) {
    const g = CONCERN_GUIDANCE[top];
    recs.push(g ? `Your top concern was ${top} — ${g.tip[0].toLowerCase()}${g.tip.slice(1)}` : `Your top concern was ${top} — check the Ingredient Guide for targeted ingredients.`);
  }
  if (q.resultSensitivity === 'high') recs.push(SENSITIVITY_GUIDANCE.high.skincare);
  return recs;
}

/* ---- Guidance personalization gate ----
   Every Guidance page (Skincare, Makeup, Ingredients, Beauty Guide) is personalized strictly
   from the Skin Quiz. Until a quiz has been completed the pages show a "take the Skin Quiz" prompt. */
function hasPersonalizationData(quizResult) {
  return !!quizResult;
}

function getEffectiveSkinProfile(profile, quizResult) {
  const skinType = (quizResult && quizResult.resultSkinType) || null;
  const sensitivity = (quizResult && quizResult.resultSensitivity) || 'medium';
  const fromQuiz = (quizResult && quizResult.resultConcerns) || [];
  const fromProfile = (profile && profile.skinConcerns) || [];
  const skinConcerns = uniq([...fromQuiz, ...fromProfile]);
  return { skinType, sensitivity, skinConcerns, source: quizResult ? 'quiz' : 'none', completedAt: (quizResult && quizResult.completedAt) || null };
}

/* Ingredient ids for the "Recommended For You" row: quiz concern(s), sensitivity, then skin type.
   Concern-driven picks never include an ingredient that isn't suited to the quiz skin type. */
function getPersonalizedIngredientIds(effective) {
  const { skinType, sensitivity, skinConcerns } = effective;
  const suits = (i) => !skinType || i.bestFor.includes(skinType);
  const concernIds = [];
  (skinConcerns || []).forEach((c) => {
    const g = CONCERN_GUIDANCE[c];
    if (g) g.ingredients.forEach((id) => { const ing = INGREDIENTS.find((x) => x.id === id); if (ing && suits(ing)) concernIds.push(id); });
    INGREDIENTS.filter((i) => i.helps.includes(c) && suits(i)).forEach((i) => concernIds.push(i.id));
  });
  const ids = uniq(concernIds).slice(0, 3);
  ((SENSITIVITY_GUIDANCE[sensitivity] || SENSITIVITY_GUIDANCE.medium).ingredients).forEach((id) => ids.push(id));
  if (skinType) INGREDIENTS.filter((i) => i.bestFor.includes(skinType)).forEach((i) => ids.push(i.id));
  return uniq(ids).slice(0, 4);
}

/* Personal notes for the Skincare and Makeup pages and their tutorials. */
function buildPersonalNotes(effective, profile) {
  const { skinType, sensitivity, skinConcerns } = effective;
  const label = skinLabel(skinType);
  const top = (skinConcerns || []).find((c) => CONCERN_GUIDANCE[c]);
  const g = top ? CONCERN_GUIDANCE[top] : null;
  const sens = SENSITIVITY_GUIDANCE[sensitivity] || SENSITIVITY_GUIDANCE.medium;
  const makeup = MAKEUP_GUIDES[skinType] || MAKEUP_GUIDES.normal;
  const preferredStyle = ((profile && profile.makeupPreferences) || [])[0];
  return {
    skincareMorning: `Tailored for ${label} skin, based on your Skin Quiz result.${g ? ` ${g.morning}` : ''}`,
    skincareNight: `A calmer pace to close out the day for ${label} skin.${g ? ` ${g.night}` : ''}${sens.skincare ? ` ${sens.skincare}` : ''}`,
    makeup: `Matched to your ${label} skin and ${makeup.finish.toLowerCase()} finish.`
      + `${g ? ` ${g.makeup}` : ''}${sens.makeup ? ` ${sens.makeup}` : ''}`
      + `${preferredStyle ? ` You said you prefer a ${preferredStyle} look — keep an eye out for looks below that lean that way.` : ''}`
      + `${top ? ` Your concern, ${top}, is factored into the base and finish recommendations here.` : ''}`,
  };
}

/* One focus card per quiz/profile concern that has guidance. */
function buildConcernFocus(effective) {
  return (effective.skinConcerns || []).filter((c) => CONCERN_GUIDANCE[c]).slice(0, 3)
    .map((c) => ({ concern: c, tip: CONCERN_GUIDANCE[c].tip, ingredientIds: CONCERN_GUIDANCE[c].ingredients }));
}

/* Skin-type-matched look ids; a look matching the user's preferred makeup style comes first. */
function buildLookIds(effective, profile) {
  const prefs = ((profile && profile.makeupPreferences) || []).map((p) => p.toLowerCase());
  const matches = LOOKS.filter((l) => l.skinTypes.includes(effective.skinType));
  const leansToPref = (l) => prefs.some((p) => {
    const key = p.split(/[\/&]/)[0].trim();
    return key && (l.name.toLowerCase().includes(key) || l.description.toLowerCase().includes(key));
  });
  return matches.map((l, i) => ({ l, i })).sort((a, b) => (leansToPref(b.l) - leansToPref(a.l)) || a.i - b.i).map((x) => x.l.id);
}

/* The Beauty Guide: skincare focus, makeup, ingredients, weekly plan and goals — all from the quiz. */
function buildAiGuide(effective, profile) {
  if (!effective || !effective.skinType) return null;
  const { skinType, sensitivity, skinConcerns } = effective;
  const bank = ROUTINE_BANK[skinType] || ROUTINE_BANK.normal;
  const makeup = MAKEUP_GUIDES[skinType] || MAKEUP_GUIDES.normal;
  const spotlight = getPersonalizedIngredientIds(effective).map((id) => INGREDIENTS.find((i) => i.id === id)).filter(Boolean);
  const focus = buildConcernFocus(effective);
  const lookNames = buildLookIds(effective, profile).slice(0, 3).map((id) => (LOOKS.find((l) => l.id === id) || {}).name).filter(Boolean);

  const highSens = sensitivity === 'high';
  const pick = highSens ? INGREDIENTS.find((i) => i.id === 'centella-asiatica') : spotlight[0];
  const treatmentLabel = pick ? `${pick.name.replace(/ \(.*\)/, '')} Treatment` : 'Treatment Step';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const themes = ['Hydration Boost', highSens ? 'Soothing Care' : 'Gentle Exfoliation', 'Barrier Repair', 'Brightening Focus', 'Rest & Recovery', 'Deep Treatment', 'Reset & Refresh'];
  const weeklyPlan = days.map((day, i) => ({
    day, theme: themes[i],
    flow: i % 3 === 1 ? [bank.morning[0].name, treatmentLabel, bank.night[bank.night.length - 1].name] : [bank.morning[0].name, bank.morning[bank.morning.length - 1].name, bank.night[0].name],
  }));
  const concernText = (skinConcerns || []).slice(0, 3).join(', ') || 'overall balance';
  return {
    greeting: `Hi! Based on your ${skinType} skin quiz result, here's a plan built just for you.`,
    skinSummary: `Your Skin Quiz shows ${skinType} skin with ${sensitivity || 'medium'} sensitivity, focused on ${concernText}.`,
    skincareFocus: [...bank.principles.slice(0, 3), ...focus.slice(0, 2).map((f) => f.tip)],
    makeupRecommendations: [`Base: ${makeup.baseTechnique}`, `Finish: ${makeup.finish}`, `Foundation: ${makeup.foundationType}`, ...(lookNames.length ? [`Looks to try: ${lookNames.join(', ')}`] : [])],
    ingredientSpotlight: spotlight,
    weeklyPlan,
    goals: ((profile && profile.beautyGoals) || []).map((g) => ({ goal: g, description: `Small, consistent steps toward "${g}" compound over weeks, not days.` })),
  };
}

/** One call that returns everything the guidance pages need. */
function computePersonalization(profile, quizResult) {
  const hasData = hasPersonalizationData(quizResult);
  const effective = getEffectiveSkinProfile(profile, quizResult);
  if (!hasData) return { hasData, effective, ingredientIds: [], lookIds: [], concernFocus: [], notes: null, aiGuide: null };
  return {
    hasData, effective,
    ingredientIds: getPersonalizedIngredientIds(effective),
    lookIds: buildLookIds(effective, profile),
    concernFocus: buildConcernFocus(effective),
    notes: buildPersonalNotes(effective, profile),
    aiGuide: buildAiGuide(effective, profile),
  };
}

module.exports = {
  buildQuizRecommendations, hasPersonalizationData, getEffectiveSkinProfile,
  getPersonalizedIngredientIds, buildPersonalNotes, buildConcernFocus, buildLookIds, buildAiGuide, computePersonalization,
};
