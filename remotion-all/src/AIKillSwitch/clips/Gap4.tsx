import React from "react";
import { WorldAnchor } from "../mg/Stage";
import { Panel, PanelSub, PanelTitle, StampRing } from "../mg/Cards";
import { BoardLine, DocCard, GapClip, R, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap4 — 570f (19s) @ 2:08.5 (after Network). THE REFUSAL CHAIN: Anthropic
// says no, the flaw is "minor", the government reaches for a 2018 law that was
// never built for this. Beats = overlays/O4 timing. Local f = (t − 128.5s) × 30.
// ---------------------------------------------------------------------------

const DUR = 570;
const S1 = 1100;
const S2 = 2900;
const S3 = 4700;

const CAM = gapCam({ cx: 900, cy: 880, z: 0.88 }, [
  { depart: 8, x: S1, trans: 20 },
  { depart: 120, x: S2 },
  { depart: 279, x: S3 },
  { depart: 500, x: 3300, y: 900, z: 0.4, trans: 44, glide: true, drift: 0 },
], DUR);

export const Gap4: React.FC = () => (
  <GapClip
    kicker="CASE 02"
    label="ANDAR SE CALL"
    cam={CAM}
    worldW={6600}
    worldH={1800}
    flashes={[30, 239]}
    cues={[
      { cue: "rise", at: 8, volume: 0.35 },
      { cue: "impact", at: 32 },
      { cue: "pop", at: 80 },
      { cue: "whoosh", at: 120, volume: 0.35 },
      { cue: "pop", at: 164 },
      { cue: "boom", at: 239, volume: 0.4 },
      { cue: "whoosh", at: 279, volume: 0.35 },
      { cue: "pop", at: 323 },
      { cue: "alert", at: 407, volume: 0.35 },
      { cue: "whoosh", at: 500, volume: 0.3 },
    ]}
  >
    {/* S1 — the refusal, stamped on the file */}
    <WorldAnchor x={S1} y={720} width={900}>
      <div style={{ position: "relative" }}>
        <Panel at={12} w={520}>
          <PanelTitle size={56}>ANTHROPIC</PanelTitle>
          <PanelSub>SECURITY FLAW · REVIEW</PanelSub>
        </Panel>
        <div style={{ position: "absolute", top: -64, right: -110 }}>
          <StampRing at={30} size={92} rotate={-14}>
            REFUSED
          </StampRing>
        </div>
      </div>
      <Panel at={78} w={520} style={{ marginTop: 38 }}>
        <PanelTitle size={44}>{'FLAW: "MINOR"'}</PanelTitle>
        <PanelSub>ANTHROPIC KI REVIEW</PanelSub>
      </Panel>
    </WorldAnchor>

    {/* S2 — replicates on public models; the government pulls it anyway */}
    <WorldAnchor x={S2} y={700} width={1200}>
      <Panel at={162} w={560} rib>
        <PanelTitle size={50}>GPT-5.5 PE BHI</PanelTitle>
        <PanelSub>REPLICATE HOTA HAI</PanelSub>
      </Panel>
      <div style={{ marginTop: 46 }}>
        <BoardLine at={237} size={50}>
          GOVERNMENT NE <R>KHUD HATA DIYA</R>
        </BoardLine>
      </div>
    </WorldAnchor>

    {/* S3 — the tool they picked up */}
    <WorldAnchor x={S3} y={660} width={1200}>
      <DocCard at={321} title="2018 KA KANOON" tag="EXPORT LAW" w={420} />
      <div style={{ marginTop: 48 }}>
        <BoardLine at={405} size={46}>
          IS KAAM KE LIYE <R>BANA HI NAHI THA</R>
        </BoardLine>
      </div>
    </WorldAnchor>
  </GapClip>
);
