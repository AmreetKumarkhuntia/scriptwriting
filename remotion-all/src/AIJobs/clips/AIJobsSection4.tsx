import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { CameraStage, CamKey } from "../components/CameraStage";

// SECTION 4 — SAFE JOBS · cues 70–80 · 2:58–3:25 · 810 frames @ 30fps
//   0–180    centered re-hook "THE JOBS AI CAN'T TOUCH"           (cues 70–72)
//   180–330  bridge "AND THEY MIGHT SURPRISE YOU"                 (cue 73)
//   330–490  CAMERA PAN — flies to each trade card as it appears  (cues 74–75)
//   490–600  three pillars: PHYSICAL · UNPREDICTABLE · TRUST      (cues 76–77)
//   600–810  payoff "AI CAN'T FIX YOUR WIRING" → re-hook          (cues 78–80)

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// trade cards laid across the world; the camera flies to each one in turn so
// the new card slides into frame as it pops in.
const CARD_Y = 900;
const CAM_Z = 0.8;
const JOBS = [
  { x: 600, name: "ELECTRICIAN", arrive: 330, pop: 332 },
  { x: 1300, name: "PLUMBER", arrive: 375, pop: 374 },
  { x: 2000, name: "NURSE", arrive: 420, pop: 416 },
  { x: 2700, name: "EMERGENCY\nRESPONDER", arrive: 465, pop: 458 },
];

// One keyframe per card → the camera holds, then flies to the next as it appears.
const CAM_KEYS: CamKey[] = [
  { f: 0, cam: { cx: JOBS[0].x, cy: CARD_Y, z: CAM_Z } },
  ...JOBS.map((j) => ({
    f: j.arrive,
    cam: { cx: j.x, cy: CARD_Y, z: CAM_Z },
  })),
];

const JobCard: React.FC<{ x: number; name: string; delay: number }> = ({
  x,
  name,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 20,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 280,
        top: CARD_Y - 220,
        width: 560,
        height: 440,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        borderRadius: 28,
        border: `2px solid ${signal.good}66`,
        background: `linear-gradient(160deg, ${signal.goodDeep}44 0%, ${colors.royal}55 100%)`,
        boxShadow: `0 0 60px ${signal.good}22`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: 30,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 92,
          lineHeight: 0.95,
          letterSpacing: 2,
          color: "#FFFFFF",
          textAlign: "center",
          whiteSpace: "pre-line",
          textShadow: `0 0 40px ${signal.good}44`,
        }}
      >
        {name}
      </div>
      <div
        style={{
          padding: "8px 26px",
          borderRadius: 999,
          background: signal.good,
          color: "#04060E",
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 4,
        }}
      >
        AI-PROOF
      </div>
    </div>
  );
};

const Pillar: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
        padding: "30px 44px",
        borderRadius: 20,
        border: `2px solid ${colors.skyLight}55`,
        background: `${colors.royal}66`,
        fontFamily: fonts.display,
        fontSize: 70,
        letterSpacing: 2,
        color: "#FFFFFF",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

const SubLine: React.FC<{
  text: string;
  delay: number;
  fontSize?: number;
  color?: string;
}> = ({ text, delay, fontSize = 46, color = "#C7D3E6" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 400,
        fontSize,
        letterSpacing: 1,
        color,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const AIJobsSection4: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const worldOpacity = interpolate(
    frame,
    [300, 330, 480, 510],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <SceneBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — re-hook title */}
        <Sequence durationInFrames={180}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["THE JOBS AI", "CAN'T TOUCH"]}
              fontSize={150}
              stagger={5}
              accent={signal.good}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 1b — bridge */}
        <Sequence from={180} durationInFrames={150}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["AND THEY MIGHT", "SURPRISE YOU"]}
              fontSize={130}
              stagger={5}
              accent={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — camera flies to each trade card as it appears */}
        <AbsoluteFill style={{ opacity: worldOpacity }}>
          <CameraStage keyframes={CAM_KEYS} transitionFrames={30}>
            {JOBS.map((j) => (
              <JobCard key={j.name} x={j.x} name={j.name} delay={j.pop} />
            ))}
          </CameraStage>
        </AbsoluteFill>

        {/* Beat 3 — three pillars */}
        <Sequence from={490} durationInFrames={130}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 30 }}>
            <SubLine text="What they all share:" delay={4} color="#8FA3C4" />
            <div style={{ display: "flex", gap: 30 }}>
              <Pillar text="PHYSICAL" delay={16} />
              <Pillar text="UNPREDICTABLE" delay={30} />
              <Pillar text="HUMAN TRUST" delay={44} />
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — payoff + re-hook */}
        <Sequence from={600} durationInFrames={210}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 26 }}>
            <KineticTitle
              lines={["AI CAN'T FIX", "YOUR WIRING"]}
              fontSize={140}
              stagger={5}
            />
            <SubLine
              text="so… should you actually be worried?"
              delay={80}
              fontSize={50}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
