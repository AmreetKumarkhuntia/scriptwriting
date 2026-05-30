import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tracking = interpolate(frame, [0, 2 * fps], [30, 14], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const watermarkOpacity = interpolate(
    frame,
    [0.5 * fps, 1.5 * fps],
    [0, 0.06],
    {
      easing: Easing.bezier(0.45, 0, 0.55, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const fadeOut = interpolate(
    frame,
    [2.5 * fps, 3.5 * fps],
    [1, 0],
    {
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
          fontFamily,
          fontSize: 500,
          fontWeight: 400,
          color: "#D4AF37",
          opacity: watermarkOpacity,
          position: "absolute",
          lineHeight: 1,
        }}
      >
        007
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 36,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: tracking,
            opacity,
            textTransform: "uppercase",
          }}
        >
          The Name is Bond
        </div>

        <div
          style={{
            width: 60,
            height: 1,
            backgroundColor: "#D4AF37",
            opacity,
          }}
        />

        <div
          style={{
            fontFamily,
            fontSize: 64,
            fontWeight: 400,
            color: "#D4AF37",
            letterSpacing: 12,
            opacity,
            textShadow: "0 0 30px rgba(212,175,55,0.4)",
          }}
        >
          JAMES BOND
        </div>
      </div>
    </AbsoluteFill>
  );
};
