import React, { useEffect, useState } from "react";
import { Flower2, Mail, ArrowRight, Lock, User as UserIcon } from "lucide-react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { ImageBackground, ClayCard } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode === "signup" ? "signup" : "login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, checking, login, signup } = useAuth();
  const navigate = useNavigate();
  const dest = location.state?.from || "/app/profile";

  // Honour a mode requested by the landing page even if this component was already mounted.
  useEffect(() => { if (location.state?.mode) setMode(location.state.mode === "signup" ? "signup" : "login"); }, [location.state?.mode]);

  if (!checking && user) return <Navigate to={dest} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") await signup(name, email, password);
      else await login(email, password);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="relative min-h-screen navy-surface flex items-center justify-center px-6 overflow-hidden">
      <ImageBackground scrim="dark" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 55% at 50% 40%, rgba(168,120,93,0.22), transparent 65%)" }} />
      <ClayCard className="relative w-full max-w-sm p-8 pop-in" noLift>
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-stone-800 justify-center mb-6"><Flower2 className="text-rose-500" size={22} />BeautyBloom</Link>
        <h1 className="font-display text-xl text-stone-800 text-center">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="font-body text-sm text-stone-400 text-center mt-1">{mode === "signup" ? "Build your beauty profile in a minute" : "Sign in to your beauty profile"}</p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={submit}>
          {mode === "signup" && (
            <div className="relative">
              <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="w-full font-body pl-10 pr-4 py-3 rounded-full input-field text-sm" />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="w-full font-body pl-10 pr-4 py-3 rounded-full input-field text-sm" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "Create a password (min. 8 characters)" : "Password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="w-full font-body pl-10 pr-4 py-3 rounded-full input-field text-sm" />
          </div>
          {error && <div className="text-rose-500 text-xs font-body">{error}</div>}
          <button type="submit" disabled={busy} className="w-full mt-1 btn-primary font-body py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} className="w-full font-body text-sm text-stone-400 mt-5 hover:text-rose-500 transition-colors text-center">
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </ClayCard>
    </div>
  );
}
