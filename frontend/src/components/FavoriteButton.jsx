import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { isFavorite } from "@/lib/favorites";

/* The heart used everywhere on the site. ♡ (outline) = not saved, ❤ (filled) = saved.
   State comes from the saved favorites loaded from the backend, so it is filled again after a refresh or when the
   item is revisited on any page. Click to save, click again to remove. */
export default function FavoriteButton({ itemType, itemId, title, description, size = 18, className = "" }) {
  const data = useAppData();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!data || !data.favorites) return null;
  const saved = isFavorite(data.favorites, itemType, itemId);

  const onClick = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (busy) return;
    setBusy(true); setFailed(false);
    try { await data.toggleFavorite({ itemType, itemId, title, description }); }
    catch { setFailed(true); setTimeout(() => setFailed(false), 2500); }
    finally { setBusy(false); }
  };

  const label = saved ? "Remove from favorites" : "Save to favorites";
  return (
    <button
      type="button" onClick={onClick} disabled={busy} aria-pressed={saved} aria-label={`${label}: ${title || itemId}`}
      title={failed ? "Couldn't update favorites — please try again" : label}
      className={`shrink-0 p-2 rounded-full border transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-70 ${failed ? "border-rose-400 bg-rose-50 text-rose-400" : saved ? "bg-rose-50 border-rose-300 text-rose-500" : "border-stone-200 text-stone-400 hover:border-rose-300 hover:text-rose-400"} ${className}`}
    >
      <Heart size={size} fill={saved ? "currentColor" : "none"} className={saved ? "pop-in" : ""} />
    </button>
  );
}
