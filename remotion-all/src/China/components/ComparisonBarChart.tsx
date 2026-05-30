import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, sides } from "../theme";

export type ComparisonBar = {
  label: string; // model / category name under the bar
  value: number; // raw numeric value (e.g. 80.2 or 0.3)
  side: "china" | "us"; // drives the color convention from theme.ts
};

type Props = {
  bars: ComparisonBar[];
  maxValue?: number; // bar scale top; defaults to max(values) * 1.15
  format?: (n: number) => string; // value-label formatter; defaults to n.toFixed(decimals)
  decimals?: number; // used by the default formatter
  startDelay?: number; // frames before the first bar grows
  stagger?: number; // frames between bars
  height?: number; // px height of the plot area (the axis)
  barWidth?: number; // px width of each bar column
  axisTitle?: string; // caption rendered BELOW the chart (e.g. "SWE-Bench Verified")
};

// Per-side fill + glow, following the comparison convention in theme.ts:
// Chinese side = skyLight/blueMed, US side = royal/navy.
const SIDE_STYLE: Record<
  ComparisonBar["side"],
  { fill: string; glow: string; value: string }
> = {
  china: { fill: sides.chinaDeep, glow: sides.china, value: sides.china },
  us: { fill: sides.us, glow: sides.usDeep, value: "#9FB2D8" },
};

// Animated vertical bar chart for comparing a small set of labeled values.
// Structure mirrors the standard Remotion bar-chart: every bar is anchored to a
// single bottom axis line, model names sit in a row below the axis, and an
// optional axis title sits below that. Bars grow with a staggered spring; value
// labels count up in lockstep.
export const ComparisonBarChart: React.FC<Props> = ({
  bars,
  maxValue,
  format,
  decimals = 0,
  startDelay = 0,
  stagger = 10,
  height = 460,
  barWidth = 150,
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
      durationInFrames: 24,
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
          gap: 70,
          height,
          borderBottom: `3px solid ${colors.skyLight}55`,
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
              {/* Value label, counts up with the bar, sits just above the bar */}
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 64,
                  color: style.value,
                  letterSpacing: 1,
                  opacity: interpolate(progress, [0, 0.25], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  textShadow: `0 0 28px ${style.glow}66`,
                  marginBottom: 12,
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
                  background: `linear-gradient(180deg, ${style.glow} 0%, ${style.fill} 100%)`,
                  borderRadius: "10px 10px 0 0",
                  boxShadow: `0 0 36px ${style.glow}55`,
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
          gap: 70,
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
              color: "#FFFFFF",
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
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 7,
            color: colors.skyLight,
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
