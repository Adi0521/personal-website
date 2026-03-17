"use client";

import { useScroll, useTransform, motion } from "framer-motion";

// SVG dune paths — each is a filled silhouette of sand dunes spanning 1440px wide
const DUNE_PATHS = {
  // Back layer: gentle, long rolling waves
  back: "M0,380 C180,340 360,420 540,370 C720,320 900,400 1080,360 C1260,320 1380,370 1440,350 L1440,900 L0,900 Z",
  // Mid-back: slightly more defined
  midBack: "M0,430 C120,390 280,470 460,420 C640,370 800,450 960,400 C1120,350 1300,420 1440,390 L1440,900 L0,900 Z",
  // Mid-front: pronounced dune crests
  midFront: "M0,490 C100,450 240,530 400,475 C560,420 700,510 880,455 C1060,400 1220,480 1440,445 L1440,900 L0,900 Z",
  // Front layer: sharp, close dunes
  front: "M0,560 C80,510 200,600 360,540 C520,480 660,570 820,510 C980,450 1140,540 1300,490 C1380,465 1420,475 1440,470 L1440,900 L0,900 Z",
};

export function SandBackground() {
  const { scrollY, scrollYProgress } = useScroll();

  // Background color deepens from bright sand to warm amber as you scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    ["#FDFAF4", "#F5F0E8", "#EDE8DC", "#DDD7C8"]
  );

  // Each dune layer translates at a different rate — front moves fastest (parallax depth)
  const yBack     = useTransform(scrollY, (v) => v * -0.02);
  const yMidBack  = useTransform(scrollY, (v) => v * -0.05);
  const yMidFront = useTransform(scrollY, (v) => v * -0.10);
  const yFront    = useTransform(scrollY, (v) => v * -0.18);

  return (
    <>
      {/* Animated background color */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor }}
      />

      {/* Dune layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Layer 4 — back */}
        <motion.div className="absolute inset-0" style={{ y: yBack }}>
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <path d={DUNE_PATHS.back} fill="rgba(196,187,168,0.28)" />
          </svg>
        </motion.div>

        {/* Layer 3 — mid-back */}
        <motion.div className="absolute inset-0" style={{ y: yMidBack }}>
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <path d={DUNE_PATHS.midBack} fill="rgba(196,187,168,0.42)" />
          </svg>
        </motion.div>

        {/* Layer 2 — mid-front */}
        <motion.div className="absolute inset-0" style={{ y: yMidFront }}>
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <path d={DUNE_PATHS.midFront} fill="rgba(196,187,168,0.58)" />
          </svg>
        </motion.div>

        {/* Layer 1 — front (fastest parallax) */}
        <motion.div className="absolute inset-0" style={{ y: yFront }}>
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <path d={DUNE_PATHS.front} fill="rgba(156,132,104,0.48)" />
          </svg>
        </motion.div>
      </div>

    </>
  );
}
