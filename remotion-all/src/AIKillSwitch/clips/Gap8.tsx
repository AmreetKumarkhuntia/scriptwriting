import React from "react";
import { noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { Panel, PanelSub, PanelTitle, StampRing } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { GapClip, SlamSwitch, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap8 — 405f (13.5s) @ 4:52.5 (after OrderVsRequest). PATTERN: two cases,
// one stamp — and the tease of the AI no switch can touch (sets up Swarm).
// Beats = overlays/O8. Local f = (t − 292.5s) × 30.
// ---------------------------------------------------------------------------

const DUR = 405;
const S1 = 1100;
const S2 = 3300;

const CAM = gapCam({ cx: 900, cy: 880, z: 0.87 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 192, x: S2 },
], DUR);

export const Gap8: React.FC = () => (
  <GapClip
    kicker="CASE 05"
    label="PATTERN"
    cam={CAM}
    worldW={5200}
    worldH={1800}
    flashes={[155]}
    cues={[
      { cue: "whoosh", at: 0, volume: 0.3 },
      { cue: "pop", at: 16 },
      { cue: "pop", at: 28 },
      { cue: "rise", at: 140, volume: 0.35 },
      { cue: "impact", at: 155 },
      { cue: "whoosh", at: 192, volume: 0.35 },
      { cue: "switchOff", at: 300, volume: 0.4 },
      { cue: "pop", at: 317 },
    ]}
  >
    {/* S1 — two cases, one stamp across both */}
    <WorldAnchor x={S1} y={700} width={1100}>
      <div style={{ position: "relative", display: "flex", gap: 52 }}>
        <Panel at={14} w={440}>
          <PanelTitle size={44}>ANTHROPIC</PanelTitle>
          <PanelSub>LEGAL ORDER SE OFF</PanelSub>
        </Panel>
        <Panel at={26} w={440}>
          <PanelTitle size={44}>OPENAI</PanelTitle>
          <PanelSub>REQUEST SE RESTRICT</PanelSub>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "34%",
            transform: "translateX(-50%)",
          }}
        >
          <StampRing at={153} size={110} rotate={-9}>
            PATTERN
          </StampRing>
        </div>
      </div>
    </WorldAnchor>

    {/* S2 — the tease into Swarm */}
    <WorldAnchor x={S2} y={520} width={1500}>
      <Headline at={234} words="EK AI — JISE SWITCH CHHU BHI NAHI SAKTI" size={70} markWord={7} />
      <div style={{ display: "flex", alignItems: "center", gap: 64, marginTop: 56 }}>
        <SlamSwitch at={300} size={200} />
        <Panel at={317} w={320}>
          <PanelTitle size={48}>
            <span style={{ color: noir.red }}>?</span>
          </PanelTitle>
          <PanelSub>SWITCH SE BAAHAR</PanelSub>
        </Panel>
      </div>
    </WorldAnchor>
  </GapClip>
);
