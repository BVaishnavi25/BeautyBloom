import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { hasPersonalizationData, getEffectiveSkinProfile, getPersonalizedIngredientIds } from "@/lib/personalization";

import { getIngredientVideo } from "@/lib/videos";
import EmptyProfileNotice from "@/pages/dashboard/EmptyProfileNotice";
import FavoriteButton from "@/components/FavoriteButton";
import { useFocusTarget } from "@/lib/useFocusTarget";

function buildIngredientTutorialSteps(i) {
  const steps = [
    { title: "What It Is", description: `${i.name} is a ${i.category.toLowerCase()} — ${i.description}` },
    { title: "How To Apply", description: `Works toward: ${i.benefits.join(", ").toLowerCase()}.` },
  ];
  (i.precautions || []).forEach((p, idx) => steps.push({ title: idx === 0 ? "Precautions" : `Precautions (cont.)`, description: p }));
  return steps;
}

export default function IngredientsPage({ profile, quizResult, goToProfile }) {
  const [query, setQuery] = useState("");
  const [filterMine, setFilterMine] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [videoOpen, setVideoOpen] = useState({});
  const [focusReady, setFocusReady] = useState(false);
  const focusId = useFocusTarget("ingredient", focusReady);
  // Opening a saved ingredient from Favorites: show every ingredient so the saved one is always on the page.
  useEffect(() => { if (focusId) { setQuery(""); setFilterMine(false); setFocusReady(true); } else setFocusReady(false); }, [focusId]);
  if (!hasPersonalizationData()) return <EmptyProfileNotice onGoToProfile={goToProfile} />;
  const { skinType } = getEffectiveSkinProfile();
  const personalizedIds = getPersonalizedIngredientIds();
  const personalizedIngredients = personalizedIds.map((id) => INGREDIENTS.find((i) => i.id === id)).filter(Boolean);
  const list = INGREDIENTS.filter((i) => {
    const matchesQuery = !query || i.name.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase()) || i.benefits.some((b) => b.toLowerCase().includes(query.toLowerCase()));
    const matchesType = !filterMine || (skinType && i.bestFor.includes(skinType));
    return matchesQuery && matchesType;
  });
  return (
    <div>
      <SectionTitle eyebrow="Guidance" title="Ingredient Guide" sub="Personalized from your Skin Quiz result." />

      {personalizedIngredients.length > 0 && (
        <ClayCard className="p-5 mb-5 bg-gradient-to-br from-rose-50 to-amber-50">
          <div className="font-body text-sm font-medium text-stone-700 mb-3">🎯 Recommended For You</div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {personalizedIngredients.map((i) => (
              <div key={i.id} className="bg-white rounded-xl p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-body text-sm font-medium text-stone-800">{i.name}</div>
                  <div className="font-body text-xs text-stone-500 mt-0.5">{i.benefits.slice(0, 2).join(", ")}</div>
                </div>
                <FavoriteButton itemType="Ingredient" itemId={i.id} title={i.name} description={i.description} size={15} className="!p-1.5" />
              </div>
            ))}
          </div>
        </ClayCard>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, category, or benefit…" className="w-full font-body pl-10 pr-4 py-2.5 rounded-full input-field text-sm" /></div>
        <div className="flex gap-2"><Pill active={filterMine} onClick={() => setFilterMine(true)}>For {skinType || "your"} Skin</Pill><Pill active={!filterMine} onClick={() => setFilterMine(false)}>All Ingredients</Pill></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((i, idx) => {
          const isOpen = expanded[i.id];
          const recommended = skinType && i.bestFor.includes(skinType);
          return (
            <Reveal key={i.id} delay={(idx % 4) * 60}>
            <div id={`ingredient-${i.id}`} className="h-full">
            <ClayCard className="p-5 h-full">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0"><div className="font-display text-lg text-stone-800 truncate">{i.name}</div><div className="font-body text-xs text-stone-400">{i.category}</div></div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">{Array.from({ length: i.rating }).map((_, j) => <Star key={j} size={13} fill="currentColor" />)}</div>
                  <FavoriteButton itemType="Ingredient" itemId={i.id} title={i.name} description={i.description} size={16} className="!p-1.5" />
                </div>
              </div>
              {recommended && <div className="mt-2"><Pill tone="emerald">✨ Recommended for {skinType}</Pill></div>}
              <p className="font-body text-sm text-stone-500 mt-2">{i.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">{i.benefits.map((b) => <Pill key={b} tone="emerald">{b}</Pill>)}</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                <button onClick={() => setExpanded({ ...expanded, [i.id]: !isOpen })} className="font-body text-xs text-rose-500 hover:text-rose-700 transition-colors">{isOpen ? "Hide details" : "Show details"}</button>
                <button onClick={() => setVideoOpen({ ...videoOpen, [i.id]: !videoOpen[i.id] })} className="font-body text-xs text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"><PlayCircle size={14} />{videoOpen[i.id] ? "Hide tutorial" : "Watch tutorial"}</button>
              </div>
              {videoOpen[i.id] && (
                <div className="mt-3 page-enter">
                  <TutorialPlayer title={`Using ${i.name}`} video={getIngredientVideo(i.id)} subtitle={i.category} theme="emerald" steps={buildIngredientTutorialSteps(i)} />
                </div>
              )}
              {isOpen && (
                <div className="mt-3 pt-3 border-t border-stone-100 space-y-2 page-enter">
                  <div><div className="font-body text-xs text-stone-400">Best For</div><div className="flex flex-wrap gap-1.5 mt-1">{i.bestFor.map((t) => <Pill key={t} tone="stone">{t}</Pill>)}</div></div>
                  <div><div className="font-body text-xs text-stone-400">Helps With</div><div className="flex flex-wrap gap-1.5 mt-1">{i.helps.map((t) => <Pill key={t} tone="rose">{t}</Pill>)}</div></div>
                  <div><div className="font-body text-xs text-stone-400">Precautions</div><ul className="font-body text-xs text-stone-600 list-disc list-inside mt-1">{i.precautions.map((p, k) => <li key={k}>{p}</li>)}</ul></div>
                </div>
              )}
            </ClayCard>
            </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

