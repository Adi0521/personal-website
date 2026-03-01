"use client";

import { SplineScene } from "./SplineScene";
import { SPLINE_SCENES } from "@/lib/spline-events";

export function HeroSpline() {
  return (
    <div className="w-full h-full">
      <SplineScene url={SPLINE_SCENES.HERO_NEURAL} interactive={false} />
    </div>
  );
}
