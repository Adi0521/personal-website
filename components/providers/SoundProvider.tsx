"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
} from "react";

type SoundKey = "hover" | "click" | "reveal";

interface SoundContextValue {
  playSound: (key: SoundKey) => void;
  muted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  playSound: () => {},
  muted: false,
  toggleMute: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  // Howl instances are created lazily on first call (browser autoplay policy)
  const howlsRef = useRef<Record<string, unknown>>({});
  const lastPlayRef = useRef<Record<string, number>>({});

  const playSound = useCallback(
    async (key: SoundKey) => {
      if (muted) return;

      // Throttle hover sounds to 150ms
      const now = Date.now();
      if (key === "hover" && now - (lastPlayRef.current[key] ?? 0) < 150) return;
      lastPlayRef.current[key] = now;

      // Lazy-load Howler on first sound (after user gesture)
      if (!howlsRef.current[key]) {
        const { Howl } = await import("howler");
        const src: Record<SoundKey, string> = {
          hover: "/sounds/hover.mp3",
          click: "/sounds/click.mp3",
          reveal: "/sounds/reveal.mp3",
        };
        howlsRef.current[key] = new Howl({
          src: [src[key]],
          volume: key === "hover" ? 0.15 : key === "reveal" ? 0.25 : 0.3,
        });
      }

      (howlsRef.current[key] as { play: () => void }).play();
    },
    [muted]
  );

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return (
    <SoundContext.Provider value={{ playSound, muted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
