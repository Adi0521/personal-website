"use client";

import { SplineScene } from "./SplineScene";
import { SPLINE_SCENES } from "@/lib/spline-events";

type SplineApp = { emitEvent: (event: string, objectName: string) => void };

interface ProteinSplineProps {
  onLoad?: (app: SplineApp) => void;
}

export function ProteinSpline({ onLoad }: ProteinSplineProps) {
  return (
    <div className="w-full h-full">
      <SplineScene url={SPLINE_SCENES.PROTEIN} onLoad={onLoad} />
    </div>
  );
}
