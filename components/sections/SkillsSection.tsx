"use client";

import { motion } from "framer-motion";
import { SectionWrapper, itemVariants } from "@/components/ui/SectionWrapper";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { skills } from "@/data/skills";

export function SkillsSection() {
  return (
    <SectionWrapper id="skills" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            variants={itemVariants}
            className="text-accent-orange font-mono text-sm tracking-widest uppercase mb-4"
          >
            Tech Stack
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="heading-block text-5xl md:text-6xl"
          >
            SKILLS
          </motion.h2>
        </div>

        <div className="space-y-10">
          {skills.map((category) => (
            <motion.div key={category.category} variants={itemVariants}>
              <p className="text-sand-400 text-xs uppercase tracking-widest mb-4">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-6 text-xs text-sand-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-orange" /> Core
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-blue" /> Proficient
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sand-400" /> Familiar
          </span>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
