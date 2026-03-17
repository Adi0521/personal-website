"use client";

import { useEffect, useRef } from "react";
import { useScroll, useVelocity } from "framer-motion";

// ── Palette ────────────────────────────────────────────────────────────────────
const GRAIN_COLORS = [
  "#DDD7C8", // sand-300 (lightest)
  "#C4BBA8", // sand-400
  "#B8A898",
  "#9A8468", // sand-500
  "#A89070",
  "#7A6448", // sand-600 (darkest)
];

// ── Config ─────────────────────────────────────────────────────────────────────
const STATIC_COUNT  = 400_000; // background texture dots (rendered once, cached)
const ACTIVE_COUNT  = 10_000;  // physics-simulated grains
const MOUSE_RADIUS  = 90;     // px — outer influence zone
const GROOVE_RADIUS = 30;     // px — strong inner groove zone

// ── Types ──────────────────────────────────────────────────────────────────────
interface Grain {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  aspect: number;
  color: string;
  opacity: number;
  angle: number;
}

// ── Dune density ───────────────────────────────────────────────────────────────
// Returns 0–1 probability of placing a grain at (x, y).
// Biased toward the lower-middle of the screen with horizontal ripple bands.
function duneDensity(x: number, y: number, W: number, H: number): number {
  const duneCenter = H * 0.65;
  const spread     = H * 0.22;
  const gaussian   = Math.exp(-0.5 * ((y - duneCenter) / spread) ** 2);
  // Horizontal sine ripple — simulates dune ridges running across the screen
  const ripple = 0.82 + 0.18 * Math.sin((x / W) * Math.PI * 3.5);
  // Faint secondary dune in upper-middle
  const duneCenter2 = H * 0.38;
  const spread2     = H * 0.14;
  const gaussian2   = 0.35 * Math.exp(-0.5 * ((y - duneCenter2) / spread2) ** 2);
  return Math.min(1, (gaussian + gaussian2) * ripple);
}

// Rejection-sample a position biased by duneDensity
function sampleDunePoint(W: number, H: number): { x: number; y: number } {
  for (;;) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    if (Math.random() < duneDensity(x, y, W, H)) return { x, y };
  }
}

// ── Component ──────────────────────────────────────────────────────────────────
export function SandGrains() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const grainsRef    = useRef<Grain[]>([]);
  const rafRef       = useRef<number>(0);
  const mouseRef     = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 });
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
  const bgImageRef   = useRef<ImageData | null>(null);

  const { scrollY }    = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    // ── Build static background texture ──────────────────────────────────────
    const offscreen = document.createElement("canvas");
    offscreen.width  = W;
    offscreen.height = H;
    const octx = offscreen.getContext("2d")!;

    for (let i = 0; i < STATIC_COUNT; i++) {
      const { x, y } = sampleDunePoint(W, H);
      const color     = GRAIN_COLORS[Math.floor(Math.random() * GRAIN_COLORS.length)];
      const size      = 0.6 + Math.random() * 1.2;
      const opacity   = 0.15 + Math.random() * 0.35;
      octx.globalAlpha = opacity;
      octx.fillStyle   = color;
      octx.beginPath();
      octx.ellipse(x, y, size, size * (0.4 + Math.random() * 0.4), Math.random() * Math.PI, 0, Math.PI * 2);
      octx.fill();
    }
    bgImageRef.current = octx.getImageData(0, 0, W, H);

    // ── Initialize active physics grains ─────────────────────────────────────
    const grains: Grain[] = [];
    for (let i = 0; i < ACTIVE_COUNT; i++) {
      const { x, y } = sampleDunePoint(W, H);
      grains.push({
        baseX: x, baseY: y, x, y,
        vx: 0, vy: 0,
        size:    0.8 + Math.random() * 2.0,
        aspect:  0.4 + Math.random() * 0.45,
        color:   GRAIN_COLORS[Math.floor(Math.random() * GRAIN_COLORS.length)],
        opacity: 0.45 + Math.random() * 0.45,
        angle:   Math.random() * Math.PI,
      });
    }
    grainsRef.current = grains;

    // ── Animation loop ────────────────────────────────────────────────────────
    function animate() {
      const vel    = scrollVelocity.get();
      const absVel = Math.abs(vel);
      const velSign = Math.sign(vel);

      // Blit cached background (O(1))
      if (bgImageRef.current) ctx.putImageData(bgImageRef.current, 0, 0);

      const mx  = mouseRef.current.x;
      const my  = mouseRef.current.y;
      const mvx = mouseRef.current.vx;
      const mvy = mouseRef.current.vy;
      const mouseSpeed = Math.sqrt(mvx * mvx + mvy * mvy);

      for (const g of grainsRef.current) {
        const screenYRatio = g.y / H;
        const depthFactor  = 0.3 + screenYRatio * 1.4;

        // Scroll impulse
        if (absVel > 20) {
          g.vy += -velSign * (absVel / 1000) * 2.2 * depthFactor;
          g.vx += (Math.random() - 0.5) * (absVel / 1000) * 1.8 * depthFactor;
        }

        // Mouse impulse
        const dx   = g.x - mx;
        const dy   = g.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0.5) {
          const norm     = 1 / dist;
          const falloff  = 1 - dist / MOUSE_RADIUS;
          const strength = dist < GROOVE_RADIUS ? 3.0 : 1.0;
          const speed    = Math.max(mouseSpeed, 8); // minimum so even slow drags work
          g.vx += dx * norm * falloff * strength * speed * 0.012;
          g.vy += dy * norm * falloff * strength * speed * 0.012;
        }

        // Spring return to base
        g.vx += (g.baseX - g.x) * 0.045;
        g.vy += (g.baseY - g.y) * 0.045;

        // Damping
        g.vx *= 0.84;
        g.vy *= 0.84;

        // Integrate
        g.x += g.vx;
        g.y += g.vy;

        // Draw
        ctx.save();
        ctx.globalAlpha = g.opacity;
        ctx.fillStyle   = g.color;
        ctx.translate(g.x, g.y);
        ctx.rotate(g.angle + g.vx * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, 0, g.size, g.size * g.aspect, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    // ── Mouse / touch tracking ────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const prev = prevMouseRef.current;
      mouseRef.current.vx = e.clientX - prev.x;
      mouseRef.current.vy = e.clientY - prev.y;
      mouseRef.current.x  = e.clientX;
      mouseRef.current.y  = e.clientY;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onTouchMove(e: TouchEvent) {
      const t    = e.touches[0];
      const prev = prevMouseRef.current;
      mouseRef.current.vx = t.clientX - prev.x;
      mouseRef.current.vy = t.clientY - prev.y;
      mouseRef.current.x  = t.clientX;
      mouseRef.current.y  = t.clientY;
      prevMouseRef.current = { x: t.clientX, y: t.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, vx: 0, vy: 0 };
      prevMouseRef.current = { x: -9999, y: -9999 };
    }

    function handleResize() {
      const c = canvasRef.current;
      if (!c) return;
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
    }

    window.addEventListener("mousemove",  onMouseMove,  { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("resize",     handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize",     handleResize);
    };
  }, [scrollVelocity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -5 }}
    />
  );
}
