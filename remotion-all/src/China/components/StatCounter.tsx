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
  accent?: string;
  entrance?: "pop" | "slide"; // "pop" = bouncy scale-in; "slide" = smooth rise
};

// Animated number count-up, plus an optional Montserrat label. The block can
// either pop in (bouncy scale) or slide up smoothly, via the `entrance` prop.
export const StatCounter: React.FC<Props> = ({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  startDelay = 0,
  countDuration = 30,
  fontSize = 180,
  color = colors.skyLight,
  accent = colors.skyLight,
  entrance = "pop",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = frame - startDelay;

  const value = interpolate(local, [0, countDuration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrance transform: bouncy scale-in ("pop") or smooth rise ("slide").
  const enter = spring({
    frame: local,
    fps,
    config:
      entrance === "slide"
        ? { damping: 200 }
        : { damping: 12, stiffness: 120 },
    durationInFrames: entrance === "slide" ? 18 : 20,
  });
  const transform =
    entrance === "slide"
      ? `translateY(${interpolate(enter, [0, 1], [fontSize * 0.45, 0])}px)`
      : `scale(${interpolate(enter, [0, 1], [0.6, 1])})`;
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(
    local,
    [countDuration * 0.5, countDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
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
      <div
        style={{
          fontFamily: fonts.display,
          fontSize,
          lineHeight: 1,
          color,
          letterSpacing: 2,
          textShadow: `0 0 ${fontSize * 0.22}px ${accent}66`,
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
            fontWeight: 600,
            fontSize: fontSize * 0.16,
            color: "#FFFFFF",
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
