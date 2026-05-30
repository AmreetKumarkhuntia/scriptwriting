import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { colors } from "../theme";

// Full-screen themed background reused by every clip: a midnight->navy gradient
// plus a slow, deterministic dot-grid drift. No Math.random / Date.now.
export const SceneBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Organic noise-based drift — wanders in [0, 40] without a modulo jump-reset.
  // frame/120 = one noise "cycle" ≈ 4 seconds.
  const driftX = (noise2D("bg-x", frame / 120, 0) * 0.5 + 0.5) * 40;
  const driftY = (noise2D("bg-y", frame / 120, 0) * 0.5 + 0.5) * 40;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.midnight} 100%)`,
      }}
    >
      {/* Drifting dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${colors.blueMed}22 1.5px, transparent 1.5px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: `${driftX}px ${driftY}px`,
        }}
      />

      {/* Vignette toward midnight to keep foreground text legible */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${colors.midnight}cc 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
