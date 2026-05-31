import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  text: string;
  color?: string;
  startDelay?: number;
  fontSize?: number;
};

// Small Montserrat pill used for license / ranking / category tags
// (e.g. "MIT LICENSE", "#1 ON OPENROUTER", "TIKTOK'S PARENT"). Pops in.
export const Badge: React.FC<Props> = ({
  text,
  color = colors.skyLight,
  startDelay = 0,
  fontSize = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 16, stiffness: 120 },
    durationInFrames: 16,
  });

  return (
    <span
      style={{
        display: "inline-block",
        opacity: interpolate(p, [0, 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        padding: `${fontSize * 0.42}px ${fontSize * 0.85}px`,
        borderRadius: 999,
        border: `2px solid ${color}`,
        background: `${color}1c`,
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize,
        letterSpacing: 2,
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
        boxShadow: `0 0 18px ${color}33`,
      }}
    >
      {text}
    </span>
  );
};
