import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, signal } from "../theme";

export type BarSide = "good" | "bad" | "neutral" | "warn";

export type ComparisonBar = {
  label: string; // category name under the bar
  value: number; // raw numeric value
  side: BarSide; // drives the color convention from theme.ts
};

type Props = {
  bars: ComparisonBar[];
  maxValue?: number; // bar scale top; defaults to max(values) * 1.15
  format?: (n: number) => string; // value-label formatter; defaults to n.toFixed(decimals)
  decimals?: number; // used by the default formatter
  startDelay?: number; // frames before the first bar grows
  stagger?: number; // frames between bars
  height?: number; // px height of the plot area
  barWidth?: number; // px width of each bar column
  axisTitle?: string; // caption rendered BELOW the chart
};

// Flat fills (no neon glow) on white, color-coded by meaning (theme.ts):
// good = cheap/safe (green), bad = expensive/risk (coral), warn = burn (amber),
// neutral = structure (blue).
const SIDE_STYLE: Record<BarSide, { fill: string; top: string; value: string }> =
  {
    good: { fill: signal.goodDeep, top: signal.good, value: signal.goodDeep },
    bad: { fill: signal.badDeep, top: signal.bad, value: signal.badDeep },
    warn: { fill: signal.warnDeep, top: signal.warn, value: signal.warnDeep },
    neutral: {
      fill: signal.neutralDeep,
      top: signal.neutral,
      value: signal.neutralDeep,
    },
  };

// Animated vertical bar chart. Every bar is anchored to a single bottom axis
// line, category names sit in a row below, and an optional axis title below that.
// Bars grow with a staggered spring; value labels count up in lockstep.
export const ComparisonBarChart: React.FC<Props> = ({
  bars,
  maxValue,
  format,
  decimals = 0,
  startDelay = 0,
  stagger = 10,
  height = 460,
  barWidth = 160,
  axisTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const top = maxValue ?? Math.max(...bars.map((b) => b.value)) * 1.15;
  const fmt = format ?? ((n: number) => n.toFixed(decimals));

  const progressFor = (i: number) =>
    spring({
      frame: frame - (startDelay + i * stagger),
      fps,
      config: { damping: 18, stiffness: 90 },
      durationInFrames: 26,
    });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      {/* Plot area — all bars share this bottom axis baseline */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 90,
          height,
          borderBottom: `3px solid ${colors.paperEdge}`,
          padding: "0 20px",
        }}
      >
        {bars.map((bar, i) => {
          const progress = progressFor(i);
          const style = SIDE_STYLE[bar.side];
          const barHeight = (bar.value / top) * height * progress;
          const shown = bar.value * progress;

          return (
            <div
              key={bar.label}
              style={{
                width: barWidth,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {/* Value label, counts up with the bar, sits just above it */}
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: 60,
                  color: style.value,
                  letterSpacing: -1,
                  opacity: interpolate(progress, [0, 0.25], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  marginBottom: 14,
                  lineHeight: 1,
                }}
              >
                {fmt(shown)}
              </div>
              {/* The bar — pinned to the bottom axis */}
              <div
                style={{
                  width: "100%",
                  height: barHeight,
                  background: `linear-gradient(180deg, ${style.top} 0%, ${style.fill} 100%)`,
                  borderRadius: "14px 14px 0 0",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Category labels — one under each bar (fixed widths keep them aligned) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 90,
          padding: "0 20px",
        }}
      >
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            style={{
              width: barWidth,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 26,
              color: colors.inkSoft,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: "center",
              opacity: interpolate(progressFor(i), [0.2, 0.6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {bar.label}
          </div>
        ))}
      </div>

      {/* Axis title — sits below the chart */}
      {axisTitle ? (
        <div
          style={{
            marginTop: 14,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 5,
            color: colors.inkSoft,
            textTransform: "uppercase",
            opacity: interpolate(frame - startDelay, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {axisTitle}
        </div>
      ) : null}
    </div>
  );
};
