"use client";

import { SplineScene } from "./SplineScene";
import { SPLINE_SCENES } from "@/lib/spline-events";

export function NeuronSpline() {
  return (
    <div className="w-full h-full">
      <SplineScene url={SPLINE_SCENES.NEURON_SPIKE} interactive={false} />
    </div>
  );
}
