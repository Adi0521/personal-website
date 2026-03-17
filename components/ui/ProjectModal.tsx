"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectItem } from "@/types";
import { MiniCarSpline } from "@/components/spline/MiniCarSpline";
import { ProteinSpline } from "@/components/spline/ProteinSpline";
import { useSplineHover } from "@/hooks/useSplineHover";
import { useSound } from "@/hooks/useSound";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

function ProjectSplineScene({ project }: { project: ProjectItem }) {
  const { handleSplineLoad } = useSplineHover(project.splineHoverObject);

  if (project.splineScene === "MINI_CAR") return <MiniCarSpline onLoad={handleSplineLoad} />;
  if (project.splineScene === "PROTEIN") return <ProteinSpline onLoad={handleSplineLoad} />;
  return null;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { playSound } = useSound();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { playSound("click"); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, playSound]);

  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === overlayRef.current) { playSound("click"); onClose(); } }}
          style={{ background: "rgba(245, 240, 232, 0.88)", backdropFilter: "blur(16px)" }}
        >
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden border-2 border-sand-300 flex flex-col md:flex-row"
            style={{ background: "#F5F0E8" }}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {/* Close button */}
            <button
              onClick={() => { playSound("click"); onClose(); }}
              onMouseEnter={() => playSound("hover")}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-sand-300 hover:bg-sand-400 flex items-center justify-center text-sand-600 hover:text-sand-900 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* 3D scene — stays mounted and playing */}
            <div className="w-full md:w-1/2 h-64 md:h-auto shrink-0 bg-sand-200">
              <ProjectSplineScene project={project} />
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <p className="text-accent-orange font-mono text-xs tracking-widest uppercase mb-2">
                Project
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-sand-900 mb-4"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {project.title}
              </h2>

              <div className="space-y-3 mb-6">
                {project.fullDescription.map((para, i) => (
                  <p key={i} className="text-sand-700 leading-relaxed">{para}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.techTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full border border-sand-300 text-sand-600 bg-sand-200">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => playSound("click")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-sand-300 text-sand-800 hover:border-accent-orange hover:text-accent-orange transition-all text-sm font-medium"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => playSound("click")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #E8720C, #3B9ED9)" }}
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
