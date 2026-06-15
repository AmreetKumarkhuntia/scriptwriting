import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { colors } from "../theme";

// The near-white "2D plane" the camera flies over. A soft white->paperDeep
// radial ground, a faint ink dot grid that drifts slowly (deterministic noise,
// no Math.random / Date.now), and a gentle edge feather to keep big type crisp.
export const Plane: React.FC = () => {
  const frame = useCurrentFrame();

  // Organic noise-based drift in [0, 40], no modulo jump-reset.
  const driftX = (noise2D("plane-x", frame / 140, 0) * 0.5 + 0.5) * 40;
  const driftY = (noise2D("plane-y", frame / 140, 0) * 0.5 + 0.5) * 40;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 42%, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
      }}
    >
      {/* Faint drifting dot grid — ink at very low alpha so it reads as texture */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${colors.ink}14 1.4px, transparent 1.4px)`,
          backgroundSize: "46px 46px",
          backgroundPosition: `${driftX}px ${driftY}px`,
        }}
      />

      {/* Soft edge feather toward paperDeep — frames the center, no darkening */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 55%, ${colors.paperDeep}88 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
