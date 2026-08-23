// ─── Reusable animation system ────────────────────────────────────────────────
// Import variants into components; respect prefers-reduced-motion globally.
// Usage: import { fadeUp, stagger, EASE } from "@/app/utils/animations";

import { useEffect, useRef, useState } from "react";

// ─── Media query helper ───────────────────────────────────────────────────────

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Easing curves ────────────────────────────────────────────────────────────

export const EASE = {
  out:    [0.22, 1, 0.36, 1] as [number, number, number, number],
  outSoft:[0.16, 1, 0.3, 1]  as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

// ─── Motion variants ──────────────────────────────────────────────────────────

export const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.out } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE.out } },
};

export const scaleReveal = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE.out } },
};

export const slideLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE.out } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE.out } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const cardItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.out } },
};

// ─── useCountUp hook ──────────────────────────────────────────────────────────
// Counts from 0 to `target` when `active` becomes true. Respects reduced motion.

export function useCountUp(target: number, active: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) { setValue(target); return; }

    const start = performance.now();
    const run = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration, reduced]);

  return value;
}

// ─── CSS keyframe strings (inject once via <style>) ───────────────────────────

export const FLOAT_KEYFRAMES = `
@keyframes floatA {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-5px) rotate(0.4deg); }
  66%       { transform: translateY(-2px) rotate(-0.3deg); }
}
@keyframes floatB {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  40%       { transform: translateY(-4px) rotate(-0.5deg); }
  70%       { transform: translateY(-7px) rotate(0.3deg); }
}
@keyframes floatC {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25%       { transform: translateY(-6px) rotate(0.4deg); }
  60%       { transform: translateY(-3px) rotate(-0.2deg); }
}
@keyframes subtleGlow {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%       { opacity: 0.75; transform: scale(1.04); }
}
.anim-float-a { animation: floatA 7s ease-in-out infinite; }
.anim-float-b { animation: floatB 6s ease-in-out infinite; }
.anim-float-c { animation: floatC 8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .anim-float-a, .anim-float-b, .anim-float-c { animation: none !important; }
}
`;
