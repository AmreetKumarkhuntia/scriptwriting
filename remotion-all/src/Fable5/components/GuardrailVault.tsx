import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  title: string; // e.g. "MYTHOS 5"
  sub?: string; // e.g. "TOO GOOD AT HACKING"
  startDelay?: number;
  width?: number;
  guardDelay?: number; // when the clay "guardrail" bars sweep across (default: never)
  guardCount?: number;
};

// A drawn padlock: the body pops in, the shackle "draws" closed.
const Padlock: React.FC<{ size: number; color: string; progress: number }> = ({
  size,
  color,
  progress,
}) => {
  const draw = interpolate(progress, [0.15, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyScale = interpolate(progress, [0, 0.5], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible" }}>
      {/* shackle — draws closed */}
      <path
        d="M28 56 V42 a22 22 0 0 1 44 0 V56"
        fill="none"
        stroke={color}
        strokeWidth={11}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      {/* body */}
      <g
        style={{
          transform: `scale(${bodyScale})`,
          transformOrigin: "50px 82px",
          opacity: interpolate(progress, [0, 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <rect x={20} y={54} width={60} height={56} rx={12} fill={color} />
        <circle cx={50} cy={78} r={8} fill={colors.paper} />
        <rect x={46} y={80} width={8} height={18} rx={4} fill={colors.paper} />
      </g>
    </svg>
  );
};

// The Mythos "locked" motif: a cream card with a hairline border, a padlock, and
// a title/sub. When `guardDelay` arrives, clay "guardrail" bars sweep across —
// the visual beat for "guardrails on top". Purely frame-driven.
export const GuardrailVault: React.FC<Props> = ({
  title,
  sub,
  startDelay = 0,
  width = 760,
  guardDelay = 1e9,
  guardCount = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 110 },
    durationInFrames: 22,
  });
  const lockProgress = interpolate(local, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const height = width * 0.66;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 28,
        background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
        border: `1.5px solid ${colors.paperEdge}`,
        boxShadow: `0 30px 70px ${colors.clayDeep}1F`,
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.94, 1],
        )})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        overflow: "hidden",
      }}
    >
      <Padlock size={120} color={colors.ink} progress={lockProgress} />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 76,
          color: colors.ink,
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: fonts.label,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 4,
            color: colors.clay,
            textTransform: "uppercase",
          }}
        >
          {sub}
        </div>
      ) : null}

      {/* Guardrail bars sweep across when guardDelay arrives */}
      {Array.from({ length: guardCount }).map((_, i) => {
        const gLocal = frame - guardDelay - i * 5;
        const gp = spring({
          frame: gLocal,
          fps,
          config: { damping: 200 },
          durationInFrames: 16,
        });
        const y = ((i + 0.5) / guardCount) * height;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: y - 9,
              height: 18,
              width: "100%",
              background: colors.clay,
              opacity: gp * 0.85,
              transform: `scaleX(${gp})`,
              transformOrigin: "left center",
              boxShadow: `0 6px 18px ${colors.clay}55`,
            }}
          />
        );
      })}
    </div>
  );
};
