import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { hasPersonalizationData, buildAiGuide } from "@/lib/personalization";

import EmptyProfileNotice from "@/pages/dashboard/EmptyProfileNotice";

export default function AiGuidePage({ profile, quizResult, goToProfile }) {
  if (!hasPersonalizationData()) return <EmptyProfileNotice onGoToProfile={goToProfile} />;
  const guide = buildAiGuide();
  if (!guide) return <EmptyProfileNotice onGoToProfile={goToProfile} />;
  return (
    <div>
      <SectionTitle eyebrow="Guidance" title="AI Beauty Guide" sub="Built entirely from your saved Skin Quiz result." />
      <ClayCard className="p-6 mb-5 bg-gradient-to-br from-rose-50 to-amber-50"><p className="font-display text-lg text-stone-800">{guide.greeting}</p><p className="font-body text-sm text-stone-600 mt-2">{guide.skinSummary}</p></ClayCard>

      <ClayCard className="p-6 mb-5"><div className="font-body text-sm text-stone-500 mb-2">Skincare Focus</div><ol className="font-body text-sm text-stone-700 list-decimal list-inside space-y-1">{guide.skincareFocus.map((s, i) => <li key={i}>{s}</li>)}</ol></ClayCard>

      <ClayCard className="p-6 mb-5"><div className="font-body text-sm text-stone-500 mb-2">Makeup Recommendations</div><ul className="font-body text-sm text-stone-700 list-disc list-inside space-y-1">{guide.makeupRecommendations.map((s, i) => <li key={i}>{s}</li>)}</ul></ClayCard>

      <ClayCard className="p-6 mb-5">
        <div className="font-body text-sm text-stone-500 mb-3">Ingredient Spotlight</div>
        <div className="grid sm:grid-cols-2 gap-3">{guide.ingredientSpotlight.map((i) => <div key={i.id} className="bg-stone-50 rounded-2xl p-4"><div className="font-body font-medium text-stone-800 text-sm">{i.name}</div><div className="flex flex-wrap gap-1.5 mt-1.5">{i.benefits.map((b) => <Pill key={b} tone="emerald">{b}</Pill>)}</div></div>)}</div>
      </ClayCard>

      <ClayCard className="p-6 mb-5">
        <div className="font-body text-sm text-stone-500 mb-3">Weekly Skincare Plan</div>
        <div className="grid gap-2">
          {guide.weeklyPlan.map((d) => (
            <div key={d.day} className="flex flex-wrap items-center gap-2 bg-stone-50 rounded-xl p-3">
              <span className="font-body text-xs font-medium bg-rose-100 text-rose-600 rounded-full px-2.5 py-1 shrink-0">{d.day.slice(0, 3)}</span>
              <span className="font-body text-xs text-stone-500">{d.theme}</span>
              <span className="font-body text-xs text-stone-400 sm:ml-auto flex items-center flex-wrap gap-1 basis-full sm:basis-auto">{d.flow.map((f, i) => <span key={i} className="flex items-center gap-1">{f}{i < d.flow.length - 1 && <ArrowRight size={10} />}</span>)}</span>
            </div>
          ))}
        </div>
      </ClayCard>

      {guide.goals.length > 0 && (
        <ClayCard className="p-6 mb-5">
          <div className="font-body text-sm text-stone-500 mb-3">Your Goals</div>
          <div className="grid gap-2">{guide.goals.map((g) => <div key={g.goal} className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /><div><div className="font-body text-sm text-stone-700">{g.goal}</div><div className="font-body text-xs text-stone-400">{g.description}</div></div></div>)}</div>
        </ClayCard>
      )}
      <ClayCard className="p-6 text-center bg-rose-50/60"><p className="font-body text-stone-600">You're already doing the work — small, consistent choices are how you bloom. 🌸</p></ClayCard>
    </div>
  );
}

