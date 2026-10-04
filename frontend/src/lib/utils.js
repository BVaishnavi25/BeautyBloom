export function findPreviousModule(modules, currentModule) {
  const sameType = modules.filter((m) => m.type === currentModule.type && m.moduleNumber < currentModule.moduleNumber);
  if (!sameType.length) return null;
  return sameType.reduce((a, b) => (a.moduleNumber > b.moduleNumber ? a : b));
}


export function parseDurationToSeconds(duration, fallback = 7) {
  if (typeof duration === "number") return duration;
  if (typeof duration !== "string") return fallback;
  const m = duration.match(/(\d+(?:\.\d+)?)\s*(sec|second|min|minute)/i);
  if (!m) return fallback;
  const value = parseFloat(m[1]);
  return /min/i.test(m[2]) ? value * 60 : value;
}


export const todayStr = () => new Date().toISOString().slice(0, 10);
export const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
