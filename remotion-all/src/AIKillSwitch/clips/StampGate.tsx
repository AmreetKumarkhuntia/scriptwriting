import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { rev } from "../mg/motion";
import { Panel, PanelSub, PanelTitle, StampRing } from "../mg/Cards";
import { StrikeReplace } from "../mg/Kinetic";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-StampGate — 240f (8s) @ 3:18.3. MOTION GRAPHICS v2.
//   A: the license document takes the government stamp (f52)
//   B: the PALANTIR card tears off the board (f118)
//   C: "HUMEIN REGULATE KARO" → struck → LEVER (f174)
// ---------------------------------------------------------------------------

const STAMP_HIT = 52;
const RIP = 118;

const DOC = { x: 1050, y: 830 };
const PAL = { x: 2450, y: 830 };

const CAM: MoKey[] = [
  { f: 0, cam: { cx: DOC.x, cy: 840, z: 0.98 } },
  { f: 8, cam: { cx: DOC.x, cy: 840, z: 1.05 }, trans: 36, mode: "settle" },
  { f: 96, cam: { cx: PAL.x, cy: 840, z: 1.0 }, trans: 36, mode: "settle" },
  { f: 158, cam: { cx: 1750, cy: 860, z: 0.62 }, trans: 42, mode: "glide" },
];

export const StampGate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Palantir card tear-off: drops + rotates away
  const ripP = frame < RIP ? 0 : spring({ frame: frame - RIP, fps, config: { damping: 26, stiffness: 44, mass: 1.2 } });

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "rise", at: STAMP_HIT - 16, volume: 0.35 },
          { cue: "impact", at: STAMP_HIT },
          { cue: "alert", at: RIP, volume: 0.4 },
          { cue: "pop", at: RIP + 22 },
          { cue: "swoosh", at: 172, volume: 0.35 },
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM}>
          {/* the license document */}
          <WorldAnchor x={DOC.x} y={470} width={620}>
            <div
              style={{
                width: 460,
                aspectRatio: "3.4 / 4",
                background: noir.paper,
                borderRadius: 6,
                boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
                padding: "6% 7%",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 40,
                  color: "#2c2c32",
                  letterSpacing: 4,
                }}
              >
                RE-EXPORT LICENSE
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#8a867c",
                  marginTop: 6,
                }}
              >
                BUREAU OF INDUSTRY & SECURITY
              </div>
              {[0.9, 0.62, 0.8, 0.5, 0.72, 0.58].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 13,
                    width: `${w * 100 * rev(frame, 10 + i * 3, 8)}%`,
                    background: "#b9b5ab",
                    marginTop: 16,
                  }}
                />
              ))}
              {/* the stamp lands on the corner */}
              {frame >= STAMP_HIT ? (
                <div style={{ position: "absolute", right: 26, bottom: 34 }}>
                  <StampRing at={STAMP_HIT} size={54} rotate={-14}>
                    GRANTED — SHARTON PE
                  </StampRing>
                </div>
              ) : null}
            </div>
          </WorldAnchor>

          {/* Palantir card — pinned, then torn away */}
          <div
            style={{
              position: "absolute",
              left: PAL.x - 260,
              top: 640 + ripP * 700,
              transform: `rotate(${ripP * 24}deg)`,
              transformOrigin: "top right",
              opacity: 1 - ripP * 0.35,
            }}
          >
            <Panel at={86} w={520} rib>
              <PanelTitle size={58}>PALANTIR</PanelTitle>
              <PanelSub>$1B+ DEFENSE CONTRACTS — CLAUDE PE</PanelSub>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: fonts.display,
                  fontSize: 34,
                  color: noir.red,
                  letterSpacing: 4,
                }}
              >
                RIPPED OUT
              </div>
            </Panel>
          </div>
        </MoStage>

        {frame >= STAMP_HIT + 6 && frame < 92 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 118 }}>
            <Sub at={STAMP_HIT + 8} size={29} color={noir.paper}>
              WAPSI = GOVERNMENT KA <span style={{ color: noir.red }}>LICENSE</span>
            </Sub>
            <Sub at={STAMP_HIT + 20} size={22} style={{ marginTop: 8 }}>
              CO-FOUNDER KHUD WASHINGTON GAYE — APNE HI PRODUCT KE LIYE
            </Sub>
          </AbsoluteFill>
        ) : null}

        {/* the irony — kinetic strike */}
        {frame >= 170 ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 60 }}>
            <StrikeReplace
              at={182}
              replaceAt={198}
              from="HUMEIN REGULATE KARO"
              to="LEVER"
              size={72}
            />
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={STAMP_HIT} />
      <Letterbox />
    </AbsoluteFill>
  );
};
