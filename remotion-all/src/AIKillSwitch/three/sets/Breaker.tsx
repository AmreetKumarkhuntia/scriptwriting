import React from "react";
import * as THREE from "three";
import { noir } from "../../theme";
import { GlowSprite } from "../Glow";

// ---------------------------------------------------------------------------
// THE kill switch — a monumental industrial breaker on a wall plate.
// `angle` = lever rotation in radians (+0.6 = ON up, -0.6 = OFF down);
// the scene drives it (spring slam, overshoot). `glow` 0..1 = red energy.
// ---------------------------------------------------------------------------

export const BREAKER_ON = 0.6;
export const BREAKER_OFF = -0.62;

export const Breaker: React.FC<{
  angle: number;
  glow: number;
  position?: [number, number, number];
  scale?: number;
}> = ({ angle, glow, position = [0, 3.2, 0], scale = 1 }) => {
  const g = Math.min(1, Math.max(0, glow));
  const handleColor = React.useMemo(() => new THREE.Color(), []);
  handleColor
    .set(noir.redDeep)
    .lerp(new THREE.Color(noir.red), 0.25 + 0.75 * g);
  return (
    <group position={position} scale={scale}>
      {/* wall plate */}
      <mesh position={[0, 0, -0.45]}>
        <boxGeometry args={[8.5, 10.5, 0.6]} />
        <meshStandardMaterial color={"#1d1d24"} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* plate edge trim */}
      <mesh position={[0, 0, -0.13]}>
        <planeGeometry args={[8.1, 10.1]} />
        <meshBasicMaterial color={"#2c2c36"} wireframe transparent opacity={0.5} />
      </mesh>
      {/* hazard strips */}
      <mesh position={[-3.1, 0, -0.13]}>
        <planeGeometry args={[0.35, 8.6]} />
        <meshBasicMaterial color={noir.paper} transparent opacity={0.22} />
      </mesh>
      <mesh position={[3.1, 0, -0.13]}>
        <planeGeometry args={[0.35, 8.6]} />
        <meshBasicMaterial color={noir.paper} transparent opacity={0.22} />
      </mesh>
      {/* soft glow halo behind the boss */}
      <GlowSprite position={[0, 0, -0.05]} size={9} intensity={0.25 + 0.75 * g} />
      {/* pivot boss */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]}>
        <cylinderGeometry args={[1.05, 1.15, 0.5, 40]} />
        <meshStandardMaterial color={noir.steel} roughness={0.6} metalness={0.5} />
      </mesh>
      {/* instrument face plate */}
      <mesh position={[0, 0, 0.41]}>
        <circleGeometry args={[1.02, 48]} />
        <meshBasicMaterial color={"#23232c"} />
      </mesh>
      {/* red ring — faces the camera */}
      <mesh position={[0, 0, 0.43]}>
        <torusGeometry args={[1.02, 0.055, 12, 64]} />
        <meshBasicMaterial color={handleColor} toneMapped={false} />
      </mesh>
      {/* lever */}
      <group rotation={[0, 0, angle]}>
        <mesh position={[0, 1.7, 0.62]}>
          <boxGeometry args={[0.55, 3.4, 0.42]} />
          <meshStandardMaterial color={"#3a3a46"} roughness={0.45} metalness={0.6} />
        </mesh>
        {/* handle */}
        <mesh position={[0, 3.5, 0.62]}>
          <boxGeometry args={[1.5, 0.85, 0.7]} />
          <meshStandardMaterial
            color={handleColor}
            emissive={handleColor}
            emissiveIntensity={0.5 + 1.6 * g}
            roughness={0.35}
          />
        </mesh>
      </group>
      {/* ON / OFF pips */}
      <mesh position={[0, 3.9, -0.1]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color={g > 0.5 ? "#cfd8e6" : "#23232b"} toneMapped={false} />
      </mesh>
      <mesh position={[0, -3.9, -0.1]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color={g > 0.5 ? "#23232b" : noir.red} toneMapped={false} />
      </mesh>
      {/* red point light the breaker throws when alive */}
      <pointLight position={[0, 0, 3]} intensity={2 + 26 * g} color={noir.red} />
    </group>
  );
};
