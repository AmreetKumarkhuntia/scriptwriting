import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { rev } from "../mg/motion";
import { Panel, PanelSub, PanelTitle } from "../mg/Cards";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { NoirTitle, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-SealDrop — 300f (10s) @ 0:41. MOTION GRAPHICS v2.
// The "race" bracket: three lab cards + VS marks. Then a massive bordered
// U.S. GOVERNMENT stamp SLAMS diagonally over the whole bracket (comparison
// stays framed — camera wide enough for all three), and the real player is
// named. Same stamp ink-language as LEGAL ORDER / DENIED / GRANTED.
// ---------------------------------------------------------------------------

const DROP = 148;
const HIT = 208;

// bracket spans world x 320..2880 — camera must hold all three cards:
// at z 0.72 the viewport half-width is 960/0.72 ≈ 1333 → covers 267..2933
const CAM: MoKey[] = [
  { f: 0, cam: { cx: 1600, cy: 880, z: 0.66 } },
  { f: 10, cam: { cx: 1600, cy: 880, z: 0.72 }, trans: 60, mode: "glide" },
  { f: 140, cam: { cx: 1600, cy: 900, z: 0.64 }, trans: 44, mode: "settle" },
];

const LabCard: React.FC<{ at: number; title: string }> = ({ at, title }) => (
  <Panel at={at} w={430}>
    <PanelTitle size={56}>{title}</PanelTitle>
    <PanelSub>FRONTIER AI LAB</PanelSub>
  </Panel>
);

export const SealDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // heavy drop: from high above, lands at HIT
  const drop = frame < DROP ? 0 : spring({ frame: frame - DROP, fps, config: { damping: 16, stiffness: 60, mass: 1.6 } });
  const sealY = interpolate(drop, [0, 1], [-1300, 640]);
  const dim = interpolate(drop, [0.5, 1], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "whoosh", at: 0, volume: 0.3 },
          { cue: "pop", at: 22 },
          { cue: "pop", at: 34 },
          { cue: "pop", at: 46 },
          { cue: "rise", at: DROP - 8, volume: 0.5 },
          { cue: "boom", at: HIT, volume: 0.6 },
          { cue: "impact", at: HIT, volume: 0.55 },
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM}>
          {/* the bracket row */}
          <div style={{ position: "absolute", left: 320, top: 700, opacity: dim }}>
            <LabCard at={22} title="GOOGLE" />
          </div>
          <div style={{ position: "absolute", left: 1385, top: 700, opacity: dim }}>
            <LabCard at={34} title="ANTHROPIC" />
          </div>
          <div style={{ position: "absolute", left: 2450, top: 700, opacity: dim }}>
            <LabCard at={46} title="OPENAI" />
          </div>
          {/* VS marks */}
          {[1180, 2245].map((x, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: 758,
                fontFamily: fonts.display,
                fontSize: 64,
                color: noir.smoke,
                letterSpacing: 4,
                opacity: rev(frame, 58 + i * 8, 10) * dim,
              }}
            >
              VS
            </div>
          ))}
          {/* "teen saal se yahi race" eyebrow */}
          <WorldAnchor x={1600} y={480} width={1200}>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 30,
                fontWeight: 600,
                color: noir.ash,
                letterSpacing: 6,
                textTransform: "uppercase",
                opacity: rev(frame, 70, 12) * dim,
              }}
            >
              TEEN SAAL SE YAHI RACE DIKHAI GAYI
            </div>
          </WorldAnchor>

          {/* THE STAMP — slams diagonally over the whole bracket */}
          {frame >= DROP - 4 ? (
            <div
              style={{
                position: "absolute",
                left: 1600,
                top: sealY,
                transform: `translateX(-50%) rotate(${interpolate(drop, [0, 1], [-15, -7])}deg)`,
                filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.7))",
              }}
            >
              <div
                style={{
                  border: `20px solid ${noir.red}`,
                  outline: `5px solid ${noir.red}`,
                  outlineOffset: 12,
                  background: "rgba(10,10,12,0.4)",
                  color: noir.red,
                  fontFamily: fonts.display,
                  fontSize: 220,
                  letterSpacing: 26,
                  lineHeight: 1,
                  padding: "30px 80px 18px",
                  whiteSpace: "nowrap",
                }}
              >
                U.S. GOVERNMENT
              </div>
            </div>
          ) : null}
        </MoStage>

        {/* the real player */}
        {frame >= 224 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 118 }}>
            <NoirTitle at={226} size={104} tracking={18}>
              ASLI PLAYER: <span style={{ color: noir.red }}>GOVERNMENT</span>
            </NoirTitle>
            <Sub at={240} size={27} style={{ marginTop: 12 }}>
              JO KISI KO BHI SWITCH OFF KAR SAKTI HAI
            </Sub>
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={HIT} />
      <Letterbox />
    </AbsoluteFill>
  );
};
