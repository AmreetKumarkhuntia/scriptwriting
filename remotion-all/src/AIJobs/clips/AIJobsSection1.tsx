import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { StatCounter } from "../components/StatCounter";
import {
  CameraStage,
  CamKey,
  WORLD_CX,
} from "../components/CameraStage";
import { WorldAnchor } from "../components/WorldAnchor";

// SECTION 1 — THE FALLACY · cues 14–37 · 0:37–1:35 · 1730 frames @ 30fps
// Group 1 (0–520)    centered: 1891 Schloss → "Lump of Labor Fallacy" → fixed-pie idea
// Group 2 (520–1300) CAMERA FLY across the Luddite timeline (1811 → aftermath)
// Group 3 (1300–1730) centered payoff "tech changes work" → re-hook "AI is different?"

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// --- camera world (Luddite timeline) ---------------------------------------
const S1_X = 760; // 1811 station
const S2_X = 2440; // aftermath station
const STN_Y = 900;

const WIDE = { cx: WORLD_CX, cy: 840, z: 0.55 };
const focus = (x: number) => ({ cx: x, cy: STN_Y, z: 1.12 });

const CAM_KEYS: CamKey[] = [
  { f: 0, cam: focus(S1_X) },
  { f: 520, cam: focus(S1_X) }, // hold on 1811
  { f: 960, cam: focus(S2_X) }, // fly to the aftermath
  { f: 1290, cam: WIDE }, // pull back wide for the payoff
];

// A small pill badge (year / "two years later").
const Pill: React.FC<{ text: string; delay?: number; color?: string }> = ({
  text,
  delay = 0,
  color = colors.skyLight,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
        padding: "10px 30px",
        borderRadius: 999,
        border: `2px solid ${color}`,
        background: `${color}1A`,
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 38,
        letterSpacing: 6,
        color,
        textTransform: "uppercase",
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
}> = ({ text, delay, fontSize = 42, color = "#C7D3E6" }) => {
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

export const AIJobsSection1: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // The camera world only shows during the Luddite timeline.
  const worldOpacity = interpolate(
    frame,
    [500, 540, 1290, 1340],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <SceneBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* ---- GROUP 1 · centered — the fallacy ---- */}
        <Sequence durationInFrames={180}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 30 }}>
            <Pill text="1891 · David Schloss" delay={4} />
            <KineticTitle
              lines={["THE LUMP OF", "LABOR FALLACY"]}
              fontSize={140}
              startDelay={22}
              stagger={5}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence from={180} durationInFrames={180}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 24 }}>
            <SubLine text="The assumption:" delay={6} color="#8FA3C4" />
            <KineticTitle
              lines={["WORK IS A FIXED PIE"]}
              fontSize={120}
              startDelay={20}
              stagger={5}
              accent={signal.bad}
            />
            <SubLine
              text="a machine does some → less left for humans"
              delay={64}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence from={360} durationInFrames={170}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["BUT HISTORY", "PROVES IT WRONG"]}
              fontSize={130}
              stagger={5}
              accent={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>

        {/* ---- GROUP 2 · the camera-fly timeline ---- */}
        <AbsoluteFill style={{ opacity: worldOpacity }}>
          <CameraStage keyframes={CAM_KEYS}>
            {/* connector line between the two stations */}
            <div
              style={{
                position: "absolute",
                left: S1_X,
                top: STN_Y - 250,
                width: S2_X - S1_X,
                height: 4,
                background: `linear-gradient(90deg, ${colors.skyLight}88, ${signal.good}88)`,
                borderRadius: 4,
              }}
            />
            {[S1_X, S2_X].map((x) => (
              <div
                key={x}
                style={{
                  position: "absolute",
                  left: x - 12,
                  top: STN_Y - 262,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  boxShadow: `0 0 24px ${colors.skyLight}`,
                }}
              />
            ))}

            {/* Station 1 — 1811 Luddite Rebellion */}
            <Sequence from={540} durationInFrames={420} layout="none">
              <WorldAnchor x={S1_X} y={STN_Y - 200} width={1100}>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}
                >
                  <Pill text="1811" delay={8} color={signal.bad} />
                  <KineticTitle
                    lines={["THE LUDDITE", "REBELLION"]}
                    fontSize={110}
                    startDelay={22}
                    stagger={5}
                  />
                  <StatCounter
                    to={12000}
                    startDelay={150}
                    countDuration={34}
                    fontSize={150}
                    entrance="slide"
                    heroFont="heavy"
                    color={signal.bad}
                    accent={signal.bad}
                    label="troops deployed to crush them"
                    labelWeight={400}
                    labelColor="#C7D3E6"
                  />
                </div>
              </WorldAnchor>
            </Sequence>

            {/* Station 2 — two years later */}
            <Sequence from={960} durationInFrames={360} layout="none">
              <WorldAnchor x={S2_X} y={STN_Y - 200} width={1200}>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}
                >
                  <Pill text="Two years later" delay={8} color={signal.good} />
                  <KineticTitle
                    lines={["WAGES ROSE.", "JOBS EXPLODED."]}
                    fontSize={110}
                    startDelay={22}
                    stagger={5}
                    accent={signal.good}
                  />
                  <SubLine
                    text="new industries, millions of jobs that didn't exist before"
                    delay={130}
                    fontSize={40}
                  />
                </div>
              </WorldAnchor>
            </Sequence>
          </CameraStage>
        </AbsoluteFill>

        {/* ---- GROUP 3 · centered payoff + re-hook ---- */}
        <Sequence from={1300} durationInFrames={240}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 24 }}>
            <KineticTitle
              lines={["TECHNOLOGY DOESN'T", "END WORK —"]}
              fontSize={120}
              stagger={4}
            />
            <KineticTitle
              lines={["IT CHANGES IT"]}
              fontSize={130}
              startDelay={40}
              stagger={6}
              accent={signal.good}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence from={1540} durationInFrames={190}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["BUT AI IS", "DIFFERENT… RIGHT?"]}
              fontSize={130}
              stagger={5}
              accent={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
