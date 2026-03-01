"use client";

import { motion } from "framer-motion";
import { HeroSpline } from "@/components/spline/HeroSpline";
import { useSound } from "@/hooks/useSound";

export function HeroSection() {
  const { playSound } = useSound();

  const scrollToAbout = () => {
    playSound("click");
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroSpline />
      </div>

      {/* Gradient overlay so text is readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-deep-blue/60 via-transparent to-deep-blue/80" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          className="text-sunset-orange font-mono text-sm tracking-widest uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          CS + Bioengineering @ UIUC
        </motion.p>

        <motion.h1
          className="text-7xl md:text-9xl font-bold leading-none tracking-tight mb-6"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-white">Aditya</span>
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #f97316, #ec4899)",
            }}
          >
            Kewalram
          </span>
        </motion.h1>

        <motion.p
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
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
            className="px-8 py-3 rounded-full font-semibold text-white border border-white/20 hover:border-sunset-orange hover:text-sunset-orange transition-all duration-300"
          >
            Explore
          </button>
          <a
            href="mailto:adi.kewalram@gmail.com"
            onMouseEnter={() => playSound("hover")}
            onClick={() => playSound("click")}
            className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #f97316, #ec4899)",
            }}
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        onMouseEnter={() => playSound("hover")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
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
