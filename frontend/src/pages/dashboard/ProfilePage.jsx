import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Droplet, ChevronLeft, ChevronRight, User, History as HistoryIcon } from "lucide-react";
import { Reveal, Pill, ClayCard, SectionTitle } from "@/components/ui";
import { SKIN_TYPES, CONCERNS, GOALS, MAKEUP_STYLES, AGE_RANGES } from "@/lib/content";

import QuizSection from "@/components/profile/QuizSection";
import HistoryTab from "@/components/profile/HistoryTab";

const PROFILE_TABS = [["overview", "Overview", User], ["quiz", "Skin Quiz", Droplet], ["history", "History", HistoryIcon]];

export default function ProfilePage({ profile, setProfile, quizResult, submitQuiz, historyModules }) {
  const location = useLocation();
  const [tab, setTab] = useState((location.state && location.state.tab) || "overview");
  const [editingFlag, setEditing] = useState(false);
  const editing = editingFlag || !profile; // a profile created by the Skin Quiz switches the page to its overview right away
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(profile || { skinType: "", skinConcerns: [], sensitivity: "", ageRange: "", beautyGoals: [], makeupPreferences: [] });
  // The Skin Quiz owns skin type and sensitivity: once a quiz exists they always mirror it.
  const d = quizResult ? { ...draft, skinType: quizResult.resultSkinType, sensitivity: quizResult.resultSensitivity } : draft;
  const toggle = (arr, val) => (arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const TabBar = (
    <div className="flex flex-wrap gap-2 mb-7">
      {PROFILE_TABS.map(([id, label, Icon]) => (
        <button key={id} onClick={() => setTab(id)} className={`font-body text-sm px-4 py-2 rounded-full border flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 ${tab === id ? "btn-primary border-rose-600 shadow-md shadow-rose-200" : "bg-white text-stone-600 border-stone-200 hover:border-rose-300"}`}>
          <Icon size={14} />{label}{id === "history" && historyModules.length > 0 ? ` (${historyModules.length})` : ""}
        </button>
      ))}
    </div>
  );

  if (tab === "quiz") {
    return (
      <div>
        <SectionTitle eyebrow="You" title="My Profile" />
        {TabBar}
        <div key="quiz" className="page-enter"><QuizSection quizResult={quizResult} submitQuiz={submitQuiz} /></div>
      </div>
    );
  }
  if (tab === "history") {
    return (
      <div>
        <SectionTitle eyebrow="You" title="My Profile" />
        {TabBar}
        <div key="history" className="page-enter"><HistoryTab modules={historyModules} /></div>
      </div>
    );
  }

  if (!editing && profile) {
    const st = SKIN_TYPES.find((s) => s.id === profile.skinType);
    return (
      <div>
        <SectionTitle eyebrow="You" title="My Profile" sub="Your beauty profile powers every recommendation on BeautyBloom." />
        {TabBar}
        <div key="overview" className="page-enter">
          {!quizResult && (
            <ClayCard className="p-5 mb-6 bg-gradient-to-br from-rose-50 to-amber-50" noLift>
              <div className="font-body text-sm text-stone-700">Take the Skin Quiz to unlock your personalized routines, makeup looks and ingredient guidance.</div>
              <button onClick={() => setTab("quiz")} className="font-body mt-3 btn-primary px-5 py-2 rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all">Take the Skin Quiz</button>
            </ClayCard>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <Reveal delay={0}><ClayCard className="p-5"><div className="text-2xl">{st?.emoji}</div><div className="font-body text-xs text-stone-400 mt-2">Skin Type</div><div className="font-display text-lg text-stone-800">{st?.label}</div></ClayCard></Reveal>
            <Reveal delay={60}><ClayCard className="p-5"><div className="text-2xl">🌡️</div><div className="font-body text-xs text-stone-400 mt-2">Sensitivity</div><div className="font-display text-lg text-stone-800 capitalize">{profile.sensitivity}</div></ClayCard></Reveal>
            <Reveal delay={120}><ClayCard className="p-5 col-span-2 sm:col-span-1"><div className="text-2xl">🎂</div><div className="font-body text-xs text-stone-400 mt-2">Age Range</div><div className="font-display text-lg text-stone-800">{profile.ageRange || "Not set"}</div></ClayCard></Reveal>
          </div>
          <ClayCard className="p-6 mb-4">
            <div className="font-body text-sm text-stone-500 mb-2">Skin Concerns</div>
            <div className="flex flex-wrap gap-2">{profile.skinConcerns.map((c) => <Pill key={c} tone="rose">{c}</Pill>)}</div>
          </ClayCard>
          <ClayCard className="p-6 mb-6">
            <div className="font-body text-sm text-stone-500 mb-2">Beauty Goals</div>
            <div className="flex flex-wrap gap-2">{profile.beautyGoals.map((g) => <Pill key={g} tone="emerald">{g}</Pill>)}</div>
          </ClayCard>
          <button onClick={() => { setDraft(profile); setStep(0); setEditing(true); }} className="font-body bg-stone-800 text-white px-6 py-3 rounded-full hover:bg-rose-600 hover:shadow-lg hover:scale-105 transition-all">Update Profile</button>
        </div>
      </div>
    );
  }

  const steps = ["Skin Type", "Skin Concerns", "Sensitivity", "Beauty Goals", "Makeup Preferences"];
  const canNext = [!!d.skinType, true, !!d.sensitivity, true, true][step];

  return (
    <div>
      <SectionTitle eyebrow="You" title="My Profile" />
      {TabBar}
      <div className="h-2 rounded-full bg-stone-100 overflow-hidden mb-8"><div className="h-full progress-fill transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      <ClayCard className="p-7" noLift>
        <div key={step} className="page-enter">
          <div className="font-body text-sm text-rose-500 mb-1">Step {step + 1} of {steps.length}</div>
          <h3 className="font-display text-xl text-stone-800 mb-5">{steps[step]}</h3>

          {quizResult && (step === 0 || step === 2) && <div className="font-body text-xs text-stone-500 mb-3">Your skin type and sensitivity come from your Skin Quiz. Retake the quiz to change them.</div>}
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {SKIN_TYPES.map((s) => (
                <button key={s.id} onClick={() => { if (!quizResult) setDraft({ ...draft, skinType: s.id }); }} className={`text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${d.skinType === s.id ? "border-rose-500 bg-rose-50 shadow-md" : "border-stone-200 hover:border-rose-300"}`}>
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="font-display text-stone-800 mt-1">{s.label}</div>
                  <div className="font-body text-xs text-stone-500 mt-1">{s.desc}</div>
                </button>
              ))}
            </div>
          )}
          {step === 1 && <div className="flex flex-wrap gap-2">{CONCERNS.map((c) => <Pill key={c} active={draft.skinConcerns.includes(c)} onClick={() => setDraft({ ...draft, skinConcerns: toggle(draft.skinConcerns, c) })}>{c}</Pill>)}</div>}
          {step === 2 && (
            <div>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[{ v: "low", e: "💚" }, { v: "medium", e: "💛" }, { v: "high", e: "🧡" }].map((s) => (
                  <button key={s.v} onClick={() => { if (!quizResult) setDraft({ ...draft, sensitivity: s.v }); }} className={`p-4 rounded-2xl border capitalize transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${d.sensitivity === s.v ? "border-rose-500 bg-rose-50 shadow-md" : "border-stone-200 hover:border-rose-300"}`}><div className="text-2xl">{s.e}</div><div className="font-body mt-1 text-stone-700">{s.v}</div></button>
                ))}
              </div>
              <div className="font-body text-sm text-stone-500 mb-2">Age Range (optional)</div>
              <div className="flex flex-wrap gap-2">{AGE_RANGES.map((a) => <Pill key={a} active={draft.ageRange === a} onClick={() => setDraft({ ...draft, ageRange: draft.ageRange === a ? "" : a })} tone="stone">{a}</Pill>)}</div>
            </div>
          )}
          {step === 3 && <div className="flex flex-wrap gap-2">{GOALS.map((g) => <Pill key={g} tone="emerald" active={draft.beautyGoals.includes(g)} onClick={() => setDraft({ ...draft, beautyGoals: toggle(draft.beautyGoals, g) })}>{g}</Pill>)}</div>}
          {step === 4 && <div className="flex flex-wrap gap-2">{MAKEUP_STYLES.map((m) => <Pill key={m} tone="amber" active={draft.makeupPreferences.includes(m)} onClick={() => setDraft({ ...draft, makeupPreferences: toggle(draft.makeupPreferences, m) })}>{m}</Pill>)}</div>}
        </div>

        <div className="flex justify-between mt-8">
          <button disabled={step === 0} onClick={() => setStep(step - 1)} className="font-body text-sm text-stone-500 disabled:opacity-30 flex items-center gap-1"><ChevronLeft size={16} />Back</button>
          {step < steps.length - 1 ? (
            <button disabled={!canNext} onClick={() => setStep(step + 1)} className="font-body bg-stone-800 text-white px-6 py-2.5 rounded-full disabled:opacity-30 hover:bg-rose-600 hover:shadow-lg transition-all flex items-center gap-1">Next <ChevronRight size={16} /></button>
          ) : (
            <button onClick={() => { const p = { ...d, completedOnboarding: true }; setProfile(p); setEditing(false); }} className="font-body btn-primary px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all">Save Profile</button>
          )}
        </div>
      </ClayCard>
    </div>
  );
}

