/* The Personalization Engine runs on the SERVER (backend/src/services/personalizationEngine.js) and is driven
   only by the user's saved Skin Quiz result. After every change to the profile or quiz, AppDataContext stores the
   server's result here, and these helpers simply read it — so every page shows exactly what the backend computed. */
let current = { hasData: false, effective: { skinType: null, sensitivity: 'medium', skinConcerns: [], source: 'none' }, ingredientIds: [], lookIds: [], concernFocus: [], notes: null, aiGuide: null };

export const setPersonalization = (p) => { if (p) current = p; };
export const hasPersonalizationData = () => current.hasData;
export const getEffectiveSkinProfile = () => current.effective;
export const getPersonalizedIngredientIds = () => current.ingredientIds;
export const getPersonalizedLookIds = () => current.lookIds;
export const getConcernFocus = () => current.concernFocus;
export const getPersonalNotes = () => current.notes || { skincareMorning: "", skincareNight: "", makeup: "" };
export const buildAiGuide = () => current.aiGuide;
