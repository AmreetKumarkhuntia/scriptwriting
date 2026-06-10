import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  left?: string; // left model
  right?: string; // right model (hero)
  tool?: string; // e.g. "Claude Code"
  startDelay?: number;
};

const Chip: React.FC<{
  text: string;
  delay: number;
  from: number; // slide-in x offset
  hero: boolean;
}> = ({ text, delay, from, hero }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 110 },
    durationInFrames: 20,
  });
  return (
    <div
      style={{
        padding: "22px 44px",
        borderRadius: 18,
        background: hero ? colors.clay : colors.paperDeep,
        border: `1.5px solid ${hero ? colors.clay : colors.paperEdge}`,
        color: hero ? colors.paper : colors.ink,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 62,
        letterSpacing: -0.5,
        lineHeight: 1,
        boxShadow: hero
          ? `0 16px 36px ${colors.clay}55`
          : `0 12px 28px ${colors.clayDeep}14`,
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [from, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

// The live-demo setup card: two model chips ("Opus 4.8" vs "Fable 5") sliding in
// from each side, a clay "VS" popping in the middle, and a "via Claude Code"
// tool tag below. Used as Section 3's hand-off into the screen recording.
export const DemoLowerThird: React.FC<Props> = ({
  left = "Opus 4.8",
  right = "Fable 5",
  tool = "Claude Code",
  startDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const vs = spring({
    frame: local - 16,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 18,
  });
  const toolEnter = interpolate(local - 34, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <Chip text={left} delay={startDelay + 2} from={-60} hero={false} />
        <div
          style={{
            fontFamily: fonts.displayItalic,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 46,
            color: colors.inkSoft,
            opacity: interpolate(vs, [0, 1], [0, 1]),
            transform: `scale(${interpolate(vs, [0, 1], [0.6, 1])})`,
          }}
        >
          vs
        </div>
        <Chip text={right} delay={startDelay + 2} from={60} hero />
      </div>
      <div
        style={{
          fontFamily: fonts.label,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 5,
          color: colors.inkSoft,
          textTransform: "uppercase",
          opacity: toolEnter,
          transform: `translateY(${interpolate(toolEnter, [0, 1], [12, 0])}px)`,
        }}
      >
        in {tool}
      </div>
    </div>
  );
};
