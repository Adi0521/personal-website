"use client";

import { SplineScene } from "./SplineScene";
import { SPLINE_SCENES } from "@/lib/spline-events";

export function ServerSpline() {
  return (
    <div className="w-full h-full">
      <SplineScene url={SPLINE_SCENES.SERVER} interactive={false} />
    </div>
  );
}
