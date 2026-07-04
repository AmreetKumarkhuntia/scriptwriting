import { Easing, interpolate } from "remotion";

// Portable motion math, ported from the video-edit skill's motion kit
// (~/.claude/skills/video-edit/remotion/src/motion/kit.tsx) + v1's settleEase.
// Deterministic, frame-driven, no springs required.

export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// The brand ease — never linear.
export const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

export type KF = { f: number; v: number };

// Per-property keyframes with the brand ease between each pair.
export const key = (frame: number, ks: KF[]): number => {
  const fs = ks.map((k) => k.f);
  const vs = ks.map((k) => k.v);
  return interpolate(frame, fs, vs, {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// 0→1 reveal ramp.
export const rev = (frame: number, start: number, len = 22): number =>
  clamp((frame - start) / len, 0, 1);

// Scale punch on a hit: returns 1 outside the window.
export const impact = (frame: number, hit: number, mag = 0.16, len = 8): number => {
  const p = (frame - hit) / len;
  if (p < 0 || p > 1) return 1;
  return 1 + mag * Math.sin(p * Math.PI) * (1 - p * 0.35);
};

// 0→1 that kisses slightly past 1 then settles (element entrances).
export const overshoot = (frame: number, start: number, len = 16, over = 0.08): number => {
  const p = clamp((frame - start) / len, 0, 1);
  const base = 1 - Math.pow(1 - p, 3);
  const bump = Math.sin(p * Math.PI) * over * (1 - p);
  return base + bump;
};

// Slow sine "living hold" — glows/backgrounds ONLY, never text geometry.
export const breath = (frame: number, per = 96, amp = 0.05): number =>
  1 + Math.sin((frame / per) * Math.PI * 2) * amp;

// Monotonic headline value — physically cannot tick backward.
export const runningPeak = (series: number[], p: number): number => {
  const idx = clamp(Math.floor(p * (series.length - 1)), 0, series.length - 1);
  let peak = -Infinity;
  for (let i = 0; i <= idx; i++) peak = Math.max(peak, series[i]);
  return peak;
};

// Camera-segment ease: reach ~target by 42% of the segment, kiss 1.5% past,
// settle by 58%, then HOLD dead-constant (v1 Rig.tsx settleEase).
export const settleEase = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 0.58) return 1;
  if (t < 0.42) return EASE(t / 0.42) * 1.015;
  const k = (t - 0.42) / 0.16;
  return 1.015 - 0.015 * EASE(k);
};
