import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, signal } from "../theme";

type Props = {
  cost: number; // top value (what it costs)
  price: number; // bottom value (what you pay)
  costLabel?: string;
  priceLabel?: string;
  gapLabel?: string; // e.g. "GAP"
  prefix?: string;
  startDelay?: number;
};

// Two stacked values — COST (coral, top) over PRICE (ink, bottom) — with a
// glowing coral band between them labelled "$X GAP". The gap is the hero.
export const GapChasm: React.FC<Props> = ({
  cost,
  price,
  costLabel = "COST TO RUN",
  priceLabel = "YOU PAY",
  gapLabel = "GAP",
  prefix = "$",
  startDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const gap = Math.round((cost - price) * 100) / 100;

  const count = (from: number, dur: number, to: number) =>
    interpolate(local, [from, from + dur], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const costVal = count(6, 20, cost);
  const priceVal = count(40, 18, price);

  const bandSpring = spring({
    frame: local - 66,
    fps,
    config: { damping: 16, stiffness: 110 },
    durationInFrames: 22,
  });
  const gapVal = count(74, 18, gap);

  const fadeAt = (f: number) =>
    interpolate(local, [f, f + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const cap: React.CSSProperties = {
    fontFamily: fonts.body,
    fontWeight: 600,
    fontSize: 30,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: colors.inkSoft,
  };
  const big = (color: string): React.CSSProperties => ({
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: 168,
    lineHeight: 0.92,
    letterSpacing: -4,
    color,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{ ...cap, opacity: fadeAt(0) }}>{costLabel}</div>
      <div style={{ ...big(signal.bad), opacity: fadeAt(4) }}>
        {prefix}
        {costVal.toFixed(0)}
      </div>

      {/* Gap band */}
      <div
        style={{
          margin: "14px 0",
          opacity: bandSpring,
          transform: `scaleX(${interpolate(bandSpring, [0, 1], [0.5, 1])})`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "16px 40px",
          borderRadius: 999,
          background: `${signal.bad}14`,
          border: `2px dashed ${signal.bad}`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: -2,
            color: signal.bad,
          }}
        >
          {prefix}
          {gapVal.toFixed(0)}
        </span>
        <span
          style={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 6,
            color: signal.bad,
          }}
        >
          {gapLabel}
        </span>
      </div>

      <div style={{ ...big(colors.ink), opacity: fadeAt(38) }}>
        {prefix}
        {priceVal.toFixed(0)}
      </div>
      <div style={{ ...cap, opacity: fadeAt(44) }}>{priceLabel}</div>
    </div>
  );
};
