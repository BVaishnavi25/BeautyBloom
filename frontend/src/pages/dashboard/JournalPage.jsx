import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { hasPersonalizationData, getEffectiveSkinProfile, getPersonalizedIngredientIds, buildAiGuide } from "@/lib/personalization";


export default function JournalPage({ journal, setJournal }) {
  const [showForm, setShowForm] = useState(journal.length === 0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState([]);
  const TAGS = ["skin-update", "new-product", "routine-change", "breakout", "glow-up", "self-care", "seasonal"];

  const save = () => {
    if (!title.trim() || !content.trim()) return;
    const entry = { id: `j-${Date.now()}`, title, content, mood, tags, createdAt: new Date().toISOString() };
    setJournal([entry, ...journal]);
    setTitle(""); setContent(""); setMood(null); setTags([]); setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3"><SectionTitle eyebrow="My Tools" title="Glow Journal" /><button onClick={() => setShowForm(!showForm)} className="font-body btn-primary px-5 py-2.5 rounded-full transition-colors h-fit">{showForm ? "Cancel" : "New Entry"}</button></div>

      {showForm && (
        <ClayCard className="p-6 mb-6">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry title" className="w-full font-body text-sm p-3 rounded-xl input-field mb-3" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's going on with your skin today?" rows={4} className="w-full font-body text-sm p-3 rounded-xl input-field mb-3" />
          <div className="flex gap-2 mb-3">{["😢", "😕", "😐", "😊", "😍"].map((e) => <button key={e} onClick={() => setMood(e)} className={`text-xl p-1.5 rounded-full ${mood === e ? "bg-rose-100" : ""}`}>{e}</button>)}</div>
          <div className="flex flex-wrap gap-2 mb-4">{TAGS.map((t) => <Pill key={t} tone="emerald" active={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>{t}</Pill>)}</div>
          <button onClick={save} className="font-body bg-stone-800 text-white px-5 py-2.5 rounded-full hover:bg-rose-600 transition-colors">Save Entry</button>
        </ClayCard>
      )}

      {journal.length === 0 && !showForm ? (
        <ClayCard className="p-10 text-center"><div className="text-4xl">📝</div><h3 className="font-display text-lg text-stone-800 mt-3">Your Glow Journal Is Waiting</h3><p className="font-body text-sm text-stone-500 mt-1">Record how your skin feels, what changed, and what's working.</p><button onClick={() => setShowForm(true)} className="font-body mt-5 btn-primary px-6 py-2.5 rounded-full transition-colors">Write First Entry</button></ClayCard>
      ) : (
        <div className="grid gap-4">
          {journal.map((e) => (
            <ClayCard key={e.id} className="p-5">
              <div className="flex justify-between items-start">
                <div className="min-w-0"><div className="font-display text-stone-800 break-words">{e.mood && <span className="mr-1">{e.mood}</span>}{e.title}</div><div className="font-body text-xs text-stone-400">{new Date(e.createdAt).toLocaleDateString()}</div></div>
                <button onClick={() => setJournal(journal.filter((j) => j.id !== e.id))} className="text-stone-300 hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
              <p className="font-body text-sm text-stone-600 mt-2">{e.content}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">{e.tags.map((t) => <Pill key={t} tone="stone">{t}</Pill>)}</div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}

