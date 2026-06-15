import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label?: string;
  startDelay?: number; // frames
  countDuration?: number; // frames spent counting up
  fontSize?: number;
  color?: string;
  entrance?: "pop" | "slide"; // "slide" = smooth rise (default here); "pop" = bouncy
  heroFont?: "display" | "mono"; // Space Grotesk vs IBM Plex Mono (prices/ratios)
  weight?: number; // hero number weight
  lead?: string; // small light qualifier above the number (e.g. "UP TO")
  labelWeight?: number; // sub-label weight (default 500)
  labelColor?: string; // sub-label color (default ink)
};

// Animated number count-up plus an optional label. Apple-white minimal: ink (or
// one accent) numbers on white, no neon glow. Defaults to a smooth "slide"
// entrance for the calm look. Hierarchy: light `lead` above, heavy hero number,
// muted `label` below.
export const StatCounter: React.FC<Props> = ({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  startDelay = 0,
  countDuration = 30,
  fontSize = 180,
  color = colors.ink,
  entrance = "slide",
  heroFont = "display",
  weight = 600,
  lead,
  labelWeight = 500,
  labelColor = colors.ink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = frame - startDelay;

  const value = interpolate(local, [0, countDuration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrance transform: smooth rise ("slide") or bouncy scale-in ("pop").
  const enter = spring({
    frame: local,
    fps,
    config:
      entrance === "slide" ? { damping: 200 } : { damping: 14, stiffness: 120 },
    durationInFrames: entrance === "slide" ? 20 : 20,
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
        gap: fontSize * 0.08,
        opacity,
        transform,
      }}
    >
      {lead ? (
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: fontSize * 0.18,
            color: colors.inkSoft,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: fontSize * 0.04,
          }}
        >
          {lead}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: heroFont === "mono" ? fonts.mono : fonts.display,
          fontWeight: weight,
          fontSize,
          lineHeight: 1,
          color,
          letterSpacing: heroFont === "mono" ? -2 : -3,
        }}
      >
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </div>
      {label ? (
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: labelWeight,
            fontSize: fontSize * 0.15,
            color: labelColor,
            opacity: labelOpacity,
            letterSpacing: 1,
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
