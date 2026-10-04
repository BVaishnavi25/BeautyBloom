import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Droplet, Sun, Moon, Sparkles, Heart, BookOpen, TrendingUp, User, LogOut, Menu, X, Search, ChevronLeft, ChevronRight, Check, Minus, Trash2, Star, Leaf, Flower2, Wand2, Palette, ClipboardList, Lightbulb, ArrowRight, ChevronDown, Mail, Circle, CheckCircle2, Flame, Trophy, Beaker, RefreshCw, Play, Pause, RotateCcw, History as HistoryIcon, TrendingDown, PlayCircle, Layers } from "lucide-react";
import { ImageBackground, Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import TutorialPlayer from "@/components/TutorialPlayer";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES, ROUTINE_BANK, INGREDIENTS, MAKEUP_GUIDES, LOOKS, TIPS, QUIZ_QUESTIONS } from "@/lib/content";
import { todayStr, fmtDate, findPreviousModule, parseDurationToSeconds } from "@/lib/utils";
import { hasPersonalizationData, getEffectiveSkinProfile, getPersonalizedIngredientIds, buildAiGuide } from "@/lib/personalization";


/* Smooth-scrolls to a section on this page (the "See What's Inside" link and the scroll cue). */
const scrollToId = (id) => (e) => {
  if (e && e.preventDefault) e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function LandingPage({ onStart, onSignIn, isSignedIn = false }) {
  const [navShrink, setNavShrink] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavShrink(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      {/* HERO: the photo fills the entire first screen, edge to edge. Everything else starts below it. */}
      <div className="hero-fullscreen relative navy-surface overflow-hidden flex flex-col w-full">
        <ImageBackground scrim="dark" />
        {/* extra left-side shade keeps the headline readable on any part of the photo */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(7,15,26,0.55) 0%, rgba(7,15,26,0.25) 55%, rgba(7,15,26,0.05) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 25% 35%, rgba(168,120,93,0.28), transparent 65%)" }} />
        <nav className={`relative sticky top-0 z-30 backdrop-blur bg-black/20 border-b border-white/10 transition-all duration-300 ${navShrink ? "py-1" : "py-0"}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 font-display text-xl text-white"><Flower2 className="text-rose-300" size={22} />BeautyBloom</div>
            <div className="flex items-center gap-3">
              <button onClick={onSignIn} className="font-body text-sm text-white/90 hover:text-rose-300 px-3 py-2 transition-colors">{isSignedIn ? "My Profile" : "Sign In"}</button>
              <button onClick={onStart} className="font-body text-sm btn-primary px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all">{isSignedIn ? "Open My Profile" : "Get Started"}</button>
            </div>
          </div>
        </nav>

        <header className="relative flex-1 w-full max-w-6xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="pop-in relative">
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-white">
              Bloom with confidence,<br /><span className="text-rose-300">glow with beauty</span>
            </h1>
            <p className="font-body text-stone-300 mt-5 max-w-md">A personalized skincare and makeup guide that learns your skin — no products to buy, just guidance made for you.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={onStart} className="font-body btn-primary px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">{isSignedIn ? "Continue to My Profile" : "Create Your Beauty Profile"} <ArrowRight size={16} /></button>
              <a href="#inside" onClick={scrollToId("inside")} className="font-body border border-white/30 text-white px-6 py-3 rounded-full hover:border-rose-300 hover:text-rose-300 hover:bg-white/5 transition-all">See What's Inside</a>
            </div>
          </div>
          <div className="relative pop-in" style={{ animationDelay: "150ms" }}>
            <ClayCard className="relative p-6">
              <div className="font-body text-xs text-stone-400 mb-3">Tailored just for you</div>
              <div className="grid grid-cols-3 gap-3">
                {SKIN_TYPES.slice(0, 3).map((s, i) => (
                  <div key={s.id} className="min-w-0 rounded-2xl bg-stone-50 border border-stone-100 p-2 sm:p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-200" style={{ animation: `popIn 0.4s ease ${0.2 + i * 0.1}s both` }}>
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="font-body text-xs mt-1 text-stone-600 break-words">{s.label}</div>
                  </div>
                ))}
              </div>
          </ClayCard>
        </div>
      </header>
        <button onClick={scrollToId("inside")} aria-label="Scroll to How It Works" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-rose-300 transition-colors animate-bounce">
          <ChevronDown size={28} />
        </button>
      </div>

      <section id="inside" className="max-w-6xl mx-auto px-6 py-16">
        <Reveal><SectionTitle eyebrow="How it works" title="Three steps to your personal glow plan" /></Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {[{ e: "📝", t: "Tell Us About You", d: "Build your beauty profile or take our 7-question skin quiz." },
            { e: "🌿", t: "Get Your Plan", d: "Receive routines, ingredients, and makeup guidance made for your skin." },
            { e: "🌸", t: "Watch Yourself Glow", d: "Track progress, journal your journey, and refine as your skin changes." }].map((s, i) => (
            <Reveal key={i} delay={i * 100}><ClayCard className="p-6 h-full"><div className="icon-badge text-xl">{s.e}</div><h3 className="font-display text-lg mt-3 text-stone-800">{s.t}</h3><p className="font-body text-sm text-stone-500 mt-1">{s.d}</p></ClayCard></Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal><SectionTitle eyebrow="Features" title="Everything guided, nothing sold" /></Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {[{ i: <User size={20} />, t: "Your Beauty Profile", d: "Skin type, concerns, sensitivity, and goals in one place." },
            { i: <Droplet size={20} />, t: "Skincare Routines", d: "Morning and night steps built for your exact skin type." },
            { i: <Palette size={20} />, t: "Makeup Guidance", d: "Application techniques suited to your base and finish." },
            { i: <Sparkles size={20} />, t: "AI Beauty Guide", d: "A weekly plan built from your profile and Skin Quiz result." },
            { i: <Beaker size={20} />, t: "Ingredient Guide", d: "What each ingredient does, and whether it's right for you." },
            { i: <TrendingUp size={20} />, t: "Track Your Progress", d: "Streaks, journal entries, and your Skin Quiz history over time." }].map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <ClayCard className="p-6 h-full group">
                <div className="icon-badge">{f.i}</div>
                <h3 className="font-display text-lg mt-3 text-stone-800">{f.t}</h3>
                <p className="font-body text-sm text-stone-500 mt-1">{f.d}</p>
              </ClayCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal><SectionTitle eyebrow="Loved by early users" title="What people are saying" /></Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {[{ n: "Sarah K.", q: "The morning routine finally makes sense for my combination skin." }, { n: "Priya M.", q: "I stopped buying random products and started following my actual plan." }, { n: "Emma L.", q: "The ingredient guide taught me more than years of scrolling ever did." }].map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <ClayCard className="p-6 h-full">
                <div className="flex gap-1 text-amber-400 mb-2">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}</div>
                <p className="font-body text-stone-600 text-sm">"{t.q}"</p>
                <div className="font-body text-sm text-stone-400 mt-3">— {t.n}</div>
              </ClayCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <ClayCard className="relative p-10 text-center bg-gradient-to-br from-rose-50 to-amber-50 overflow-hidden" noLift>
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-rose-200 to-rose-100 opacity-60 blur-2xl" />
            <div className="absolute -bottom-16 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-amber-200 to-amber-100 opacity-60 blur-2xl" />
            <div className="relative">
              <h2 className="font-display text-3xl text-stone-800">Ready to Bloom?</h2>
              <p className="font-body text-stone-500 mt-2">Your personalized beauty profile takes two minutes to start.</p>
              <button onClick={onStart} className="font-body mt-6 btn-primary px-8 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all">{isSignedIn ? "Open My Profile" : "Get Started Free"}</button>
            </div>
          </ClayCard>
        </Reveal>
      </section>

      <footer className="navy-surface relative overflow-hidden px-6 py-10 flex items-center justify-center gap-2 font-display text-stone-300">
        <Flower2 size={18} className="text-rose-300" /><span>BeautyBloom — bloom with confidence, glow with beauty</span>
      </footer>
    </div>
  );
}

