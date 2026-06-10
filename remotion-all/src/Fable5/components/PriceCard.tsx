import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  startDelay?: number;
  inputPrice?: number; // $/M input tokens
  outputPrice?: number; // $/M output tokens
  tag?: string; // e.g. "2× THE PRICE OF OPUS 4.8"
  width?: number;
};

const Row: React.FC<{
  label: string;
  price: number;
  delay: number;
  accent: boolean;
}> = ({ label, price, delay, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 200 },
    durationInFrames: 16,
  });
  const value = interpolate(local, [0, 24], [0, price], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        width: "100%",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [-24, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.label,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: 4,
          color: colors.inkSoft,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: 60,
          color: accent ? colors.clay : colors.ink,
          lineHeight: 1,
        }}
      >
        ${value.toFixed(0)}
        <span
          style={{
            fontFamily: fonts.label,
            fontWeight: 500,
            fontSize: 26,
            color: colors.inkSoft,
            letterSpacing: 1,
          }}
        >
          {" "}
          / M
        </span>
      </span>
    </div>
  );
};

// Token-pricing card on cream: input + output rows with mono prices that count
// up, divided by a hairline, with a clay tag pill below ("2× Opus 4.8").
export const PriceCard: React.FC<Props> = ({
  startDelay = 0,
  inputPrice = 10,
  outputPrice = 50,
  tag = "2× THE PRICE OF OPUS 4.8",
  width = 760,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 110 },
    durationInFrames: 20,
  });
  const tagEnter = spring({
    frame: local - 40,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 18,
  });

  return (
    <div
      style={{
        width,
        borderRadius: 28,
        background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
        border: `1.5px solid ${colors.paperEdge}`,
        boxShadow: `0 30px 70px ${colors.clayDeep}1F`,
        padding: "56px 56px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 30,
        alignItems: "center",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.95, 1],
        )})`,
      }}
    >
      <Row label="Input" price={inputPrice} delay={startDelay + 8} accent={false} />
      <div style={{ width: "100%", height: 1.5, background: colors.paperEdge }} />
      <Row label="Output" price={outputPrice} delay={startDelay + 22} accent />
      <div
        style={{
          marginTop: 8,
          padding: "12px 28px",
          borderRadius: 999,
          background: colors.clay,
          color: colors.paper,
          fontFamily: fonts.label,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: interpolate(tagEnter, [0, 1], [0, 1]),
          transform: `scale(${interpolate(tagEnter, [0, 1], [0.8, 1])})`,
          boxShadow: `0 12px 26px ${colors.clay}55`,
        }}
      >
        {tag}
      </div>
    </div>
  );
};
