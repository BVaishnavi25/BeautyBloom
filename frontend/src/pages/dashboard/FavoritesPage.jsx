import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Pill, ClayCard, SectionTitle } from "@/components/ui";
import FavoriteButton from "@/components/FavoriteButton";
import { FAVORITE_TYPES, favoriteHref, favoriteTypeInfo } from "@/lib/favorites";

/* Everything saved with a heart on the Ingredient Guide, Beauty Tips and Makeup Looks pages.
   Only the categories that exist on the site are listed; counts are computed from the user's saved items. */
export default function FavoritesPage({ favorites }) {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const counts = Object.fromEntries(FAVORITE_TYPES.map(({ type }) => [type, favorites.filter((f) => f.itemType === type).length]));
  const list = filter === "All" ? favorites : favorites.filter((f) => f.itemType === filter);
  const filterInfo = favoriteTypeInfo(filter);

  return (
    <div>
      <SectionTitle eyebrow="My Tools" title="Favorites" />
      <div className="flex flex-wrap gap-2 mb-6">
        <Pill active={filter === "All"} onClick={() => setFilter("All")}>All ({favorites.length})</Pill>
        {FAVORITE_TYPES.map(({ type, emoji }) => <Pill key={type} active={filter === type} onClick={() => setFilter(type)}>{emoji} {type} ({counts[type]})</Pill>)}
      </div>
      {list.length === 0 ? (
        <ClayCard className="p-10 text-center">
          <div className="text-4xl">💝</div>
          <h3 className="font-display text-lg text-stone-800 mt-3">{filterInfo ? `No Saved ${filterInfo.type}s Yet` : "Nothing Saved Yet"}</h3>
          <p className="font-body text-sm text-stone-500 mt-1">
            {filterInfo ? <>Tap the heart on any item in <Link to={filterInfo.path} className="text-rose-500 underline underline-offset-2">{filterInfo.page}</Link> to save it here.</> : "Tap the heart icon on ingredients, tips and makeup looks to save them here."}
          </p>
        </ClayCard>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((f) => {
            const info = favoriteTypeInfo(f.itemType);
            const href = favoriteHref(f);
            return (
              <ClayCard key={`${f.itemType}:${f.itemId}`} className="p-5 cursor-pointer h-full">
                <div onClick={() => navigate(href)} className="h-full flex flex-col">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <Link to={href} onClick={(e) => e.stopPropagation()} className="font-display text-stone-800 hover:text-rose-600 transition-colors block truncate">{f.title}</Link>
                      <div className="font-body text-xs text-stone-400">Saved {new Date(f.addedAt).toLocaleDateString()}</div>
                    </div>
                    <FavoriteButton itemType={f.itemType} itemId={f.itemId} title={f.title} description={f.description} size={16} className="!p-1.5" />
                  </div>
                  <p className="font-body text-sm text-stone-500 mt-2 line-clamp-3">{f.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                    <Pill tone="rose">{info ? `${info.emoji} ${f.itemType}` : f.itemType}</Pill>
                    {info && <Link to={href} onClick={(e) => e.stopPropagation()} className="font-body text-xs text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 transition-colors">Open in {info.page} <ArrowRight size={12} /></Link>}
                  </div>
                </div>
              </ClayCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
