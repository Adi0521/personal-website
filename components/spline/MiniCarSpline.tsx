"use client";

import { SplineScene } from "./SplineScene";
import { SPLINE_SCENES } from "@/lib/spline-events";

type SplineApp = { emitEvent: (event: string, objectName: string) => void };

interface MiniCarSplineProps {
  onLoad?: (app: SplineApp) => void;
}

export function MiniCarSpline({ onLoad }: MiniCarSplineProps) {
  return (
    <div className="w-full h-full">
      <SplineScene url={SPLINE_SCENES.MINI_CAR} onLoad={onLoad} />
    </div>
  );
}
