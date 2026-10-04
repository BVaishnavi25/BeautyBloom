import React, { useState, useEffect, useMemo, useRef } from "react";
import { Sparkles, Droplet, Sun, Wand2, Palette, Beaker, Flower2, Leaf, Star, Heart, Moon, Lightbulb, Play, Pause, RotateCcw, ExternalLink } from "lucide-react";
import { ClayCard } from "@/components/ui";
import { parseDurationToSeconds } from "@/lib/utils";

const TUTORIAL_SCENE_ICONS = [Sparkles, Droplet, Sun, Wand2, Palette, Beaker, Flower2, Leaf, Star, Heart, Moon, Lightbulb];

function StepWalkthrough({ title, subtitle, steps, theme = "rose", personalizedNote, footer }) {
  const safeSteps = steps && steps.length ? steps : [{ title: "Overview", description: "Steps for this tutorial are on the way." }];
  const durations = useMemo(() => safeSteps.map((s) => parseDurationToSeconds(s.duration, 6)), [safeSteps]);
  const totalDuration = useMemo(() => durations.reduce((a, b) => a + b, 0), [durations]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  // Reset the player whenever it's asked to show a different tutorial.
  useEffect(() => { setActiveIndex(0); setStepElapsed(0); setPlaying(false); setFinished(false); }, [title, safeSteps.length]);

  useEffect(() => {
    if (!playing) return undefined;
    const tick = setInterval(() => {
      setStepElapsed((prev) => {
        const stepLength = durations[activeIndex] || 6;
        const next = prev + 0.2;
        if (next < stepLength) return next;
        setActiveIndex((idx) => {
          if (idx + 1 < safeSteps.length) return idx + 1;
          setPlaying(false);
          setFinished(true);
          return idx;
        });
        return 0;
      });
    }, 200);
    return () => clearInterval(tick);
  }, [playing, activeIndex, durations, safeSteps.length]);

  const jumpTo = (i) => { setActiveIndex(i); setStepElapsed(0); setFinished(false); };
  const togglePlay = () => { if (finished) { jumpTo(0); setPlaying(true); return; } setPlaying((p) => !p); };
  const restart = () => { jumpTo(0); setPlaying(true); };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const elapsedTotal = durations.slice(0, activeIndex).reduce((a, b) => a + b, 0) + stepElapsed;
  const step = safeSteps[activeIndex];
  const stepProgress = durations[activeIndex] ? Math.min(1, stepElapsed / durations[activeIndex]) : 0;
  const SceneIcon = TUTORIAL_SCENE_ICONS[activeIndex % TUTORIAL_SCENE_ICONS.length];

  return (
    <ClayCard className="p-4 sm:p-5" noLift>
      <div className="mb-3">
        <div className="font-body text-xs uppercase tracking-widest text-brand-eyebrow">Video Tutorial</div>
        <h4 className="font-display text-lg text-stone-800 truncate">{title}</h4>
        {subtitle && <div className="font-body text-xs text-stone-400">{subtitle}</div>}
      </div>

      <div className={`relative aspect-video rounded-2xl overflow-hidden tutorial-scene tutorial-scene-${theme} flex items-center justify-center text-center px-6`}>
        <div className="relative z-10 text-white max-w-sm">
          <SceneIcon size={32} className={`mx-auto mb-3 ${playing ? "animate-pulse" : ""}`} />
          <div className="font-body text-[11px] uppercase tracking-widest opacity-80">Step {activeIndex + 1} of {safeSteps.length}</div>
          <div className="font-display text-lg sm:text-xl mt-1 break-words">{step.title}</div>
          {step.description && <p className="font-body text-sm opacity-90 mt-2 leading-snug break-words">{step.description}</p>}
        </div>
        {finished && (
          <button onClick={restart} className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 font-body text-sm text-white hover:bg-black/60 transition-colors">
            <span className="bg-white/90 text-stone-800 rounded-full px-5 py-2 flex items-center gap-2"><RotateCcw size={15} />Watch Again</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 hover:bg-rose-600 transition-colors">
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex gap-1">
            {safeSteps.map((s, i) => (
              <button key={i} onClick={() => jumpTo(i)} aria-label={`Jump to ${s.title}`} className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: i < activeIndex ? "100%" : i === activeIndex ? `${stepProgress * 100}%` : "0%" }} />
              </button>
            ))}
          </div>
          <div className="font-body text-[11px] text-stone-400 mt-1">{fmt(elapsedTotal)} / {fmt(totalDuration)}</div>
        </div>
      </div>

      <div className="font-body text-xs text-stone-400 mt-2 truncate">{safeSteps.map((s) => s.title).join(" · ")}</div>
      {personalizedNote && <div className="mt-3 font-body text-xs bg-rose-50 text-rose-700 rounded-xl px-3 py-2 break-words">✨ {personalizedNote}</div>}
      {footer}
    </ClayCard>
  );
}



/* =========================================================================
   REAL VIDEO TUTORIALS
   Every tutorial that has a matching YouTube video (see backend/src/data/videos.js) plays it here
   with YouTube's own responsive controls (play/pause, seek, speed, captions, fullscreen).
   Uses the YouTube IFrame API on the privacy-enhanced domain so a video that can't be embedded,
   was removed, or can't load (offline / blocked) is detected and replaced by a clear
   "Watch on YouTube" link instead of a broken player.
   ========================================================================= */
let ytApiPromise = null;
function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (previous) previous(); resolve(window.YT); };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => { ytApiPromise = null; reject(new Error("YouTube API blocked")); };
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

function YouTubeFrame({ video }) {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | failed

  useEffect(() => {
    let cancelled = false;
    let player = null;
    setStatus("loading");
    const timeout = setTimeout(() => { if (!cancelled) setStatus((s) => (s === "ready" ? s : "failed")); }, 12000);
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;
        const target = document.createElement("div");
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(target);
        player = new YT.Player(target, {
          videoId: video.id,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 1, cc_load_policy: 0 },
          events: {
            onReady: () => { if (!cancelled) setStatus("ready"); },
            onError: () => { if (!cancelled) setStatus("failed"); }, // removed, private or embedding disabled
          },
        });
      })
      .catch(() => { if (!cancelled) setStatus("failed"); });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      try { if (player && player.destroy) player.destroy(); } catch (e) { /* ignore */ }
    };
  }, [video.id]);

  if (status === "failed") {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-900 flex flex-col items-center justify-center text-center px-6 text-white">
        <p className="font-body text-sm opacity-90">This video can't play inside BeautyBloom right now.</p>
        <a href={watchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="font-body mt-3 inline-flex items-center gap-2 bg-white text-stone-800 rounded-full px-5 py-2 text-sm hover:bg-rose-50 transition-colors">
          <ExternalLink size={14} />Watch on YouTube
        </a>
      </div>
    );
  }
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-900">
      <div ref={mountRef} className="yt-frame absolute inset-0 w-full h-full" />
      {status === "loading" && <div className="absolute inset-0 flex items-center justify-center font-body text-xs text-white/70 pointer-events-none">Loading video…</div>}
    </div>
  );
}

function VideoTutorial({ title, subtitle, steps, video, personalizedNote }) {
  const list = steps && steps.length ? steps : [];
  return (
    <ClayCard className="p-4 sm:p-5" noLift>
      <div className="mb-3">
        <div className="font-body text-xs uppercase tracking-widest text-brand-eyebrow">Video Tutorial</div>
        <h4 className="font-display text-lg text-stone-800 break-words">{title}</h4>
        {subtitle && <div className="font-body text-xs text-stone-400">{subtitle}</div>}
      </div>

      <YouTubeFrame key={video.id} video={video} />

      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="font-body text-xs text-stone-500 min-w-0 break-words">{video.title}</div>
        <a href={watchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 shrink-0">
          YouTube <ExternalLink size={11} />
        </a>
      </div>

      {personalizedNote && <div className="mt-3 font-body text-xs bg-rose-50 text-rose-700 rounded-xl px-3 py-2 break-words">✨ {personalizedNote}</div>}

      {list.length > 0 && (
        <div className="mt-4">
          <div className="font-body text-xs uppercase tracking-wide text-stone-400 mb-2">Steps in this tutorial</div>
          <ol className="grid gap-2">
            {list.map((s, i) => (
              <li key={i} className="flex gap-3 items-start bg-stone-50 rounded-xl px-3 py-2.5">
                <span className="shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-body text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                <div className="min-w-0">
                  <div className="font-body text-sm text-stone-800 break-words">{s.title}</div>
                  {s.description && <div className="font-body text-xs text-stone-500 mt-0.5 leading-snug break-words">{s.description}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </ClayCard>
  );
}

export default function TutorialPlayer(props) {
  const { video, title } = props;
  if (video && video.id) return <VideoTutorial {...props} />;
  // No matching video exists yet for this tutorial: keep the written step-by-step walkthrough and say so plainly.
  const query = encodeURIComponent(`${title} tutorial`);
  const footer = (
    <div className="mt-3 font-body text-xs text-stone-400">
      No video has been matched to this tutorial yet.{" "}
      <a href={`https://www.youtube.com/results?search_query=${query}`} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700 underline underline-offset-2">Search YouTube</a>
    </div>
  );
  return <StepWalkthrough {...props} footer={footer} />;
}
