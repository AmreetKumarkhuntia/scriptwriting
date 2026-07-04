import React from "react";
import { Easing } from "remotion";
import { useThree } from "@react-three/fiber";
import type * as THREE from "three";

// ---------------------------------------------------------------------------
// Keyframed 3D camera — the "flying around" engine.
//
// Motion laws baked in (from the video-edit skill's MOTION_DESIGN_LAWS):
//  - hold-then-ease between keys, never linear;
//  - `settle` segments micro-overshoot (~1.5% past target around 42–58% of the
//    segment) then lock DEAD constant — text overlays land on the hold;
//  - `glide` segments use the brand bezier for continuous flythrough.
// ---------------------------------------------------------------------------

export type Vec3 = [number, number, number];

export type CamKey = {
  f: number; // frame at which the camera IS at this state
  pos: Vec3;
  look: Vec3;
  fov?: number;
  // how to travel FROM the previous key TO this one:
  mode?: "settle" | "glide"; // default: settle
};

const brandEase = Easing.bezier(0.2, 0.8, 0.2, 1);

// Reach ~target by 42% of the segment, kiss 1.5% past it, settle by 58%, HOLD.
const settleEase = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 0.58) return 1;
  if (t < 0.42) {
    const k = brandEase(t / 0.42);
    return k * 1.015;
  }
  // 0.42 → 0.58: come back from the overshoot
  const k = (t - 0.42) / 0.16;
  return 1.015 - 0.015 * brandEase(k);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export type CamState = { pos: Vec3; look: Vec3; fov: number };

export const camAt = (keys: CamKey[], frame: number): CamState => {
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (frame <= first.f) {
    return { pos: first.pos, look: first.look, fov: first.fov ?? 45 };
  }
  if (frame >= last.f) {
    return { pos: last.pos, look: last.look, fov: last.fov ?? 45 };
  }
  let i = 1;
  while (keys[i].f < frame) i++;
  const k0 = keys[i - 1];
  const k1 = keys[i];
  const raw = (frame - k0.f) / (k1.f - k0.f);
  const mode = k1.mode ?? "settle";
  const t = mode === "settle" ? settleEase(raw) : brandEase(raw);
  return {
    pos: lerp3(k0.pos, k1.pos, t),
    look: lerp3(k0.look, k1.look, t),
    fov: lerp(k0.fov ?? 45, k1.fov ?? 45, t),
  };
};

// Mutates the default fiber camera every frame. Raw fiber has no makeDefault
// on <perspectiveCamera/> (that's drei) — mutating the default is the clean way.
export const Rig: React.FC<{ keys: CamKey[]; frame: number }> = ({
  keys,
  frame,
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const { pos, look, fov } = camAt(keys, frame);
  React.useLayoutEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(look[0], look[1], look[2]);
    camera.fov = fov;
    camera.near = 0.1;
    camera.far = 220;
    camera.updateProjectionMatrix();
  });
  return null;
};
