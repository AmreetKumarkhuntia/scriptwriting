import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts, signal } from "../theme";

type Props = {
  text: string;
  delay: number;
  fontSize?: number;
  color?: string;
  strikeColor?: string;
};

// A strike-through "dead idea" word: it fades up, then a coral bar wipes across
// it. Used for contrast beats (e.g. "DOT-COM 2.0", "CONSPIRACY").
export const StrikeWord: React.FC<Props> = ({
  text,
  delay,
  fontSize = 110,
  color = colors.ink,
  strikeColor = signal.bad,
}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame - delay, [0, 10], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strike = interpolate(frame - delay, [10, 24], [0, 100], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "relative",
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [20, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize,
          color,
          letterSpacing: -1,
        }}
      >
        {text}
      </span>
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: 0,
          height: fontSize * 0.07,
          width: `${strike}%`,
          background: strikeColor,
          borderRadius: 4,
        }}
      />
    </div>
  );
};
