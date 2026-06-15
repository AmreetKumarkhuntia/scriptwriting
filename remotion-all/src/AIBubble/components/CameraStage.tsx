import { Easing, useCurrentFrame } from "remotion";

// A virtual 2D camera over a world larger than the viewport. The camera centers
// a world point (cx,cy) at the viewport middle and scales by z. Children are
// world-space content (positioned with absolute left/top in world coords).
// Ported from src/China — tuned here for a slower, more elegant glide
// (transitionFrames default is higher) to suit the Apple-white minimal look.

export const WORLD_W = 3200;
export const WORLD_H = 1800;
export const WORLD_CX = WORLD_W / 2; // 1600
export const WORLD_CY = WORLD_H / 2; // 900

export type Cam = { cx: number; cy: number; z: number };
export type CamKey = { f: number; cam: Cam };

// Gentle, premium ease — slow in, slow out (no snap).
const ease = Easing.bezier(0.33, 0, 0.18, 1);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Hold-then-move: at each keyframe boundary, ease from the previous target to
// the new one over `trans` frames, then hold until the next keyframe.
export const camAt = (frame: number, keys: CamKey[], trans: number): Cam => {
  if (frame <= keys[0].f) return keys[0].cam;
  let i = 0;
  for (let k = 0; k < keys.length; k++) {
    if (keys[k].f <= frame) i = k;
  }
  const prev = keys[Math.max(0, i - 1)].cam;
  const cur = keys[i].cam;
  const raw = Math.min(1, Math.max(0, (frame - keys[i].f) / trans));
  const t = ease(raw);
  return {
    cx: lerp(prev.cx, cur.cx, t),
    cy: lerp(prev.cy, cur.cy, t),
    z: lerp(prev.z, cur.z, t),
  };
};

type Props = {
  keyframes: CamKey[];
  transitionFrames?: number;
  children: React.ReactNode;
};

export const CameraStage: React.FC<Props> = ({
  keyframes,
  transitionFrames = 50,
  children,
}) => {
  const frame = useCurrentFrame();
  const { cx, cy, z } = camAt(frame, keyframes, transitionFrames);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: WORLD_W,
        height: WORLD_H,
        transformOrigin: "0 0",
        // world point (cx,cy) -> viewport center (960,540), scaled by z
        transform: `translate(960px, 540px) scale(${z}) translate(${-cx}px, ${-cy}px)`,
      }}
    >
      {children}
    </div>
  );
};
