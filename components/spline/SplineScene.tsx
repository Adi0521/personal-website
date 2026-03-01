"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SplineFallback />,
});

type SplineApp = {
  emitEvent: (event: string, objectName: string) => void;
};

interface SplineSceneProps {
  url: string;
  onLoad?: (app: SplineApp) => void;
  className?: string;
  interactive?: boolean;
}

export function SplineScene({
  url,
  onLoad,
  className,
  interactive = true,
}: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Only mount once this element is near the viewport
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -150px 0px",
  });

  const handleLoad = useCallback(
    (app: SplineApp) => {
      setIsLoaded(true);
      onLoad?.(app);
    },
    [onLoad]
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      {!isLoaded && <SplineFallback />}
      {isInView && (
        <Spline
          scene={url}
          onLoad={handleLoad as (app: unknown) => void}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
}

function SplineFallback() {
  return (
    <div className="w-full h-full animate-pulse bg-gradient-to-br from-sunset-orange/10 via-deep-blue-mid to-sunset-pink/10 rounded-xl" />
  );
}
