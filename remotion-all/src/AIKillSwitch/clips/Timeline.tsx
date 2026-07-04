import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { key } from "../mg/motion";
import {
  GlobeDots,
  LetterCard,
  Panel,
  PanelSub,
  PanelTitle,
  TimelineSpine,
  useEnter,
} from "../mg/Cards";
import { EnterExit, Letterbox, Vignette } from "../components/Frame";
import { MonoCounter, PaperChip, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-Timeline — 360f (12s) @ cut-sheet 1:03.5. MOTION GRAPHICS v2.
// The dated spine: the camera FLIES station → station along a 6400px world.
//   S1  9 JUNE — FABLE 5 launch card lights up
//   S2  12 JUNE · 5:21 PM — the Commerce letter
//   S3  KUCH GHANTON MEIN — the world-globe dies
//   coda: pull WAY back — whole spine + 72 GHANTE counter
// ---------------------------------------------------------------------------

const WORLD_W = 6400;
const WORLD_H = 1800;
const SPINE_Y = 940;

const S1 = 1000;
const S2 = 2900;
const S3 = 4800;

const CAM: MoKey[] = [
  { f: 0, cam: { cx: 760, cy: 900, z: 0.82 } },
  { f: 8, cam: { cx: S1, cy: 860, z: 1.0 }, trans: 30, mode: "settle" },
  { f: 88, cam: { cx: S2, cy: 850, z: 1.02 }, trans: 44, mode: "settle" },
  { f: 198, cam: { cx: S3, cy: 850, z: 1.0 }, trans: 44, mode: "settle" },
  { f: 292, cam: { cx: 3200, cy: 880, z: 0.29 }, trans: 48, mode: "glide" },
];

// launch spark burst behind the S1 card
const Spark: React.FC<{ at: number; size?: number }> = ({ at, size = 260 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p <= 0) return null;
  const rays = 10;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
    >
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const r0 = size * 0.18 + p * size * 0.16;
        const r1 = r0 + size * 0.1 * (1 - p);
        return (
          <line
            key={i}
            x1={size / 2 + Math.cos(a) * r0}
            y1={size / 2 + Math.sin(a) * r0}
            x2={size / 2 + Math.cos(a) * r1}
            y2={size / 2 + Math.sin(a) * r1}
            stroke={noir.paper}
            strokeWidth={3}
            opacity={1 - p}
          />
        );
      })}
    </svg>
  );
};

const CodaCounter: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(at, 10);
  if (frame < at) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 148 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20, ...enter }}>
        <MonoCounter at={at + 2} to={72} dur={20} size={150} />
        <div style={{ fontFamily: fonts.display, fontSize: 56, color: noir.red, letterSpacing: 8 }}>
          GHANTE
        </div>
      </div>
      <Sub at={at + 14} size={26}>
        LIVE RAHA · PHIR EK ORDER SE GAYAB
      </Sub>
    </AbsoluteFill>
  );
};

export const Timeline: React.FC = () => {
  const frame = useCurrentFrame();

  // spine draws ahead of the flight
  const drawTo = key(frame, [
    { f: 0, v: 0.1 },
    { f: 40, v: 0.16 },
    { f: 88, v: 0.46 },
    { f: 150, v: 0.5 },
    { f: 198, v: 0.8 },
    { f: 260, v: 0.86 },
    { f: 300, v: 1 },
  ]);

  const globeLife = interpolate(frame, [252, 296], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "whoosh", at: 0, volume: 0.3 },
          { cue: "flare", at: 28, volume: 0.35 }, // launch light
          { cue: "whoosh", at: 88, volume: 0.4 }, // flight to S2
          { cue: "pop", at: 134 }, // letter lands
          { cue: "whoosh", at: 198, volume: 0.4 }, // flight to S3
          { cue: "riser", at: 215, volume: 0.4 },
          { cue: "alert", at: 256, volume: 0.3 }, // world dies
          { cue: "whoosh", at: 292, volume: 0.35 }, // pull-back
          { cue: "boom", at: 302, volume: 0.35 }, // 72
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM} worldW={WORLD_W} worldH={WORLD_H}>
          <TimelineSpine
            x={400}
            y={SPINE_Y}
            length={5600}
            drawTo={drawTo}
            stations={[
              { x: S1, date: "9 JUNE 2026", label: "FABLE 5 — LAUNCH", at: 18 },
              { x: S2, date: "12 JUNE · 5:21 PM", label: "COMMERCE SECRETARY KA LETTER", at: 112 },
              { x: S3, date: "KUCH GHANTON MEIN", label: "NA THROTTLE · NA REGION LOCK — BAS OFF", at: 224 },
            ]}
          />

          {/* S1 — launch card */}
          <WorldAnchor x={S1} y={520} width={620}>
            <div style={{ position: "relative" }}>
              <Spark at={30} />
              <Panel at={20} w={520} rib>
                <PanelTitle size={64}>FABLE 5</PanelTitle>
                <PanelSub>ANTHROPIC KA SABSE POWERFUL PUBLIC MODEL</PanelSub>
                <div style={{ marginTop: 16 }}>
                  <PaperChip at={34} accent>
                    LIVE
                  </PaperChip>
                </div>
              </Panel>
            </div>
          </WorldAnchor>

          {/* S2 — the letter */}
          <WorldAnchor x={S2} y={438} width={620}>
            <LetterCard at={118} w={300} />
          </WorldAnchor>

          {/* S3 — the world goes dark */}
          <WorldAnchor x={S3} y={430} width={640}>
            <GlobeDots size={430} life={globeLife} seed="tl2" />
            <div style={{ marginTop: 20 }}>
              {frame >= 250 ? (
                <PaperChip at={252} accent>
                  DUNIYA MEIN SAB KE LIYE — OFF
                </PaperChip>
              ) : null}
            </div>
          </WorldAnchor>
        </MoStage>

        {/* coda — screen-fixed over the wide shot */}
        {frame >= 300 ? <CodaCounter at={300} /> : null}

        <Vignette />
      </EnterExit>
      <Letterbox />
    </AbsoluteFill>
  );
};
