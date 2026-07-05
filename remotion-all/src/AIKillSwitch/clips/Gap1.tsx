import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { clamp, rev } from "../mg/motion";
import { FlatSwitch, LetterCard, Panel, PanelSub, PanelTitle, StampRing } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { Sub } from "../components/Type";
import { GapClip, MotifBlock, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap1 — 810f (27s) @ cut-sheet 0:14 (after ColdOpen). CASE FILE OPEN:
// re-anchor the letter, the switch that hits ALL AI, motif #1, "3 SAAL".
// Beat frames = overlays/O1 timing (word-synced). Local f = (t − 14.0s) × 30.
// ---------------------------------------------------------------------------

const DUR = 810;
const S1 = 1000;
const S2 = 2900;
const S3 = 4800;
const S4 = 6400;

const CAM = gapCam({ cx: 820, cy: 880, z: 0.84 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 164, x: S2, trans: 42 },
  { depart: 497, x: S3, trans: 42 },
  { depart: 665, x: S4, trans: 40 },
  { depart: 762, x: 3700, y: 900, z: 0.34, trans: 44, glide: true, drift: 0 },
], DUR);

// the switch wired to every model — draw-on wires into a chip column
const WireFan: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const names = ["FABLE 5", "MYTHOS 5", "GPT-5.5", "GPT-5.6"];
  const enter = clamp(rev(frame, at, 12) * 1.6, 0, 1);
  return (
    <div style={{ display: "flex", alignItems: "center", opacity: enter }}>
      <FlatSwitch flip={1} size={190} />
      <svg width={230} height={380} style={{ flexShrink: 0 }}>
        {names.map((_, i) => {
          const p = rev(frame, at + 10 + i * 6, 12);
          const y2 = 52 + i * 92;
          return (
            <line
              key={i}
              x1={6}
              y1={190}
              x2={6 + (224 * p)}
              y2={190 + (y2 - 190) * p}
              stroke={noir.smoke}
              strokeWidth={3}
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {names.map((n, i) => {
          const p = clamp(rev(frame, at + 16 + i * 6, 10) * 1.6, 0, 1);
          return (
            <div
              key={n}
              style={{
                width: 250,
                padding: "12px 20px 9px",
                background: "#131318",
                border: "1px solid #2c2c36",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: p,
                transform: `translateY(${10 * (1 - p)}px)`,
              }}
            >
              <span
                style={{ fontFamily: fonts.display, fontSize: 30, letterSpacing: 3, color: noir.paper }}
              >
                {n}
              </span>
              <span style={{ width: 12, height: 12, background: noir.red, borderRadius: 2 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Gap1: React.FC = () => (
  <GapClip
    kicker="KILL SWITCH"
    label="CASE FILE"
    cam={CAM}
    worldW={8000}
    worldH={1800}
    flashes={[713]}
    cues={[
      { cue: "whoosh", at: 0, volume: 0.3 },
      { cue: "pop", at: 12 },
      { cue: "whoosh", at: 164, volume: 0.35 },
      { cue: "swoosh", at: 212, volume: 0.3 },
      { cue: "whoosh", at: 497, volume: 0.35 },
      { cue: "riser", at: 520, volume: 0.35 },
      { cue: "boom", at: 545, volume: 0.35 },
      { cue: "whoosh", at: 665, volume: 0.35 },
      { cue: "impact", at: 713 },
      { cue: "whoosh", at: 762, volume: 0.3 },
    ]}
  >
    {/* S1 — the inciting document, re-anchored after the ColdOpen */}
    <WorldAnchor x={S1} y={620} width={960}>
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <LetterCard at={26} w={250} />
        <Panel at={10} w={520} rib>
          <PanelTitle size={54}>12 JUNE · 5:21 PM</PanelTitle>
          <PanelSub>COMMERCE SECRETARY KA LETTER</PanelSub>
        </Panel>
      </div>
    </WorldAnchor>

    {/* S2 — one switch, every AI */}
    <WorldAnchor x={S2} y={520} width={1400}>
      <Headline at={210} words="EK SWITCH — SAARE AI" size={104} markWord={3} />
      <div style={{ marginTop: 44 }}>
        <WireFan at={250} />
      </div>
    </WorldAnchor>

    {/* S3 — the spine, first strike */}
    <WorldAnchor x={S3} y={740} width={1600}>
      <MotifBlock at={543} />
    </WorldAnchor>

    {/* S4 — teen saal se yehi sawal */}
    <WorldAnchor x={S4} y={680} width={900}>
      <StampRing at={711} size={120}>
        3 SAAL
      </StampRing>
      <div style={{ marginTop: 40 }}>
        <Sub at={727} size={26}>
          TEEN SAAL SE YEHI SAWAL
        </Sub>
      </div>
    </WorldAnchor>
  </GapClip>
);
