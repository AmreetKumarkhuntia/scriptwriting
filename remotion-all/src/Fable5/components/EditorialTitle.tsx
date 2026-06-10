import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  lines: string[];
  fontSize?: number;
  color?: string;
  weight?: number; // Fraunces 400–900
  startDelay?: number; // frames before first word
  stagger?: number; // frames between words
  italic?: boolean;
  lineHeight?: number;
};

// Fraunces word-by-word reveal — the Anthropic-editorial replacement for the
// dark videos' KineticTitle. Words fade + rise on a damped spring (no overshoot,
// no neon glow); serif gets a slight negative tracking at display sizes.
export const EditorialTitle: React.FC<Props> = ({
  lines,
  fontSize = 120,
  color = colors.ink,
  weight = 600,
  startDelay = 0,
  stagger = 5,
  italic = false,
  lineHeight = 1.02,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous word index so stagger flows across lines.
  let wordIndex = -1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: fontSize * 0.04,
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
                  fontFamily: italic ? fonts.displayItalic : fonts.display,
                  fontStyle: italic ? "italic" : "normal",
                  fontWeight: weight,
                  fontSize,
                  lineHeight,
                  color,
                  opacity,
                  transform: `translateY(${y}px)`,
                  display: "inline-block",
                  letterSpacing: -0.5,
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
