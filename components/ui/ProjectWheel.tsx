"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import type { ProjectItem } from "@/types";
import { useSound } from "@/hooks/useSound";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { projects } from "@/data/projects";

// ── Wheel geometry ────────────────────────────────────────────────────────────

const CARD_W = 320;
const CARD_H = 440;
const RADIUS = 450;       // cylinder radius (px)
const PERSPECTIVE = 1000; // camera distance (px)
const TOTAL_SLOTS = 7;
const N = TOTAL_SLOTS;
const STEP = 360 / N;     // degrees per slot

const SPRING_OPT = { type: "spring" as const, stiffness: 260, damping: 30 };

function snapToSlot(raw: number) {
  return Math.round(raw / STEP) * STEP;
}

/** Returns which card index is facing the viewer given current cylinder rotation. */
function activeIndexFrom(angle: number) {
  return ((Math.round(-angle / STEP) % N) + N) % N;
}

// ── Wheel card window ─────────────────────────────────────────────────────────

function WheelCard({
  project,
  isActive,
  onClick,
}: {
  project: ProjectItem | null;
  isActive: boolean;
  onClick: () => void;
}) {
  const { playSound } = useSound();

  if (!project) {
    return (
      <div
        className="w-full h-full rounded-2xl flex items-center justify-center"
        style={{
          border: "2px dashed rgba(196,187,168,0.6)",
          background: "rgba(237,232,220,0.5)",
        }}
      >
        <p className="text-sand-400 text-sm text-center px-8">More coming soon...</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "linear-gradient(155deg, #F5F0E8 0%, #DDD7C8 100%)",
        border: `2px solid ${isActive ? "rgba(232,114,12,0.55)" : "rgba(196,187,168,0.55)"}`,
        boxShadow: isActive
          ? "0 24px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)"
          : "0 8px 28px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onClick={() => { playSound("click"); onClick(); }}
      onMouseEnter={() => playSound("hover")}
    >
      {/* Top gradient band */}
      <div
        className="absolute top-0 left-0 right-0 h-52 pointer-events-none"
        style={{
          background:
            "linear-gradient(155deg, rgba(232,114,12,0.13) 0%, rgba(59,158,217,0.10) 100%)",
        }}
      />

      {/* Window-frame corner bolts */}
      {(["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"] as const).map(
        (pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2 h-2 rounded-full pointer-events-none`}
            style={{ background: "rgba(154,132,104,0.5)" }}
          />
        )
      )}

      {/* Content — pinned to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col">
        <p className="text-accent-orange font-mono text-xs tracking-widest uppercase mb-2">
          Project
        </p>

        <h3
          className="text-2xl font-bold text-sand-900 mb-3 leading-snug"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {project.title}
        </h3>

        <p className="text-sand-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-md text-sand-700"
              style={{ background: "rgba(196,187,168,0.5)" }}
            >
              {tag}
            </span>
          ))}
          {project.techTags.length > 4 && (
            <span
              className="px-2 py-0.5 text-xs rounded-md text-sand-500"
              style={{ background: "rgba(196,187,168,0.35)" }}
            >
              +{project.techTags.length - 4}
            </span>
          )}
        </div>

        <p className="text-accent-orange text-xs font-medium group-hover:underline transition-all">
          Click to explore ↗
        </p>
      </div>
    </div>
  );
}

// ── Nav arrow button ──────────────────────────────────────────────────────────

function ArrowButton({
  onClick,
  direction,
}: {
  onClick: () => void;
  direction: "left" | "right";
}) {
  const { playSound } = useSound();
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => playSound("hover")}
      className="w-12 h-12 shrink-0 rounded-full border-2 border-sand-300 hover:border-accent-orange text-sand-500 hover:text-accent-orange flex items-center justify-center transition-all duration-200"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// ── Main wheel component ──────────────────────────────────────────────────────

export function ProjectWheel() {
  const [activeModal, setActiveModal] = useState<ProjectItem | null>(null);
  const [snapped, setSnapped] = useState(0); // snapped angle — used for activeIndex

  // Raw angle MotionValue: set directly on drag, spring-animated on release
  const angle = useMotionValue(0);

  const dragOrigin = useRef(0);
  const hasPanned = useRef(false);

  const activeIndex = activeIndexFrom(snapped);

  const rotateTo = useCallback(
    (raw: number) => {
      const s = snapToSlot(raw);
      setSnapped(s);
      animate(angle, s, SPRING_OPT);
    },
    [angle]
  );

  const prev = () => rotateTo(snapped + STEP);
  const next = () => rotateTo(snapped - STEP);

  // Pad with nulls to fill TOTAL_SLOTS
  const wheelItems: (typeof projects[number] | null)[] = [
    ...projects,
    ...Array(TOTAL_SLOTS - projects.length).fill(null),
  ];

  return (
    <>
      <div className="relative flex items-center justify-center gap-6 py-12 select-none">
        <ArrowButton onClick={prev} direction="left" />

        {/* Perspective viewport */}
        <div
          style={{
            perspective: PERSPECTIVE,
            perspectiveOrigin: "50% 50%",
            width: CARD_W,
            height: CARD_H,
            position: "relative",
          }}
        >
          {/* Cylinder — translateZ back so front card sits at z=0 (1× apparent size) */}
          <motion.div
            style={{
              width: CARD_W,
              height: CARD_H,
              transformStyle: "preserve-3d",
              rotateY: angle,
              translateZ: -RADIUS,
              cursor: "grab",
            }}
            whileTap={{ cursor: "grabbing" }}
            onPanStart={() => {
              dragOrigin.current = angle.get();
              hasPanned.current = false;
            }}
            onPan={(_, info) => {
              hasPanned.current = Math.abs(info.offset.x) > 8;
              angle.set(dragOrigin.current + info.offset.x * 0.28);
            }}
            onPanEnd={(_, info) => {
              rotateTo(dragOrigin.current + info.offset.x * 0.28);
            }}
          >
            {wheelItems.map((project, i) => {
              const cardAngle = i * STEP;
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={project?.id ?? `empty-${i}`}
                  animate={{ opacity: isActive ? 1 : 0.38 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    position: "absolute",
                    width: CARD_W,
                    height: CARD_H,
                    transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                  }}
                >
                  <WheelCard
                    project={project}
                    isActive={isActive}
                    onClick={() => {
                      if (hasPanned.current) return;
                      // If clicking a non-active card, rotate to it instead of opening modal
                      if (!isActive) {
                        const delta = -cardAngle - snapped;
                        const normalized = ((delta % 360) + 540) % 360 - 180;
                        rotateTo(snapped + normalized);
                        return;
                      }
                      if (project) setActiveModal(project);
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <ArrowButton onClick={next} direction="right" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 pb-4">
        {wheelItems.map((_, i) => (
          <button
            key={i}
            onClick={() => rotateTo(-i * STEP)}
            className="transition-all duration-300"
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i === activeIndex ? "rgb(232,114,12)" : "rgba(196,187,168,0.7)",
            }}
          />
        ))}
      </div>

      <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}
