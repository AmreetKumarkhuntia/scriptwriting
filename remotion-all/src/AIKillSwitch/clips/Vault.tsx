import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { rev } from "../mg/motion";
import { ExhibitFrame, GlobeDots, StampRing } from "../mg/Cards";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { PaperChip, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-Vault — 360f (12s) @ 2:27.5. MOTION GRAPHICS v2.
// The law's exhibit wall: MISSILE and CHIP hang framed ("yeh kanoon inke
// liye bana tha") → a CHAT BUBBLE slides into the empty third frame (the
// intruder) → fly right: the dotted globe takes the DENIED stamp and its
// dots die in a wave.
// ---------------------------------------------------------------------------

const WORLD_W = 4800;
const WORLD_H = 1800;
const E1 = 700; // missile
const E2 = 1500; // chip
const E3 = 2300; // the empty frame → chat bubble
const GLOBE = 3700;
const STAMP_HIT = 232;

const CAM: MoKey[] = [
  { f: 0, cam: { cx: 1000, cy: 880, z: 0.86 } },
  { f: 12, cam: { cx: 1100, cy: 880, z: 0.92 }, trans: 46, mode: "glide" },
  { f: 92, cam: { cx: E3, cy: 860, z: 1.04 }, trans: 40, mode: "settle" },
  { f: 190, cam: { cx: GLOBE, cy: 880, z: 1.0 }, trans: 38, mode: "settle" },
  // hold through the stamp, then pull wide over the whole wall
  { f: 300, cam: { cx: 2400, cy: 880, z: 0.42 }, trans: 50, mode: "glide" },
];

// blueprint-style line icons (SVG, wireframe register)
const MissileIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" stroke="#aab6c6" strokeWidth={3}>
    <path d="M100 18 L118 56 L118 130 L82 130 L82 56 Z" />
    <path d="M82 108 L58 140 L82 140 Z" />
    <path d="M118 108 L142 140 L118 140 Z" />
    <path d="M92 130 L92 154 M108 130 L108 154" />
    <circle cx={100} cy={80} r={11} />
  </svg>
);

const ChipIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" stroke="#aab6c6" strokeWidth={3}>
    <rect x={56} y={56} width={88} height={88} rx={6} />
    <rect x={80} y={80} width={40} height={40} />
    {[68, 92, 116].map((p) => (
      <React.Fragment key={p}>
        <path d={`M${p + 8} 56 L${p + 8} 34`} />
        <path d={`M${p + 8} 144 L${p + 8} 166`} />
        <path d={`M56 ${p + 8} L34 ${p + 8}`} />
        <path d={`M144 ${p + 8} L166 ${p + 8}`} />
      </React.Fragment>
    ))}
  </svg>
);

const BubbleIcon: React.FC<{ size?: number; glow?: boolean }> = ({ size = 200, glow }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    stroke="#7db0d8"
    strokeWidth={3.5}
    style={glow ? { filter: "drop-shadow(0 0 18px rgba(125,176,216,0.55))" } : undefined}
  >
    <rect x={36} y={52} width={128} height={82} rx={12} />
    <path d="M72 134 L60 160 L96 134" />
    {[76, 100, 124].map((x) => (
      <circle key={x} cx={x} cy={93} r={6} fill="#cfe4f4" stroke="none" />
    ))}
  </svg>
);

export const Vault: React.FC = () => {
  const frame = useCurrentFrame();

  const globeLife =
    frame < STAMP_HIT
      ? 1
      : interpolate(frame, [STAMP_HIT, 300], [1, 0.06], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // bubble slides into the empty frame
  const slideP = rev(frame, 108, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "whoosh", at: 0, volume: 0.3 },
          { cue: "swoosh", at: 24, volume: 0.3 },
          { cue: "pop", at: 112 }, // the intruder arrives
          { cue: "whoosh", at: 190, volume: 0.35 },
          { cue: "riser", at: 205, volume: 0.35 },
          { cue: "impact", at: STAMP_HIT },
          { cue: "alert", at: STAMP_HIT + 14, volume: 0.3 },
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM} worldW={WORLD_W} worldH={WORLD_H}>
          {/* law header over the wall */}
          <WorldAnchor x={1500} y={430} width={2400}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 92,
                color: noir.paper,
                letterSpacing: 10,
                opacity: rev(frame, 22, 12),
              }}
            >
              EXPORT CONTROL REFORM ACT
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 26,
                fontWeight: 600,
                color: noir.ash,
                letterSpacing: 5,
                marginTop: 10,
                opacity: rev(frame, 34, 12),
              }}
            >
              2018 · BANAYA GAYA THA: MISSILES + CHIPS KE LIYE
            </div>
          </WorldAnchor>

          {/* exhibits */}
          <div style={{ position: "absolute", left: E1 - 190, top: 620 }}>
            <ExhibitFrame at={26} w={380} h={430} label="MISSILE TECH">
              <MissileIcon size={240} />
            </ExhibitFrame>
          </div>
          <div style={{ position: "absolute", left: E2 - 190, top: 620 }}>
            <ExhibitFrame at={40} w={380} h={430} label="ADVANCED CHIPS">
              <ChipIcon size={240} />
            </ExhibitFrame>
          </div>
          <div style={{ position: "absolute", left: E3 - 190, top: 620 }}>
            <ExhibitFrame at={54} w={380} h={430} label="?? — EK CHATBOT" accent>
              {slideP > 0 ? (
                <div
                  style={{
                    transform: `translateX(${(1 - slideP) * 320}px)`,
                    opacity: slideP,
                  }}
                >
                  <BubbleIcon size={250} glow />
                </div>
              ) : null}
            </ExhibitFrame>
          </div>

          {/* the globe wall-piece */}
          <WorldAnchor x={GLOBE} y={520} width={700}>
            <GlobeDots size={560} life={globeLife} seed="vault2" />
            {frame >= STAMP_HIT + 26 ? (
              <div style={{ marginTop: 24 }}>
                <PaperChip at={STAMP_HIT + 28} accent>
                  HAR FOREIGN NATIONAL — ACCESS BAND
                </PaperChip>
              </div>
            ) : null}
          </WorldAnchor>
        </MoStage>

        {/* intruder line */}
        {frame >= 132 && frame < 185 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 128 }}>
            <Sub at={134} size={29} color={noir.paper}>
              COMMERCE NE YE KANOON EK <span style={{ color: noir.red }}>CHATBOT</span> PE LAGA DIYA
            </Sub>
          </AbsoluteFill>
        ) : null}

        {/* DENIED — screen-fixed, lands on the held globe shot */}
        {frame >= STAMP_HIT + 2 && frame < 300 ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 90 }}>
            <StampRing at={STAMP_HIT + 2} size={104}>
              DENIED
            </StampRing>
          </AbsoluteFill>
        ) : null}

        {/* closing line on the wide */}
        {frame >= 312 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 138 }}>
            <Sub at={314} size={29} color={noir.paper}>
              EK EXPORT RULE NE PURI DUNIYA KA SOFTWARE OFF KAR DIYA
            </Sub>
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={STAMP_HIT} />
      <Letterbox />
    </AbsoluteFill>
  );
};
