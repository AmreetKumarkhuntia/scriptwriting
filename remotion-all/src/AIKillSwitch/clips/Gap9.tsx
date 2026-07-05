import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { rev } from "../mg/motion";
import { FlatSwitch, Panel, PanelSub, PanelTitle } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { PaperChip } from "../components/Type";
import { GapClip, MotifBlock, RedSlab, SlamSwitch, StrikeBlock, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap9 — 1035f (34.5s) @ 5:18 (after Swarm). VERDICT + THE ANSWER: open
// Chinese AI has no switch, the ban is open-source's best ad, motif #3, and
// LABS → GOVERNMENT lands screen-fixed over the coda pull-back into Outro.
// Beats = overlays/O9. Local f = (t − 318.0s) × 30.
// ---------------------------------------------------------------------------

const DUR = 1035;
const S1 = 1000;
const S2 = 3000;
const S3 = 5000;
const S4 = 6600;
const S5 = 8200;

const CAM = gapCam({ cx: 840, cy: 880, z: 0.86 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 183, x: S2, z: 0.95 },
  { depart: 390, x: S3 },
  { depart: 609, x: S4 },
  { depart: 741, x: S5 },
  { depart: 970, x: 5600, y: 900, z: 0.34, trans: 46, glide: true, drift: 0 },
], DUR);

export const Gap9: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = rev(frame, 264, 10);
  return (
    <GapClip
      kicker="CASE 06"
      label="OPEN SOURCE"
      cam={CAM}
      worldW={9000}
      worldH={1800}
      flashes={[960]}
      screen={
        frame >= 936 ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 20 }}>
            <StrikeBlock at={936} strikeAt={952} replaceAt={960} from="LABS" to="GOVERNMENT" size={88} />
          </AbsoluteFill>
        ) : null
      }
      cues={[
        { cue: "whoosh", at: 0, volume: 0.3 },
        { cue: "pop", at: 64 },
        { cue: "whoosh", at: 183, volume: 0.35 },
        { cue: "pop", at: 227 },
        { cue: "pop", at: 254 },
        { cue: "whoosh", at: 390, volume: 0.3 },
        { cue: "boom", at: 434, volume: 0.4 },
        { cue: "whoosh", at: 609, volume: 0.3 },
        { cue: "boom", at: 685, volume: 0.35 },
        { cue: "whoosh", at: 741, volume: 0.35 },
        { cue: "riser", at: 900, volume: 0.4 },
        { cue: "impact", at: 954 },
        { cue: "boom", at: 962, volume: 0.45 },
        { cue: "whoosh", at: 970, volume: 0.35 },
      ]}
    >
      {/* S1 — China already open */}
      <WorldAnchor x={S1} y={640} width={900}>
        <Panel at={62} w={560} rib>
          <PanelTitle size={60}>CHINA</PanelTitle>
          <PanelSub>PEHLE SE OPEN</PanelSub>
        </Panel>
        <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
          <PaperChip at={80}>OPEN WEIGHTS</PaperChip>
          <PaperChip at={90}>LOCAL RUN</PaperChip>
          <PaperChip at={100}>SAB KE LIYE</PaperChip>
        </div>
      </WorldAnchor>

      {/* S2 — the two-cell verdict */}
      <WorldAnchor x={S2} y={560} width={1600}>
        <div style={{ display: "flex", alignItems: "stretch", gap: 44 }}>
          <Panel
            at={225}
            w={640}
            style={{
              background: "linear-gradient(180deg, #7E1220, #5E0D18)",
              border: `1px solid ${noir.red}`,
            }}
          >
            <PanelTitle size={56}>US AI</PanelTitle>
            <PanelSub>WASHINGTON OFF KAR SAKTA</PanelSub>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
              <SlamSwitch at={240} size={150} />
            </div>
          </Panel>
          <div style={{ width: 4, background: noir.smoke, opacity: 0.6 }} />
          <Panel at={252} w={640}>
            <PanelTitle size={56}>OPEN CHINESE AI</PanelTitle>
            <PanelSub>KOI SWITCH NAHI</PanelSub>
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                marginTop: 26,
              }}
            >
              <FlatSwitch flip={0} size={150} />
              <div
                style={{
                  position: "absolute",
                  left: "18%",
                  top: "48%",
                  width: `${strike * 64}%`,
                  height: 10,
                  background: noir.red,
                  transform: "rotate(-14deg)",
                }}
              />
            </div>
          </Panel>
        </div>
      </WorldAnchor>

      {/* S3 — open-source's best ad */}
      <WorldAnchor x={S3} y={640} width={1500}>
        <Headline at={432} words="YE BAN = OPEN-SOURCE KA SABSE BADA AD" size={74} markWord={7} />
      </WorldAnchor>

      {/* S4 — the reframe */}
      <WorldAnchor x={S4} y={600} width={1400}>
        <Headline at={651} words="COMPANY VS COMPANY?" size={92} />
        <div style={{ marginTop: 42 }}>
          <RedSlab at={683} size={68}>
            AB NAHI
          </RedSlab>
        </div>
      </WorldAnchor>

      {/* S5 — the spine, final strike (answer lands screen-fixed) */}
      <WorldAnchor x={S5} y={720} width={1600}>
        <MotifBlock at={783} />
      </WorldAnchor>
    </GapClip>
  );
};
