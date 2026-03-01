"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SectionWrapper, itemVariants } from "@/components/ui/SectionWrapper";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { projects } from "@/data/projects";
import type { ProjectItem } from "@/types";
import { useSound } from "@/hooks/useSound";

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSound();

  const scroll = (dir: "left" | "right") => {
    playSound("click");
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
  };

  return (
    <SectionWrapper id="projects" className="py-32">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.p
          variants={itemVariants}
          className="text-sunset-orange font-mono text-sm tracking-widest uppercase mb-4"
        >
          What I&apos;ve Built
        </motion.p>
        <div className="flex items-end justify-between">
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Projects
          </motion.h2>

          {/* Scroll arrows */}
          <div className="flex gap-2">
            {["left", "right"].map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir as "left" | "right")}
                onMouseEnter={() => playSound("hover")}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-sunset-orange text-white/60 hover:text-sunset-orange flex items-center justify-center transition-all"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-scroll scrollbar-hide pl-6 pr-6 pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {projects.map((project) => (
          <div key={project.id} style={{ scrollSnapAlign: "start" }}>
            <ProjectCard
              project={project}
              onClick={() => setActiveProject(project)}
            />
          </div>
        ))}

        {/* Coming soon card */}
        <div
          className="w-80 md:w-96 h-[500px] shrink-0 rounded-3xl border border-dashed border-white/10 flex items-center justify-center"
          style={{ scrollSnapAlign: "start" }}
        >
          <p className="text-white/20 text-center text-sm">
            More coming soon...
          </p>
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </SectionWrapper>
  );
}
