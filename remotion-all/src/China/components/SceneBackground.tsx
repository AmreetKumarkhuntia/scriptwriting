import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Full-screen themed background reused by every clip: a midnight->navy gradient
// plus a slow, deterministic dot-grid drift. No Math.random / Date.now.
export const SceneBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow diagonal drift of the dot grid (one 40px tile loop).
  const drift = (frame * 0.25) % 40;

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
          backgroundPosition: `${drift}px ${drift}px`,
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
