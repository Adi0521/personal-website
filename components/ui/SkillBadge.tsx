"use client";

import { motion } from "framer-motion";
import type { SkillItem } from "@/types";
import { cn } from "@/lib/cn";
import { useSound } from "@/hooks/useSound";

interface SkillBadgeProps {
  skill: SkillItem;
}

const proficiencyStyles = {
  core: "border-sunset-orange/40 text-sunset-orange bg-sunset-orange/10 hover:bg-sunset-orange/20",
  proficient: "border-sunset-pink/30 text-sunset-pink/80 bg-sunset-pink/5 hover:bg-sunset-pink/10",
  familiar: "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60",
};

export function SkillBadge({ skill }: SkillBadgeProps) {
  const { playSound } = useSound();
  const style = proficiencyStyles[skill.proficiency ?? "familiar"];

  return (
    <motion.span
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium border cursor-default transition-all duration-200",
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
