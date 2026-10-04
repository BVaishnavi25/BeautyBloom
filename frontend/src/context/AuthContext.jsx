import React, { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.me().then((r) => setUser(r.user)).catch(() => setUser(null)).finally(() => setChecking(false));
  }, []);

  const signup = async (name, email, password) => { const r = await api.signup({ name, email, password }); setUser(r.user); };
  const login = async (email, password) => { const r = await api.login({ email, password }); setUser(r.user); };
  const logout = async () => { try { await api.logout(); } catch { /* clear locally regardless */ } setUser(null); };

  return <AuthContext.Provider value={{ user, checking, signup, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export { ApiError };
