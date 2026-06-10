import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

type Props = {
  size?: number; // overall diameter in px
  color?: string; // ray color (default clay)
  rays?: number; // number of spokes
  strokeWidth?: number; // ray thickness
  startDelay?: number; // frames before the burst draws in
  spin?: number; // degrees per frame of slow continuous rotation (0 = still)
  pulse?: boolean; // gentle breathing scale
};

// The Claude "spark" — a radial starburst of rounded rays, used as a quiet bit
// of brand punctuation. Each ray draws outward from the center with a tiny
// stagger; the whole mark can drift-rotate and breathe. Purely frame-driven.
export const ClaudeSpark: React.FC<Props> = ({
  size = 120,
  color = colors.clay,
  rays = 12,
  strokeWidth = 6,
  startDelay = 0,
  spin = 0.08,
  pulse = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startDelay;

  const radius = size / 2;
  const inner = radius * 0.22; // small gap so it reads as a burst, not a star
  const rayLen = radius - inner;

  const rotate = spin * local;
  const breathe = pulse
    ? 1 + Math.sin(local / 22) * 0.04
    : 1;
  const appear = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity: appear,
        transform: `rotate(${rotate}deg) scale(${breathe})`,
      }}
    >
      {/* center point */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: strokeWidth * 1.4,
          height: strokeWidth * 1.4,
          marginLeft: -(strokeWidth * 0.7),
          marginTop: -(strokeWidth * 0.7),
          borderRadius: "50%",
          background: color,
        }}
      />
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i / rays) * 360;
        const delay = i * 1.2;
        const p = spring({
          frame: local - delay,
          fps,
          config: { damping: 200 },
          durationInFrames: 14,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: strokeWidth,
              height: rayLen,
              marginLeft: -strokeWidth / 2,
              background: color,
              borderRadius: strokeWidth,
              // origin = the center point; rays grow outward from `inner`
              transformOrigin: "center top",
              transform: `rotate(${angle}deg) translateY(${inner}px) scaleY(${p})`,
            }}
          />
        );
      })}
    </div>
  );
};
