import { interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { colors, signal } from "../theme";

type Props = {
  tiles?: number; // number of cash tiles
  columns?: number;
  startDelay?: number;
  burnDuration?: number; // frames for the whole stack to burn away
  tileSize?: number;
};

const EMBERS = Array.from({ length: 7 }, (_, i) => i);

// A stack of green "cash" tiles that burns away top-first with a flickering
// amber flame front and rising embers. The money-on-fire motif for the burn.
export const BurnStack: React.FC<Props> = ({
  tiles = 18,
  columns = 6,
  startDelay = 0,
  burnDuration = 90,
  tileSize = 84,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startDelay;

  const rows = Math.ceil(tiles / columns);
  const gap = 12;
  const width = columns * tileSize + (columns - 1) * gap;
  const height = rows * tileSize + (rows - 1) * gap;

  // Burn front sweeps from the top (tile 0) downward.
  const burnFront = interpolate(local, [0, burnDuration], [0, tiles], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flicker for the flame band.
  const flicker = 0.6 + (noise2D("burn-flick", local / 5, 0) * 0.5 + 0.5) * 0.4;
  const frontRow = Math.min(rows - 1, Math.floor(burnFront / columns));
  const frontY = frontRow * (tileSize + gap);

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Tiles */}
      {Array.from({ length: tiles }).map((_, i) => {
        const r = Math.floor(i / columns);
        const c = i % columns;
        // How burned this tile is (0 = intact, 1 = gone).
        const t = interpolate(burnFront, [i - 0.5, i + 1.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * (tileSize + gap),
              top: r * (tileSize + gap),
              width: tileSize,
              height: tileSize * 0.62,
              borderRadius: 10,
              background: `linear-gradient(180deg, ${signal.good} 0%, ${signal.goodDeep} 100%)`,
              border: `2px solid ${colors.paper}`,
              boxShadow: `0 8px 18px ${colors.ink}10`,
              opacity: 1 - t,
              transform: `translateY(${t * -26}px) scale(${1 - t * 0.3})`,
              // brief char/amber tint as it burns
              filter: t > 0 && t < 1 ? `sepia(${t}) hue-rotate(-35deg)` : "none",
            }}
          />
        );
      })}

      {/* Flame band at the burn front */}
      {burnFront > 0.5 && burnFront < tiles - 0.5 ? (
        <div
          style={{
            position: "absolute",
            left: -20,
            top: frontY - 30,
            width: width + 40,
            height: tileSize,
            borderRadius: 999,
            background: `radial-gradient(ellipse at center, ${signal.warn}cc 0%, ${signal.bad}55 45%, transparent 75%)`,
            opacity: flicker,
            filter: "blur(6px)",
          }}
        />
      ) : null}

      {/* Rising embers */}
      {burnFront > 0.5
        ? EMBERS.map((i) => {
            const cycle = (local + i * 9) % 46;
            const ex =
              (i / EMBERS.length) * width +
              noise2D(`ember-${i}`, local / 14, 0) * 26;
            const ey = frontY - cycle * 2.2;
            const o = interpolate(cycle, [0, 8, 38, 46], [0, 1, 1, 0]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: ex,
                  top: ey,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: signal.warn,
                  opacity: o,
                  boxShadow: `0 0 10px ${signal.warn}`,
                }}
              />
            );
          })
        : null}
    </div>
  );
};
