"use client";

import { motion } from "framer-motion";
import { SectionWrapper, itemVariants } from "@/components/ui/SectionWrapper";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <SectionWrapper id="experience" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            variants={itemVariants}
            className="text-sunset-orange font-mono text-sm tracking-widest uppercase mb-4"
          >
            Work & Research
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Experience
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />

          <div className="space-y-12">
            {experience.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
