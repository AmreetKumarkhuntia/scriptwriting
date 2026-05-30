import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const TITLE = "JAMES BOND";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topLineWidth = interpolate(frame, [0, 1 * fps], [0, 400], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomLineWidth = interpolate(
    frame,
    [0.3 * fps, 1.3 * fps],
    [0, 400],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: topLineWidth,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {TITLE.split("").map((char, i) => {
            const staggerDelay = i * 2;
            const charOpacity = interpolate(
              frame,
              [0.5 * fps + staggerDelay, 1.2 * fps + staggerDelay],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            const charY = interpolate(
              frame,
              [0.5 * fps + staggerDelay, 1.2 * fps + staggerDelay],
              [40, 0],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontSize: 120,
                  fontWeight: 700,
                  color: "#D4AF37",
                  opacity: charOpacity,
                  transform: `translateY(${charY}px)`,
                  display: "inline-block",
                  minWidth: char === " " ? 40 : undefined,
                  textShadow:
                    "0 0 20px rgba(212,175,55,0.3), 0 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        <div
          style={{
            width: bottomLineWidth,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
