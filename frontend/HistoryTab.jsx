import React from "react";
import { Droplet, Layers } from "lucide-react";
import { Reveal, Pill, ClayCard } from "@/components/ui";
import { SKIN_TYPES } from "@/lib/content";
import { findPreviousModule } from "@/lib/utils";

/* =========================================================================
   SKIN QUIZ HISTORY — every completed Skin Quiz is saved as its own numbered
   module, in the exact order the user took them (Module 1, 2, 3…), so changes
   in skin type, sensitivity and concern can be tracked and compared over time.
   ========================================================================= */

/* Small labeled wrapper used to give every part of a history module its own
   clearly separated section, so long text wraps inside the card instead of overflowing it. */
function HistoryFieldSection({ label, children, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      {label && <div className="font-body text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">{label}</div>}
      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

const skinLabel = (id) => (SKIN_TYPES.find((s) => s.id === id) || {}).label || id;

function changesSince(mod, prev) {
  const out = [];
  if (mod.quiz.resultSkinType !== prev.quiz.resultSkinType) out.push(`Skin type: ${skinLabel(prev.quiz.resultSkinType)} → ${skinLabel(mod.quiz.resultSkinType)}`);
  if (mod.quiz.resultSensitivity !== prev.quiz.resultSensitivity) out.push(`Sensitivity: ${prev.quiz.resultSensitivity} → ${mod.quiz.resultSensitivity}`);
  const a = (prev.quiz.resultConcerns || []).join(", "), b = (mod.quiz.resultConcerns || []).join(", ");
  if (a !== b) out.push(`Top concern: ${a || "none"} → ${b || "none"}`);
  return out;
}

function HistoryModuleCard({ mod, previous, delay }) {
  const st = SKIN_TYPES.find((s) => s.id === mod.quiz?.resultSkinType);
  const changes = previous ? changesSince(mod, previous) : [];

  return (
    <Reveal delay={delay}>
      <ClayCard className="p-6 overflow-hidden">
        {/* Header section: module number, type, and date only — never mixed with content below. */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-body text-xs font-semibold bg-rose-100 text-rose-700 rounded-full px-3 py-1 shrink-0">Module {mod.moduleNumber}</span>
            <Pill tone="emerald"><span className="flex items-center gap-1"><Droplet size={12} />Skin Quiz</span></Pill>
          </div>
          <span className="font-body text-xs text-stone-400 shrink-0">{new Date(mod.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>

        <div className="flex flex-col gap-4">
          <HistoryFieldSection label="Result">
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0 leading-none">{st?.emoji}</div>
              <div className="min-w-0">
                <div className="font-display text-stone-800">{st?.label} Skin</div>
                <div className="font-body text-xs text-stone-500 capitalize break-words">Sensitivity: {mod.quiz.resultSensitivity} · {(mod.quiz.resultConcerns || []).join(", ") || "No specific concern noted"}</div>
              </div>
            </div>
          </HistoryFieldSection>

          {previous && (
            <HistoryFieldSection label={`Compared to Module ${previous.moduleNumber}`}>
              {changes.length === 0
                ? <span className="font-body text-xs text-stone-400">No change from your previous quiz.</span>
                : <ul className="font-body text-xs text-stone-600 space-y-1 capitalize">{changes.map((c, i) => <li key={i}>{c}</li>)}</ul>}
            </HistoryFieldSection>
          )}

          {mod.recommendations && mod.recommendations.length > 0 && (
            <HistoryFieldSection label="Personalized Recommendations" className="pt-3 border-t border-stone-100">
              <ul className="font-body text-sm text-stone-600 list-disc list-outside pl-4 space-y-1">
                {mod.recommendations.map((r, i) => <li key={i} className="break-words">{r}</li>)}
              </ul>
            </HistoryFieldSection>
          )}
        </div>
      </ClayCard>
    </Reveal>
  );
}

export default function HistoryTab({ modules }) {
  if (!modules || modules.length === 0) {
    return (
      <ClayCard className="p-10 text-center max-w-md">
        <Layers className="mx-auto text-rose-300" size={32} />
        <h3 className="font-display text-lg text-stone-800 mt-3">Your History Starts Here</h3>
        <p className="font-body text-sm text-stone-500 mt-1">Complete the Skin Quiz and it'll be saved here as Module 1, building a timeline you can track over time.</p>
      </ClayCard>
    );
  }
  const sorted = [...modules].sort((a, b) => b.moduleNumber - a.moduleNumber);
  return (
    <div>
      <p className="font-body text-sm text-stone-500 mb-5">Every Skin Quiz you complete is saved here as its own module, in order, so you can track how your skin changes over time. Your latest quiz powers all of your personalized guidance.</p>
      <div className="grid gap-4">
        {sorted.map((mod, i) => (
          <HistoryModuleCard key={mod.id} mod={mod} previous={findPreviousModule(modules, mod)} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}
