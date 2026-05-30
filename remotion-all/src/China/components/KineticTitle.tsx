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
  startDelay?: number; // frames before first word appears
  stagger?: number; // frames between words
  accent?: string; // glow color
};

// Bebas Neue word-by-word reveal, staggered by frame with a spring pop.
export const KineticTitle: React.FC<Props> = ({
  lines,
  fontSize = 120,
  color = "#FFFFFF",
  startDelay = 0,
  stagger = 5,
  accent = colors.skyLight,
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
        gap: fontSize * 0.12,
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
            gap: fontSize * 0.28,
          }}
        >
          {line.split(" ").map((word, wi) => {
            wordIndex += 1;
            const delay = startDelay + wordIndex * stagger;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: { damping: 200 },
              durationInFrames: 18,
            });
            const opacity = interpolate(progress, [0, 1], [0, 1]);
            const y = interpolate(progress, [0, 1], [fontSize * 0.4, 0]);
            const scale = interpolate(progress, [0, 1], [0.85, 1]);
            return (
              <span
                key={wi}
                style={{
                  fontFamily: fonts.display,
                  fontSize,
                  lineHeight: 0.95,
                  color,
                  opacity,
                  transform: `translateY(${y}px) scale(${scale})`,
                  display: "inline-block",
                  letterSpacing: 2,
                  textShadow: `0 0 ${fontSize * 0.18}px ${accent}55`,
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
