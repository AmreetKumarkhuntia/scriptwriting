import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 1.2 * fps], [3, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = interpolate(
    frame,
    [0.8 * fps, 1.5 * fps, 2.5 * fps],
    [0, 40, 15],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const lineWidth = interpolate(frame, [1 * fps, 2 * fps], [0, 600], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [2 * fps, 2.8 * fps],
    [0, 1],
    {
      easing: Easing.bezier(0.45, 0, 0.55, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const subtitleY = interpolate(frame, [2 * fps, 2.8 * fps], [20, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 220,
            fontWeight: 900,
            color: "#D4AF37",
            transform: `scale(${scale})`,
            opacity,
            textShadow: `0 0 ${glowIntensity}px #D4AF37, 0 0 ${glowIntensity * 2}px rgba(212,175,55,0.3)`,
            letterSpacing: 20,
            lineHeight: 1,
          }}
        >
          007
        </div>

        <div
          style={{
            width: lineWidth,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />

        <div
          style={{
            fontFamily,
            fontSize: 28,
            color: "rgba(212,175,55,0.8)",
            letterSpacing: 18,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textTransform: "uppercase",
          }}
        >
          License to Kill
        </div>
      </div>
    </AbsoluteFill>
  );
};
