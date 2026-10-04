/* Favorites exist for exactly these content types:
     Ingredient -> Ingredient Guide      Tip -> Beauty Tips      Look -> Makeup Looks
   `path` is the page that holds the original content; a saved item opens it with ?focus=<itemId>
   and that page scrolls to / highlights it. */
export const FAVORITE_TYPES = [
  { type: "Ingredient", emoji: "🧪", path: "/app/ingredients", page: "Ingredient Guide" },
  { type: "Tip", emoji: "💡", path: "/app/tips", page: "Beauty Tips" },
  { type: "Look", emoji: "💄", path: "/app/makeup", page: "Makeup Looks" },
];

export const favoriteTypeInfo = (type) => FAVORITE_TYPES.find((t) => t.type === type);
export const favoriteHref = (f) => { const t = favoriteTypeInfo(f.itemType); return t ? `${t.path}?focus=${encodeURIComponent(f.itemId)}` : "/app/favorites"; };
export const isFavorite = (favorites, itemType, itemId) => (favorites || []).some((f) => f.itemType === itemType && f.itemId === itemId);
