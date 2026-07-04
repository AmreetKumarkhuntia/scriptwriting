import React from "react";
import { noise2D } from "@remotion/noise";
import * as THREE from "three";
import { noir } from "../../theme";
import { GlowSprite } from "../Glow";

// ---------------------------------------------------------------------------
// Scene 9 hardware.
// WeightsSwarm — thousands of tiny cubes (downloaded open weights) carpeting
// the ground to the horizon; an ignition wave lights them red from the center.
// ServerPlug — one closed-model server whose plug gets pulled.
// ---------------------------------------------------------------------------

const COLD = new THREE.Color("#17171d");
const HOT = new THREE.Color(noir.red);
const CORE = new THREE.Color(noir.ember);

export const WeightsSwarm: React.FC<{
  frame: number;
  ignite: number; // wave radius in world units (0 = nothing lit)
  position?: [number, number, number];
  cols?: number;
  rows?: number;
  spacing?: number;
  seed?: string;
  clear?: { x: number; z: number; r: number }; // keep-out zone (local coords)
}> = ({
  frame,
  ignite,
  position = [0, 0, 0],
  cols = 70,
  rows = 46,
  spacing = 2.3,
  seed = "swarm",
  clear,
}) => {
  const count = cols * rows;
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  const color = React.useMemo(() => new THREE.Color(), []);

  const cells = React.useMemo(() => {
    const arr: { x: number; z: number; d: number; j: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * spacing + noise2D(`${seed}-jx`, c, r) * 0.9;
        const z = -r * spacing + noise2D(`${seed}-jz`, c, r) * 0.9;
        const d = Math.sqrt(x * x + z * z);
        const j = Math.abs(noise2D(`${seed}-jt`, c * 0.7, r * 0.7)) * 3.5; // ignition jitter
        arr.push({ x, z, d, j });
      }
    }
    return arr;
  }, [cols, rows, spacing, seed]);

  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const { x, z, d, j } = cells[i];
      const lit = ignite - d - j; // >0 → lit
      const pulse = 0.75 + 0.25 * noise2D(`${seed}-p`, i * 0.13, frame * 0.05);
      dummy.position.set(x, 0.22, z);
      let s = lit > 0 ? 1 + Math.min(0.5, lit * 0.06) : 1;
      if (clear) {
        const dc = Math.sqrt((x - clear.x) ** 2 + (z - clear.z) ** 2);
        if (dc < clear.r) s = 0; // keep-out apron around the server
      }
      dummy.scale.setScalar(s);
      dummy.rotation.y = noise2D(`${seed}-ry`, i, 0) * 0.6;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (lit <= 0) {
        color.copy(COLD);
      } else if (lit < 1.6) {
        color.copy(COLD).lerp(HOT, (lit / 1.6) * pulse);
      } else {
        color.copy(HOT).lerp(CORE, Math.min(1, (lit - 1.6) * 0.12) * pulse);
      }
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [frame, ignite, cells, count, dummy, color, seed, clear]);

  return (
    <group position={position}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.46, 0.46, 0.46]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {ignite > 2 ? (
        <GlowSprite
          position={[0, 0.4, -Math.min(40, ignite * 0.4)]}
          rotation={[-Math.PI / 2, 0, 0]}
          size={Math.min(90, ignite * 1.9)}
          intensity={Math.min(0.5, ignite * 0.012)}
        />
      ) : null}
    </group>
  );
};

// One closed-model server + its single power cable + the plug being pulled.
export const ServerPlug: React.FC<{
  pull: number; // 0 = plugged, 1 = fully yanked
  position?: [number, number, number];
  scale?: number;
}> = ({ pull, position = [0, 0, 0], scale = 1 }) => {
  const p = Math.min(1, Math.max(0, pull));
  const curve = React.useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.1, 0.35, 0),
        new THREE.Vector3(2.4, 0.12, 0.3),
        new THREE.Vector3(3.8, 0.1, -0.2),
        new THREE.Vector3(5.0, 0.14, 0.25),
      ]),
    [],
  );
  const tube = React.useMemo(() => new THREE.TubeGeometry(curve, 40, 0.09, 10, false), [curve]);
  return (
    <group position={position} scale={scale}>
      {/* server tower */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[2.2, 4.2, 1.6]} />
        <meshStandardMaterial color={noir.coal} roughness={0.85} metalness={0.2} />
      </mesh>
      {/* rack slots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.65 + i * 0.62, 0.82]}>
          <planeGeometry args={[1.7, 0.16]} />
          <meshBasicMaterial color={p < 0.6 ? "#cfd8e6" : "#1a1a20"} toneMapped={false} />
        </mesh>
      ))}
      {/* cable */}
      <mesh geometry={tube}>
        <meshStandardMaterial color={"#3a3a46"} roughness={0.6} />
      </mesh>
      {/* plug — slides away + lifts as it's pulled */}
      <group position={[5.1 + p * 2.6, 0.2 + p * 0.7, 0.25]} rotation={[0, 0, p * 0.5]}>
        <mesh>
          <boxGeometry args={[0.8, 0.42, 0.42]} />
          <meshStandardMaterial color={noir.steel} roughness={0.5} metalness={0.5} />
        </mesh>
        {[0.12, -0.12].map((y, i) => (
          <mesh key={i} position={[0.55, y, 0]}>
            <boxGeometry args={[0.3, 0.07, 0.07]} />
            <meshBasicMaterial color={"#c8ccd6"} />
          </mesh>
        ))}
      </group>
      {/* socket spark when the plug leaves */}
      {p > 0.15 && p < 0.55 ? (
        <GlowSprite position={[5.0, 0.25, 0.25]} size={1.6} intensity={0.8 * (0.55 - p)} />
      ) : null}
    </group>
  );
};
