import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { setPersonalization } from "@/lib/personalization";
import { useAuth } from "@/context/AuthContext";

const AppDataContext = createContext(null);

/* Single source of truth for everything that isn't in AuthContext. Every mutation calls the API, then
   re-fetches GET /state so the UI always reflects exactly what the backend (and, eventually, MongoDB)
   holds — including the Personalization Engine's latest output. */
export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(null);
  stateRef.current = state;
  const favInFlight = useRef(0);

  const refresh = useCallback(async () => {
    const s = await api.state();
    setPersonalization(s.personalization);
    setState(s);
    setLoaded(true);
    return s;
  }, []);

  useEffect(() => {
    if (user) refresh().catch(() => setLoaded(true));
    else { setState(null); setLoaded(false); }
  }, [user, refresh]);

  /* Saves/unsaves ONE favorite. The heart updates instantly (optimistic), the server does an atomic add/remove,
     and the server's list (title/description from the site's own content) replaces the local one once all
     pending clicks have finished. If the request fails, the list is reloaded from the server and the error is rethrown. */
  const toggleFavorite = useCallback(async (item) => {
    const { itemType, itemId } = item;
    const current = (stateRef.current && stateRef.current.favorites) || [];
    const exists = current.some((f) => f.itemType === itemType && f.itemId === itemId);
    setState((s) => (s ? {
      ...s,
      favorites: exists
        ? s.favorites.filter((f) => !(f.itemType === itemType && f.itemId === itemId))
        : [{ itemType, itemId, title: item.title || "", description: item.description || "", addedAt: new Date().toISOString() }, ...s.favorites.filter((f) => !(f.itemType === itemType && f.itemId === itemId))],
    } : s));
    favInFlight.current += 1;
    try {
      const r = exists ? await api.removeFavorite(itemType, itemId) : await api.addFavorite(itemType, itemId);
      favInFlight.current -= 1;
      if (favInFlight.current === 0) setState((s) => (s ? { ...s, favorites: r.favorites } : s));
      return !exists;
    } catch (err) {
      favInFlight.current -= 1;
      if (favInFlight.current === 0) { try { const f = await api.favorites(); setState((s) => (s ? { ...s, favorites: f.favorites } : s)); } catch { /* keep optimistic list */ } }
      throw err;
    }
  }, []);

  if (!user) return children; // pages behind auth won't render without a user anyway

  const value = state && {
    ...state,
    setProfile: async (p) => { await api.saveProfile(p); return refresh(); },
    applyToProfile: async () => { await api.applyQuiz(); return refresh(); },
    submitQuiz: async (answers) => { const r = await api.submitQuiz(answers); await refresh(); return r.quizResult; },
    setJournal: async (j) => { await api.saveJournal(j); return (await refresh()).journal; },
    setRoutineEntries: async (r) => { await api.saveRoutine(r); return (await refresh()).routineEntries; },
    toggleFavorite,
  };

  return <AppDataContext.Provider value={{ ...value, loaded }}>{children}</AppDataContext.Provider>;
}

export const useAppData = () => useContext(AppDataContext);
