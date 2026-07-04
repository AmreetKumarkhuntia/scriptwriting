import React from "react";
import { noise2D } from "@remotion/noise";
import * as THREE from "three";
import { noir } from "../theme";

// ---------------------------------------------------------------------------
// Shared GOV-NOIR atmosphere: void + fog + base light, an emissive ground
// grid (hand-built — gridHelper aliases badly at glancing angles), drifting
// dust, and fake-volumetric searchlight cones. All deterministic.
// ---------------------------------------------------------------------------

export const NoirStage: React.FC<{
  children: React.ReactNode;
  fogNear?: number;
  fogFar?: number;
  ambient?: number;
}> = ({ children, fogNear = 6, fogFar = 42, ambient = 0.35 }) => {
  return (
    <>
      <color attach="background" args={[noir.void]} />
      <fog attach="fog" args={[noir.void, fogNear, fogFar]} />
      <ambientLight intensity={ambient} />
      <directionalLight position={[6, 12, 4]} intensity={1.1} color={noir.paper} />
      <directionalLight position={[-8, 4, -6]} intensity={0.35} color={"#6a7080"} />
      {children}
    </>
  );
};

// Thin emissive line grid on the floor — reads like a classified war-room map.
export const GroundGrid: React.FC<{
  size?: number;
  step?: number;
  y?: number;
  color?: string;
  opacity?: number;
}> = ({ size = 120, step = 3, y = 0, color = "#1e1e26", opacity = 0.85 }) => {
  const geo = React.useMemo(() => {
    const pts: number[] = [];
    const half = size / 2;
    for (let i = -half; i <= half; i += step) {
      pts.push(-half, y, i, half, y, i);
      pts.push(i, y, -half, i, y, half);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [size, step, y]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
};

// Drifting dust motes — instanced, noise-driven, additive.
export const Dust: React.FC<{
  frame: number;
  count?: number;
  area?: [number, number, number];
  center?: [number, number, number];
  size?: number;
  opacity?: number;
  seed?: string;
}> = ({
  frame,
  count = 260,
  area = [40, 14, 40],
  center = [0, 6, 0],
  size = 0.055,
  opacity = 0.5,
  seed = "dust",
}) => {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const bx = noise2D(`${seed}-x`, i * 0.37, 0) * 0.5 * area[0];
      const by = noise2D(`${seed}-y`, i * 0.41, 0) * 0.5 * area[1];
      const bz = noise2D(`${seed}-z`, i * 0.53, 0) * 0.5 * area[2];
      const dx = noise2D(`${seed}-dx`, i * 0.11, frame * 0.004) * 1.6;
      const dy = noise2D(`${seed}-dy`, i * 0.13, frame * 0.003) * 1.1;
      const dz = noise2D(`${seed}-dz`, i * 0.17, frame * 0.004) * 1.6;
      dummy.position.set(
        center[0] + bx + dx,
        center[1] + by + dy,
        center[2] + bz + dz,
      );
      const s = 0.6 + 0.5 * (0.5 + 0.5 * noise2D(`${seed}-s`, i, 0));
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [frame, count, area, center, dummy, seed]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial
        color={noir.ash}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// Fake-volumetric searchlight: an additive cone, apex up at the source.
export const Searchlight: React.FC<{
  frame: number;
  pos?: [number, number, number];
  height?: number;
  radius?: number;
  color?: string;
  opacity?: number;
  sweep?: number; // radians of slow sweep
  seed?: string;
}> = ({
  frame,
  pos = [0, 14, -6],
  height = 16,
  radius = 5,
  color = "#3a3f4e",
  opacity = 0.16,
  sweep = 0.25,
  seed = "sl",
}) => {
  const ang = noise2D(seed, frame * 0.006, 0) * sweep;
  return (
    <group position={pos} rotation={[0, 0, ang]}>
      <mesh position={[0, -height / 2, 0]}>
        <coneGeometry args={[radius, height, 24, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
