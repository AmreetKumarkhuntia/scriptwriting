import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  lines: string[];
  fontSize?: number;
  color?: string;
  weight?: number;
  startDelay?: number; // frames before first word appears
  stagger?: number; // frames between words
};

// Space Grotesk word-by-word reveal, staggered with a damped spring (no
// overshoot) for a calm, premium feel. Ink-on-white — no neon glow.
export const Title: React.FC<Props> = ({
  lines,
  fontSize = 110,
  color = colors.ink,
  weight = 600,
  startDelay = 0,
  stagger = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flatten to a global word index so stagger is continuous across lines.
  let wordIndex = -1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: fontSize * 0.16,
        textAlign: "center",
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: fontSize * 0.26,
          }}
        >
          {line.split(" ").map((word, wi) => {
            wordIndex += 1;
            const delay = startDelay + wordIndex * stagger;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 200 },
              durationInFrames: 20,
            });
            const opacity = interpolate(progress, [0, 1], [0, 1]);
            const y = interpolate(progress, [0, 1], [fontSize * 0.32, 0]);
            return (
              <span
                key={wi}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: weight,
                  fontSize,
                  lineHeight: 1.0,
                  color,
                  opacity,
                  transform: `translateY(${y}px)`,
                  display: "inline-block",
                  letterSpacing: -1,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
