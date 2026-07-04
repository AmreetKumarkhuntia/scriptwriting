import React from "react";
import * as THREE from "three";
import { noir } from "../../theme";

// ---------------------------------------------------------------------------
// The government letter — a paper dart flying a bezier path, banking as it
// turns. `t` 0..1 along the flight; the scene eases t. At t=1 it holds flat
// (slapped against whatever it hit).
// ---------------------------------------------------------------------------

export type V3 = [number, number, number];

const qBezier = (a: V3, c: V3, b: V3, t: number): V3 => {
  const u = 1 - t;
  return [
    u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
    u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
    u * u * a[2] + 2 * u * t * c[2] + t * t * b[2],
  ];
};

export const Letter: React.FC<{
  t: number;
  from: V3;
  ctrl: V3;
  to: V3;
  scale?: number;
}> = ({ t, from, ctrl, to, scale = 1 }) => {
  const tt = Math.min(1, Math.max(0, t));
  const pos = qBezier(from, ctrl, to, tt);
  const ahead = qBezier(from, ctrl, to, Math.min(1, tt + 0.02));

  const geo = React.useMemo(() => {
    // folded paper dart: two wing triangles meeting at a raised crease
    const g = new THREE.BufferGeometry();
    // prettier-ignore
    const verts = new Float32Array([
      // left wing: nose, tailL, creaseTail
      0, 0, 1.1,   -0.62, 0, -0.55,   0, 0.16, -0.5,
      // right wing: nose, creaseTail, tailR
      0, 0, 1.1,   0, 0.16, -0.5,   0.62, 0, -0.55,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  const groupRef = React.useRef<THREE.Group>(null);
  React.useLayoutEffect(() => {
    const gr = groupRef.current;
    if (!gr) return;
    gr.position.set(pos[0], pos[1], pos[2]);
    if (tt < 0.999) {
      gr.lookAt(ahead[0], ahead[1], ahead[2]);
      // bank into the turn
      const bank = (ahead[0] - pos[0]) * -1.4;
      gr.rotateZ(bank);
    } else {
      gr.lookAt(ahead[0], ahead[1], ahead[2]);
    }
  });

  // Landed: the dart "unfolds" into a readable letter pinned where it hit.
  if (tt >= 0.985) {
    return (
      <group position={to} scale={scale}>
        <mesh>
          <planeGeometry args={[1.5, 2.05]} />
          <meshStandardMaterial color={noir.paper} roughness={0.75} />
        </mesh>
        {/* classification band + text lines */}
        <mesh position={[0, 0.75, 0.01]}>
          <planeGeometry args={[1.2, 0.16]} />
          <meshBasicMaterial color={noir.red} toneMapped={false} />
        </mesh>
        {[0.42, 0.22, 0.02, -0.18, -0.38, -0.58].map((y, i) => (
          <mesh key={i} position={[i % 3 === 2 ? -0.18 : 0, y, 0.01]}>
            <planeGeometry args={[i % 3 === 2 ? 0.8 : 1.16, 0.05]} />
            <meshBasicMaterial color={"#9a978f"} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef} scale={scale}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          color={noir.paper}
          roughness={0.7}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* red classification band near the nose */}
      <mesh position={[0, 0.012, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.16]} />
        <meshBasicMaterial color={noir.red} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
};
