import React from "react";
import { noise2D } from "@remotion/noise";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// GlobeScreens — a sphere of tiny glowing screens (the world's devices).
// `life` 1→0 blinks them off in a noise-staggered cascade. Instanced.
// ---------------------------------------------------------------------------

const LIT = new THREE.Color("#cfd8e6");
const DEAD = new THREE.Color("#111116");

export const GlobeScreens: React.FC<{
  frame: number;
  life: number;
  position?: [number, number, number];
  radius?: number;
  count?: number;
  scale?: number;
  seed?: string;
}> = ({
  frame,
  life,
  position = [0, 0, 0],
  radius = 3,
  count = 420,
  scale = 1,
  seed = "globe",
}) => {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  const color = React.useMemo(() => new THREE.Color(), []);

  // fibonacci sphere points + a per-point death threshold
  const pts = React.useMemo(() => {
    const arr: { p: THREE.Vector3; thr: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const p = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(radius);
      const thr = 0.5 + 0.5 * noise2D(seed, i * 0.173, 0); // 0..1
      arr.push({ p, thr });
    }
    return arr;
  }, [count, radius, seed]);

  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < pts.length; i++) {
      const { p, thr } = pts[i];
      dummy.position.copy(p);
      dummy.lookAt(p.x * 2, p.y * 2, p.z * 2); // face outward
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // die when life drops below this screen's threshold; flicker at the edge
      let on = life > thr ? 1 : 0;
      const edge = Math.abs(life - thr);
      if (edge < 0.04 && life > 0.01) {
        on = Math.abs(noise2D(`${seed}-f${i}`, frame * 0.5, 0)) > 0.45 ? 1 : 0;
      }
      color.copy(DEAD).lerp(LIT, on);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [frame, life, pts, dummy, color, seed]);

  return (
    <group position={position} scale={scale} rotation={[0.35, frame * 0.0035, 0]}>
      {/* dark core so far-side screens occlude */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 40, 30]} />
        <meshBasicMaterial color={"#0c0c11"} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <planeGeometry args={[radius * 0.075, radius * 0.05]} />
        <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
      </instancedMesh>
      {/* faint lat ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[radius * 1.12, 0.015, 8, 80]} />
        <meshBasicMaterial color={"#3a3f4e"} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};
