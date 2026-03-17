"use client";

import { useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────

const SAND_COLOR   = "#F5F0E8";
const SHORE_START  = 0.60; // below this y-fraction the wave starts growing
const FOAM_START   = 0.76; // below this y-fraction white crest & foam appear
const NUM_SWELLS   = 11;

// ── Types ──────────────────────────────────────────────────────────────────────

interface Swell {
  y: number;        // 0–1 fraction of canvas height (moves downward)
  speed: number;    // fraction of height per second
  phase: number;    // unique horizontal-shape seed
  amp: number;      // base horizontal irregularity amplitude (px)
  strength: number; // 0–1 visual prominence
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeSwell(forceY?: number): Swell {
  return {
    y:        forceY ?? -(0.05 + Math.random() * 0.15), // spawn just above top
    speed:    0.022 + Math.random() * 0.032,
    phase:    Math.random() * Math.PI * 2,
    amp:      10 + Math.random() * 18,
    strength: 0.35 + Math.random() * 0.65,
  };
}

/**
 * Horizontal crest profile for one swell at canvas-x.
 * t coefficients are tiny (< 0.12) so the shape evolves slowly — it does NOT
 * look like it's scrolling left/right, just gently morphing.
 */
function crestProfile(x: number, W: number, t: number, s: Swell): number {
  const p = s.phase;
  return (
    Math.sin((x / W) * Math.PI * 2 * 0.61  + p          + t * 0.055) * 0.38 +
    Math.sin((x / W) * Math.PI * 2 * 1.73  + p * 1.41   + t * 0.038) * 0.28 +
    Math.sin((x / W) * Math.PI * 2 * 3.14  + p * 0.77   + t * 0.082) * 0.17 +
    Math.sin((x / W) * Math.PI * 2 * 5.83  + p * 1.87   + t * 0.047) * 0.10 +
    Math.sin((x / W) * Math.PI * 2 * 10.24 + p * 0.53   + t * 0.103) * 0.05 +
    Math.sin((x / W) * Math.PI * 2 * 17.00 + p * 1.22   + t * 0.031) * 0.02
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function OceanWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Spread initial swells evenly down the canvas so it isn't empty on load
    const swells: Swell[] = Array.from({ length: NUM_SWELLS }, (_, i) =>
      makeSwell(i / NUM_SWELLS)
    );

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let prevTime: number | null = null;
    let elapsed = 0; // total elapsed seconds (for wave profile calcs)

    const draw = (ts: number) => {
      const dt = prevTime === null ? 0 : Math.min((ts - prevTime) / 1000, 0.05);
      prevTime = ts;
      elapsed += dt;

      const W = canvas.width;
      const H = canvas.height;
      const STEPS = Math.ceil(W / 3);

      ctx.clearRect(0, 0, W, H);

      // ── 1. Ocean background gradient (top-down depth) ───────────────────
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0.00, "#003A5C");  // deep open ocean
      bg.addColorStop(0.22, "#005278");
      bg.addColorStop(0.45, "#007090");
      bg.addColorStop(0.65, "#009BA0");  // turquoise shallows
      bg.addColorStop(0.82, "#30C8BC");  // very shallow — aquamarine
      bg.addColorStop(0.94, "#78E8DC");  // near-shore foam water
      bg.addColorStop(1.00, "#B8F4EE");  // lightest water (clip-path defines the actual edge)
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── 2. Subtle subsurface shimmer (sunlight refracting through water) ─
      const shimmer = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, W * 0.7);
      shimmer.addColorStop(0,   "rgba(200,240,255,0.10)");
      shimmer.addColorStop(0.6, "rgba(100,200,230,0.04)");
      shimmer.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, W, H);

      // ── 3. Each swell: downward-moving wave band ──────────────────────────
      // Sort back-to-front (lowest y drawn last = on top)
      const sorted = [...swells].sort((a, b) => a.y - b.y);

      for (const swell of sorted) {
        const baseY = swell.y * H;

        // How close to shore (0 = open water, 1 = shore)
        const prox = Math.max(0, (swell.y - SHORE_START) / (1 - SHORE_START));
        // Shoaling: amplitude grows as wave enters shallows
        const amp  = swell.amp * (1 + prox * 3.5);
        // Band thickness grows near shore (wave steepens)
        const band = (6 + prox * 50) * swell.strength;

        // ── upper & lower crest sample arrays ────────────────────────────
        const upperX: number[] = [];
        const upperY: number[] = [];
        const lowerX: number[] = [];
        const lowerY: number[] = [];

        for (let i = 0; i <= STEPS; i++) {
          const x = (i / STEPS) * W;
          const prof = crestProfile(x, W, elapsed, swell);
          upperX.push(x);
          upperY.push(baseY + prof * amp - band * 0.35);
          lowerX.push(x);
          lowerY.push(baseY + prof * amp + band * 0.65);
        }

        // ── wave body (gradient band) ─────────────────────────────────────
        // Colour transitions: subtle teal → bright turquoise → white
        const foamFrac = Math.max(0, (swell.y - FOAM_START) / (1 - FOAM_START));

        // Front of band color (leading crest edge)
        const cr = Math.round(lerp(40,  255, foamFrac));
        const cg = Math.round(lerp(195, 255, foamFrac));
        const cb = Math.round(lerp(210, 255, foamFrac));
        const ca = lerp(0.18, 0.85, foamFrac) * swell.strength;

        ctx.beginPath();
        for (let i = 0; i <= STEPS; i++) {
          i === 0 ? ctx.moveTo(upperX[i], upperY[i]) : ctx.lineTo(upperX[i], upperY[i]);
        }
        for (let i = STEPS; i >= 0; i--) {
          ctx.lineTo(lowerX[i], lowerY[i]);
        }
        ctx.closePath();

        const bandGrad = ctx.createLinearGradient(0, upperY[0], 0, lowerY[0]);
        bandGrad.addColorStop(0,    `rgba(${cr},${cg},${cb},0)`);
        bandGrad.addColorStop(0.25, `rgba(${cr},${cg},${cb},${ca})`);
        bandGrad.addColorStop(0.65, `rgba(${cr},${cg},${cb},${ca * 0.75})`);
        bandGrad.addColorStop(1,    `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = bandGrad;
        ctx.fill();

        // ── crest highlight line ──────────────────────────────────────────
        if (prox > 0.1) {
          ctx.beginPath();
          for (let i = 0; i <= STEPS; i++) {
            i === 0
              ? ctx.moveTo(upperX[i], upperY[i] + band * 0.35)
              : ctx.lineTo(upperX[i], upperY[i] + band * 0.35);
          }
          const lineAlpha = Math.min(1, prox * 1.6) * swell.strength;
          ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
          ctx.lineWidth   = 1.2 + foamFrac * 5;
          ctx.stroke();
        }

        // ── foam bubbles along the crest (only near shore) ───────────────
        if (foamFrac > 0.05) {
          const bubbleCount = Math.floor(8 + foamFrac * 30);
          for (let b = 0; b < bubbleCount; b++) {
            // stable position per-bubble: seeded from swell phase + index
            const seed  = swell.phase * 317.4 + b * 91.7;
            const bx    = ((Math.sin(seed) * 0.5 + 0.5) * W +
                           Math.sin(seed * 0.37 + elapsed * 0.4) * 12) % W;
            const prof  = crestProfile(bx, W, elapsed, swell);
            const by    = baseY + prof * amp + (Math.sin(seed * 1.7) * 0.5 + 0.5) * band * 0.4;
            const br    = 1.5 + foamFrac * 4 * (Math.sin(seed * 2.3) * 0.5 + 0.5);
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${foamFrac * 0.7 * swell.strength})`;
            ctx.fill();
          }
        }

        // ── advance swell downward ────────────────────────────────────────
        swell.y += swell.speed * dt;
        if (swell.y > 1.08) {
          Object.assign(swell, makeSwell());
        }
      }

      // ── 4. Shore foam band (crash zone) ──────────────────────────────────
      // Two overlapping foam tongues with chaotic ragged edges.
      for (let pass = 0; pass < 2; pass++) {
        const foamBase  = (0.83 + pass * 0.05) * H;
        const timeShift = pass * 1.57 + elapsed;

        ctx.beginPath();
        for (let i = 0; i <= STEPS; i++) {
          const x = (i / STEPS) * W;
          const edge =
            Math.sin((x / W) * Math.PI * 2 * 1.3  + timeShift * 1.7) * 20 +
            Math.sin((x / W) * Math.PI * 2 * 2.7  + timeShift * 2.4) * 11 +
            Math.sin((x / W) * Math.PI * 2 * 5.1  + timeShift * 1.2) * 6  +
            Math.sin((x / W) * Math.PI * 2 * 9.8  + timeShift * 3.1) * 3;
          const y = foamBase + edge;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();

        const fg = ctx.createLinearGradient(0, foamBase - 20, 0, H);
        fg.addColorStop(0,    "rgba(255,255,255,0)");
        fg.addColorStop(0.12, `rgba(255,255,255,${0.55 - pass * 0.15})`);
        fg.addColorStop(0.55, `rgba(245,252,255,${0.65 - pass * 0.12})`);
        fg.addColorStop(1.00, `rgba(220,250,248,${0.80 - pass * 0.15})`);
        ctx.fillStyle = fg;
        ctx.fill();
      }

      // No bottom fade — clip-path on the hero section defines the wave edge.

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}
