import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { getEffectiveSkinProfile } from "@/lib/personalization";


export default function ProgressPage({ routineEntries, journal, quizResult, historyModules, profile }) {
  const effective = getEffectiveSkinProfile();
  const st = SKIN_TYPES.find((x) => x.id === effective.skinType);
  const last7 = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().slice(0, 10); });
  const dayPct = (d) => {
    const bank = ROUTINE_BANK[effective.skinType || "normal"];
    const entry = routineEntries[d];
    if (!entry) return 0;
    const totalSteps = bank.morning.length + bank.night.length;
    const done = (entry.morning?.completedSteps.length || 0) + (entry.night?.completedSteps.length || 0);
    return Math.round((done / totalSteps) * 100);
  };
  const adherence = Math.round(last7.reduce((a, d) => a + dayPct(d), 0) / 7);
  let streak = 0;
  for (let i = last7.length - 1; i >= 0; i--) { if (dayPct(last7[i]) > 0) streak++; else break; }
  const quizCount = (historyModules || []).length;
  const milestones = [
    { label: "Created Beauty Profile", emoji: "✨", done: !!profile?.completedOnboarding },
    { label: "First Journal Entry", emoji: "📝", done: journal.length >= 1 },
    { label: "3-Day Streak", emoji: "🔥", done: streak >= 3 },
    { label: "7-Day Streak", emoji: "⚡", done: streak >= 7 },
    { label: "Completed Skin Quiz", emoji: "🔬", done: !!quizResult },
    { label: "5 Journal Entries", emoji: "📚", done: journal.length >= 5 },
    { label: "30-Day Streak Champion", emoji: "🏆", done: streak >= 30 },
  ];

  return (
    <div>
      <SectionTitle eyebrow="My Tools" title="My Progress" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Reveal delay={0}><ClayCard className="p-5"><TrendingUp size={18} className="text-rose-500" /><div className="font-display text-2xl text-stone-800 mt-2">{adherence}%</div><div className="font-body text-xs text-stone-400">Routine Adherence</div></ClayCard></Reveal>
        <Reveal delay={60}><ClayCard className="p-5"><Flame size={18} className="text-amber-500" /><div className="font-display text-2xl text-stone-800 mt-2">{streak}</div><div className="font-body text-xs text-stone-400">Day Streak</div></ClayCard></Reveal>
        <Reveal delay={120}><ClayCard className="p-5"><BookOpen size={18} className="text-emerald-500" /><div className="font-display text-2xl text-stone-800 mt-2">{journal.length}</div><div className="font-body text-xs text-stone-400">Journal Entries</div></ClayCard></Reveal>
        <Reveal delay={180}><ClayCard className="p-5"><Sparkles size={18} className="text-violet-500" /><div className="font-display text-2xl text-stone-800 mt-2">{quizCount}</div><div className="font-body text-xs text-stone-400">Skin Quizzes Taken</div></ClayCard></Reveal>
      </div>

      <ClayCard className="p-6 mb-6">
        <div className="font-body text-sm text-stone-500 mb-4">This Week's Routine Completion</div>
        <div className="flex items-end gap-3 h-32">
          {last7.map((d) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-stone-100 rounded-lg flex items-end h-24 overflow-hidden"><div className="w-full progress-fill-vertical rounded-lg transition-all duration-500" style={{ height: `${dayPct(d)}%` }} /></div>
              <div className="font-body text-xs text-stone-400">{new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "narrow" })}</div>
            </div>
          ))}
        </div>
      </ClayCard>

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        <ClayCard className="p-6">
          <div className="font-body text-sm text-stone-500 mb-3">Your Skin Profile</div>
          {quizResult && st ? (
            <div>
              <div className="flex items-center gap-3"><div className="text-4xl leading-none">{st.emoji}</div><div><div className="font-display text-lg text-stone-800">{st.label} Skin</div><div className="font-body text-xs text-stone-500 capitalize">Sensitivity: {effective.sensitivity}</div></div></div>
              {effective.skinConcerns.length > 0 && <div className="flex flex-wrap gap-2 mt-4">{effective.skinConcerns.map((c) => <Pill key={c} tone="rose">{c}</Pill>)}</div>}
              <div className="font-body text-xs text-stone-400 mt-4">Last Skin Quiz {new Date(quizResult.completedAt).toLocaleDateString()}</div>
            </div>
          ) : (
            <div className="font-body text-sm text-stone-500">Take the Skin Quiz in My Profile to see your skin profile here.</div>
          )}
        </ClayCard>

        <ClayCard className="p-6">
          <div className="font-body text-sm text-stone-500 mb-3">Milestones</div>
          <div className="grid gap-2">
            {milestones.map((m) => (
              <div key={m.label} className={`flex items-center gap-2 p-2.5 rounded-xl ${m.done ? "bg-emerald-50" : "bg-stone-50"}`}>
                <span className="text-lg shrink-0">{m.emoji}</span><span className="font-body text-sm text-stone-700 flex-1 min-w-0">{m.label}</span>
                {m.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-stone-300" />}
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
}

