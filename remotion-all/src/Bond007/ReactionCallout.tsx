import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./theme";

// Punchy streamer-reaction pop (e.g. "WE SOLD GREENWAY 😅") for a single beat.
// Springs in with a slight overshoot, holds, fades out. Frame is clip-local, so
// the parent should mount this from the moment the callout should appear (use a
// <Sequence from={atFrame}> wrapper in Reel).
export const ReactionCallout: React.FC<{
  text: string;
  tone?: "gold" | "alert";
  hold?: number;
}> = ({ text, tone = "gold", hold = 55 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const fadeOut = interpolate(frame, [hold, hold + 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const accent = tone === "alert" ? colors.alert : colors.gold;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", opacity: fadeOut }}>
      <div
        style={{
          marginTop: 150,
          transform: `scale(${scale}) rotate(-2deg)`,
          background: "rgba(0,0,0,0.78)",
          border: `3px solid ${accent}`,
          borderRadius: 14,
          padding: "18px 34px",
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 58,
          letterSpacing: 1,
          color: colors.bone,
          textTransform: "uppercase",
          boxShadow: `0 0 28px ${accent}55, 0 8px 24px rgba(0,0,0,0.6)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
