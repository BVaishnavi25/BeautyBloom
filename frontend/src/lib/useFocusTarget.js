import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

/* Reads ?focus=<id> (set when a saved favorite is opened) and, once the item is on screen, scrolls it into view and
   flashes a highlight. Re-runs on every navigation (location.key) and whenever `ready` changes, so filters that change
   the visible list are handled too. */
export function useFocusTarget(prefix, ready = true) {
  const [params] = useSearchParams();
  const { key } = useLocation();
  const focusId = params.get("focus");
  const doneFor = useRef(null);

  useEffect(() => {
    if (!focusId || !ready) return undefined;
    const token = `${key}:${focusId}`;
    if (doneFor.current === token) return undefined;
    const t = setTimeout(() => {
      const el = document.getElementById(`${prefix}-${focusId}`);
      if (!el) return;
      doneFor.current = token;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("fav-focus"); void el.offsetWidth; el.classList.add("fav-focus");
      setTimeout(() => el.classList.remove("fav-focus"), 2600);
    }, 250);
    return () => clearTimeout(t);
  }, [focusId, key, prefix, ready]);

  return focusId;
}
