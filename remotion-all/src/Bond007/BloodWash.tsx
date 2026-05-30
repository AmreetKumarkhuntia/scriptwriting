import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const BloodWash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drip1 = interpolate(frame, [0, 1 * fps], [-100, 110], {
    easing: Easing.bezier(0.55, 0, 1, 0.45),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const drip2 = interpolate(frame, [0.3 * fps, 1.5 * fps], [-100, 110], {
    easing: Easing.bezier(0.55, 0, 1, 0.45),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const drip3 = interpolate(frame, [0.15 * fps, 1.2 * fps], [-100, 110], {
    easing: Easing.bezier(0.55, 0, 1, 0.45),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [2 * fps, 3 * fps], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          width: "25%",
          height: `${drip1}%`,
          background:
            "linear-gradient(180deg, #8B0000 0%, #CC0000 60%, rgba(139,0,0,0.4) 100%)",
          borderRadius: "0 0 50% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "20%",
          height: `${drip2}%`,
          background:
            "linear-gradient(180deg, #8B0000 0%, #AA0000 60%, rgba(139,0,0,0.3) 100%)",
          borderRadius: "0 0 50% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "75%",
          width: "15%",
          height: `${drip3}%`,
          background:
            "linear-gradient(180deg, #8B0000 0%, #BB0000 60%, rgba(139,0,0,0.5) 100%)",
          borderRadius: "0 0 50% 50%",
        }}
      />
    </AbsoluteFill>
  );
};
