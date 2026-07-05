import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey } from "../mg/Stage";
import { rev } from "../mg/motion";
import { Panel, PanelSub, PanelTitle, StampRing } from "../mg/Cards";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { DateSuper, PaperChip, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-OrderVsRequest — 270f (9s) @ 4:43.5. MOTION GRAPHICS v2.
// A comparison board — STATIC framing (gentle push only):
//   left: ANTHROPIC dossier takes a red ORDER stamp (f58)
//   right: OPENAI dossier gets a floating REQUEST note (f118)
//   puppet strings from ONE point draw down to BOTH cards and pull
//   taut (f150–205) → "DO COMPANIES · DO HAFTE · EK HAATH"
// ---------------------------------------------------------------------------

// comparison → both cards stay framed; gentle push only
const CAM: MoKey[] = [
  { f: 0, cam: { cx: 1600, cy: 900, z: 0.78 } },
  { f: 16, cam: { cx: 1600, cy: 905, z: 0.84 }, trans: 110, mode: "glide" },
];

export const OrderVsRequest: React.FC = () => {
  const frame = useCurrentFrame();

  // strings draw on, then pull taut (sag → straight) as the pattern lands
  const stringP = rev(frame, 150, 18);
  const taut = interpolate(frame, [150, 205], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sol/Terra/Luna drift chips
  const moons = ["SOL", "TERRA", "LUNA"];

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "pop", at: 16 },
          { cue: "pop", at: 30 },
          { cue: "impact", at: 58, volume: 0.45 },
          { cue: "swoosh", at: 120, volume: 0.3 },
          { cue: "rise", at: 150, volume: 0.35 },
          { cue: "boom", at: 212, volume: 0.4 },
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM}>
          {/* the one hand — puppet strings from a single node down to BOTH cards */}
          {stringP > 0 ? (
            <svg
              width={3200}
              height={1800}
              viewBox="0 0 3200 1800"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                // recede once the pattern line takes the frame
                opacity: interpolate(frame, [206, 218], [1, 0.12], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {[
                { x: 790, y: 714 },
                { x: 2410, y: 714 },
              ].map((c, i) => {
                const sag = 74 * (1 - taut);
                const mx = (1600 + c.x) / 2;
                const my = (430 + c.y) / 2 + sag;
                const len = Math.hypot(c.x - 1600, c.y - 430) * 1.1;
                return (
                  <path
                    key={i}
                    d={`M 1600 430 Q ${mx} ${my} ${c.x} ${c.y}`}
                    fill="none"
                    stroke={noir.red}
                    strokeWidth={5}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - stringP)}
                    opacity={0.85}
                  />
                );
              })}
              <circle cx={1600} cy={430} r={16 * stringP} fill={noir.red} />
              <circle cx={1600} cy={430} r={30 * stringP} fill="none" stroke={noir.red} strokeWidth={4} opacity={0.5} />
            </svg>
          ) : null}

          {/* ANTHROPIC — the order */}
          <div style={{ position: "absolute", left: 470, top: 720 }}>
            <Panel at={16} w={640}>
              <PanelTitle size={62}>ANTHROPIC</PanelTitle>
              <PanelSub>FABLE 5 · MYTHOS 5 — PULLED BY LAW</PanelSub>
              <div style={{ height: 120 }} />
            </Panel>
            {frame >= 58 ? (
              <div style={{ position: "absolute", right: 30, bottom: 26 }}>
                <StampRing at={58} size={72} rotate={-10}>
                  LEGAL ORDER
                </StampRing>
              </div>
            ) : null}
          </div>

          {/* OPENAI — the request */}
          <div style={{ position: "absolute", left: 2090, top: 720 }}>
            <Panel at={30} w={640}>
              <PanelTitle size={62}>OPENAI</PanelTitle>
              <PanelSub>GPT-5.6 — TRUSTED PARTNERS ONLY</PanelSub>
              <div style={{ height: 120 }} />
            </Panel>
            {/* the polite paper note, floating in */}
            {frame >= 118 ? (
              <div
                style={{
                  position: "absolute",
                  right: 24,
                  bottom: 20,
                  background: noir.paper,
                  color: "#2c2c32",
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: 2,
                  padding: "14px 26px",
                  transform: `rotate(3deg) translateY(${(1 - rev(frame, 118, 14)) * -40}px)`,
                  opacity: rev(frame, 118, 14),
                  boxShadow: "0 12px 34px rgba(0,0,0,0.5)",
                }}
              >
                "SIRF EK REQUEST"
              </div>
            ) : null}
            {/* Sol/Terra/Luna drift */}
            {frame >= 132
              ? moons.map((m, i) => {
                  const dy = noise2D(`moon${i}`, frame * 0.015, i) * 10;
                  return (
                    <div
                      key={m}
                      style={{
                        position: "absolute",
                        top: -54 + dy,
                        left: 40 + i * 200,
                        opacity: rev(frame, 134 + i * 6, 10),
                      }}
                    >
                      <PaperChip at={134 + i * 6}>{m}</PaperChip>
                    </div>
                  );
                })
              : null}
          </div>
        </MoStage>

        <DateSuper at={10}>~25 JUNE 2026</DateSuper>

        {/* the pattern line */}
        {frame >= 210 ? (
          <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 102 }}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 74,
                color: noir.paper,
                letterSpacing: 12,
                opacity: interpolate(frame, [212, 224], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              DO COMPANIES · DO HAFTE · <span style={{ color: noir.red }}>EK HAATH</span>
            </div>
          </AbsoluteFill>
        ) : null}

        {frame >= 236 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 128 }}>
            <Sub at={238} size={26}>
              YE EXCEPTION NAHI — <span style={{ color: noir.paper }}>PATTERN</span> HAI
            </Sub>
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={58} />
      <Letterbox />
    </AbsoluteFill>
  );
};
