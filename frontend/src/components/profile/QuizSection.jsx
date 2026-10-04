import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, ClayCard } from "@/components/ui";
import { SKIN_TYPES, QUIZ_QUESTIONS } from "@/lib/content";

export default function QuizSection({ quizResult, submitQuiz }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(quizResult ? "result" : "intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // question id -> chosen option INDEX (scored on the server)
  const [result, setResult] = useState(quizResult);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const answer = (optIndex) => {
    if (saving) return;
    const next = { ...answers, [QUIZ_QUESTIONS[qIndex].id]: optIndex };
    setAnswers(next);
    if (qIndex < QUIZ_QUESTIONS.length - 1) { setTimeout(() => setQIndex(qIndex + 1), 250); return; }
    setSaving(true); setError("");
    submitQuiz(next)
      .then((r) => { setResult(r); setPhase("result"); })
      .catch((e) => setError(e.message || "Could not save your quiz. Please try again."))
      .finally(() => setSaving(false));
  };

  if (phase === "result" && result) {
    const st = SKIN_TYPES.find((s) => s.id === result.resultSkinType);
    return (
      <ClayCard className="p-8 text-center max-w-lg pop-in" noLift>
        <div className="text-5xl">{st?.emoji}</div>
        <div className="font-display text-2xl text-stone-800 mt-2">{st?.label} Skin</div>
        <div className="flex flex-wrap justify-center gap-2 mt-3">{result.resultConcerns.map((c) => <Pill key={c}>{c}</Pill>)}</div>
        <div className="font-body text-sm text-stone-500 mt-3 capitalize">Sensitivity: {result.resultSensitivity}</div>
        <div className="font-body text-xs text-stone-400 mt-1">Completed {new Date(result.completedAt).toLocaleDateString()}</div>
        <div className="font-body text-xs text-emerald-600 mt-3">Saved — your routines, makeup looks and ingredient guidance now use this result.</div>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <button onClick={() => navigate("/app/skincare")} className="font-body btn-primary px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all">See My Skincare Routine</button>
          <button onClick={() => { setPhase("intro"); setQIndex(0); setAnswers({}); }} className="font-body border border-stone-200 text-stone-600 px-5 py-2.5 rounded-full hover:border-stone-400 transition-all">Retake</button>
        </div>
      </ClayCard>
    );
  }

  if (phase === "intro") {
    return (
      <ClayCard className="p-8 max-w-lg text-center">
        <div className="text-4xl">🧴</div>
        <h3 className="font-display text-xl text-stone-800 mt-3">Discover Your Skin Type</h3>
        <p className="font-body text-sm text-stone-500 mt-2">Answer 7 quick questions and we'll identify your skin type, sensitivity, and top concern — then personalize your whole BeautyBloom experience from the result.</p>
        <button onClick={() => setPhase("quiz")} className="font-body mt-6 btn-primary px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all">Start Quiz</button>
      </ClayCard>
    );
  }

  const q = QUIZ_QUESTIONS[qIndex];
  return (
    <div>
      <div className="h-2 rounded-full bg-stone-100 overflow-hidden mb-8 max-w-lg"><div className="h-full progress-fill transition-all duration-500" style={{ width: `${((qIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
      <ClayCard className="p-7 max-w-lg" noLift>
        <div key={qIndex} className="page-enter">
          <div className="font-body text-sm text-rose-500 mb-1">Question {qIndex + 1} of {QUIZ_QUESTIONS.length}</div>
          <h3 className="font-display text-lg text-stone-800 mb-5">{q.question}</h3>
          {error && <div className="text-rose-500 text-sm font-body mb-3">{error}</div>}
          <div className="grid gap-2.5">
            {q.options.map((o, i) => (
              <button key={i} onClick={() => answer(i)} disabled={saving} className="text-left font-body p-3.5 rounded-2xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50 hover:translate-x-1 transition-all text-stone-700">{o.text}</button>
            ))}
          </div>
        </div>
      </ClayCard>
    </div>
  );
}

