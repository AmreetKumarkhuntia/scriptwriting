import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";

type Props = {
  text: string;
  startDelay?: number; // frames before the first word rolls in
  stagger?: number; // frames between words
  fontSize?: number;
  color?: string;
  weight?: number;
};

// Word-by-word roll-up: each word lives in an overflow-hidden box and rolls up
// from below (translateY 100% -> 0) with a per-word stagger. Montserrat body font.
export const RollingText: React.FC<Props> = ({
  text,
  startDelay = 0,
  stagger = 5,
  fontSize = 38,
  color = "#9FB2D8",
  weight = 500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: fontSize * 0.32,
      }}
    >
      {text.split(" ").map((word, i) => {
        const progress = spring({
          frame: frame - (startDelay + i * stagger),
          fps,
          config: { damping: 200 },
          durationInFrames: 16,
        });
        const y = (1 - progress) * 100; // % of line height
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${y}%)`,
                opacity: progress,
                fontFamily: fonts.body,
                fontWeight: weight,
                fontSize,
                color,
                letterSpacing: 2,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};
