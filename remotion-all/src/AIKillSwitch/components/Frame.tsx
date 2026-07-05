import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { noir } from "../theme";

// ---------------------------------------------------------------------------
// The cinematic "graphics register" frame: letterbox bars + vignette, plus
// EnterExit — a baked-in motivated entrance (scale+blur resolve) and exit
// (blur + drift + darken), so straight cuts in Resolve read as edited, not
// pasted. Per the motion laws: no takeover may enter or die on a flat fade.
// ---------------------------------------------------------------------------

export const LETTERBOX = 84; // px bars top+bottom — the takeover signature

export const Letterbox: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: LETTERBOX,
        background: "#000",
        zIndex: 40,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: LETTERBOX,
        background: "#000",
        zIndex: 40,
      }}
    />
  </>
);

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.55,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 72% 62% at 50% 46%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
      zIndex: 30,
    }}
  />
);

// Wrap the whole visual stack of a clip. Entrance: 8-frame push-in resolve.
// Exit: last `exitFrames` — blur up, slight scale drift, dip toward black.
export const EnterExit: React.FC<{
  children: React.ReactNode;
  exitFrames?: number;
}> = ({ children, exitFrames = 10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const inT = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outStart = durationInFrames - exitFrames;
  const outT = interpolate(frame, [outStart, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = 1.045 - 0.045 * inT + 0.03 * outT;
  const blur = 7 * (1 - inT) + 9 * outT;
  const dark = 0.5 * outT;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "#000", opacity: dark, pointerEvents: "none", zIndex: 60 }}
      />
    </AbsoluteFill>
  );
};

// One-frame red impact flash (the "punch" on slams/stamps), decays fast.
export const ImpactFlash: React.FC<{ at: number; color?: string }> = ({
  at,
  color = noir.red,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + 7], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{ background: color, opacity: o, pointerEvents: "none", zIndex: 35 }}
    />
  );
};
