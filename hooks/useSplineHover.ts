"use client";

import { useRef, useCallback } from "react";
import { SPLINE_EVENTS } from "@/lib/spline-events";

type SplineApp = {
  emitEvent: (event: string, objectName: string) => void;
};

export function useSplineHover(objectName: string) {
  const appRef = useRef<SplineApp | null>(null);

  const handleSplineLoad = useCallback((app: SplineApp) => {
    appRef.current = app;
  }, []);

  const handleMouseEnter = useCallback(() => {
    appRef.current?.emitEvent(SPLINE_EVENTS.MOUSE_HOVER, objectName);
  }, [objectName]);

  const handleMouseLeave = useCallback(() => {
    appRef.current?.emitEvent(SPLINE_EVENTS.MOUSE_LEAVE, objectName);
  }, [objectName]);

  return { handleSplineLoad, handleMouseEnter, handleMouseLeave };
}
