/* =====================================================================
   FAVORITES — the only item types that can be saved are:
   Ingredient (Ingredient Guide), Tip (Beauty Tips) and Look (Makeup Looks). Titles/descriptions always come from the site's own content, never from
   the browser, so a favorite can't be forged and never goes stale. Items that no longer exist are dropped.
   ===================================================================== */
const { INGREDIENTS, TIPS, LOOKS } = require('../data/content');

const FAV_TYPES = ['Ingredient', 'Tip', 'Look'];

const lookup = {
  Ingredient: (id) => { const i = INGREDIENTS.find((x) => x.id === id); return i && { title: i.name, description: i.description }; },
  Tip: (id) => { const t = TIPS.find((x) => x.id === id); return t && { title: t.title, description: t.content }; },
  Look: (id) => { const l = LOOKS.find((x) => x.id === id); return l && { title: l.name, description: l.description }; },
};

/** Returns { itemType, itemId, title, description } for a real site item, or null. */
function canonical(itemType, itemId) {
  if (!FAV_TYPES.includes(itemType) || typeof itemId !== 'string') return null;
  const found = lookup[itemType](itemId);
  return found ? { itemType, itemId, title: found.title.slice(0, 120), description: found.description.slice(0, 400) } : null;
}

/** Cleans a stored list: real items only, no duplicates, fresh title/description, newest first. */
function resolveList(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows || []) {
    const c = canonical(r.itemType, r.itemId);
    const key = c && `${c.itemType}:${c.itemId}`;
    if (!c || seen.has(key)) continue;
    seen.add(key);
    out.push({ ...c, addedAt: r.addedAt ? new Date(r.addedAt).toISOString() : new Date().toISOString() });
  }
  return out.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
}

module.exports = { FAV_TYPES, canonical, resolveList };
