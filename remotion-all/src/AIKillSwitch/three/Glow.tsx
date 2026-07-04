import React from "react";
import * as THREE from "three";

// Soft radial glow sprite — a canvas radial-gradient texture on an additive
// plane. Drawn once (deterministic); use for halos, embers, ignitions.
export const useGlowTexture = (color: string): THREE.CanvasTexture => {
  return React.useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const hex = new THREE.Color(color);
    const rgb = `${Math.round(hex.r * 255)},${Math.round(hex.g * 255)},${Math.round(hex.b * 255)}`;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, `rgba(${rgb},0.6)`);
    g.addColorStop(0.35, `rgba(${rgb},0.22)`);
    g.addColorStop(0.7, `rgba(${rgb},0.06)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, [color]);
};

export const GlowSprite: React.FC<{
  position?: [number, number, number];
  size?: number;
  color?: string;
  intensity?: number; // 0..1 opacity multiplier
  rotation?: [number, number, number];
}> = ({ position = [0, 0, 0], size = 6, color = "#E5233D", intensity = 1, rotation }) => {
  const tex = useGlowTexture(color);
  if (intensity <= 0.005) return null;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={Math.min(1, intensity)}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};
