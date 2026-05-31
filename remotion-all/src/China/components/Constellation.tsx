import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, sides } from "../theme";
import { IgnitableNode } from "./IgnitableNode";
import { WORLD_CX, WORLD_CY, WORLD_W, WORLD_H } from "./CameraStage";

// Seven labs in reveal order, scattered across the WORLD canvas (3200x1800).
// Positions are composition-tuned (NOT geographic), spread out so the camera
// can fly to one and frame it alone, with the center left clear for OPEN.
// igniteFrame values come from the captions.md cue timing (ChinaSection2 table).
export type LabNode = {
  id: string;
  name: string;
  logo?: string; // staticFile path under public/; rendered white inside the ring
  monogram: string; // fallback if the logo is missing
  x: number; // world coords
  y: number;
  igniteFrame: number;
};

export const LAB_NODES: LabNode[] = [
  { id: "deepseek", name: "DEEPSEEK", logo: "logos/deepseek.svg", monogram: "DS", x: 640, y: 520, igniteFrame: 250 },
  { id: "moonshot", name: "MOONSHOT", logo: "logos/moonshot.svg", monogram: "Ki", x: 2560, y: 540, igniteFrame: 700 },
  { id: "zhipu", name: "ZHIPU", logo: "logos/zhipu.svg", monogram: "Z", x: 1600, y: 340, igniteFrame: 1014 },
  { id: "minimax", name: "MINIMAX", logo: "logos/minimax.svg", monogram: "MM", x: 380, y: 1060, igniteFrame: 1492 },
  { id: "alibaba", name: "ALIBABA", logo: "logos/qwen.svg", monogram: "Qw", x: 2820, y: 1080, igniteFrame: 2090 },
  { id: "stepfun", name: "STEPFUN", logo: "logos/stepfun.svg", monogram: "St", x: 1080, y: 1500, igniteFrame: 2337 },
  { id: "baidu", name: "BAIDU", logo: "logos/baidu.svg", monogram: "Bd", x: 2160, y: 1500, igniteFrame: 3077 },
];

const NODE_SIZE = 210;
const CX = WORLD_CX;
const CY = WORLD_CY;

type Props = {
  convergeStart: number; // frame the lines draw toward center -> OPEN reveal
};

// Persistent backdrop for Section 2: the eight "?" nodes carried over from
// Section 1 ignite one by one, then all converge on a single center node
// revealing the section's thesis — OPEN.
export const Constellation: React.FC<Props> = ({ convergeStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lines draw from every node into the center over ~26 frames.
  const drawDur = 26;
  const openPop = spring({
    frame: frame - (convergeStart + 20),
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });
  const openVisible = frame > convergeStart + 10;

  return (
    <>
      {/* Converge lines (drawn under the nodes) */}
      <svg
        width={WORLD_W}
        height={WORLD_H}
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
      >
        {LAB_NODES.map((n) => {
          const dist = Math.hypot(CX - n.x, CY - n.y);
          const draw = interpolate(
            frame,
            [convergeStart, convergeStart + drawDur],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <line
              key={n.id}
              x1={n.x}
              y1={n.y}
              x2={CX}
              y2={CY}
              stroke={sides.china}
              strokeWidth={6}
              strokeDasharray={dist}
              strokeDashoffset={dist * (1 - draw)}
              opacity={0.5}
              style={{ filter: `drop-shadow(0 0 10px ${sides.china})` }}
            />
          );
        })}
      </svg>

      {/* The seven lab nodes */}
      {LAB_NODES.map((n, i) => (
        <IgnitableNode
          key={n.id}
          x={n.x}
          y={n.y}
          name={n.name}
          logo={n.logo}
          monogram={n.monogram}
          size={NODE_SIZE}
          showCaption={false}
          igniteFrame={n.igniteFrame}
          activeUntil={
            i + 1 < LAB_NODES.length
              ? LAB_NODES[i + 1].igniteFrame
              : convergeStart
          }
        />
      ))}

      {/* Center node + the thesis word: OPEN */}
      {openVisible ? (
        <div
          style={{
            position: "absolute",
            left: CX,
            top: CY,
            transform: `translate(-50%, -50%) scale(${interpolate(
              openPop,
              [0, 1],
              [0.5, 1],
            )})`,
            opacity: interpolate(openPop, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: "48px 120px",
              borderRadius: 28,
              border: `6px solid ${sides.china}`,
              background: `radial-gradient(circle at 50% 35%, ${colors.blueMed}55, ${colors.navy}ee)`,
              boxShadow: `0 0 120px ${sides.china}77`,
              fontFamily: fonts.display,
              fontSize: 280,
              letterSpacing: 14,
              color: sides.china,
              lineHeight: 1,
              textShadow: `0 0 80px ${sides.china}99`,
            }}
          >
            OPEN
          </div>
        </div>
      ) : null}
    </>
  );
};
