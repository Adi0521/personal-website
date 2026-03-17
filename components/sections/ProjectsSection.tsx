"use client";

import { motion } from "framer-motion";
import { SectionWrapper, itemVariants } from "@/components/ui/SectionWrapper";
import { ProjectWheel } from "@/components/ui/ProjectWheel";

export function ProjectsSection() {
  return (
    <SectionWrapper id="projects" className="py-24 px-6 overflow-visible">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 text-center">
        <motion.p
          variants={itemVariants}
          className="text-accent-orange font-mono text-sm tracking-widest uppercase mb-4"
        >
          What I&apos;ve Built
        </motion.p>
        <motion.h2
          variants={itemVariants}
          className="heading-block text-5xl md:text-6xl"
        >
          PROJECTS
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-sand-500 text-sm mt-3"
        >
          Drag the wheel or use the arrows to browse
        </motion.p>
      </div>

      {/* 3D Wheel */}
      <ProjectWheel />
    </SectionWrapper>
  );
}
