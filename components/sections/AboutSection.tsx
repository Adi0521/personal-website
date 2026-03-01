"use client";

import { motion } from "framer-motion";
import { SectionWrapper, itemVariants } from "@/components/ui/SectionWrapper";
import { SoundButton } from "@/components/ui/SoundButton";
import { education } from "@/data/education";

export function AboutSection() {
  return (
    <SectionWrapper id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <motion.p
            variants={itemVariants}
            className="text-sunset-orange font-mono text-sm tracking-widest uppercase mb-4"
          >
            About me
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Builder.
            <br />
            Researcher.
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #f97316, #ec4899)",
              }}
            >
              Curious human.
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-white/70 text-lg leading-relaxed mb-6"
          >
            I&apos;m a sophomore at UIUC studying Computer Science and
            Bioengineering. I spend my time building things that sit at the edge
            of what software can do — inference engines that squeeze milliseconds
            out of AI pipelines, models that read brain signals, and simulations
            that predict how proteins fold.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-white/60 text-lg leading-relaxed"
          >
            Outside of code and research, I&apos;m involved in Neurotech@UIUC,
            designing electric vehicle concepts, and working with MADE to push
            the boundaries of medical technology.
          </motion.p>
        </div>

        {/* Student orgs + quick stats */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
              Student Organizations
            </p>
            <div className="flex flex-wrap gap-3">
              {education.activities.map((org) => (
                <SoundButton
                  key={org}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white/80 hover:border-sunset-orange hover:text-sunset-orange transition-all duration-300 cursor-default"
                >
                  {org}
                </SoundButton>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            {[
              { label: "GPA", value: "3.88" },
              { label: "Grad Year", value: "2028" },
              { label: "Roles", value: "5+" },
              { label: "Projects", value: "10+" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-2xl border border-white/10 bg-white/5"
              >
                <p
                  className="text-3xl font-bold text-transparent bg-clip-text mb-1"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f97316, #ec4899)",
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  {value}
                </p>
                <p className="text-white/50 text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
