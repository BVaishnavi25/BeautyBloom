import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { getEffectiveSkinProfile } from "@/lib/personalization";
import FavoriteButton from "@/components/FavoriteButton";
import { useFocusTarget } from "@/lib/useFocusTarget";


export default function TipsPage({ profile, quizResult }) {
  const { skinType, skinConcerns } = getEffectiveSkinProfile(); // from the Skin Quiz (plus any concerns added in the profile)
  const [personalized, setPersonalized] = useState(true);
  const [category, setCategory] = useState("All");
  const CATS = [["All", ""], ["skincare", "🧴"], ["makeup", "💄"], ["lifestyle", "🌿"], ["ingredients", "🧪"]];
  const concernHits = (t) => t.concerns.filter((c) => skinConcerns.includes(c)).length;
  const list = TIPS
    .filter((t) => (category === "All" || t.category === category) && (!personalized || !skinType || t.skinTypes.includes(skinType)))
    .map((t, i) => ({ t, i }))
    .sort((a, b) => (personalized ? concernHits(b.t) - concernHits(a.t) : 0) || a.i - b.i) // tips about your quiz concern(s) first
    .map((x) => x.t);
  const focusId = useFocusTarget("tip", list.length > 0);
  // Opening a saved tip from Favorites: clear the filters so the saved tip is always on the page.
  useEffect(() => { if (focusId) { setCategory("All"); setPersonalized(false); } }, [focusId]);
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3"><SectionTitle eyebrow="My Tools" title="Beauty Tips" /><Pill active={personalized} onClick={() => setPersonalized(!personalized)} tone="emerald">{personalized ? "✨ Showing tips for you" : "Show tips for my skin type"}</Pill></div>
      <div className="flex flex-wrap gap-2 mb-6">{CATS.map(([c, e]) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{e} {c}</Pill>)}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((t, idx) => {
          const forYou = skinType && t.skinTypes.includes(skinType);
          return (
            <Reveal key={t.id} delay={(idx % 4) * 60}>
            <div id={`tip-${t.id}`} className="h-full">
            <ClayCard className="p-5 h-full">
              <div className="flex justify-between items-start gap-2"><div className="font-display text-stone-800 min-w-0">{t.title}</div><div className="flex items-center gap-2 shrink-0">{forYou && <Pill tone="emerald">For you</Pill>}<FavoriteButton itemType="Tip" itemId={t.id} title={t.title} description={t.content} size={16} className="!p-1.5" /></div></div>
              <p className="font-body text-sm text-stone-500 mt-2">{t.content}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">{t.skinTypes.map((s) => <Pill key={s} tone="stone">{s}</Pill>)}{t.concerns.map((c) => <Pill key={c} tone="rose">{c}</Pill>)}</div>
            </ClayCard>
            </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

