import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./theme";

// New cold-open title SLAM (replaces the old gun-barrel intro).
// "007 FIRST LIGHT" punches in with a white flash, a gold rule wipes out, and
// "DAY 3 · AL LEF" rises underneath. Punchy and short (~2.6s).
export const ColdOpenTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slam = spring({ frame, fps, config: { damping: 11, mass: 0.5, stiffness: 140 } });
  const titleScale = interpolate(slam, [0, 1], [1.25, 1]);
  const titleOpacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });

  // White impact flash, peaks at the slam then fades.
  const flash = interpolate(frame, [0, 5, 16], [0.85, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ruleWidth = interpolate(frame, [8, 26], [0, 720], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [16, 30], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [16, 30], [18, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 26,
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          <span style={{ color: colors.gold, textShadow: "0 0 30px rgba(212,175,55,0.45)" }}>007</span>
          <span style={{ color: colors.bone }}>FIRST LIGHT</span>
        </div>

        <div
          style={{
            width: ruleWidth,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
          }}
        />

        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 14,
            color: colors.gold,
            textTransform: "uppercase",
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          Day 3 · Al Lef
        </div>
      </div>

      {/* impact flash on top */}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
