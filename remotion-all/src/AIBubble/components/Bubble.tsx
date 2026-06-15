import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { colors, fonts } from "../theme";

type Pop = { at: number; duration?: number }; // local frame to pop + burst length

type Props = {
  size: number; // diameter in px
  label?: string; // big word inside (e.g. "COST", "NVIDIA")
  sublabel?: string; // small line under the label
  tint?: string; // glass tint + soft shadow color
  ring?: string; // ring/border color (defaults to a faint ink)
  ringWidth?: number;
  startDelay?: number;
  seed?: string; // isolates the noise wobble/float per bubble
  wobble?: boolean;
  float?: boolean;
  pop?: Pop; // if set, the bubble inflates then bursts into particles
  children?: React.ReactNode; // optional custom inner content (overrides label)
  style?: React.CSSProperties; // for absolute world placement
};

// Deterministic particle ring used by the pop burst.
const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { dx: Math.cos(a), dy: Math.sin(a), s: 0.6 + ((i * 7) % 5) / 10 };
});

// THE motif: a frosted-glass translucent bubble. Radius encodes magnitude;
// gentle deterministic wobble + float keep it alive; an optional `pop` inflates
// it and bursts it into particles. Ink-on-white, soft shadow (no neon).
export const Bubble: React.FC<Props> = ({
  size,
  label,
  sublabel,
  tint = colors.blue,
  ring,
  ringWidth = 2,
  startDelay = 0,
  seed = "bubble",
  wobble = true,
  float = true,
  pop,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  // Entrance — soft scale + fade.
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 16, stiffness: 110 },
    durationInFrames: 26,
  });
  const enterScale = interpolate(enter, [0, 1], [0.55, 1]);
  const enterOpacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Idle life — slow float + breathing wobble (deterministic noise).
  const floatY = float ? noise2D(`${seed}-fy`, local / 60, 0) * size * 0.03 : 0;
  const wob = wobble ? noise2D(`${seed}-wb`, local / 45, 0) * 0.015 : 0;

  // Pop — inflate then burst.
  const popDur = pop?.duration ?? 20;
  const popLocal = pop ? local - pop.at : -1;
  const popping = popLocal >= 0;
  const inflate = pop
    ? interpolate(popLocal, [0, 6], [1, 1.22], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const bodyOpacity = pop
    ? interpolate(popLocal, [3, 11], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const burst = pop
    ? interpolate(popLocal, [3, popDur], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const scale = enterScale * (1 + wob) * inflate;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: enterOpacity,
        transform: `translateY(${floatY}px) scale(${scale})`,
        ...style,
      }}
    >
      {/* Glass body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          opacity: bodyOpacity,
          background: `radial-gradient(circle at 34% 30%, #FFFFFFEE 0%, ${tint}22 46%, ${tint}33 100%)`,
          border: `${ringWidth}px solid ${ring ?? `${colors.ink}1f`}`,
          boxShadow: `0 26px 60px ${tint}33, inset 0 0 60px #FFFFFF66`,
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Glossy top highlight */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "20%",
            width: "44%",
            height: "30%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, #FFFFFFcc 0%, #FFFFFF00 70%)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Inner content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: size * 0.04,
          opacity: bodyOpacity,
          padding: size * 0.12,
          textAlign: "center",
        }}
      >
        {children ?? (
          <>
            {label ? (
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: size * 0.16,
                  color: colors.ink,
                  letterSpacing: -1,
                  lineHeight: 0.95,
                }}
              >
                {label}
              </div>
            ) : null}
            {sublabel ? (
              <div
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 500,
                  fontSize: size * 0.072,
                  color: colors.inkSoft,
                  letterSpacing: 0.5,
                }}
              >
                {sublabel}
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Pop burst — a ring of particles flying outward + fading */}
      {popping
        ? PARTICLES.map((p, i) => {
            const dist = burst * size * 0.85;
            const pOpacity = interpolate(burst, [0, 0.25, 1], [0, 1, 0]);
            const ps = size * 0.05 * p.s * (1 - burst * 0.5);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: ps,
                  height: ps,
                  marginLeft: -ps / 2,
                  marginTop: -ps / 2,
                  borderRadius: "50%",
                  background: tint,
                  opacity: pOpacity,
                  transform: `translate(${p.dx * dist}px, ${p.dy * dist}px)`,
                }}
              />
            );
          })
        : null}
    </div>
  );
};
