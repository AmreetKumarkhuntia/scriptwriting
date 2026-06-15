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
  accent?: string; // marker color
  color?: string; // text color
  align?: "flex-start" | "center";
};

// Staggered reveal of points: each item slides up + fades in, led by a small
// accent square marker. Ink-on-white, no glow.
export const PointsList: React.FC<Props> = ({
  items,
  startDelay = 0,
  stagger = 16,
  fontSize = 64,
  accent = colors.blue,
  color = colors.ink,
  align = "flex-start",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: fontSize * 0.5,
        alignItems: align,
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
        const x = interpolate(progress, [0, 1], [-36, 0]);

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
                width: fontSize * 0.28,
                height: fontSize * 0.28,
                background: accent,
                borderRadius: 6,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize,
                color,
                letterSpacing: -1,
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
