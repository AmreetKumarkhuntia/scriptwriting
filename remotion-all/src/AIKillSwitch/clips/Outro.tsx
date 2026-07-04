import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey, WorldAnchor } from "../mg/Stage";
import { FlatSwitch } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { PaperChip, Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-Outro — 300f (10s) @ 5:52.5. MOTION GRAPHICS v2.
// The icon shot, flat: the switch flips OFF (f40) and ON (f84) with the
// "unhone kiya" labels → the board clears → giant kinetic
// "SWITCH KISKE PAAS?" + CTA + end-card slot.
// ---------------------------------------------------------------------------

const OFF_AT = 40;
const ON_AT = 84;

const CAM: MoKey[] = [
  { f: 0, cam: { cx: 1600, cy: 830, z: 1.12 } },
  { f: 10, cam: { cx: 1600, cy: 830, z: 1.18 }, trans: 40, mode: "settle" },
  { f: 120, cam: { cx: 1600, cy: 860, z: 0.7 }, trans: 46, mode: "glide" },
  { f: 210, cam: { cx: 1600, cy: 880, z: 0.62 }, trans: 60, mode: "glide" },
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const off = frame < OFF_AT ? 0 : spring({ frame: frame - OFF_AT, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const on = frame < ON_AT ? 0 : spring({ frame: frame - ON_AT, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const flip = frame < ON_AT ? off : 1 - on; // ON → OFF → ON

  // the switch dips away as the question takes over
  const switchFade = interpolate(frame, [150, 190], [1, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "boom", at: OFF_AT, volume: 0.45 },
          { cue: "boom", at: ON_AT, volume: 0.45 },
          { cue: "whoosh", at: 120, volume: 0.35 },
          { cue: "riser", at: 148, volume: 0.4 },
          { cue: "swoosh", at: 170, volume: 0.35 },
          { cue: "pop", at: 232 },
        ]}
      />
      <EnterExit exitFrames={14}>
        <Board />
        <MoStage keys={CAM}>
          <WorldAnchor x={1600} y={420} width={600}>
            <div style={{ opacity: switchFade }}>
              <FlatSwitch flip={flip} size={430} hitAt={frame < ON_AT ? OFF_AT : ON_AT} />
            </div>
          </WorldAnchor>
        </MoStage>

        {/* beat labels */}
        {frame >= OFF_AT + 4 && frame < ON_AT ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 132 }}>
            <Sub at={OFF_AT + 5} size={30} color={noir.paper}>
              OFF — <span style={{ color: noir.red }}>UNHONE</span> KIYA
            </Sub>
          </AbsoluteFill>
        ) : null}
        {frame >= ON_AT + 4 && frame < 148 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 132 }}>
            <Sub at={ON_AT + 5} size={30} color={noir.paper}>
              ON — BHI <span style={{ color: noir.red }}>UNHONE</span> HI KIYA · ANTHROPIC, PHIR OPENAI
            </Sub>
          </AbsoluteFill>
        ) : null}

        {/* the question */}
        {frame >= 168 ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26, paddingBottom: 20 }}>
            <Headline at={170} words="SWITCH KISKE PAAS?" size={168} markWord={1} />
            <Sub at={198} size={31}>
              COMMENTS MEIN BATAO — HONA CHAHIYE YA NAHI?
            </Sub>
            {frame >= 230 ? (
              <div style={{ position: "absolute", right: 128, bottom: 126 }}>
                <PaperChip at={232}>FABLE 5 REVIEW → YAHAN</PaperChip>
              </div>
            ) : null}
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <ImpactFlash at={OFF_AT} />
      <ImpactFlash at={ON_AT} color={"#cfd8e6"} />
      <Letterbox />
    </AbsoluteFill>
  );
};
