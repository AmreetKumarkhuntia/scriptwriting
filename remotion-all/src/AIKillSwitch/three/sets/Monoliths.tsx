import React from "react";
import { noise2D } from "@remotion/noise";
import * as THREE from "three";
import { noir } from "../../theme";

// ---------------------------------------------------------------------------
// Server monoliths — the "AI datacenter as brutalist standing stones" motif.
// Each monolith: matte black slab + a glowing status strip down its face.
// `life` (0..1 global) drives an off-cascade: 1 = all alive, 0 = all dead.
// The wave travels far→near (index order), each unit flickering as it dies.
// Pass `reverse` to make the same wave re-ignite near→far (Scene 7).
// ---------------------------------------------------------------------------

const GLOW_ALIVE = new THREE.Color("#cfd8e6");
const GLOW_DEAD = new THREE.Color("#0c0c10");

export const lifeOf = (
  index: number,
  count: number,
  life: number,
  frame: number,
  seed: string,
): number => {
  // Each unit has a death threshold staggered across [0,1] by index.
  const stagger = (index + 0.5) / count;
  const local = (life - stagger) * count * 0.9; // <0 dead, >1 alive, between = dying
  const base = Math.min(1, Math.max(0, local));
  if (base <= 0 || base >= 1) return base;
  // dying: violent flicker
  const fl = noise2D(`${seed}-fl${index}`, frame * 0.55, 0);
  return base * (0.35 + 0.65 * Math.abs(fl));
};

export const Monolith: React.FC<{
  position: [number, number, number];
  height?: number;
  width?: number;
  depth?: number;
  glow: number; // 0..1 strip brightness
  faceZ?: 1 | -1; // which Z side carries the strip
}> = ({ position, height = 5, width = 1.4, depth = 0.9, glow, faceZ = 1 }) => {
  const stripColor = React.useMemo(() => new THREE.Color(), []);
  stripColor.copy(GLOW_DEAD).lerp(GLOW_ALIVE, Math.min(1, Math.max(0, glow)));
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={noir.coal} roughness={0.9} metalness={0.15} />
      </mesh>
      {/* status strip */}
      <mesh position={[0, height / 2, faceZ * (depth / 2 + 0.012)]}>
        <planeGeometry args={[width * 0.14, height * 0.82]} />
        <meshBasicMaterial color={stripColor} toneMapped={false} />
      </mesh>
      {/* faint under-glow when alive */}
      {glow > 0.05 ? (
        <mesh
          position={[0, height / 2, faceZ * (depth / 2 + 0.005)]}
          scale={[1, 1, 1]}
        >
          <planeGeometry args={[width * 0.5, height * 0.9]} />
          <meshBasicMaterial
            color={"#5a6b85"}
            transparent
            opacity={0.16 * glow}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ) : null}
    </group>
  );
};

// Two facing rows forming an aisle down -Z. index 0 = FARTHEST (dies first).
export const MonolithHall: React.FC<{
  frame: number;
  life: number; // 1 all alive → 0 all dead (cascade far→near)
  rows?: number;
  gap?: number; // aisle half-width
  spacing?: number;
  seed?: string;
  flip?: boolean; // true → wave travels near→far (re-ignition)
}> = ({ frame, life, rows = 9, gap = 4.2, spacing = 3.4, seed = "hall", flip = false }) => {
  const units: React.ReactNode[] = [];
  const count = rows * 2;
  for (let r = 0; r < rows; r++) {
    const z = -r * spacing;
    const hL = 4.4 + 1.8 * Math.abs(noise2D(`${seed}-hL`, r, 0));
    const hR = 4.4 + 1.8 * Math.abs(noise2D(`${seed}-hR`, r, 0));
    const iL = (flip ? r : rows - 1 - r) * 2; // low index = first to change
    const iR = iL + 1;
    units.push(
      <Monolith
        key={`L${r}`}
        position={[-gap, 0, z]}
        height={hL}
        glow={lifeOf(iL, count, life, frame, seed)}
        faceZ={1}
      />,
      <Monolith
        key={`R${r}`}
        position={[gap, 0, z]}
        height={hR}
        glow={lifeOf(iR, count, life, frame, seed)}
        faceZ={1}
      />,
    );
  }
  return <>{units}</>;
};
