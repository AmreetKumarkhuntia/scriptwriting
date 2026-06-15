import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "./theme";

// Gold act-label lower-third, bottom-left. Wipes in over ~14 frames, holds,
// then fades out — meant to overlay the first beat of an act (AL LEF, THE
// AUCTION, THE PIT). Render it inside a Sequence so `frame` is clip-local.
export const LowerThird: React.FC<{
  label: string;
  sub?: string;
  hold?: number; // frames to stay fully visible before fading out
}> = ({ label, sub, hold = 70 }) => {
  const frame = useCurrentFrame();

  const barWidth = interpolate(frame, [0, 14], [0, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [hold, hold + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 90,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            width: barWidth,
            height: 3,
            background: `linear-gradient(90deg, ${colors.gold}, transparent)`,
          }}
        />
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: 6,
            color: colors.gold,
            opacity: textOpacity,
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          {label}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: 4,
              color: colors.bone,
              opacity: textOpacity,
              textTransform: "uppercase",
              textShadow: "0 2px 6px rgba(0,0,0,0.9)",
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
