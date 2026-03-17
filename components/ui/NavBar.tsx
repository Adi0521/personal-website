"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function NavBar() {
  const activeSection = useActiveSection();
  const { muted, toggleMute, playSound } = useSound();

  const scrollTo = (id: string) => {
    playSound("click");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.5 }}
      style={{
        background: "linear-gradient(to bottom, rgba(245, 240, 232, 0.96), rgba(245, 240, 232, 0))",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => scrollTo("hero")}
        onMouseEnter={() => playSound("hover")}
        className="font-bold text-xl tracking-tight text-sand-900 hover:text-accent-orange transition-colors"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        AK
      </button>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              onMouseEnter={() => playSound("hover")}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors relative",
                activeSection === id
                  ? "text-accent-orange"
                  : "text-sand-600 hover:text-sand-900"
              )}
            >
              {label}
              {activeSection === id && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-orange rounded-full"
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Mute toggle */}
      <button
        onClick={() => { toggleMute(); playSound("click"); }}
        onMouseEnter={() => playSound("hover")}
        className="text-sand-500 hover:text-sand-900 transition-colors p-2"
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      >
        {muted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </motion.nav>
  );
}
