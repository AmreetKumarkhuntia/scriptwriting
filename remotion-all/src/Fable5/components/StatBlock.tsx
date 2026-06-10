import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label?: string; // sub-label below the number
  lead?: string; // small clay kicker above the number
  startDelay?: number;
  countDuration?: number;
  fontSize?: number;
  color?: string;
  entrance?: "pop" | "slide";
  numFont?: "serif" | "mono"; // serif = Fraunces 900 hero; mono = benchmark numeral
  labelColor?: string;
  labelWeight?: number;
};

// Big count-up number, Anthropic-editorial. A light clay `lead` above, a heavy
// hero number (serif Fraunces by default, or mono for a benchmark-table look),
// and a muted Space Grotesk label below. Slides up smoothly or pops.
export const StatBlock: React.FC<Props> = ({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  lead,
  startDelay = 0,
  countDuration = 30,
  fontSize = 200,
  color = colors.clay,
  entrance = "slide",
  numFont = "serif",
  labelColor = colors.inkSoft,
  labelWeight = 600,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const value = interpolate(local, [0, countDuration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const enter = spring({
    frame: local,
    fps,
    config: entrance === "slide" ? { damping: 200 } : { damping: 14, stiffness: 120 },
    durationInFrames: entrance === "slide" ? 18 : 20,
  });
  const transform =
    entrance === "slide"
      ? `translateY(${interpolate(enter, [0, 1], [fontSize * 0.4, 0])}px)`
      : `scale(${interpolate(enter, [0, 1], [0.7, 1])})`;
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(
    local,
    [countDuration * 0.5, countDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: fontSize * 0.05,
        opacity,
        transform,
      }}
    >
      {lead ? (
        <div
          style={{
            fontFamily: fonts.label,
            fontWeight: 600,
            fontSize: fontSize * 0.15,
            color: colors.clay,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: fontSize * 0.03,
          }}
        >
          {lead}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: numFont === "mono" ? fonts.mono : fonts.display,
          fontWeight: numFont === "mono" ? 600 : 900,
          fontSize,
          lineHeight: 1,
          color,
          letterSpacing: numFont === "mono" ? 0 : -1,
        }}
      >
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </div>
      {label ? (
        <div
          style={{
            fontFamily: fonts.label,
            fontWeight: labelWeight,
            fontSize: fontSize * 0.13,
            color: labelColor,
            opacity: labelOpacity,
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
