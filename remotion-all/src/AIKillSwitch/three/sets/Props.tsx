import React from "react";
import { noir } from "../../theme";
import { GlowSprite } from "../Glow";

// Shared governmental props: the seal, the clamp, the restriction gate,
// the stamp, and the export-vault relics. All primitives, all deterministic.

// ---- The government seal — a heavy instrument disc that descends. --------
export const Seal: React.FC<{
  position: [number, number, number];
  scale?: number;
  spin?: number; // radians
  tilt?: number; // radians tipped toward the camera so the face reads
}> = ({ position, scale = 1, spin = 0, tilt = 0.55 }) => {
  const studs = React.useMemo(() => {
    const arr: [number, number][] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      arr.push([Math.cos(a) * 2.35, Math.sin(a) * 2.35]);
    }
    return arr;
  }, []);
  return (
    <group position={position} scale={scale} rotation={[Math.PI / 2 - tilt, 0, spin]}>
      {/* main disc (axis Y → after group rotation faces -Y world) */}
      <mesh>
        <cylinderGeometry args={[3, 3, 0.4, 64]} />
        <meshStandardMaterial color={noir.steel} roughness={0.5} metalness={0.65} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.7, 0.09, 12, 64]} />
        <meshBasicMaterial color={noir.paper} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.06, 12, 64]} />
        <meshBasicMaterial color={"#8b8b96"} />
      </mesh>
      {studs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.23, z]}>
          <cylinderGeometry args={[0.11, 0.11, 0.12, 12]} />
          <meshBasicMaterial color={noir.paper} />
        </mesh>
      ))}
      {/* center emblem */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.1, 32]} />
        <meshBasicMaterial color={noir.red} toneMapped={false} />
      </mesh>
      {/* lit rim so the disc reads from the side, not as a black moon */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.02, 0.09, 12, 72]} />
        <meshBasicMaterial color={"#8b8b96"} toneMapped={false} />
      </mesh>
      {/* authority beam under the seal */}
      <GlowSprite position={[0, -1.6, 0]} rotation={[Math.PI / 2, 0, 0]} size={8} intensity={0.4} />
    </group>
  );
};

// ---- The clamp — an abstract 3-prong state hand that closes on a target. --
export const Clamp: React.FC<{
  position: [number, number, number];
  closed: number; // 0 open … 1 gripping
  scale?: number;
}> = ({ position, closed, scale = 1 }) => {
  const t = Math.min(1, Math.max(0, closed));
  const open = 0.85 - 0.55 * t; // prong splay
  return (
    <group position={position} scale={scale}>
      {/* wrist column from above */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 3.2, 20]} />
        <meshStandardMaterial color={noir.steel} roughness={0.5} metalness={0.6} />
      </mesh>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <group position={[0.55, 0.9, 0]} rotation={[0, 0, -open]}>
            <mesh position={[0.35, -0.9, 0]}>
              <boxGeometry args={[0.28, 2.0, 0.42]} />
              <meshStandardMaterial color={"#3a3a46"} roughness={0.45} metalness={0.6} />
            </mesh>
            {/* claw tip */}
            <mesh position={[0.35, -2.05, 0]} rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.24, 0.7, 0.36]} />
              <meshStandardMaterial color={noir.red} emissive={noir.red} emissiveIntensity={0.35} roughness={0.4} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

// ---- Restriction gate — posts + red barrier bars ("US ORGS ONLY"). -------
export const Gate: React.FC<{
  position: [number, number, number];
  width?: number;
  height?: number;
  glow?: number;
}> = ({ position, width = 5.4, height = 5, glow = 1 }) => {
  return (
    <group position={position}>
      {[-width / 2, width / 2].map((x, i) => (
        <mesh key={i} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.4, height, 0.4]} />
          <meshStandardMaterial color={noir.steel} roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {[0.3, 0.5, 0.7].map((h, i) => (
        <mesh key={i} position={[0, height * h, 0]}>
          <boxGeometry args={[width - 0.4, 0.16, 0.1]} />
          <meshBasicMaterial
            color={noir.red}
            transparent
            opacity={0.55 + 0.45 * glow}
            toneMapped={false}
          />
        </mesh>
      ))}
      <GlowSprite position={[0, height * 0.5, -0.2]} size={width * 1.4} intensity={0.28 * glow} />
    </group>
  );
};

// ---- Rubber stamp — slams down onto a surface; scene drives y via spring. -
export const Stamp: React.FC<{
  position: [number, number, number]; // resting/impact point (head bottom)
  lift: number; // 0 = touching, 1 = raised high
  scale?: number;
}> = ({ position, lift, scale = 1 }) => {
  const y = position[1] + lift * 6;
  return (
    <group position={[position[0], y, position[2]]} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.6, 0.6, 1.7]} />
        <meshStandardMaterial color={"#2c2c36"} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.28, 0.4, 1.1, 20]} />
        <meshStandardMaterial color={noir.steel} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.42, 20, 16]} />
        <meshStandardMaterial color={noir.red} emissive={noir.red} emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
};

// ---- Vault relics: missile, chip, chat bubble — wireframe museum pieces. --
export const Plinth: React.FC<{
  position: [number, number, number];
  label?: never;
}> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.7, 0]}>
      <cylinderGeometry args={[1.15, 1.3, 1.4, 28]} />
      <meshStandardMaterial color={noir.coal} roughness={0.8} metalness={0.3} />
    </mesh>
    <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.05, 0.04, 10, 48]} />
      <meshBasicMaterial color={"#4a4a55"} />
    </mesh>
  </group>
);

const WIRE = "#aab6c6";

export const MissileRelic: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.42, 0.5, 2.6, 14]} />
      <meshBasicMaterial color={WIRE} wireframe transparent opacity={0.55} />
    </mesh>
    <mesh position={[0, 3.25, 0]}>
      <coneGeometry args={[0.42, 0.9, 14]} />
      <meshBasicMaterial color={WIRE} wireframe transparent opacity={0.55} />
    </mesh>
    {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
      <mesh key={i} position={[Math.cos(a) * 0.5, 0.5, Math.sin(a) * 0.5]} rotation={[0, -a, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshBasicMaterial color={WIRE} wireframe transparent opacity={0.55} />
      </mesh>
    ))}
  </group>
);

export const ChipRelic: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => (
  <group position={position} scale={scale} rotation={[0.35, 0.5, 0]}>
    <mesh>
      <boxGeometry args={[1.7, 0.22, 1.7]} />
      <meshBasicMaterial color={WIRE} wireframe transparent opacity={0.55} />
    </mesh>
    <mesh position={[0, 0.16, 0]}>
      <boxGeometry args={[0.85, 0.12, 0.85]} />
      <meshBasicMaterial color={WIRE} wireframe transparent opacity={0.8} />
    </mesh>
    {Array.from({ length: 6 }).map((_, i) => (
      <React.Fragment key={i}>
        <mesh position={[-1.0, 0, -0.62 + i * 0.25]}>
          <boxGeometry args={[0.3, 0.06, 0.08]} />
          <meshBasicMaterial color={WIRE} transparent opacity={0.6} />
        </mesh>
        <mesh position={[1.0, 0, -0.62 + i * 0.25]}>
          <boxGeometry args={[0.3, 0.06, 0.08]} />
          <meshBasicMaterial color={WIRE} transparent opacity={0.6} />
        </mesh>
      </React.Fragment>
    ))}
  </group>
);

// The intruder among the relics — a HOLOGRAPHIC chat bubble (the chatbot).
export const BubbleRelic: React.FC<{
  position: [number, number, number];
  scale?: number;
  materialize: number; // 0 hidden … 1 solid holo
}> = ({ position, scale = 1, materialize }) => {
  const m = Math.min(1, Math.max(0, materialize));
  if (m <= 0.01) return null;
  return (
    <group position={position} scale={scale * (0.9 + 0.1 * m)}>
      <mesh>
        <boxGeometry args={[1.9, 1.25, 0.32]} />
        <meshBasicMaterial color={"#7db0d8"} wireframe transparent opacity={0.75 * m} />
      </mesh>
      <mesh position={[-0.5, -0.85, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.28, 0.55, 4]} />
        <meshBasicMaterial color={"#7db0d8"} wireframe transparent opacity={0.75 * m} />
      </mesh>
      {/* text dots */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.18]}>
          <sphereGeometry args={[0.11, 10, 10]} />
          <meshBasicMaterial color={"#cfe4f4"} transparent opacity={0.9 * m} toneMapped={false} />
        </mesh>
      ))}
      <GlowSprite position={[0, 0, -0.3]} size={4.4} color={"#6fa7d4"} intensity={0.5 * m} />
    </group>
  );
};
