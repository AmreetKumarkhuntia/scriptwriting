import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, EASE, lerp, settleEase } from "./motion";

// ---------------------------------------------------------------------------
// MoStage — the motion-graphics flying camera.
// China's CameraStage (world plane + translate→scale→translate) upgraded with:
//  - per-key easing mode: "settle" (micro-overshoot → dead hold) | "glide"
//  - per-key transition length
//  - rotation support
//  - velocity-derived motion blur (≤6px, zero at rest — text-safe)
//  - parallax layers (MoLayer depth) for cheap depth
// Semantics match China: key.f = the frame the move STARTS; the camera arrives
// at key.f + trans and holds until the next key.
// ---------------------------------------------------------------------------

export type MoCam = { cx: number; cy: number; z: number; rot?: number };
export type MoKey = {
  f: number;
  cam: MoCam;
  mode?: "settle" | "glide"; // easing INTO this key's cam (default settle)
  trans?: number; // frames for the move (default stage-level)
};

export type CamState = { cx: number; cy: number; z: number; rot: number };

export const camAt = (frame: number, keys: MoKey[], defaultTrans = 40): CamState => {
  const first = keys[0];
  if (frame <= first.f) {
    return { cx: first.cam.cx, cy: first.cam.cy, z: first.cam.z, rot: first.cam.rot ?? 0 };
  }
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (keys[k].f <= frame) i = k;
  const prev = keys[Math.max(0, i - 1)].cam;
  const cur = keys[i].cam;
  const trans = keys[i].trans ?? defaultTrans;
  const raw = clamp((frame - keys[i].f) / trans, 0, 1);
  const t = (keys[i].mode ?? "settle") === "glide" ? EASE(raw) : settleEase(raw);
  return {
    cx: lerp(prev.cx, cur.cx, t),
    cy: lerp(prev.cy, cur.cy, t),
    z: lerp(prev.z, cur.z, t),
    rot: lerp(prev.rot ?? 0, cur.rot ?? 0, t),
  };
};

const worldTransform = (
  cam: CamState,
  vw: number,
  vh: number,
): string =>
  `translate(${vw / 2}px, ${vh / 2}px) rotate(${cam.rot}deg) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;

type StageProps = {
  keys: MoKey[];
  worldW?: number;
  worldH?: number;
  defaultTrans?: number;
  blur?: boolean; // velocity motion blur (default on)
  children: React.ReactNode;
};

const StageCtx = React.createContext<{ cam: CamState; worldW: number; worldH: number }>({
  cam: { cx: 1600, cy: 900, z: 1, rot: 0 },
  worldW: 3200,
  worldH: 1800,
});

export const useCam = () => React.useContext(StageCtx);

export const MoStage: React.FC<StageProps> = ({
  keys,
  worldW = 3200,
  worldH = 1800,
  defaultTrans = 40,
  blur = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = camAt(frame, keys, defaultTrans);

  // velocity → blur (kit trick): zero at rest, capped 6px so text stays legible
  let blurPx = 0;
  if (blur && frame > 0) {
    const prev = camAt(frame - 1, keys, defaultTrans);
    blurPx = clamp(
      Math.abs(cam.z - prev.z) * 110 +
        (Math.abs(cam.cx - prev.cx) + Math.abs(cam.cy - prev.cy)) * 0.09 * cam.z,
      0,
      6,
    );
  }

  return (
    <StageCtx.Provider value={{ cam, worldW, worldH }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: worldW,
          height: worldH,
          transformOrigin: "0 0",
          transform: worldTransform(cam, width, height),
          willChange: "transform",
          filter: blurPx > 0.4 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
        }}
      >
        {children}
      </div>
    </StageCtx.Provider>
  );
};

// A parallax sibling layer: responds to a FRACTION of the camera motion.
// depth 1 = rides with the world, 0 = static. Render as a sibling of MoStage
// (before it, so it sits behind) with the SAME keys.
export const MoLayer: React.FC<{
  keys: MoKey[];
  depth: number;
  worldW?: number;
  worldH?: number;
  defaultTrans?: number;
  children: React.ReactNode;
}> = ({ keys, depth, worldW = 3200, worldH = 1800, defaultTrans = 40, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = camAt(frame, keys, defaultTrans);
  const wcx = worldW / 2;
  const wcy = worldH / 2;
  const layerCam: CamState = {
    cx: lerp(wcx, cam.cx, depth),
    cy: lerp(wcy, cam.cy, depth),
    z: 1 + (cam.z - 1) * depth,
    rot: cam.rot * depth,
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: worldW,
        height: worldH,
        transformOrigin: "0 0",
        transform: worldTransform(layerCam, width, height),
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

// Position a centered content column at a world point (China's WorldAnchor).
export const WorldAnchor: React.FC<{
  x: number;
  y: number;
  width?: number;
  children: React.ReactNode;
  align?: "center" | "left";
}> = ({ x, y, width = 800, children, align = "center" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
    }}
  >
    {children}
  </div>
);
