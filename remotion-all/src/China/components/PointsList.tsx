import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  items: string[];
  startDelay?: number; // frames before the first item appears
  stagger?: number; // frames between items
  fontSize?: number;
  accent?: string; // marker / glow color
};

// Staggered reveal of bullet points: each item slides up + fades in, led by a
// small accent square marker. Used for the "where AI is used" beat.
export const PointsList: React.FC<Props> = ({
  items,
  startDelay = 0,
  stagger = 16,
  fontSize = 64,
  accent = colors.skyLight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: fontSize * 0.5,
        alignItems: "flex-start",
      }}
    >
      {items.map((item, i) => {
        const delay = startDelay + i * stagger;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
          durationInFrames: 18,
        });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const x = interpolate(progress, [0, 1], [-40, 0]);

        return (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: fontSize * 0.42,
              opacity,
              transform: `translateX(${x}px)`,
            }}
          >
            <div
              style={{
                width: fontSize * 0.32,
                height: fontSize * 0.32,
                background: accent,
                borderRadius: 4,
                boxShadow: `0 0 22px ${accent}aa`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: fonts.display,
                fontSize,
                color: "#FFFFFF",
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </div>
  );
};
