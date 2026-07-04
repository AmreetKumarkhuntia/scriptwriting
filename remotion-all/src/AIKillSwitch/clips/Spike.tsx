import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// AIKillSwitch-Spike — WSL headless-GL smoke test.
// A lit wireframe monolith in fog; keyframed camera dolly with ease + settle.
// If this renders correct pixels at acceptable speed, real 3D is a GO.
// ---------------------------------------------------------------------------

const VOID = "#0A0A0C";
const RED = "#E5233D";
const PAPER = "#F2EFE9";

const ease = (t: number) => 1 - Math.pow(1 - t, 3); // cubic out

const SpikeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Camera dolly: pull back + rise, settle by ~55% then hold.
  const t = ease(Math.min(1, frame / (durationInFrames * 0.55)));
  const camZ = interpolate(t, [0, 1], [4, 9]);
  const camY = interpolate(t, [0, 1], [0.4, 2.2]);

  return (
    <>
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 4, 16]} />
      <CameraRig position={[2.5, camY, camZ]} lookAt={[0, 1, 0]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 5, 4]} intensity={40} color={PAPER} />
      <pointLight position={[-3, 1, 2]} intensity={25} color={RED} />
      {/* monolith */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.2, 3, 0.6]} />
        <meshStandardMaterial color="#1a1a1f" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* wireframe shell */}
      <mesh position={[0, 1, 0]} scale={1.02}>
        <boxGeometry args={[1.2, 3, 0.6]} />
        <meshBasicMaterial color={RED} wireframe transparent opacity={0.5} />
      </mesh>
      {/* ground grid */}
      <gridHelper args={[40, 40, "#2a2a30", "#17171b"]} position={[0, -0.5, 0]} />
    </>
  );
};

// Minimal camera controller: mutate the default camera every frame.
// (Raw fiber has no makeDefault on <perspectiveCamera/> — that's a drei-ism.)
const CameraRig: React.FC<{
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}> = ({ position, lookAt, fov = 45 }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  React.useLayoutEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...lookAt);
    camera.fov = fov;
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  });
  return null;
};

export const Spike: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: VOID }}>
      <ThreeCanvas width={width} height={height}>
        <SpikeScene />
      </ThreeCanvas>
      {/* DOM overlay text — must stay pixel-stable while the camera moves */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: 80,
          opacity: interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            color: PAPER,
            fontFamily: "sans-serif",
            fontSize: 48,
            letterSpacing: 8,
          }}
        >
          SPIKE — GL CHECK
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
