import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { colors } from "../theme";

// Full-screen Anthropic-style ground reused by every Fable 5 clip: warm cream
// paper, a faint slowly-drifting clay glow for depth, a subtle grain overlay,
// and a soft warm vignette toward the paper edge (never toward ink — the page
// stays light). No Math.random / Date.now.
export const PaperBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentle, organic drift of the clay glow — wanders without a modulo jump.
  // frame/200 ≈ one slow noise cycle every ~6.7s.
  const glowX = 50 + noise2D("bg-glow-x", frame / 200, 0) * 12;
  const glowY = 34 + noise2D("bg-glow-y", frame / 200, 0) * 8;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
      }}
    >
      {/* Soft clay glow drifting from the upper area for warmth + depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at ${glowX}% ${glowY}%, ${colors.clay}1F 0%, transparent 60%)`,
        }}
      />

      {/* A second, cooler sage wash low-left to keep the cream from going flat */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at 18% 88%, ${colors.sage}24 0%, transparent 62%)`,
        }}
      />

      {/* Paper grain — inline SVG turbulence (renders deterministically, no
          asset load to wait on) at low opacity with multiply blend, so the
          dark speckle reads as the "tooth" of cream paper. */}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "multiply" }}>
        <svg width="100%" height="100%">
          <filter id="fable5-paper-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={3}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#fable5-paper-grain)" />
        </svg>
      </AbsoluteFill>

      {/* Warm vignette toward the paper edge — keeps focus centered without
          darkening to black (the page must stay light/editorial). */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 52%, ${colors.paperEdge}aa 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
