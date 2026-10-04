import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Flower2, User, Sun, Palette, Beaker, Wand2, ClipboardList, BookOpen, Heart, Lightbulb, TrendingUp, Menu, LogOut,
} from "lucide-react";
import { ImageBackground } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";

const NAV = [
  { section: "You", items: [["profile", "My Profile", User]] },
  { section: "Guidance", items: [["skincare", "Skincare Routines", Sun], ["makeup", "Makeup Looks", Palette], ["ingredients", "Ingredient Guide", Beaker], ["aiguide", "AI Beauty Guide", Wand2]] },
  { section: "My Tools", items: [["tracker", "Routine Tracker", ClipboardList], ["journal", "Glow Journal", BookOpen], ["favorites", "Favorites", Heart], ["tips", "Beauty Tips", Lightbulb], ["progress", "My Progress", TrendingUp]] },
];

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();
  const data = useAppData();
  const navigate = useNavigate();

  const handleSignOut = async () => { await logout(); navigate("/", { replace: true }); };

  if (!data || !data.loaded) {
    return (
      <div className="min-h-screen navy-surface flex items-center justify-center font-body text-stone-300 relative overflow-hidden">
        <ImageBackground scrim="dark" />
        <div className="relative flex flex-col items-center gap-3"><Flower2 className="text-rose-300" size={28} /><div>Loading your beauty profile…</div></div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6"><div className="flex items-center gap-2 font-display text-lg text-stone-800"><Flower2 className="text-rose-500" size={20} />BeautyBloom</div><div className="font-body text-xs text-stone-400 mt-0.5">Bloom with confidence</div></div>
      <div className="flex-1 overflow-y-auto px-3">
        {NAV.map((sec) => (
          <div key={sec.section} className="mb-4">
            <div className="font-body text-xs uppercase tracking-wide text-stone-400 px-3 mb-1.5">{sec.section}</div>
            {sec.items.map(([id, label, Icon]) => (
              <NavLink key={id} to={`/app/${id}`} onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) => `nav-item group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200 hover:translate-x-0.5 ${isActive ? "active bg-rose-50 text-rose-700" : "text-stone-600 hover:bg-stone-50"}`}>
                <span className="nav-indicator" />
                <Icon size={16} />{label}{id === "history" && data.historyModules.length > 0 ? ` (${data.historyModules.length})` : ""}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-stone-100">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-body text-sm">{(user.name || user.email)[0].toUpperCase()}</div>
          <div className="min-w-0"><div className="font-body text-sm text-stone-700 truncate">{user.name || "Your Profile"}</div><div className="font-body text-xs text-stone-400 truncate">{user.email}</div></div>
        </div>
        <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-body text-sm text-stone-500 hover:bg-stone-50 hover:text-rose-600 transition-colors"><LogOut size={15} />Sign Out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen navy-surface relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none"><ImageBackground scrim="dark" /></div>
      <div className="relative z-10 flex flex-col min-h-screen p-2 sm:p-3 md:p-6">
        <div className="flex-1 flex bg-gradient-to-br from-stone-50 to-rose-50/40 rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <aside className="hidden md:block w-72 shrink-0 border-r border-rose-100 bg-gradient-to-b from-white to-rose-50/50 overflow-y-auto"><SidebarContent /></aside>

          {mobileNavOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div className="absolute inset-0 bg-black/30 pop-in" onClick={() => setMobileNavOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-white to-rose-50/50 page-enter"><SidebarContent /></div>
            </div>
          )}

          <div className="relative flex-1 min-w-0 overflow-y-auto">
            <div className="md:hidden sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-stone-100 flex items-center justify-between px-4 py-3">
              <button onClick={() => setMobileNavOpen(true)} className="hover:scale-110 transition-transform"><Menu size={20} className="text-stone-600" /></button>
              <div className="flex items-center gap-1.5 font-display text-stone-800"><Flower2 size={16} className="text-rose-500" />BeautyBloom</div>
              <div className="w-5" />
            </div>
            <main className="relative max-w-4xl mx-auto px-5 md:px-10 py-8 md:py-10">
              <Outlet context={data} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
