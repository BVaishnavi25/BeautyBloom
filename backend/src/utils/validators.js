const { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES } = require('../data/content');

const SKIN_IDS = SKIN_TYPES.map((s) => s.id);
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const strList = (v, max, each) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').map((x) => x.trim().slice(0, each)).filter(Boolean).slice(0, max) : []);
const oneOf = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);

function cleanProfile(input = {}) {
  return {
    skinType: oneOf(input.skinType, SKIN_IDS, null),
    sensitivity: oneOf(input.sensitivity, ['low', 'medium', 'high'], 'medium'),
    skinConcerns: strList(input.skinConcerns, 12, 40).filter((c) => CONCERNS.includes(c)),
    makeupPreferences: strList(input.makeupPreferences, 10, 40).filter((m) => MAKEUP_STYLES.includes(m)),
    beautyGoals: strList(input.beautyGoals, 10, 40).filter((g) => GOALS.includes(g)),
    ageRange: oneOf(input.ageRange, AGE_RANGES, ''),
    completedOnboarding: !!input.completedOnboarding,
  };
}

const MOODS = ['😢', '😕', '😐', '😊', '😍'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const JOURNAL_TAGS = ['skin-update', 'new-product', 'routine-change', 'breakout', 'glow-up', 'self-care', 'seasonal'];

function cleanJournal(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 500).map((e) => ({
    id: str(e && e.id, 60) || `j-${Date.now()}`,
    title: str(e && e.title, 120),
    content: str(e && e.content, 4000),
    mood: oneOf(e && e.mood, MOODS, null),
    tags: strList(e && e.tags, 8, 30).filter((t) => JOURNAL_TAGS.includes(t)),
    createdAt: isNaN(Date.parse(e && e.createdAt)) ? new Date().toISOString() : new Date(e.createdAt).toISOString(),
  })).filter((e) => e.title && e.content);
}

function cleanRoutinePart(p) {
  const ids = (v) => strList(v, 30, 40);
  return { completedSteps: ids(p && p.completedSteps), skippedSteps: ids(p && p.skippedSteps), mood: oneOf(p && p.mood, MOODS, null) };
}
function cleanRoutine(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
  const out = {};
  Object.keys(map).filter((d) => DATE_RE.test(d)).slice(-400).forEach((d) => {
    const v = map[d] || {};
    out[d] = {};
    if (v.morning) out[d].morning = cleanRoutinePart(v.morning);
    if (v.night) out[d].night = cleanRoutinePart(v.night);
  });
  return out;
}

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

module.exports = { cleanProfile, cleanJournal, cleanRoutine, str, EMAIL_RE };
