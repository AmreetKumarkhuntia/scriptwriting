import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { key, rev } from "../mg/motion";
import {
  BarrierTape,
  FlatSwitch,
  GaugeArc,
  LetterCard,
  Panel,
  PanelSub,
  PanelTitle,
  TimelineSpine,
} from "../mg/Cards";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { DateSuper, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-SwitchBack — 360f (12s) @ 3:52. MOTION GRAPHICS v2.
// The dated spine returns (continuity with KS-Timeline):
//   the 19-DIN gap bracket → 1 JULY station: second letter, the switch flips
//   back ON (f132), the 99%+ classifier gauge → fly right: MYTHOS still
//   behind the barrier tape.
// ---------------------------------------------------------------------------

const WORLD_W = 6400;
const WORLD_H = 1800;
const SPINE_Y = 1010;
const S_OFF = 1200; // 12 June (where the story left off)
const S_ON = 3150; // 1 July
const S_MYTHOS = 5000;
const SLAM = 132;

const CAM: MoKey[] = [
  { f: 0, cam: { cx: S_OFF, cy: 900, z: 0.8 } },
  { f: 14, cam: { cx: (S_OFF + S_ON) / 2, cy: 880, z: 0.74 }, trans: 40, mode: "settle" },
  { f: 88, cam: { cx: S_ON, cy: 850, z: 1.0 }, trans: 40, mode: "settle" },
  { f: 176, cam: { cx: S_ON + 240, cy: 830, z: 1.04 }, trans: 30, mode: "settle" },
  { f: 282, cam: { cx: S_MYTHOS, cy: 860, z: 0.98 }, trans: 44, mode: "settle" },
];

export const SwitchBack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slam = frame < SLAM ? 0 : spring({ frame: frame - SLAM, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const flip = 1 - slam; // OFF (1) → ON (0)

  const drawTo = key(frame, [
    { f: 0, v: 0.3 },
    { f: 60, v: 0.52 },
    { f: 130, v: 0.62 },
    { f: 282, v: 0.9 },
    { f: 330, v: 1 },
  ]);

  const bracketP = rev(frame, 26, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "swoosh", at: 20, volume: 0.3 },
          { cue: "pop", at: 62 }, // second letter
          { cue: "rise", at: 92, volume: 0.4 },
          { cue: "boom", at: SLAM }, // slam ON
          { cue: "flare", at: 148 }, // gauge lights
          { cue: "whoosh", at: 282, volume: 0.4 },
          { cue: "alert", at: 300 }, // Mythos still gated
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM} worldW={WORLD_W} worldH={WORLD_H}>
          <TimelineSpine
            x={600}
            y={SPINE_Y}
            length={5200}
            drawTo={drawTo}
            stations={[
              { x: S_OFF, date: "12 JUNE", label: "OFF — SARKARI ORDER", at: 4 },
              { x: S_ON, date: "1 JULY 2026", label: "WAPAS ON — COMMERCE KA DUSRA LETTER", at: 96 },
              { x: S_MYTHOS, date: "MYTHOS 5", label: "ABHI BHI SIRF APPROVED US ORGS", at: 292 },
            ]}
          />

          {/* the 19-DIN gap bracket between the stations */}
          <div
            style={{
              position: "absolute",
              left: S_OFF + 60,
              top: SPINE_Y - 210,
              width: (S_ON - S_OFF - 120) * bracketP,
              borderTop: `3px dashed ${noir.smoke}`,
              height: 40,
              borderLeft: `3px solid ${noir.smoke}`,
              borderRight: bracketP >= 1 ? `3px solid ${noir.smoke}` : undefined,
            }}
          />
          <WorldAnchor x={(S_OFF + S_ON) / 2} y={SPINE_Y - 420} width={800}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 150,
                color: noir.red,
                letterSpacing: 10,
                opacity: rev(frame, 34, 12),
              }}
            >
              19 DIN
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 26,
                fontWeight: 600,
                color: noir.ash,
                letterSpacing: 5,
                textTransform: "uppercase",
                marginTop: 8,
                opacity: rev(frame, 44, 12),
              }}
            >
              FABLE 5 — GAYAB
            </div>
          </WorldAnchor>

          {/* 1 July station: letter + switch + gauge */}
          <WorldAnchor x={S_ON - 330} y={520} width={300}>
            <LetterCard at={58} w={230} heading="U.S. DEPT OF COMMERCE" bandAt={70} />
          </WorldAnchor>
          <WorldAnchor x={S_ON + 60} y={430} width={480}>
            <FlatSwitch flip={flip} size={340} hitAt={SLAM} />
          </WorldAnchor>
          <WorldAnchor x={S_ON + 620} y={520} width={400}>
            {frame >= 186 ? <GaugeArc at={188} pct={99} size={330} /> : null}
            {frame >= 206 ? (
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 22,
                  fontWeight: 600,
                  color: noir.ash,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginTop: 14,
                  opacity: rev(frame, 208, 10),
                }}
              >
                NAYA CLASSIFIER · JAILBREAK BLOCKED
              </div>
            ) : null}
          </WorldAnchor>

          {/* Mythos — still gated */}
          <WorldAnchor x={S_MYTHOS} y={520} width={620}>
            <div style={{ position: "relative" }}>
              <Panel at={288} w={480} dim={0.25}>
                <PanelTitle size={62}>MYTHOS 5</PanelTitle>
                <PanelSub>FABLE KA BADA BHAI — LOCKED</PanelSub>
              </Panel>
              <div style={{ position: "absolute", left: -60, top: 76 }}>
                <BarrierTape at={302} w={620} text="US ORGS ONLY" angle={-7} />
              </div>
            </div>
          </WorldAnchor>
        </MoStage>

        <DateSuper at={10}>1 JULY 2026 · 19 DIN BAAD</DateSuper>

        {frame >= 236 && frame < 276 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 132 }}>
            <Sub at={238} size={28} color={noir.paper}>
              OFF BHI WASHINGTON NE KIYA — <span style={{ color: noir.red }}>ON BHI</span>
            </Sub>
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={SLAM} color={"#cfd8e6"} />
      <Letterbox />
    </AbsoluteFill>
  );
};
