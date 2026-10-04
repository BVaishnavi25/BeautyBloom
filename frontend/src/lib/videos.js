import { VIDEOS } from "@/lib/content";

/* Tutorial video lookups. VIDEOS is served by the backend (backend/src/data/videos.js).
   Routine and makeup-technique videos are chosen by the skin type saved from the user's Skin Quiz. */
export const getRoutineVideo = (skinType, when) => (VIDEOS.routine[skinType] || {})[when] || null;
export const getMakeupVideo = (skinType) => VIDEOS.makeup[skinType] || null;
export const getLookVideo = (lookId) => VIDEOS.looks[lookId] || null;
export const getIngredientVideo = (ingredientId) => VIDEOS.ingredients[ingredientId] || null;
