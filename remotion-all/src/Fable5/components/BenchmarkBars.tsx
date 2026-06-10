import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

export type Bar = {
  label: string; // model name under the bar
  value: number;
  side: "hero" | "rival"; // hero = Fable 5 (clay), rival = competitor (slate)
};

type Props = {
  bars: Bar[];
  maxValue?: number; // axis top; defaults to max(values) * 1.15
  decimals?: number;
  suffix?: string; // e.g. "%"
  startDelay?: number;
  stagger?: number;
  height?: number; // plot-area height in px
  barWidth?: number;
  axisTitle?: string; // caption below the chart
};

// Per-side fill — the hero (Fable 5) is clay with a warm kraft top; rivals are
// muted slate. Value labels render in mono for that benchmark-table feel.
const SIDE: Record<
  Bar["side"],
  { top: string; fill: string; value: string; label: string; shadow: string }
> = {
  hero: {
    top: colors.kraft,
    fill: colors.clay,
    value: colors.clayDeep,
    label: colors.ink,
    shadow: `${colors.clay}55`,
  },
  rival: {
    top: "#8A99A6",
    fill: colors.slate,
    value: colors.slate,
    label: colors.inkSoft,
    shadow: `${colors.slate}33`,
  },
};

// Vertical benchmark bars on cream: one shared bottom axis (hairline), model
// names in a row below, optional axis title under that. Bars grow on a staggered
// spring; mono value labels count up in lockstep.
export const BenchmarkBars: React.FC<Props> = ({
  bars,
  maxValue,
  decimals = 1,
  suffix = "",
  startDelay = 0,
  stagger = 10,
  height = 460,
  barWidth = 150,
  axisTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const top = maxValue ?? Math.max(...bars.map((b) => b.value)) * 1.15;

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
      {/* Plot area — bars share this bottom axis baseline */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 80,
          height,
          borderBottom: `2px solid ${colors.paperEdge}`,
          padding: "0 20px",
        }}
      >
        {bars.map((bar, i) => {
          const progress = progressFor(i);
          const s = SIDE[bar.side];
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
              {/* Value label — counts up, sits above the bar */}
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontWeight: 600,
                  fontSize: 56,
                  color: s.value,
                  marginBottom: 14,
                  lineHeight: 1,
                  opacity: interpolate(progress, [0, 0.25], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {shown.toFixed(decimals)}
                {suffix}
              </div>
              {/* The bar — pinned to the bottom axis */}
              <div
                style={{
                  width: "100%",
                  height: barHeight,
                  background: `linear-gradient(180deg, ${s.top} 0%, ${s.fill} 100%)`,
                  borderRadius: "8px 8px 0 0",
                  boxShadow: `0 12px 30px ${s.shadow}`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Model labels — one under each bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 80,
          padding: "0 20px",
        }}
      >
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            style={{
              width: barWidth,
              fontFamily: fonts.label,
              fontWeight: 600,
              fontSize: 25,
              color: SIDE[bar.side].label,
              textTransform: "uppercase",
              letterSpacing: 1.5,
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

      {/* Axis title */}
      {axisTitle ? (
        <div
          style={{
            marginTop: 14,
            fontFamily: fonts.label,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 6,
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
