import React from "react";
import { motion } from "framer-motion";

export function ImageBackground({ scrim = "dark", className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="site-bg-image" style={{ "--site-bg-url": "url(/bg.jpg)" }} />
      <div className={scrim === "light" ? "site-bg-scrim-light" : "site-bg-scrim"} />
    </div>
  );
}

/* Scroll-reveal animation (Framer Motion). */
export function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const Pill = ({ children, active, onClick, tone = "rose" }) => {
  const toneClass = { rose: "rose", emerald: "gold", amber: "gold", stone: "stone" }[tone] || "rose";
  return (
    <button onClick={onClick} className={`pill px-3 py-1.5 rounded-full text-sm border hover:scale-105 active:scale-95 pill-${toneClass}${active ? `-active` : ""} ${onClick ? "cursor-pointer" : "cursor-default"}`}>
      {children}
    </button>
  );
};

export const ClayCard = ({ children, className = "", noLift = false }) => (
  <div className={`clay-card ${noLift ? "" : "lift"} ${className}`}>{children}</div>
);

export const SectionTitle = ({ eyebrow, title, sub }) => (
  <div className="mb-6">
    {eyebrow && <div className="font-body text-xs font-semibold uppercase tracking-widest text-brand-eyebrow mb-1.5">{eyebrow}</div>}
    <h2 className="font-display text-2xl md:text-3xl text-stone-800">{title}</h2>
    {sub && <p className="font-body text-stone-500 mt-1 max-w-xl">{sub}</p>}
  </div>
);
