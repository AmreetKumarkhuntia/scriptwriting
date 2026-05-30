import { interpolate, useCurrentFrame, Easing } from "remotion";
import { fonts } from "../theme";

type Props = {
  text: string;
  delay: number;
  fontSize?: number;
};

// A strike-through "killed logo / dead idea" word: it fades up, then a red bar
// wipes across it. Used for contrast beats (e.g. "NOT OPENAI", "BEST MODEL?").
export const StrikeWord: React.FC<Props> = ({ text, delay, fontSize = 110 }) => {
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
          fontSize,
          color: "#EEF3FB",
          letterSpacing: 3,
        }}
      >
        {text}
      </span>
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: 0,
          height: fontSize * 0.073,
          width: `${strike}%`,
          background: "#E0476B",
          borderRadius: 4,
          boxShadow: "0 0 24px #E0476B",
        }}
      />
    </div>
  );
};
