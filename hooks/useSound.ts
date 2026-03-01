"use client";

import { useSoundContext } from "@/components/providers/SoundProvider";

export function useSound() {
  return useSoundContext();
}
