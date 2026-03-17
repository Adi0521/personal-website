"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { OceanWaves } from "@/components/ui/OceanWaves";
import { useSound } from "@/hooks/useSound";

// Sine terms that define the wave-shaped clip-path at the hero's bottom edge.
// Irrational frequency/speed ratios → never repeats.
const CLIP_TERMS = [
  { f: 0.61, a: 2.6, s: 0.90, p: 0.00 },
  { f: 1.41, a: 1.5, s: 1.31, p: 1.13 },
  { f: 2.73, a: 0.9, s: 0.67, p: 2.71 },
  { f: 5.18, a: 0.5, s: 1.84, p: 0.54 },
  { f: 9.55, a: 0.25, s: 2.53, p: 1.77 },
];
const CLIP_STEPS  = 80;   // polygon points along the bottom edge
const CLIP_BASE   = 93;   // base y-position as % of section height
const CLIP_MARGIN = 4;    // extra % below 100% to ensure no gap on resize

export function HeroSection() {
  const { playSound } = useSound();
  const sectionRef  = useRef<HTMLElement>(null);
  const rafRef      = useRef<number>(0);
  const elapsedRef  = useRef(0);


  // Animate the clip-path polygon so the bottom of the hero is a live wave
  // rather than a straight horizontal line.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let prev: number | null = null;

    const tick = (ts: number) => {
      const dt = prev === null ? 0 : Math.min((ts - prev) / 1000, 0.05);
      prev = ts;
      elapsedRef.current += dt;
      const t = elapsedRef.current;

      // Build bottom wave: sweep right-to-left so the polygon closes neatly.
      // Points: top-left → top-right → wave from right to left
      const pts: string[] = ["0% 0%", "100% 0%"];

      for (let i = CLIP_STEPS; i >= 0; i--) {
        const xFrac = i / CLIP_STEPS;
        let y = CLIP_BASE;
        for (const term of CLIP_TERMS) {
          y += term.a * Math.sin(xFrac * Math.PI * 2 * term.f + t * term.s + term.p);
        }
        pts.push(`${(xFrac * 100).toFixed(1)}% ${Math.min(100 + CLIP_MARGIN, y).toFixed(2)}%`);
      }

      section.style.clipPath = `polygon(${pts.join(", ")})`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const scrollToAbout = () => {
    playSound("click");
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ocean background */}
      <div className="absolute inset-0 z-0">
        <OceanWaves />
      </div>

      {/* Very light top-only vignette — keeps tagline legible */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-transparent to-transparent" />

      {/* Content — centred in the upper 80% so it stays above the wave clip */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto -translate-y-16">
        <motion.p
          className="text-accent-orange font-mono text-sm tracking-widest uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          CS + Bioengineering @ UIUC
        </motion.p>

        <motion.h1
          className="leading-none mb-6 select-none"
          style={{
            fontFamily: "'Clash Display', 'Impact', 'Arial Black', sans-serif",
            fontSize: "clamp(4rem, 13vw, 9rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#FFBB7A",
            textShadow: [
              "2px 2px 0 #B84D00",
              "4px 4px 0 #A34300",
              "6px 6px 0 #8F3A00",
              "8px 8px 0 #7A3100",
              "10px 10px 0 #662900",
              "12px 12px 0 #522200",
              "14px 14px 0 rgba(50,20,0,0.3)",
            ].join(", "),
          }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          ADITYA
          <br />
          KEWALRAM
        </motion.h1>

        <motion.p
          className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Building at the intersection of software and biology — from autonomous
          vehicles and LLM inference engines to computational neuroscience and
          protein modeling.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={scrollToAbout}
            onMouseEnter={() => playSound("hover")}
            className="px-10 py-4 rounded-full text-lg font-semibold text-blue-100 border-2 border-blue-300/40 hover:border-accent-orange hover:text-accent-orange transition-all duration-300"
          >
            Explore
          </button>
          <a
            href="mailto:adi.kewalram@gmail.com"
            onMouseEnter={() => playSound("hover")}
            onClick={() => playSound("click")}
            className="px-10 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #E8720C, #3B9ED9)" }}
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — high enough to stay above the wave clip */}
      <motion.button
        onClick={scrollToAbout}
        onMouseEnter={() => playSound("hover")}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
