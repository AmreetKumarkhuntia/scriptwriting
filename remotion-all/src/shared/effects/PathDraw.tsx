import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";

interface PathDrawProps {
  d: string;
  stroke: string;
  strokeWidth?: number;
  fill?: string;
  durationInFrames?: number;
  startDelay?: number;
  easing?: (t: number) => number;
}

export const PathDraw: React.FC<PathDrawProps> = ({
  d,
  stroke,
  strokeWidth = 3,
  fill = "none",
  durationInFrames = 30,
  startDelay = 0,
  easing = Easing.bezier(0.16, 1, 0.3, 1),
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const progress = interpolate(
    frame,
    [startDelay, startDelay + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
  );
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, d);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
    >
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
