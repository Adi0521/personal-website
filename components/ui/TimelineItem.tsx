"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/components/ui/SectionWrapper";
import type { ExperienceItem } from "@/types";
import { cn } from "@/lib/cn";

interface TimelineItemProps {
  item: ExperienceItem;
  index: number;
}

export function TimelineItem({ item, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <div className={cn("relative flex gap-8 md:gap-0 items-start", isLeft ? "md:flex-row" : "md:flex-row-reverse")}>
      {/* Content card */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: isLeft ? -40 : 40 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="md:w-[calc(50%-2rem)] p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors duration-300"
      >
        <div className="flex items-start justify-between mb-3 gap-4 flex-wrap">
          <div>
            <h3
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {item.role}
            </h3>
            <p className="text-sunset-orange font-medium">{item.company}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/50 text-sm">{item.period}</p>
            <p className="text-white/30 text-xs">{item.location}</p>
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {item.description.map((bullet, i) => (
            <li key={i} className="text-white/60 text-sm leading-relaxed flex gap-2">
              <span className="text-sunset-pink mt-1 shrink-0">▸</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {item.techTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/50 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center w-16 shrink-0 relative">
        <div className={cn("w-4 h-4 rounded-full mt-6 ring-4 ring-deep-blue z-10", item.accentColor)} />
      </div>

      {/* Empty space on other side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}
