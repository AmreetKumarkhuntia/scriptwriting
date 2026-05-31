import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, signal } from "../theme";

type Props = {
  count?: number; // chips to light up (default 8 — Zhipu's "8x H100")
  startDelay?: number;
  stagger?: number;
  label?: string;
};

// A row of GPU chips lighting up one by one — the visual for "runs on just
// 8 H100s". Frugality reads better as eight little chips than as a number.
export const GpuRow: React.FC<Props> = ({
  count = 8,
  startDelay = 0,
  stagger = 6,
  label = "8× H100",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = signal.good;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {Array.from({ length: count }).map((_, i) => {
          const p = spring({
            frame: frame - (startDelay + i * stagger),
            fps,
            config: { damping: 14, stiffness: 140 },
            durationInFrames: 14,
          });
          return (
            <div
              key={i}
              style={{
                width: 58,
                height: 84,
                borderRadius: 8,
                border: `2px solid ${accent}`,
                background: `linear-gradient(180deg, ${accent}${
                  p > 0.5 ? "44" : "10"
                }, ${colors.navy}cc)`,
                boxShadow: `0 0 ${interpolate(p, [0, 1], [0, 22])}px ${accent}aa`,
                opacity: interpolate(p, [0, 0.5], [0.25, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
              }}
            />
          );
        })}
      </div>
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: 64,
          letterSpacing: 3,
          color: accent,
          textShadow: `0 0 22px ${accent}66`,
        }}
      >
        {label}
      </span>
    </div>
  );
};
