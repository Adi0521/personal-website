"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ProjectItem } from "@/types";
import { MiniCarSpline } from "@/components/spline/MiniCarSpline";
import { ProteinSpline } from "@/components/spline/ProteinSpline";
import { useSplineHover } from "@/hooks/useSplineHover";
import { useSound } from "@/hooks/useSound";

interface ProjectCardProps {
  project: ProjectItem;
  onClick: () => void;
}

function CardSplineScene({ project }: { project: ProjectItem }) {
  const { handleSplineLoad, handleMouseEnter, handleMouseLeave } =
    useSplineHover(project.splineHoverObject);

  const scene =
    project.splineScene === "MINI_CAR" ? (
      <MiniCarSpline onLoad={handleSplineLoad} />
    ) : project.splineScene === "PROTEIN" ? (
      <ProteinSpline onLoad={handleSplineLoad} />
    ) : null;

  return (
    <div className="w-full h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {scene}
    </div>
  );
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const { playSound } = useSound();

  return (
    <motion.div
      className="relative w-80 md:w-96 h-[500px] shrink-0 rounded-3xl overflow-hidden cursor-pointer border-2 border-sand-300 hover:border-accent-orange/50 transition-colors duration-300"
      style={{ background: "#EDE8DC" }}
      onHoverStart={() => { setHovered(true); playSound("hover"); }}
      onHoverEnd={() => setHovered(false)}
      onClick={() => { playSound("click"); onClick(); }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      {/* 3D scene fills top 60% of card */}
      <div className="absolute inset-0">
        <CardSplineScene project={project} />
      </div>

      {/* Light gradient from bottom so text reads cleanly */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to top, rgba(237,232,220,1) 0%, rgba(237,232,220,0.85) 45%, rgba(237,232,220,0.1) 100%)`,
          opacity: hovered ? 0.92 : 1,
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-accent-orange font-mono text-xs tracking-widest uppercase mb-2">
          Project
        </p>
        <h3
          className="text-2xl font-bold text-sand-900 mb-2"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {project.title}
        </h3>
        <p className="text-sand-600 text-sm leading-relaxed mb-4">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.techTags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-sand-300 text-sand-700">
              {tag}
            </span>
          ))}
          {project.techTags.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-sand-300 text-sand-500">
              +{project.techTags.length - 4}
            </span>
          )}
        </div>

        <motion.div
          className="mt-4 flex items-center gap-1 text-accent-orange text-sm font-medium"
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Click to explore ↗
        </motion.div>
      </div>
    </motion.div>
  );
}
