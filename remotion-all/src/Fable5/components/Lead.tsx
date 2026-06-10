import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  text: string;
  delay?: number;
  color?: string;
  fontSize?: number;
  tracking?: number;
  rule?: boolean; // small clay rule before the text (editorial eyebrow)
};

// Space Grotesk "eyebrow" / kicker — a short, tracked, uppercase label that sits
// above a title. Fades + rises in. Optionally led by a small clay rule.
export const Lead: React.FC<Props> = ({
  text,
  delay = 0,
  color = colors.clay,
  fontSize = 30,
  tracking = 7,
  rule = false,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.7,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
      }}
    >
      {rule ? (
        <span
          style={{
            display: "inline-block",
            width: fontSize * 1.4,
            height: 2,
            background: color,
            borderRadius: 2,
          }}
        />
      ) : null}
      <span
        style={{
          fontFamily: fonts.label,
          fontWeight: 600,
          fontSize,
          letterSpacing: tracking,
          color,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};
