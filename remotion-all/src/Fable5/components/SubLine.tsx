import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  text: string;
  delay?: number;
  color?: string;
  fontSize?: number;
  weight?: number;
  maxWidth?: number;
};

// Space Grotesk supporting line — sentence-case, muted ink, sits under a title.
// Fades + rises in. Sentence case (not uppercase) keeps the editorial, human
// tone; use Lead for the tracked uppercase eyebrow above.
export const SubLine: React.FC<Props> = ({
  text,
  delay = 0,
  color = colors.inkSoft,
  fontSize = 44,
  weight = 400,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: fonts.label,
        fontWeight: weight,
        fontSize,
        lineHeight: 1.35,
        color,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
        textAlign: "center",
        maxWidth,
      }}
    >
      {text}
    </div>
  );
};
