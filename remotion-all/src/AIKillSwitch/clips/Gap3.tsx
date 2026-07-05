import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { clamp, rev } from "../mg/motion";
import { Panel, PanelSub, PanelTitle, ServerCard, StampRing } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { PaperChip, Sub } from "../components/Type";
import { DocCard, GapClip, RedSlab, StrikeBlock, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap3 — 1350f (45s) @ 1:15.5 (after Timeline). The longest gap: both
// models go DARK, the "safety bug" myth dies, the jailbreak demo, AMAZON.
// Beats = overlays/O3 timing. Local f = (t − 75.5s) × 30.
// ---------------------------------------------------------------------------

const DUR = 1350;
const S1 = 1100;
const S2 = 2750;
const S3 = 4300;
const S4 = 5800;
const S5 = 7300;
const S6 = 8900;
const S7 = 10500;

const CAM = gapCam({ cx: 860, cy: 880, z: 0.85 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 243, x: S2 },
  { depart: 417, x: S3 },
  { depart: 492, x: S4 },
  { depart: 729, x: S5 },
  { depart: 954, x: S6, z: 0.97 },
  { depart: 1176, x: S7 },
], DUR);

// server rack + nameplate + status chip; goes DARK (strike + tag) at deadAt
const ModelRack: React.FC<{
  at: number;
  chipAt: number;
  deadAt: number;
  name: string;
  status: string;
}> = ({ at, chipAt, deadAt, name, status }) => {
  const frame = useCurrentFrame();
  const dead = rev(frame, deadAt, 10);
  const nameP = clamp(rev(frame, at + 8, 10) * 1.6, 0, 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative" }}>
        <ServerCard at={at} dead={dead} w={250} />
        {frame >= deadAt ? (
          <>
            <div
              style={{
                position: "absolute",
                left: "-5%",
                top: "46%",
                width: `${dead * 110}%`,
                height: 9,
                background: noir.red,
                transform: "rotate(-7deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                fontFamily: fonts.display,
                fontSize: 32,
                letterSpacing: 5,
                color: noir.red,
                opacity: clamp(dead * 1.5, 0, 1),
              }}
            >
              DARK
            </div>
          </>
        ) : null}
      </div>
      <div style={{ opacity: nameP }}>
        <PanelTitle size={46}>{name}</PanelTitle>
      </div>
      <PaperChip at={chipAt} accent>
        {status}
      </PaperChip>
    </div>
  );
};

export const Gap3: React.FC = () => {
  const frame = useCurrentFrame();
  const subP = clamp(rev(frame, 1287, 10) * 1.6, 0, 1);
  const stringP = rev(frame, 1282, 22);
  return (
    <GapClip
      kicker="CASE 01"
      label="THE LETTER"
      cam={CAM}
      worldW={11200}
      worldH={1800}
      flashes={[858, 1220]}
      cues={[
        { cue: "whoosh", at: 0, volume: 0.3 },
        { cue: "pop", at: 113 },
        { cue: "pop", at: 128 },
        { cue: "glitch", at: 195, volume: 0.3 },
        { cue: "glitch", at: 207, volume: 0.3 },
        { cue: "whoosh", at: 243, volume: 0.35 },
        { cue: "whoosh", at: 417, volume: 0.35 },
        { cue: "impact", at: 461 },
        { cue: "whoosh", at: 492, volume: 0.3 },
        { cue: "pop", at: 642 },
        { cue: "whoosh", at: 729, volume: 0.3 },
        { cue: "riser", at: 810, volume: 0.35 },
        { cue: "boom", at: 860, volume: 0.4 },
        { cue: "whoosh", at: 954, volume: 0.35 },
        { cue: "pop", at: 998 },
        { cue: "pop", at: 1031 },
        { cue: "alert", at: 1085, volume: 0.3 },
        { cue: "pop", at: 1142 },
        { cue: "whoosh", at: 1176, volume: 0.35 },
        { cue: "boom", at: 1220, volume: 0.4 },
      ]}
    >
      {/* S1 — both models live… then DARK (f195 / f207) */}
      <WorldAnchor x={S1} y={620} width={1100}>
        <div style={{ display: "flex", gap: 70 }}>
          <ModelRack at={46} chipAt={111} deadAt={195} name="FABLE 5" status="LIVE · PUBLIC" />
          <ModelRack at={60} chipAt={126} deadAt={207} name="MYTHOS 5" status="LIVE · PARTNERS" />
        </div>
      </WorldAnchor>

      {/* S2 — how it went down */}
      <WorldAnchor x={S2} y={640} width={1400}>
        <Headline at={285} words="NO THROTTLE · NO REGION LOCK" size={80} />
        <div style={{ marginTop: 36 }}>
          <RedSlab at={315} size={64}>
            SIRF OFF
          </RedSlab>
        </div>
      </WorldAnchor>

      {/* S3 — the stat */}
      <WorldAnchor x={S3} y={800} width={1000}>
        <StampRing at={459} size={100}>
          72 GHANTE LIVE
        </StampRing>
      </WorldAnchor>

      {/* S4 — history line */}
      <WorldAnchor x={S4} y={660} width={1400}>
        <Headline at={534} words="PEHLI BAAR" size={140} />
        <div style={{ marginTop: 30 }}>
          <Sub at={560} size={30}>
            LIVE FRONTIER AI — GAYAB
          </Sub>
        </div>
        <div style={{ marginTop: 34 }}>
          <PaperChip at={640} accent>
            POORI DUNIYA SE — EK SAATH
          </PaperChip>
        </div>
      </WorldAnchor>

      {/* S5 — the myth dies */}
      <WorldAnchor x={S5} y={620} width={1400}>
        <StrikeBlock at={771} strikeAt={840} replaceAt={858} from="SAFETY BUG?" to="NAHI." size={84} />
      </WorldAnchor>

      {/* S6 — the demo that spooked them */}
      <WorldAnchor x={S6} y={690} width={1500}>
        <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <Panel at={996} w={470}>
              <PanelTitle size={46}>TRUSTED PARTNER</PanelTitle>
              <PanelSub>DEMO KIYA</PanelSub>
            </Panel>
            <Panel
              at={1029}
              w={470}
              style={{
                background: "linear-gradient(180deg, #7E1220, #5E0D18)",
                border: `1px solid ${noir.red}`,
              }}
            >
              <PanelTitle size={46}>JAILBREAK</PanelTitle>
            </Panel>
            <div style={{ marginTop: 4 }}>
              <PaperChip at={1140}>PER FORTUNE</PaperChip>
            </div>
          </div>
          <DocCard at={1083} title="CYBER-ATTACK INFO" tag="RESTRICTED" w={400} />
        </div>
      </WorldAnchor>

      {/* S7 — the reveal (string stub pre-laps Network's evidence board) */}
      <WorldAnchor x={S7} y={780} width={900}>
        <Panel at={1218} w={760} rib>
          <PanelTitle size={76}>AMAZON</PanelTitle>
          <div style={{ opacity: subP }}>
            <PanelSub size={24}>ANTHROPIC KA SABSE BADA INVESTOR</PanelSub>
          </div>
        </Panel>
      </WorldAnchor>
      <div style={{ position: "absolute", left: S7 + 390, top: 878 }}>
        <svg width={620} height={24}>
          <line x1={0} y1={12} x2={620 * stringP} y2={12} stroke={noir.red} strokeWidth={5} />
        </svg>
      </div>
    </GapClip>
  );
};
