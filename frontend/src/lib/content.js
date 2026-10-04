/* Reference content (skin types, routines, ingredients, makeup guides, tips, quiz…) is served by the
   backend at GET /api/content. It is loaded ONCE before the app renders (see ContentGate in App.jsx)
   and exposed here as live ES-module bindings, so pages can simply `import { INGREDIENTS } from '@/lib/content'`. */
export let SKIN_TYPES = [];
export let CONCERNS = [];
export let GOALS = [];
export let MAKEUP_STYLES = [];
export let AGE_RANGES = [];
export let ROUTINE_BANK = {};
export let INGREDIENTS = [];
export let MAKEUP_GUIDES = {};
export let LOOKS = [];
export let TIPS = [];
export let QUIZ_QUESTIONS = [];
export let VIDEOS = { routine: {}, makeup: {}, looks: {}, ingredients: {} };

export function hydrateContent(c) {
  SKIN_TYPES = c.SKIN_TYPES; CONCERNS = c.CONCERNS; GOALS = c.GOALS; MAKEUP_STYLES = c.MAKEUP_STYLES; AGE_RANGES = c.AGE_RANGES;
  ROUTINE_BANK = c.ROUTINE_BANK; INGREDIENTS = c.INGREDIENTS; MAKEUP_GUIDES = c.MAKEUP_GUIDES; LOOKS = c.LOOKS; TIPS = c.TIPS;
  QUIZ_QUESTIONS = c.QUIZ_QUESTIONS;
  VIDEOS = c.VIDEOS || VIDEOS;
}
