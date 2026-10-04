import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { hasPersonalizationData, getEffectiveSkinProfile, getPersonalNotes, getPersonalizedLookIds } from "@/lib/personalization";

import { getMakeupVideo, getLookVideo } from "@/lib/videos";
import FavoriteButton from "@/components/FavoriteButton";
import { useFocusTarget } from "@/lib/useFocusTarget";
import EmptyProfileNotice from "@/pages/dashboard/EmptyProfileNotice";

export default function MakeupPage({ profile, quizResult, goToProfile }) {
  const [openLook, setOpenLook] = useState(null);
  const focusId = useFocusTarget("look", true);
  // Opening a saved look from Favorites: open its video tutorial.
  useEffect(() => { if (focusId) setOpenLook(focusId); }, [focusId]);
  if (!hasPersonalizationData()) return <EmptyProfileNotice onGoToProfile={goToProfile} />;
  const { skinType } = getEffectiveSkinProfile();
  const m = MAKEUP_GUIDES[skinType] || MAKEUP_GUIDES.normal;
  const personalLooks = getPersonalizedLookIds().map((id) => LOOKS.find((l) => l.id === id)).filter(Boolean);
  // A saved look that no longer matches the current Skin Quiz skin type is still shown (first) when opened from Favorites.
  const savedExtra = focusId && !personalLooks.some((l) => l.id === focusId) ? LOOKS.find((l) => l.id === focusId) : null;
  const looks = savedExtra ? [savedExtra, ...personalLooks] : personalLooks;
  const baseNote = getPersonalNotes().makeup;
  return (
    <div>
      <SectionTitle eyebrow="Guidance" title="Makeup Looks" sub="Personalized from your Skin Quiz result." />
      <ClayCard className="p-6 mb-5">
        <div className="font-body text-sm text-stone-500 mb-3">Foundation & Base</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-stone-50 rounded-2xl p-4"><div className="font-body text-xs text-stone-400">Base Technique</div><div className="font-body text-sm text-stone-700 mt-1">{m.baseTechnique}</div></div>
          <div className="bg-stone-50 rounded-2xl p-4"><div className="font-body text-xs text-stone-400">Foundation Type</div><div className="font-body text-sm text-stone-700 mt-1">{m.foundationType}</div></div>
          <div className="bg-stone-50 rounded-2xl p-4"><div className="font-body text-xs text-stone-400">Recommended Finish</div><div className="font-body text-sm text-stone-700 mt-1">{m.finish}</div></div>
        </div>
      </ClayCard>
      <div className="mb-5">
        <TutorialPlayer
          title="Full Face Application Technique"
          video={getMakeupVideo(skinType)}
          subtitle={`${m.finish} finish · for ${(SKIN_TYPES.find((s) => s.id === skinType)?.label || "your").toLowerCase()} skin`}
          theme="gold"
          steps={[
            { title: "Prep & Primer", description: m.prep },
            { title: "Base Technique", description: m.baseTechnique },
            { title: "Concealer", description: m.concealer },
            { title: "Powder & Setting", description: m.powder },
            { title: "Blush Placement", description: m.blush },
            { title: "Eye Tips", description: m.eyeTips },
            { title: "Lip Tips", description: m.lipTips },
          ]}
          personalizedNote={`Your recommended foundation type is ${m.foundationType.toLowerCase()}, applied with this technique: ${m.baseTechnique.toLowerCase()}`}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <ClayCard className="p-6"><div className="font-body text-xs text-stone-400">Prep & Primer</div><p className="font-body text-sm text-stone-700 mt-1">{m.prep}</p></ClayCard>
        <ClayCard className="p-6"><div className="font-body text-xs text-stone-400">Concealer</div><p className="font-body text-sm text-stone-700 mt-1">{m.concealer}</p></ClayCard>
        <ClayCard className="p-6"><div className="font-body text-xs text-stone-400">Powder & Setting</div><p className="font-body text-sm text-stone-700 mt-1">{m.powder}</p></ClayCard>
        <ClayCard className="p-6"><div className="font-body text-xs text-stone-400">Blush Placement</div><p className="font-body text-sm text-stone-700 mt-1">{m.blush}</p></ClayCard>
      </div>
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <ClayCard className="p-6"><div className="font-body text-xs text-stone-400">Eye Tips</div><p className="font-body text-sm text-stone-700 mt-1">{m.eyeTips}</p></ClayCard>
        <ClayCard className="p-6"><div className="font-body text-xs text-stone-400">Lip Tips</div><p className="font-body text-sm text-stone-700 mt-1">{m.lipTips}</p></ClayCard>
      </div>
      <ClayCard className="p-6 mb-6"><div className="font-body text-xs text-stone-400">Makeup Removal</div><p className="font-body text-sm text-stone-700 mt-1">{m.removal}</p></ClayCard>

      <div className="font-display text-lg text-stone-800 mb-3">Looks for You</div>
      <div className="grid sm:grid-cols-2 gap-5">
        {looks.map((l, i) => {
          const isOpen = openLook === l.id;
          return (
            <Reveal key={l.id} delay={(i % 2) * 90}>
              <div id={`look-${l.id}`} className="h-full">
              <ClayCard className="p-6 h-full">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0"><div className="font-display text-lg text-stone-800 truncate">{l.name}</div><div className="font-body text-xs text-stone-400">{l.occasion} · {l.time}</div></div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill tone={l.difficulty === "beginner" ? "emerald" : l.difficulty === "intermediate" ? "amber" : "rose"}>{l.difficulty}</Pill>
                    <FavoriteButton itemType="Look" itemId={l.id} title={l.name} description={l.description} size={16} className="!p-1.5" />
                  </div>
                </div>
                {savedExtra && l.id === savedExtra.id && <div className="mt-2"><Pill tone="stone">From your favorites · made for {l.skinTypes.join(", ")} skin</Pill></div>}
                <p className="font-body text-sm text-stone-500 mt-2">{l.description}</p>
                <button onClick={() => setOpenLook(isOpen ? null : l.id)} className="font-body text-xs text-rose-500 hover:text-rose-700 transition-colors mt-3 flex items-center gap-1"><PlayCircle size={14} />{isOpen ? "Hide video tutorial" : "Watch video tutorial"}</button>
                {isOpen && (
                  <div className="mt-3 page-enter">
                    <TutorialPlayer
                      title={l.name}
                      video={getLookVideo(l.id)}
                      subtitle={`${l.steps.length} steps · ${l.time}`}
                      theme={l.difficulty === "advanced" ? "glam" : l.difficulty === "intermediate" ? "rose" : "natural"}
                      steps={l.steps.map((s, i2) => ({ title: `Step ${i2 + 1}`, description: s }))}
                      personalizedNote={baseNote}
                    />
                  </div>
                )}
                <ol className="font-body text-sm text-stone-700 list-decimal list-inside mt-3 space-y-1">{l.steps.map((s, i2) => <li key={i2}>{s}</li>)}</ol>
              </ClayCard>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* Turns an ingredient's own data (category, benefits, precautions) into a
   short, genuinely relevant set of "how to use this" steps — so every
   ingredient gets its own tutorial rather than sharing one with the rest. */
