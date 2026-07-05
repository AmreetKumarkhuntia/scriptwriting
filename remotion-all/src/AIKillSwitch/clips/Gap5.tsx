import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { clamp, key, rev } from "../mg/motion";
import { DotField, Panel, PanelSub, PanelTitle, RosetteSeal, StampRing } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { GapClip, MotifBlock, R, RedSlab, ScreenLine, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap5 — 1164f (38.8s) @ 2:39.5 (after Vault). BLAST RADIUS: nobody is
// exempt, the passport trap, the DotField world goes dark, motif #2, and the
// real bomb — the license. Beats = overlays/O5. Local f = (t − 159.5s) × 30.
// ---------------------------------------------------------------------------

const DUR = 1164;
const S1 = 1100;
const S2 = 2900;
const S3 = 5100;
const S4 = 7300;
const S5 = 8900;

const CAM = gapCam({ cx: 880, cy: 880, z: 0.86 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 216, x: S2 },
  { depart: 360, x: S3, y: 890, z: 0.92 },
  { depart: 489, x: S3, y: 890, z: 0.8, trans: 120, glide: true, drift: 0.02 },
  { depart: 753, x: S4 },
  { depart: 837, x: S5 },
], DUR);

// five passports that CAN'T be sorted — struck through in one sweep
const PassportRow: React.FC<{ at: number; strikeAt: number }> = ({ at, strikeAt }) => {
  const frame = useCurrentFrame();
  const labels = ["US", "EU", "CHINA", "INDIA", "BRAZIL"];
  const strike = rev(frame, strikeAt, 12);
  return (
    <div style={{ position: "relative", display: "flex", gap: 26 }}>
      {labels.map((l, i) => {
        const p = clamp(rev(frame, at + i * 5, 10) * 1.6, 0, 1);
        return (
          <div
            key={l}
            style={{
              width: 150,
              padding: "16px 0 12px",
              background: noir.paper,
              boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: p,
              transform: `translateY(${14 * (1 - p)}px)`,
            }}
          >
            <svg width={44} height={44}>
              <circle cx={22} cy={22} r={19} fill="none" stroke={noir.void} strokeWidth={3} />
              <ellipse cx={22} cy={22} rx={9} ry={19} fill="none" stroke={noir.void} strokeWidth={2} />
              <line x1={3} y1={22} x2={41} y2={22} stroke={noir.void} strokeWidth={2} />
            </svg>
            <span style={{ fontFamily: fonts.display, fontSize: 28, letterSpacing: 3, color: noir.void }}>
              {l}
            </span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "-3%",
          top: "48%",
          width: `${strike * 106}%`,
          height: 9,
          background: noir.red,
          transform: "rotate(-2deg)",
        }}
      />
    </div>
  );
};

export const Gap5: React.FC = () => {
  const frame = useCurrentFrame();
  const ignite = key(frame, [
    { f: 489, v: 0 },
    { f: 700, v: 1900 },
  ]);
  return (
    <GapClip
      kicker="CASE 03"
      label="EXPORT LAW"
      cam={CAM}
      worldW={9600}
      worldH={1800}
      flashes={[404, 881]}
      screen={
        <ScreenLine at={489} out={740} size={42}>
          EK EXPORT RULE → <R>PURI DUNIYA KA SOFTWARE OFF</R>
        </ScreenLine>
      }
      cues={[
        { cue: "whoosh", at: 0, volume: 0.3 },
        { cue: "pop", at: 29 },
        { cue: "pop", at: 102 },
        { cue: "boom", at: 172, volume: 0.35 },
        { cue: "whoosh", at: 216, volume: 0.35 },
        { cue: "alert", at: 292, volume: 0.3 },
        { cue: "whoosh", at: 360, volume: 0.35 },
        { cue: "impact", at: 404 },
        { cue: "riserBig", at: 478, volume: 0.45 },
        { cue: "flare", at: 492, volume: 0.4 },
        { cue: "whoosh", at: 753, volume: 0.35 },
        { cue: "riser", at: 770, volume: 0.35 },
        { cue: "boom", at: 797, volume: 0.35 },
        { cue: "whoosh", at: 837, volume: 0.35 },
        { cue: "impact", at: 881 },
        { cue: "pop", at: 1046 },
      ]}
    >
      {/* S1 — nobody, nowhere: the cascade */}
      <WorldAnchor x={S1} y={520} width={800}>
        <Panel at={27} w={560}>
          <PanelTitle size={52}>NO PUBLIC ACCESS</PanelTitle>
        </Panel>
        <Panel at={100} w={560} style={{ marginTop: 28 }}>
          <PanelTitle size={52}>NO NATIONS</PanelTitle>
        </Panel>
        <Panel
          at={170}
          w={560}
          style={{
            marginTop: 28,
            background: "linear-gradient(180deg, #7E1220, #5E0D18)",
            border: `1px solid ${noir.red}`,
          }}
        >
          <PanelTitle size={52}>NO ONE</PanelTitle>
        </Panel>
      </WorldAnchor>

      {/* S2 — the compliance trap */}
      <WorldAnchor x={S2} y={640} width={1300}>
        <Headline at={258} words="PASSPORT SE SORT?" size={88} />
        <div style={{ marginTop: 44 }}>
          <PassportRow at={232} strikeAt={290} />
        </div>
        <div style={{ marginTop: 42 }}>
          <RedSlab at={286} size={62}>
            NAHI HO SAKTA
          </RedSlab>
        </div>
      </WorldAnchor>

      {/* S3 — the blast radius: the whole field goes red */}
      <div style={{ position: "absolute", left: 3900, top: 340 }}>
        <DotField w={2400} h={1100} ignite={ignite} seed="gap5" />
      </div>
      <WorldAnchor x={S3} y={500} width={1000}>
        <StampRing at={402} size={96} rotate={-8}>
          SAB KE LIYE OFF
        </StampRing>
      </WorldAnchor>

      {/* S4 — the spine, second strike */}
      <WorldAnchor x={S4} y={740} width={1600}>
        <MotifBlock at={795} />
      </WorldAnchor>

      {/* S5 — the real bomb: the license */}
      <WorldAnchor x={S5} y={620} width={900}>
        <StampRing at={879} size={110} rotate={-6}>
          ASLI BOMB
        </StampRing>
        <Panel at={1044} w={680} rib style={{ marginTop: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <RosetteSeal size={96} />
            <div>
              <PanelTitle size={54}>WAPSI = LICENSE</PanelTitle>
              <PanelSub>GOVERNMENT KI MARZI</PanelSub>
            </div>
          </div>
        </Panel>
      </WorldAnchor>
    </GapClip>
  );
};
