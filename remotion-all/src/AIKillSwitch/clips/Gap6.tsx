import React from "react";
import { WorldAnchor } from "../mg/Stage";
import { ExhibitFrame, StampRing } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { Sub } from "../components/Type";
import { GapClip, QuoteBlock, RedSlab, SlamSwitch, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap6 — 771f (25.7s) @ 3:26.3 (after StampGate). THE IRONY EXHIBIT:
// their own safety pitch became the lever. Ends on "19 DIN" pre-lapping
// SwitchBack's spine. Beats = overlays/O6. Local f = (t − 206.3s) × 30.
// ---------------------------------------------------------------------------

const DUR = 771;
const S1 = 1100;
const S2 = 3000;
const S3 = 4900;
const S4 = 6300;

const CAM = gapCam({ cx: 900, cy: 880, z: 0.86 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 186, x: S2 },
  { depart: 333, x: S3 },
  { depart: 489, x: S4 },
], DUR);

export const Gap6: React.FC = () => (
  <GapClip
    kicker="CASE 04"
    label="IRONY"
    cam={CAM}
    worldW={7400}
    worldH={1800}
    flashes={[252, 701]}
    cues={[
      { cue: "whoosh", at: 0, volume: 0.3 },
      { cue: "pop", at: 54 },
      { cue: "swoosh", at: 95, volume: 0.3 },
      { cue: "whoosh", at: 186, volume: 0.35 },
      { cue: "switchOff", at: 252, volume: 0.45 },
      { cue: "whoosh", at: 333, volume: 0.35 },
      { cue: "boom", at: 377, volume: 0.4 },
      { cue: "whoosh", at: 489, volume: 0.35 },
      { cue: "riser", at: 682, volume: 0.35 },
      { cue: "impact", at: 701 },
    ]}
  >
    {/* S1 — the brand line, framed like museum evidence */}
    <WorldAnchor x={S1} y={540} width={1100}>
      <ExhibitFrame at={52} w={960} h={560} label="ANTHROPIC KI BRAND LINE" accent>
        <QuoteBlock at={93} quote="Humein regulate karo — AI bahut khatarnak hai." w={800} size={42} />
      </ExhibitFrame>
    </WorldAnchor>

    {/* S2 — that line became the lever */}
    <WorldAnchor x={S2} y={500} width={1400}>
      <Headline at={228} words="WAHI LINE → LEVER BAN GAYI" size={84} markWord={3} />
      <div style={{ marginTop: 52 }}>
        <SlamSwitch at={252} size={240} />
      </div>
    </WorldAnchor>

    {/* S3 — safety didn't save, it armed */}
    <WorldAnchor x={S3} y={620} width={1400}>
      <Headline at={375} words="SAFETY NE BACHAYA NAHI" size={92} />
      <div style={{ marginTop: 42 }}>
        <RedSlab at={403} size={64}>
          HATHIYAR DE DIYA
        </RedSlab>
      </div>
    </WorldAnchor>

    {/* S4 — the turn: how did it come back? */}
    <WorldAnchor x={S4} y={560} width={1300}>
      <Headline at={531} words="SWITCH WAPAS ON KAISE HUA?" size={88} markWord={2} />
      <div style={{ marginTop: 58 }}>
        <StampRing at={699} size={110}>
          19 DIN
        </StampRing>
      </div>
      <div style={{ marginTop: 36 }}>
        <Sub at={717} size={26}>
          MEIN SWITCH WAPAS ON HUA
        </Sub>
      </div>
    </WorldAnchor>
  </GapClip>
);
