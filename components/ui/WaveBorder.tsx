"use client";

import { useEffect, useRef } from "react";

/**
 * WaveBorder — a canvas that straddles the hero/beach boundary.
 * The top of the canvas is transparent (ocean shows through).
 * The bottom is sand-colored (#F5F0E8).
 * The boundary between them is a continuously animated sum of overlapping
 * sine waves, so the edge is always live and never a straight line.
 *
 * Placed in page.tsx between <HeroSection /> and <AboutSection /> with a
 * negative margin-top so it overlaps the hero's bottom portion.
 */

const SAND = "#F5F0E8";

// Each sine term: { frequency (cycles/width), amplitude (px), speed (rad/s), phase }
const TERMS = [
  { f: 0.51, a: 22, s: 0.82, p: 0.00 },
  { f: 1.18, a: 14, s: 1.31, p: 1.13 },
  { f: 2.07, a:  9, s: 0.67, p: 2.71 },
  { f: 3.73, a:  6, s: 1.84, p: 0.54 },
  { f: 6.28, a:  4, s: 2.53, p: 1.77 },
  { f: 9.89, a:  2, s: 1.20, p: 3.14 },
  { f: 15.0, a:  1, s: 3.10, p: 0.88 },
];

export function WaveBorder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let prev: number | null = null;
    let t = 0;

    const draw = (ts: number) => {
      const dt = prev === null ? 0 : Math.min((ts - prev) / 1000, 0.05);
      prev = ts;
      t += dt;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Wave edge sits in the top third of the canvas.
      // The rest (below) is sand-filled — this is what "invades" the section border.
      const BASE_Y = H * 0.32;
      const STEPS  = Math.ceil(W / 2);

      // ── Build wave edge path ──────────────────────────────────────────────
      const xs: number[] = [];
      const ys: number[] = [];

      for (let i = 0; i <= STEPS; i++) {
        const x = (i / STEPS) * W;
        let y = BASE_Y;
        for (const term of TERMS) {
          y += term.a * Math.sin((x / W) * Math.PI * 2 * term.f + t * term.s + term.p);
        }
        xs.push(x);
        ys.push(y);
      }

      // ── Sand fill below the wave edge ─────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(xs[0], ys[0]);
      for (let i = 1; i <= STEPS; i++) ctx.lineTo(xs[i], ys[i]);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();

      const sandGrad = ctx.createLinearGradient(0, BASE_Y - 30, 0, H);
      sandGrad.addColorStop(0,    "rgba(245,240,232,0)");
      sandGrad.addColorStop(0.18, "rgba(245,240,232,0.85)");
      sandGrad.addColorStop(0.45, SAND);
      sandGrad.addColorStop(1,    SAND);
      ctx.fillStyle = sandGrad;
      ctx.fill();

      // ── Foam highlight on the wave edge ───────────────────────────────────
      // Primary bright white line
      ctx.beginPath();
      ctx.moveTo(xs[0], ys[0]);
      for (let i = 1; i <= STEPS; i++) ctx.lineTo(xs[i], ys[i]);
      ctx.strokeStyle = "rgba(255,255,255,0.80)";
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      // Softer glow just below the crest
      ctx.beginPath();
      ctx.moveTo(xs[0], ys[0] + 4);
      for (let i = 1; i <= STEPS; i++) ctx.lineTo(xs[i], ys[i] + 4);
      ctx.strokeStyle = "rgba(255,255,255,0.30)";
      ctx.lineWidth   = 6;
      ctx.stroke();

      // ── Scattered foam bubbles along the edge ────────────────────────────
      const bubbleCount = Math.floor(W / 28);
      for (let b = 0; b < bubbleCount; b++) {
        const seed = b * 137.5;
        const bx   = ((Math.sin(seed) * 0.5 + 0.5) * W + Math.sin(seed * 0.41 + t * 0.5) * 18) % W;
        // Interpolate wave y at bx
        const bi   = Math.round((bx / W) * STEPS);
        const by   = (ys[Math.min(bi, STEPS)] ?? BASE_Y) + Math.sin(seed * 1.7 + t) * 6;
        const r    = 1.2 + (Math.sin(seed * 2.3) * 0.5 + 0.5) * 3.5;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.45 + Math.sin(seed + t * 0.8) * 0.25})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ display: "block", height: "110px" }}
    />
  );
}
