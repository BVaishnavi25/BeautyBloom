import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Flower2 } from "lucide-react";
import "./index.css";
import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { hydrateContent } from "@/lib/content";
import { ImageBackground } from "@/components/ui";

/* Loads the site's reference content (skin types, routines, ingredients, makeup guides, tips, quiz)
   from the backend ONCE, before anything else renders — every page then reads it via @/lib/content. */
function ContentGate({ children }) {
  const [state, setState] = useState("loading"); // loading | ready | error
  useEffect(() => {
    api.content().then((c) => { hydrateContent(c); setState("ready"); }).catch(() => setState("error"));
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen navy-surface flex items-center justify-center font-body text-stone-300 relative overflow-hidden">
        <ImageBackground scrim="dark" />
        <div className="relative flex flex-col items-center gap-3"><Flower2 className="text-rose-300 animate-pulse" size={28} /><div>Loading BeautyBloom…</div></div>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="min-h-screen navy-surface flex items-center justify-center font-body text-stone-200 relative overflow-hidden text-center px-6">
        <ImageBackground scrim="dark" />
        <div className="relative">
          <div className="font-display text-lg mb-2">Couldn't reach BeautyBloom</div>
          <p className="text-sm text-stone-400 mb-4">Please check that the backend server is running.</p>
          <button onClick={() => window.location.reload()} className="btn-primary font-body px-5 py-2.5 rounded-full">Retry</button>
        </div>
      </div>
    );
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentGate>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContentGate>
    </BrowserRouter>
  </React.StrictMode>
);
