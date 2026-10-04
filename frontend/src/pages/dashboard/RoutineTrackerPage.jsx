import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { getEffectiveSkinProfile } from "@/lib/personalization";


export default function RoutineTrackerPage({ routineEntries, setRoutineEntries, profile, quizResult }) {
  const [date, setDate] = useState(todayStr());
  const [tab, setTab] = useState("morning");
  const bank = ROUTINE_BANK[getEffectiveSkinProfile().skinType || "normal"]; // your Skin Quiz routine
  const steps = bank[tab];
  const entry = routineEntries[date]?.[tab] || { completedSteps: [], skippedSteps: [], mood: null };

  const cycle = (id) => {
    const completed = new Set(entry.completedSteps);
    const skipped = new Set(entry.skippedSteps);
    let next;
    if (!completed.has(id) && !skipped.has(id)) { completed.add(id); next = { completedSteps: [...completed], skippedSteps: [...skipped] }; }
    else if (completed.has(id)) { completed.delete(id); skipped.add(id); next = { completedSteps: [...completed], skippedSteps: [...skipped] }; }
    else { skipped.delete(id); next = { completedSteps: [...completed], skippedSteps: [...skipped] }; }
    const dayData = { ...(routineEntries[date] || {}), [tab]: { ...entry, ...next } };
    setRoutineEntries({ ...routineEntries, [date]: dayData });
  };
  const setMood = (mood) => {
    const dayData = { ...(routineEntries[date] || {}), [tab]: { ...entry, mood } };
    setRoutineEntries({ ...routineEntries, [date]: dayData });
  };

  const pct = steps.length ? Math.round((entry.completedSteps.length / steps.length) * 100) : 0;

  return (
    <div>
      <SectionTitle eyebrow="My Tools" title="Routine Tracker" />
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setDate(new Date(new Date(date).getTime() - 86400000).toISOString().slice(0, 10))} className="p-2 rounded-full border border-stone-200 hover:border-stone-400"><ChevronLeft size={16} /></button>
        <div className="font-body text-sm text-stone-700">{fmtDate(date)} {date === todayStr() && <span className="text-rose-500">· Today</span>}</div>
        <button onClick={() => setDate(new Date(new Date(date).getTime() + 86400000).toISOString().slice(0, 10))} className="p-2 rounded-full border border-stone-200 hover:border-stone-400"><ChevronRight size={16} /></button>
      </div>
      <div className="flex gap-2 mb-5">
        <Pill active={tab === "morning"} onClick={() => setTab("morning")} tone="amber">☀️ Morning</Pill>
        <Pill active={tab === "night"} onClick={() => setTab("night")} tone="stone">🌙 Night</Pill>
      </div>
      <ClayCard className="p-6">
        <div className="flex justify-between text-sm font-body text-stone-500 mb-1"><span>{pct}% complete</span><span>{entry.completedSteps.length} of {steps.length} steps</span></div>
        <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden mb-5"><div className="h-full progress-fill-gold transition-all duration-500" style={{ width: `${pct}%` }} /></div>
        <div className="grid gap-2.5">
          {steps.map((s, i) => {
            const state = entry.completedSteps.includes(s.id) ? "done" : entry.skippedSteps.includes(s.id) ? "skipped" : "pending";
            return (
              <button key={s.id} onClick={() => cycle(s.id)} className={`text-left flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${state === "done" ? "border-emerald-300 bg-emerald-50" : state === "skipped" ? "border-stone-200 bg-stone-50" : "border-stone-200 hover:border-rose-300"}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${state === "done" ? "bg-emerald-500 text-white" : state === "skipped" ? "bg-stone-300 text-white" : "bg-white border border-stone-300 text-stone-400"}`}>
                  {state === "done" ? <Check size={14} /> : state === "skipped" ? <Minus size={14} /> : i + 1}
                </span>
                <div className="flex-1 min-w-0"><div className="font-body text-sm text-stone-800">{s.name}</div><div className="font-body text-xs text-stone-500">{s.description}</div></div>
                <Pill tone="stone">{s.product}</Pill>
              </button>
            );
          })}
        </div>
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="font-body text-sm text-stone-500 mb-2">How does your skin feel today?</div>
          <div className="flex gap-2">{["😢", "😕", "😐", "😊", "😍"].map((e) => <button key={e} onClick={() => setMood(e)} className={`text-2xl p-2 rounded-full transition-transform ${entry.mood === e ? "bg-rose-100 scale-110" : "hover:scale-110"}`}>{e}</button>)}</div>
        </div>
      </ClayCard>
    </div>
  );
}

