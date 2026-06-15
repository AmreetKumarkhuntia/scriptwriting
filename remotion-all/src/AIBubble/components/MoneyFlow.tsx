import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  from: string; // funder (e.g. "MICROSOFT")
  to: string; // recipient (e.g. "OpenAI")
  amount: string; // e.g. "$13B+"
  color?: string;
  startDelay?: number;
  lineWidth?: number;
};

const DOTS = [0, 1, 2, 3, 4];

// A funder streams money into an AI company: two pills joined by a channel with
// particles flowing along it and the amount floating above. Apple-white minimal.
export const MoneyFlow: React.FC<Props> = ({
  from,
  to,
  amount,
  color = colors.blue,
  startDelay = 0,
  lineWidth = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const pill = (text: string, delay: number, accent: boolean) => {
    const s = spring({
      frame: local - delay,
      fps,
      config: { damping: 18, stiffness: 110 },
      durationInFrames: 20,
    });
    return (
      <div
        style={{
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
          padding: "20px 30px",
          borderRadius: 18,
          background: colors.paper,
          border: `2px solid ${accent ? color : colors.paperEdge}`,
          boxShadow: `0 16px 40px ${colors.ink}10`,
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: -1,
          color: colors.ink,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    );
  };

  // Channel draws in, then particles flow.
  const draw = interpolate(local, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flowing = local > 38;
  const amt = spring({
    frame: local - 44,
    fps,
    config: { damping: 16, stiffness: 120 },
    durationInFrames: 20,
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {pill(from, 0, false)}

      {/* Flow channel */}
      <div
        style={{
          position: "relative",
          width: lineWidth,
          height: 80,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* baseline */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            height: 4,
            width: lineWidth * draw,
            marginTop: -2,
            background: `${color}55`,
            borderRadius: 4,
          }}
        />
        {/* particles */}
        {flowing
          ? DOTS.map((i) => {
              const span = lineWidth - 24;
              const x = (local * 3 + (i * span) / DOTS.length) % span;
              const o = interpolate(
                x,
                [0, span * 0.12, span * 0.88, span],
                [0, 1, 1, 0],
              );
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 12 + x,
                    top: "50%",
                    width: 14,
                    height: 14,
                    marginTop: -7,
                    borderRadius: "50%",
                    background: color,
                    opacity: o,
                  }}
                />
              );
            })
          : null}
        {/* amount floating above */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "50%",
            transform: `translate(-50%, ${interpolate(amt, [0, 1], [10, 0])}px)`,
            opacity: amt,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: -1,
            color,
            whiteSpace: "nowrap",
          }}
        >
          {amount}
        </div>
      </div>

      {pill(to, 12, true)}
    </div>
  );
};
