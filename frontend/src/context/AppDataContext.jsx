import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { setPersonalization } from "@/lib/personalization";
import { useAuth } from "@/context/AuthContext";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const stateRef = useRef(null);
  stateRef.current = state;
  const favInFlight = useRef(0);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const s = await api.state();
      setPersonalization(s.personalization);
      setState(s);
      setLoaded(true);
      return s;
    } catch (err) {
      console.error("BeautyBloom state loading failed:", err);
      setError(err);
      setLoaded(true);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (user) {
      refresh().catch(() => {});
    } else {
      setState(null);
      setError(null);
      setLoaded(false);
    }
  }, [user, refresh]);

  const toggleFavorite = useCallback(async (item) => {
    const { itemType, itemId } = item;
    const current = (stateRef.current && stateRef.current.favorites) || [];
    const exists = current.some(
      (f) => f.itemType === itemType && f.itemId === itemId
    );

    setState((s) =>
      s
        ? {
            ...s,
            favorites: exists
              ? s.favorites.filter(
                  (f) => !(f.itemType === itemType && f.itemId === itemId)
                )
              : [
                  {
                    itemType,
                    itemId,
                    title: item.title || "",
                    description: item.description || "",
                    addedAt: new Date().toISOString(),
                  },
                  ...s.favorites.filter(
                    (f) => !(f.itemType === itemType && f.itemId === itemId)
                  ),
                ],
          }
        : s
    );

    favInFlight.current += 1;

    try {
      const r = exists
        ? await api.removeFavorite(itemType, itemId)
        : await api.addFavorite(itemType, itemId);

      favInFlight.current -= 1;

      if (favInFlight.current === 0) {
        setState((s) => (s ? { ...s, favorites: r.favorites } : s));
      }

      return !exists;
    } catch (err) {
      favInFlight.current -= 1;

      if (favInFlight.current === 0) {
        try {
          const f = await api.favorites();
          setState((s) => (s ? { ...s, favorites: f.favorites } : s));
        } catch {
        }
      }

      throw err;
    }
  }, []);

  if (!user) {
    return children;
  }

  const value = state
    ? {
        ...state,
        loaded,
        error,
        refresh,
        setProfile: async (p) => {
          await api.saveProfile(p);
          return refresh();
        },
        applyToProfile: async () => {
          await api.applyQuiz();
          return refresh();
        },
        submitQuiz: async (answers) => {
          const r = await api.submitQuiz(answers);
          await refresh();
          return r.quizResult;
        },
        setJournal: async (j) => {
          await api.saveJournal(j);
          return (await refresh()).journal;
        },
        setRoutineEntries: async (r) => {
          await api.saveRoutine(r);
          return (await refresh()).routineEntries;
        },
        toggleFavorite,
      }
    : {
        loaded,
        error,
        refresh,
        toggleFavorite,
      };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);
