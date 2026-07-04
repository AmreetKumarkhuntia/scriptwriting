import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { noir } from "../theme";

// ---------------------------------------------------------------------------
// The war-room board — the static ground BEHIND the flying world (rendered
// outside MoStage, so camera motion over it reads as free parallax depth).
// Dot grid with a slow deterministic drift + two soft light wedges.
// ---------------------------------------------------------------------------

export const Board: React.FC<{ tint?: string; wedges?: boolean }> = ({
  tint = noir.void,
  wedges = true,
}) => {
  const frame = useCurrentFrame();
  const dx = noise2D("board-x", frame * 0.004, 0) * 14;
  const dy = noise2D("board-y", 0, frame * 0.004) * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: tint, overflow: "hidden" }}>
      {/* base gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 38%, #111117 0%, ${tint} 70%)`,
        }}
      />
      {/* drifting dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, #23232b 1.4px, transparent 1.6px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: `${dx}px ${dy}px`,
          opacity: 0.55,
        }}
      />
      {/* light wedges (the old searchlights, flattened) */}
      {wedges ? (
        <>
          <div
            style={{
              position: "absolute",
              top: -200,
              left: "12%",
              width: 700,
              height: 1500,
              background:
                "linear-gradient(195deg, rgba(90,100,125,0.10) 0%, transparent 62%)",
              transform: `rotate(${8 + noise2D("w1", frame * 0.005, 0) * 3}deg)`,
              transformOrigin: "top center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -200,
              right: "10%",
              width: 800,
              height: 1500,
              background:
                "linear-gradient(165deg, rgba(90,100,125,0.08) 0%, transparent 60%)",
              transform: `rotate(${-9 + noise2D("w2", frame * 0.005, 0) * 3}deg)`,
              transformOrigin: "top center",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
