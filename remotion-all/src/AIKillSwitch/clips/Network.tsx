import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoStage, MoKey } from "../mg/Stage";
import { rev } from "../mg/motion";
import { Panel, PanelSub, PanelTitle } from "../mg/Cards";
import { EnterExit, Letterbox, Vignette } from "../components/Frame";
import { Sub } from "../components/Type";
import { SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// KS-Network — 240f (8s) @ 2:00.5. MOTION GRAPHICS v2.
// The evidence board: three pinned cards, red strings drawn between them,
// a packet dot traveling each string. Topology = comparison → camera holds
// (gentle push only); the story is the edges lighting in sequence.
// ---------------------------------------------------------------------------

const AMZ = { x: 620, y: 1150 };
const WH = { x: 1600, y: 460 };
const ANT = { x: 2580, y: 1150 };

// comparison/topology → ALL three cards stay framed; gentle push only
const CAM: MoKey[] = [
  { f: 0, cam: { cx: 1600, cy: 880, z: 0.62 } },
  { f: 20, cam: { cx: 1600, cy: 870, z: 0.68 }, trans: 100, mode: "glide" },
];

// a red string edge that draws on, with a traveling packet
const Edge: React.FC<{
  at: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  sag?: number;
}> = ({ at, from, to, color = noir.red, sag = 90 }) => {
  const frame = useCurrentFrame();
  const p = rev(frame, at, 16);
  if (p <= 0) return null;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + sag;
  const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
  // approximate length for dash draw-on
  const len = Math.hypot(to.x - from.x, to.y - from.y) * 1.08;
  // packet param after the edge is drawn
  const pt = ((frame - at - 16) * 0.02) % 1;
  const t = Math.max(0, pt);
  const u = 1 - t;
  const px = u * u * from.x + 2 * u * t * mx + t * t * to.x;
  const py = u * u * from.y + 2 * u * t * my + t * t * to.y;
  return (
    <svg
      width={3200}
      height={1800}
      viewBox="0 0 3200 1800"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        opacity={0.85}
      />
      {p >= 1 ? (
        <>
          <circle cx={px} cy={py} r={13} fill={color} opacity={0.9} />
          <circle cx={px} cy={py} r={26} fill={color} opacity={0.25} />
        </>
      ) : null}
    </svg>
  );
};

// pushpin dot on a card
const Pin: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const p = rev(frame, at, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 11,
        top: y - 11,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: noir.red,
        border: `4px solid #7E1220`,
        transform: `scale(${p})`,
        zIndex: 5,
      }}
    />
  );
};

export const Network: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: noir.void }}>
      <SfxTrack
        cues={[
          { cue: "pop", at: 12 },
          { cue: "pop", at: 20 },
          { cue: "swoosh", at: 30, volume: 0.3 },
          { cue: "alert", at: 95, volume: 0.35 },
          { cue: "alert", at: 150, volume: 0.4 },
          { cue: "swoosh", at: 172, volume: 0.3 },
        ]}
      />
      <EnterExit>
        <Board />
        <MoStage keys={CAM}>
          {/* strings UNDER the cards */}
          <Edge at={30} from={AMZ} to={ANT} color={"#8b8b96"} sag={130} />
          <Edge at={95} from={AMZ} to={WH} sag={-40} />
          <Edge at={150} from={WH} to={ANT} sag={-40} />

          {/* investor tag on the grey string */}
          {frame >= 52 ? (
            <div
              style={{
                position: "absolute",
                left: 1470,
                top: 1252,
                background: noir.paper,
                color: noir.void,
                fontFamily: fonts.body,
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: 3,
                padding: "8px 20px",
                opacity: rev(frame, 52, 10),
              }}
            >
              SABSE BADA INVESTOR
            </div>
          ) : null}

          {/* the three cards */}
          <div style={{ position: "absolute", left: AMZ.x - 215, top: AMZ.y - 20 }}>
            <Panel at={12} w={430}>
              <PanelTitle size={54}>AMAZON</PanelTitle>
              <PanelSub>JAILBREAK DEMO — CYBER INFO</PanelSub>
            </Panel>
          </div>
          <div style={{ position: "absolute", left: WH.x - 235, top: WH.y - 190 }}>
            <Panel at={88} w={470} rib>
              <PanelTitle size={54}>WHITE HOUSE</PanelTitle>
              <PanelSub>CEO NE SEEDHA YAHIN BAAT PAHUNCHAI</PanelSub>
            </Panel>
          </div>
          <div style={{ position: "absolute", left: ANT.x - 215, top: ANT.y - 20 }}>
            <Panel at={20} w={430}>
              <PanelTitle size={54}>ANTHROPIC</PanelTitle>
              <PanelSub>FABLE 5 · MYTHOS 5</PanelSub>
            </Panel>
          </div>
          <Pin x={AMZ.x} y={AMZ.y} at={14} />
          <Pin x={WH.x} y={WH.y} at={90} />
          <Pin x={ANT.x} y={ANT.y} at={22} />
        </MoStage>

        {/* attribution */}
        {frame >= 60 && frame < 145 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 122 }}>
            <Sub at={62} size={23}>
              PER FORTUNE — WOH "TRUSTED PARTNER" AMAZON THA
            </Sub>
          </AbsoluteFill>
        ) : null}

        {/* the ultimatum */}
        {frame >= 168 ? (
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 108 }}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 62,
                color: noir.paper,
                letterSpacing: 8,
                opacity: interpolate(frame, [168, 180], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              "BUG FIX KARO — <span style={{ color: noir.red }}>YA MODEL HATAO</span>"
            </div>
            <Sub at={182} size={22} style={{ marginTop: 8 }}>
              — DAVID SACKS KE MUTABIK
            </Sub>
          </AbsoluteFill>
        ) : null}

        <Vignette />
      </EnterExit>
      <Letterbox />
    </AbsoluteFill>
  );
};
