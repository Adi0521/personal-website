"use client";

import { motion } from "framer-motion";
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
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
          },
        }}
        className="md:w-[calc(50%-2rem)] p-6 rounded-2xl border-2 border-sand-300 bg-sand-100 hover:border-accent-orange/40 transition-colors duration-300"
      >
        <div className="flex items-start justify-between mb-3 gap-4 flex-wrap">
          <div>
            <h3
              className="text-xl font-bold text-sand-900"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {item.role}
            </h3>
            <p className="text-accent-orange font-medium">{item.company}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sand-600 text-sm">{item.period}</p>
            <p className="text-sand-400 text-xs">{item.location}</p>
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {item.description.map((bullet, i) => (
            <li key={i} className="text-sand-700 text-sm leading-relaxed flex gap-2">
              <span className="text-accent-blue mt-1 shrink-0">▸</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {item.techTags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 text-sm rounded-full bg-sand-200 text-sand-600 border border-sand-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center w-16 shrink-0 relative">
        <div className={cn("w-4 h-4 rounded-full mt-6 ring-4 ring-sand-200 z-10", item.accentColor)} />
      </div>

      {/* Empty space on other side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}
