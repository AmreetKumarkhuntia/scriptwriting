import React from "react";
import { useCurrentFrame } from "remotion";
import { noir } from "../theme";
import { WorldAnchor } from "../mg/Stage";
import { clamp, rev } from "../mg/motion";
import { Panel, PanelTitle, StampRing } from "../mg/Cards";
import { Headline } from "../mg/Kinetic";
import { Sub } from "../components/Type";
import { GapClip, gapCam } from "./gapKit";

// ---------------------------------------------------------------------------
// KS-Gap2 — 375f (12.5s) @ 0:51 (after SealDrop). THE FORK: switch off — or
// control? Then the rewind stamp into Beat 1. Beats = overlays/O2 timing.
// Local f = (t − 51.0s) × 30.
// ---------------------------------------------------------------------------

const DUR = 375;
const S1 = 1100;
const S2 = 3100;

const CAM = gapCam({ cx: 900, cy: 880, z: 0.86 }, [
  { depart: 8, x: S1, trans: 32 },
  { depart: 255, x: S2, trans: 38 },
  { depart: 330, x: S2, z: 1.06, trans: 45, glide: true, drift: 0 },
], DUR);

// fast counter-clockwise clock — the literal rewind device
const RewindClock: React.FC<{ at: number; size?: number }> = ({ at, size = 300 }) => {
  const frame = useCurrentFrame();
  const p = clamp(rev(frame, at, 12) * 1.6, 0, 1);
  const spin = -Math.max(0, frame - at) * 9; // CCW
  const r = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: p }}>
      <svg width={size} height={size}>
        <circle cx={r} cy={r} r={r - 6} fill="#131318" stroke="#2c2c36" strokeWidth={3} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={r + Math.cos(a) * (r - 18)}
              y1={r + Math.sin(a) * (r - 18)}
              x2={r + Math.cos(a) * (r - 38)}
              y2={r + Math.sin(a) * (r - 38)}
              stroke={noir.smoke}
              strokeWidth={5}
            />
          );
        })}
        <g transform={`rotate(${spin} ${r} ${r})`}>
          <line
            x1={r}
            y1={r}
            x2={r}
            y2={r * 0.26}
            stroke={noir.red}
            strokeWidth={8}
            strokeLinecap="square"
          />
        </g>
        <circle cx={r} cy={r} r={9} fill={noir.red} />
      </svg>
    </div>
  );
};

export const Gap2: React.FC = () => (
  <GapClip
    kicker="CASE 01"
    label="72 GHANTE"
    cam={CAM}
    worldW={5600}
    worldH={1800}
    flashes={[301]}
    cues={[
      { cue: "whoosh", at: 0, volume: 0.3 },
      { cue: "pop", at: 62 },
      { cue: "swoosh", at: 90, volume: 0.3 },
      { cue: "whoosh", at: 255, volume: 0.35 },
      { cue: "riser", at: 262, volume: 0.35 },
      { cue: "impact", at: 301 },
    ]}
  >
    {/* S1 — the fork */}
    <WorldAnchor x={S1} y={560} width={1400}>
      <Headline at={60} words="SWITCH OFF — YA CONTROL" size={100} markWord={4} />
      <div style={{ display: "flex", gap: 40, marginTop: 52 }}>
        <Panel
          at={84}
          w={300}
          style={{
            background: "linear-gradient(180deg, #8E1526, #6E0F1D)",
            border: `1px solid ${noir.red}`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <PanelTitle size={52}>OFF</PanelTitle>
          </div>
        </Panel>
        <Panel at={96} w={340} rib>
          <div style={{ textAlign: "center" }}>
            <PanelTitle size={52}>CONTROL</PanelTitle>
          </div>
        </Panel>
      </div>
    </WorldAnchor>

    {/* S2 — rewind 72 hours */}
    <WorldAnchor x={S2} y={480} width={1000}>
      <RewindClock at={262} size={290} />
      <div style={{ marginTop: -36 }}>
        <StampRing at={299} size={84} rotate={-6}>
          72 GHANTE PEECHE
        </StampRing>
      </div>
      <div style={{ marginTop: 34 }}>
        <Sub at={317} size={26}>
          WAHIN SE SHURU KARTE HAIN
        </Sub>
      </div>
    </WorldAnchor>
  </GapClip>
);
