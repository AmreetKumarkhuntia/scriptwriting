import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const GunBarrel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const circleScale = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const circleX = interpolate(frame, [1.5 * fps, 3 * fps], [-300, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const riflingRotation = interpolate(frame, [0, 4 * fps], [0, 90], {
    extrapolateRight: "clamp",
  });

  const collapseScale = interpolate(
    frame,
    [3.2 * fps, 4 * fps],
    [1, 0],
    {
      easing: Easing.bezier(0.55, 0, 1, 0.45),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const finalScale = frame > 3.2 * fps ? collapseScale : circleScale;

  const riflingLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8 + riflingRotation;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          width: 2,
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.3)",
          left: "50%",
          top: 0,
          transformOrigin: "center center",
          transform: `translateX(-50%) rotate(${angle}deg)`,
        }}
      />
    );
  });

  const concentricRings = [0.3, 0.5, 0.7, 0.85, 1.0].map((scale, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.15)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  ));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.8)",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${circleX}px), -50%) scale(${finalScale})`,
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      >
        {riflingLines}
        {concentricRings}
        <div
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.6)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
