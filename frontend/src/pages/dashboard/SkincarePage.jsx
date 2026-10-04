import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { hasPersonalizationData, getEffectiveSkinProfile, getPersonalNotes, getConcernFocus } from "@/lib/personalization";

import { getRoutineVideo } from "@/lib/videos";
import EmptyProfileNotice from "@/pages/dashboard/EmptyProfileNotice";

export default function SkincarePage({ profile, quizResult, goToProfile }) {
  if (!hasPersonalizationData()) return <EmptyProfileNotice onGoToProfile={goToProfile} />;
  const { skinType, sensitivity } = getEffectiveSkinProfile();
  const notes = getPersonalNotes();
  const concernFocus = getConcernFocus();
  const bank = ROUTINE_BANK[skinType] || ROUTINE_BANK.normal;
  const st = SKIN_TYPES.find((s) => s.id === skinType) || SKIN_TYPES.find((s) => s.id === "normal");

  const morningNote = notes.skincareMorning;
  const nightNote = notes.skincareNight;

  return (
    <div>
      <SectionTitle eyebrow={`${st.emoji} ${st.label}`} title="Skincare Routines" sub="Personalized from your Skin Quiz result" />

      <ClayCard className="p-6 mb-5"><p className="font-body text-sm text-stone-600">{st.desc} Your routine below is built to match this profile{sensitivity ? `, with ${sensitivity} sensitivity in mind` : ""}.</p></ClayCard>

      {concernFocus.length > 0 && (
        <ClayCard className="p-6 mb-5 bg-gradient-to-br from-rose-50 to-amber-50" noLift>
          <div className="font-body text-sm text-stone-500 mb-3">Focus On Your Concerns</div>
          <div className="grid gap-3">
            {concernFocus.map((c) => (
              <div key={c.concern} className="bg-white rounded-2xl p-4">
                <div className="font-body font-medium text-stone-800 text-sm">{c.concern}</div>
                <div className="font-body text-xs text-stone-500 mt-1">{c.tip}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">{c.ingredientIds.map((id) => <Pill key={id} tone="rose">{(INGREDIENTS.find((i) => i.id === id) || {}).name || id}</Pill>)}</div>
              </div>
            ))}
          </div>
        </ClayCard>
      )}

      <ClayCard className="p-6 mb-5">
        <div className="font-body text-sm text-stone-500 mb-2">Key Principles</div>
        <ol className="font-body text-sm text-stone-700 list-decimal list-inside space-y-1">{bank.principles.map((p, i) => <li key={i}>{p}</li>)}</ol>
      </ClayCard>

      <ClayCard className="p-6 mb-5 bg-amber-50/40" noLift>
        <div className="flex items-center gap-2 font-display text-lg text-stone-800 mb-3"><Sun size={20} className="text-amber-500" />Morning Routine</div>
        <div className="mb-4"><TutorialPlayer title="Morning Routine" video={getRoutineVideo(skinType, "morning")} subtitle={`${bank.morning.length} steps · ${st.label} skin`} theme="rose" steps={bank.morning.map((s) => ({ title: s.name, description: s.description, duration: s.duration }))} personalizedNote={morningNote} /></div>
        <div className="font-body text-xs text-stone-400 mb-2">Full written steps</div>
        <div className="grid gap-3">{bank.morning.map((s, i) => <RoutineStepCard key={s.id} step={s} n={i + 1} delay={i * 70} />)}</div>
      </ClayCard>

      <ClayCard className="p-6 mb-5 bg-violet-50/40" noLift>
        <div className="flex items-center gap-2 font-display text-lg text-stone-800 mb-3"><Moon size={20} className="text-violet-500" />Night Routine</div>
        <div className="mb-4"><TutorialPlayer title="Night Routine" video={getRoutineVideo(skinType, "night")} subtitle={`${bank.night.length} steps · ${st.label} skin`} theme="night" steps={bank.night.map((s) => ({ title: s.name, description: s.description, duration: s.duration }))} personalizedNote={nightNote} /></div>
        <div className="font-body text-xs text-stone-400 mb-2">Full written steps</div>
        <div className="grid gap-3">{bank.night.map((s, i) => <RoutineStepCard key={s.id} step={s} n={i + 1} delay={i * 70} />)}</div>
      </ClayCard>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <ClayCard className="p-6"><div className="font-body text-sm text-rose-500 mb-2">Avoid These</div><ul className="font-body text-sm text-stone-600 list-disc list-inside space-y-1">{bank.avoid.map((a, i) => <li key={i}>{a}</li>)}</ul></ClayCard>
        <ClayCard className="p-6"><div className="font-body text-sm text-emerald-600 mb-2">Recommended Methods</div><ul className="font-body text-sm text-stone-600 list-disc list-inside space-y-1">{bank.recommended.map((a, i) => <li key={i}>{a}</li>)}</ul></ClayCard>
      </div>

      <ClayCard className="p-6">
        <div className="font-body text-sm text-stone-500 mb-3">Seasonal Adjustments</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[["Spring", "🌱", bank.seasonal.spring], ["Summer", "☀️", bank.seasonal.summer], ["Fall", "🍂", bank.seasonal.fall], ["Winter", "❄️", bank.seasonal.winter]].map(([l, e, t], i) => (
            <Reveal key={l} delay={i * 80}><div className="rounded-2xl bg-stone-50 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white h-full"><div className="text-xl">{e}</div><div className="font-body text-xs font-medium text-stone-700 mt-1">{l}</div><div className="font-body text-xs text-stone-500 mt-1">{t}</div></div></Reveal>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}

function RoutineStepCard({ step, n, delay = 0 }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-rose-200" style={{ animation: `fadeInUp 0.5s ease ${delay}ms both` }}>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0"><div className="font-body font-medium text-stone-800 text-sm">{n}. {step.name}</div><div className="font-body text-xs text-stone-500 mt-1">{step.description}</div></div>
        <span className="font-body text-xs text-stone-400 whitespace-nowrap">{step.duration}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Pill tone="stone">{step.product}</Pill>
        {step.ingredients.map((ing) => <Pill key={ing} tone="rose">{ing}</Pill>)}
      </div>
    </div>
  );
}

