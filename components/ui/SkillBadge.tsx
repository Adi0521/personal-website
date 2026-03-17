"use client";

import { motion } from "framer-motion";
import type { SkillItem } from "@/types";
import { cn } from "@/lib/cn";
import { useSound } from "@/hooks/useSound";

interface SkillBadgeProps {
  skill: SkillItem;
}

const proficiencyStyles = {
  core:       "border-accent-orange/50 text-accent-orange bg-accent-orange/10 hover:bg-accent-orange/20",
  proficient: "border-accent-blue/40 text-accent-blue bg-accent-blue/8 hover:bg-accent-blue/15",
  familiar:   "border-sand-300 text-sand-600 hover:border-sand-400 hover:text-sand-800",
};

export function SkillBadge({ skill }: SkillBadgeProps) {
  const { playSound } = useSound();
  const style = proficiencyStyles[skill.proficiency ?? "familiar"];

  return (
    <motion.span
      className={cn(
        "px-5 py-2.5 rounded-full text-base font-medium border cursor-default transition-all duration-200",
        style
      )}
      onHoverStart={() => playSound("hover")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {skill.name}
    </motion.span>
  );
}
