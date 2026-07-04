import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { rev } from "../mg/motion";
import { FlatSwitch, LetterCard } from "../mg/Cards";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { NoirTitle, PaperChip, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-ColdOpen — 420f (14s) @ 0:00. MOTION GRAPHICS v2.
// One flight across the story's first hour:
//   R1 giant date type  →  R2 the letter  →  R3 the switch WALL: a grid of
//   app windows around the big rocker; it SLAMS OFF (f196) and the windows
//   die in a cascade  →  pull back wide, KILL SWITCH lockup.
// ---------------------------------------------------------------------------

const WORLD_W = 4800;
const WORLD_H = 1800;
const R1 = 900;
const R2 = 2300;
const R3 = 3760;
const SLAM = 196;

const CAM: MoKey[] = [
  { f: 0, cam: { cx: R1, cy: 900, z: 0.9 } },
  { f: 10, cam: { cx: R1, cy: 900, z: 0.98 }, trans: 46, mode: "glide" },
  { f: 62, cam: { cx: R2, cy: 880, z: 1.0 }, trans: 38, mode: "settle" },
  { f: 150, cam: { cx: R3, cy: 880, z: 1.02 }, trans: 40, mode: "settle" },
  { f: 244, cam: { cx: R3, cy: 880, z: 1.14 }, trans: 30, mode: "settle" },
  { f: 322, cam: { cx: 2400, cy: 900, z: 0.36 }, trans: 56, mode: "glide" },
];

// small app-window card that dies in the cascade
const MiniWin: React.FC<{ x: number; y: number; dieAt: number; seedRow: number }> = ({
  x,
  y,
  dieAt,
  seedRow,
}) => {
  const frame = useCurrentFrame();
  const dead = frame >= dieAt;
  const flicker = !dead && frame >= dieAt - 6 && Math.floor((frame + seedRow) / 2) % 2 === 0;
  const lit = dead ? 0 : flicker ? 0.3 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 168,
        height: 118,
        background: "#15151b",
        border: `1px solid ${dead ? "#1c1c22" : "#2c2c36"}`,
        borderRadius: 10,
        padding: "12px 14px",
        opacity: dead ? 0.45 : 1,
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: lit > 0.5 ? noir.red : "#26262c" }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: lit > 0.5 ? "#4a4a58" : "#26262c" }} />
      </div>
      <div style={{ height: 9, width: "82%", background: lit > 0.5 ? "#cfd8e6" : "#22222a", opacity: 0.9 * Math.max(0.3, lit) }} />
      <div style={{ height: 9, width: "58%", background: "#3a3a46", marginTop: 8, opacity: Math.max(0.3, lit) }} />
      <div style={{ height: 9, width: "70%", background: "#3a3a46", marginTop: 8, opacity: Math.max(0.3, lit) }} />
    </div>
  );
};

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // switch flip OFF at SLAM
  const slam = spring({ frame: frame - SLAM, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const flip = frame < SLAM ? 0 : slam;

  // window wall: grid positions flanking + above the switch
  const wall = React.useMemo(() => {
    const cells: { x: number; y: number; i: number }[] = [];
    let i = 0;
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 4; row++) {
        cells.push({ x: R3 - 620 + col * 190, y: 380 + row * 148, i: i++ }); // left block
        cells.push({ x: R3 + 280 + col * 190, y: 380 + row * 148, i: i++ }); // right block
      }
    }
    return cells;
  }, []);

  const titleAt = 338;

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "whoosh", at: 0, volume: 0.35 },
          { cue: "rise", at: 60, volume: 0.4 },
          { cue: "swoosh", at: 100, volume: 0.3 },
          { cue: "pop", at: 146 }, // letter band snap
          { cue: "boom", at: SLAM },
          { cue: "riser", at: 235, volume: 0.35 },
          { cue: "boom", at: titleAt, volume: 0.4 },
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM} worldW={WORLD_W} worldH={WORLD_H}>
          {/* R1 — the giant date */}
          <WorldAnchor x={R1} y={620} width={1400}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 100,
                color: noir.ash,
                letterSpacing: 16,
                opacity: rev(frame, 4, 12),
              }}
            >
              SHUKRAVAAR
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 240,
                color: noir.paper,
                letterSpacing: 10,
                lineHeight: 1,
                marginTop: 8,
                opacity: rev(frame, 10, 12),
              }}
            >
              12 JUNE 2026
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 26,
                opacity: rev(frame, 22, 12),
              }}
            >
              <div style={{ width: 12, height: 44, background: noir.red }} />
              <div style={{ fontFamily: fonts.display, fontSize: 88, color: noir.red, letterSpacing: 8 }}>
                5:21 PM
              </div>
            </div>
          </WorldAnchor>

          {/* R2 — the letter */}
          <WorldAnchor x={R2} y={430} width={700}>
            <LetterCard at={94} w={330} bandAt={146} />
            <div style={{ marginTop: 26 }}>
              <PaperChip at={122}>US GOVERNMENT → ANTHROPIC</PaperChip>
            </div>
          </WorldAnchor>

          {/* R3 — the switch wall */}
          {wall.map((c) => (
            <MiniWin
              key={c.i}
              x={c.x}
              y={c.y}
              seedRow={c.i * 3}
              dieAt={238 + ((c.i * 7) % 24) * 3.2} // staggered cascade f238–315
            />
          ))}
          <WorldAnchor x={R3} y={430} width={520}>
            <FlatSwitch flip={flip} size={400} hitAt={SLAM} />
          </WorldAnchor>
        </MoStage>

        {/* title lockup on the wide shot */}
        {frame >= titleAt ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 24, paddingBottom: 36 }}>
            <NoirTitle at={titleAt} size={200} tracking={26}>
              KILL <span style={{ color: noir.red }}>SWITCH</span>
            </NoirTitle>
            <Sub at={titleAt + 10} size={30}>
              72 GHANTE · PHIR SAB OFF
            </Sub>
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={SLAM} />
      <Letterbox />
    </AbsoluteFill>
  );
};

void interpolate;
