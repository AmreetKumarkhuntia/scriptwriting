import React from "react";
import { useCurrentFrame } from "remotion";
import { noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { clamp, rev } from "../mg/motion";
import { BarrierTape, Panel, PanelSub, PanelTitle } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { Redacted, Sub } from "../components/Type";
import { GapClip, StrikeBlock, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap7 — 1185f (39.5s) @ 4:04 (after SwitchBack). TERMS & THE NEW TARGET:
// the comeback conditions, OFF/ON both Washington, then the story repeats —
// White House → OpenAI, GPT-5.6, codenames, trusted partners only.
// Beats = overlays/O7. Local f = (t − 244.0s) × 30.
// ---------------------------------------------------------------------------

const DUR = 1185;
const S1 = 1100;
const S2 = 2950;
const S3 = 4800;
const S4 = 6400;
const S5 = 8300;
const S6 = 9900;

const CAM = gapCam({ cx: 880, cy: 880, z: 0.86 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 306, x: S2 },
  { depart: 546, x: S3 },
  { depart: 630, x: S4 },
  { depart: 861, x: S5 },
  { depart: 1016, x: S6 },
], DUR);

export const Gap7: React.FC = () => {
  const frame = useCurrentFrame();
  const codeP = clamp(rev(frame, 945, 10) * 1.6, 0, 1);
  return (
    <GapClip
      kicker="CASE 05"
      label="WAPSI"
      cam={CAM}
      worldW={10800}
      worldH={1800}
      flashes={[624, 821]}
      cues={[
        { cue: "whoosh", at: 0, volume: 0.3 },
        { cue: "pop", at: 47 },
        { cue: "pop", at: 131 },
        { cue: "pop", at: 203 },
        { cue: "whoosh", at: 306, volume: 0.35 },
        { cue: "boom", at: 350, volume: 0.4 },
        { cue: "boom", at: 360, volume: 0.35 },
        { cue: "whoosh", at: 546, volume: 0.3 },
        { cue: "boom", at: 626, volume: 0.4 },
        { cue: "whoosh", at: 630, volume: 0.3 },
        { cue: "pop", at: 674 },
        { cue: "pop", at: 737 },
        { cue: "pop", at: 782 },
        { cue: "boom", at: 821, volume: 0.35 },
        { cue: "whoosh", at: 861, volume: 0.3 },
        { cue: "pop", at: 905 },
        { cue: "swoosh", at: 995, volume: 0.3 },
        { cue: "whoosh", at: 1016, volume: 0.3 },
        { cue: "alert", at: 1076, volume: 0.35 },
      ]}
    >
      {/* S1 — the comeback terms */}
      <WorldAnchor x={S1} y={470} width={800}>
        <Panel at={45} w={640}>
          <PanelTitle size={46}>NAYA CLASSIFIER</PanelTitle>
          <PanelSub>99%+ CASES BLOCK</PanelSub>
        </Panel>
        <Panel at={129} w={640} style={{ marginTop: 26 }}>
          <PanelTitle size={46}>GOVT TERMS</PanelTitle>
          <PanelSub>MAAN LIYE</PanelSub>
        </Panel>
        <Panel at={201} w={640} rib style={{ marginTop: 26 }}>
          <PanelTitle size={46}>MYTHOS 5</PanelTitle>
          <PanelSub>SIRF ~10 US GOV ORGS</PanelSub>
        </Panel>
      </WorldAnchor>

      {/* S2 — the punch of the whole beat */}
      <WorldAnchor x={S2} y={540} width={1500}>
        <Headline at={348} words="OFF: WASHINGTON" size={96} markWord={1} />
        <div style={{ marginTop: 26 }}>
          <Headline at={356} words="ON: WASHINGTON" size={96} markWord={1} />
        </div>
        <div style={{ marginTop: 34 }}>
          <Sub at={384} size={28}>
            — DONO BAAR
          </Sub>
        </div>
      </WorldAnchor>

      {/* S3 — not a one-off */}
      <WorldAnchor x={S3} y={620} width={1400}>
        <StrikeBlock
          at={588}
          strikeAt={615}
          replaceAt={624}
          from="ONE-TIME STORY?"
          to="NAHI."
          size={78}
        />
      </WorldAnchor>

      {/* S4 — two weeks later, new target */}
      <WorldAnchor x={S4} y={520} width={1200}>
        <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>
          <Panel at={672} w={520} rib style={{ marginTop: 104 }}>
            <PanelTitle size={50}>DO HAFTE BAAD</PanelTitle>
            <PanelSub>NAYA TARGET</PanelSub>
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Panel at={735} w={460}>
              <PanelTitle size={46}>25 JUNE</PanelTitle>
            </Panel>
            <Panel at={780} w={460}>
              <PanelTitle size={46}>WHITE HOUSE</PanelTitle>
            </Panel>
            <Panel
              at={819}
              w={460}
              style={{
                background: "linear-gradient(180deg, #7E1220, #5E0D18)",
                border: `1px solid ${noir.red}`,
              }}
            >
              <PanelTitle size={46}>→ OPENAI</PanelTitle>
            </Panel>
          </div>
        </div>
      </WorldAnchor>

      {/* S5 — the models: GPT-5.6 + unredacting codenames */}
      <WorldAnchor x={S5} y={640} width={1000}>
        <Panel at={903} w={460}>
          <PanelTitle size={64}>GPT-5.6</PanelTitle>
        </Panel>
        <div style={{ marginTop: 44, opacity: codeP }}>
          <Redacted at={993} size={54}>
            SOL · TERRA · LUNA
          </Redacted>
        </div>
        <div style={{ marginTop: 16 }}>
          <Sub at={1013} size={24}>
            CODENAMES
          </Sub>
        </div>
      </WorldAnchor>

      {/* S6 — access taped off */}
      <WorldAnchor x={S6} y={700} width={1000}>
        <div style={{ position: "relative" }}>
          <Panel at={1058} w={780}>
            <PanelTitle size={50}>OPENAI FRONTIER MODELS</PanelTitle>
            <PanelSub>PUBLIC ACCESS — ?</PanelSub>
          </Panel>
          <div style={{ position: "absolute", left: -60, top: "42%" }}>
            <BarrierTape at={1074} w={920} text="TRUSTED PARTNERS ONLY" />
          </div>
        </div>
      </WorldAnchor>
    </GapClip>
  );
};
