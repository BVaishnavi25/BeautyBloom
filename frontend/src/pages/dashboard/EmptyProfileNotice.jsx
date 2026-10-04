import React from "react";
import { ClayCard } from "@/components/ui";

export default function EmptyProfileNotice({ onGoToProfile }) {
  return (
    <ClayCard className="p-10 text-center max-w-md">
      <div className="text-4xl">🌸</div>
      <h3 className="font-display text-lg text-stone-800 mt-3">Take Your Skin Quiz First</h3>
      <p className="font-body text-sm text-stone-500 mt-1">This guidance is personalized entirely from your Skin Quiz results. Answer 7 quick questions so we know your skin before showing recommendations.</p>
      {onGoToProfile && <button onClick={onGoToProfile} className="font-body mt-5 btn-primary px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all">Take the Skin Quiz</button>}
    </ClayCard>
  );
}
