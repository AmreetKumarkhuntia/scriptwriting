import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { DotField, ServerCard } from "../mg/Cards";
import { EnterExit, Letterbox, Vignette } from "../components/Frame";
import { NoirTitle, PaperChip, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-Swarm — 360f (12s) @ 5:06. MOTION GRAPHICS v2.
// One server card, one cable, one plug — YANKED. Then the camera zooms WAY
// out: the whole board is a matrix of weight-squares, and a red ignition
// wave sweeps to the edges. You can't switch off what's everywhere.
// ---------------------------------------------------------------------------

const WORLD_W = 4800;
const WORLD_H = 2700;
const CX = 2400;
const CY = 1350;
const PULL = 70;
const IGNITE = 150;

const CAM: MoKey[] = [
  { f: 0, cam: { cx: CX + 60, cy: CY - 40, z: 1.05 } },
  { f: 12, cam: { cx: CX + 40, cy: CY - 20, z: 1.12 }, trans: 40, mode: "settle" },
  { f: 112, cam: { cx: CX, cy: CY, z: 0.52 }, trans: 56, mode: "settle" },
  { f: 235, cam: { cx: CX, cy: CY, z: 0.335 }, trans: 70, mode: "glide" },
];

// cable + plug, yanked by a spring
const CablePlug: React.FC<{ pull: number }> = ({ pull }) => {
  const dx = pull * 200;
  const rot = pull * 14;
  return (
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <svg width={560} height={140} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* cable — retracts slightly as the plug leaves */}
        <path
          d={`M 0 60 C 120 ${60 + 26 - pull * 18}, 210 ${60 - 20 + pull * 10}, ${300 - pull * 30} 60`}
          fill="none"
          stroke="#3a3a46"
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>
      {/* plug */}
      <div
        style={{
          position: "absolute",
          left: 292 + dx,
          top: 38,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 64, height: 44, background: "#34343e", borderRadius: 6 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 4 }}>
            <div style={{ width: 26, height: 8, background: "#c8ccd6" }} />
            <div style={{ width: 26, height: 8, background: "#c8ccd6" }} />
          </div>
        </div>
      </div>
      {/* socket spark */}
      {pull > 0.1 && pull < 0.7 ? (
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 44,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(229,35,61,${0.8 * (0.7 - pull)}) 0%, transparent 70%)`,
          }}
        />
      ) : null}
    </div>
  );
};

export const Swarm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pull = frame < PULL ? 0 : spring({ frame: frame - PULL, fps, config: { damping: 13, stiffness: 160, mass: 0.7 } });
  const dead = interpolate(frame, [PULL + 4, PULL + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ignite = interpolate(frame, [IGNITE, 330], [0, 3000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "cable", at: PULL }, // the yank
          { cue: "alert", at: PULL + 10, volume: 0.25 },
          { cue: "whoosh", at: 112, volume: 0.4 },
          { cue: "riserBig", at: IGNITE - 12 },
          { cue: "flare", at: IGNITE + 6 },
          { cue: "pop", at: 268 },
          { cue: "pop", at: 284 },
        ]}
      />
      <EnterExit>
        <Board wedges={false} />
        <MoStage keys={CAM} worldW={WORLD_W} worldH={WORLD_H}>
          {/* the weights matrix — whole world */}
          <DotField w={WORLD_W} h={WORLD_H} cell={34} ignite={ignite} origin={[CX, CY]} seed="sw2" />
          {/* clear apron behind the server so it reads */}
          <div
            style={{
              position: "absolute",
              left: CX - 340,
              top: CY - 400,
              width: 680,
              height: 800,
              background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${noir.void} 30%, transparent 75%)`,
            }}
          />
          {/* server + cable */}
          <WorldAnchor x={CX - 60} y={CY - 260} width={320}>
            <ServerCard at={4} dead={dead} w={300} />
          </WorldAnchor>
          <div style={{ position: "absolute", left: CX + 100, top: CY + 60 }}>
            <CablePlug pull={pull} />
          </div>
        </MoStage>

        {/* A: the closed-model equation */}
        {frame < 105 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 150px 110px" }}>
            <Sub at={26} size={34} color={noir.paper} style={{ textAlign: "left" }}>
              EK COMPANY · EK SERVER · EK <span style={{ color: noir.red }}>PLUG</span>
            </Sub>
          </AbsoluteFill>
        ) : null}

        {/* scrim so the reveal text reads over the bright field */}
        {frame >= 205 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 470,
              background: "linear-gradient(180deg, rgba(5,5,7,0.92) 30%, rgba(5,5,7,0.55) 70%, transparent 100%)",
              opacity: interpolate(frame, [205, 218], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        ) : null}

        {/* B/C: the reveal */}
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 140 }}>
          {frame >= 210 ? (
            <>
              <NoirTitle at={210} size={116} tracking={16}>
                LAKHON HARD DRIVES
              </NoirTitle>
              <Sub at={224} size={29} style={{ marginTop: 16 }}>
                IN PE KOI SWITCH KAAM NAHI KARTA
              </Sub>
            </>
          ) : null}
          {frame >= 264 ? (
            <div style={{ display: "flex", gap: 26, marginTop: 42 }}>
              <PaperChip at={266}>MISTRAL — OPEN</PaperChip>
              <PaperChip at={282} accent>
                CHINA — PEHLE SE OPEN
              </PaperChip>
            </div>
          ) : null}
        </AbsoluteFill>

        <Vignette />
      </EnterExit>
      <Letterbox />
    </AbsoluteFill>
  );
};

void fonts;
