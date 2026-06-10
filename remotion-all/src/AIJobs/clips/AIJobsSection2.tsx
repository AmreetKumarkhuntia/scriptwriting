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
import { ComparisonBarChart } from "../components/ComparisonBarChart";
import { PointsList } from "../components/PointsList";
import { CameraStage, CamKey, WORLD_CX } from "../components/CameraStage";
import { WorldAnchor } from "../components/WorldAnchor";

// SECTION 2 — THE DATA · cues 38–58 · 1:35–2:31 · 1680 frames @ 30fps
// Intro (0–290)     centered: ChatGPT baseline → "we'd see a crisis by now"
// Camera fly (290–1430) three data stations: WEF +78M → growth chart → 8–10% layoffs
// Payoff (1433–1680) centered: "no apocalypse" → re-hook "what's actually happening?"

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const SA_X = 700;
const SB_X = 1600;
const SC_X = 2500;
const STN_Y = 900;

const WIDE = { cx: WORLD_CX, cy: 840, z: 0.5 };
const CAM_KEYS: CamKey[] = [
  { f: 0, cam: { cx: SA_X, cy: STN_Y, z: 0.92 } },
  { f: 290, cam: { cx: SA_X, cy: STN_Y, z: 0.92 } }, // WEF
  { f: 785, cam: { cx: SB_X, cy: STN_Y, z: 0.82 } }, // growth chart
  { f: 1135, cam: { cx: SC_X, cy: STN_Y, z: 0.92 } }, // layoffs
  { f: 1430, cam: WIDE }, // pull back
];

const Lead: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
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
        fontWeight: 700,
        fontSize: 40,
        letterSpacing: 6,
        color: colors.skyLight,
        textTransform: "uppercase",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

const SubLine: React.FC<{ text: string; delay: number; fontSize?: number }> = ({
  text,
  delay,
  fontSize = 42,
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
        fontFamily: fonts.body,
        fontWeight: 400,
        fontSize,
        letterSpacing: 1,
        color: "#C7D3E6",
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const AIJobsSection2: React.FC = () => {
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
    [270, 300, 1430, 1470],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <SceneBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* ---- INTRO · centered ---- */}
        <Sequence durationInFrames={290}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 28 }}>
            <Lead text="ChatGPT · November 2022" delay={4} />
            <KineticTitle
              lines={["3+ YEARS OF DATA"]}
              fontSize={150}
              startDelay={22}
              stagger={6}
            />
            <SubLine
              text="if AI was causing a jobs crisis, we'd see it by now"
              delay={70}
            />
          </AbsoluteFill>
        </Sequence>

        {/* ---- CAMERA FLY · three data stations ---- */}
        <AbsoluteFill style={{ opacity: worldOpacity }}>
          <CameraStage keyframes={CAM_KEYS}>
            {/* Station A — WEF net jobs */}
            <Sequence from={300} durationInFrames={490} layout="none">
              <WorldAnchor x={SA_X} y={STN_Y - 340} width={1150}>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}
                >
                  <Lead text="World Economic Forum · 2025" delay={8} />
                  <div style={{ display: "flex", gap: 90, alignItems: "flex-start" }}>
                    <StatCounter
                      to={92}
                      prefix="−"
                      suffix="M"
                      startDelay={40}
                      countDuration={30}
                      fontSize={130}
                      color={signal.bad}
                      accent={signal.bad}
                      label="jobs displaced by 2030"
                      labelWeight={400}
                      labelColor="#C7D3E6"
                    />
                    <StatCounter
                      to={170}
                      prefix="+"
                      suffix="M"
                      startDelay={70}
                      countDuration={30}
                      fontSize={130}
                      color={signal.good}
                      accent={signal.good}
                      label="new jobs created"
                      labelWeight={400}
                      labelColor="#C7D3E6"
                    />
                  </div>
                  <StatCounter
                    to={78}
                    prefix="+"
                    suffix="M"
                    lead="net result"
                    startDelay={150}
                    countDuration={34}
                    fontSize={200}
                    heroFont="heavy"
                    color={signal.good}
                    accent={signal.good}
                    label="jobs gained worldwide"
                  />
                </div>
              </WorldAnchor>
            </Sequence>

            {/* Station B — AI-exposed sectors grow faster */}
            <Sequence from={790} durationInFrames={350} layout="none">
              <WorldAnchor x={SB_X} y={STN_Y - 420} width={1200}>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
                >
                  <Lead text="More AI exposure → better outcomes" delay={8} />
                  <ComparisonBarChart
                    bars={[
                      { label: "Job growth", value: 3.9, side: "china" },
                      { label: "Wage growth", value: 4.8, side: "china" },
                    ]}
                    maxValue={6}
                    decimals={1}
                    format={(n) => `${n.toFixed(1)}%`}
                    startDelay={40}
                    stagger={16}
                    height={420}
                    barWidth={200}
                    axisTitle="AI-exposed sectors · 2024"
                  />
                </div>
              </WorldAnchor>
            </Sequence>

            {/* Station C — AI is a small slice of layoffs */}
            <Sequence from={1140} durationInFrames={300} layout="none">
              <WorldAnchor x={SC_X} y={STN_Y - 320} width={1200}>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}
                >
                  <StatCounter
                    to={10}
                    prefix="8–"
                    suffix="%"
                    startDelay={20}
                    countDuration={28}
                    fontSize={200}
                    color={signal.warn}
                    accent={signal.warn}
                    label="of layoffs blamed on AI"
                    labelWeight={400}
                    labelColor="#C7D3E6"
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <Lead text="the other 90%" delay={120} />
                    <PointsList
                      items={["ECONOMIC SLOWDOWN", "MARKET CONDITIONS", "STRATEGIC PIVOTS"]}
                      startDelay={140}
                      stagger={14}
                      fontSize={56}
                      accent={signal.bad}
                    />
                  </div>
                </div>
              </WorldAnchor>
            </Sequence>
          </CameraStage>
        </AbsoluteFill>

        {/* ---- PAYOFF + RE-HOOK · centered ---- */}
        <Sequence from={1433} durationInFrames={172}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["3 YEARS IN —", "NO APOCALYPSE"]}
              fontSize={140}
              stagger={5}
              accent={signal.good}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence from={1605} durationInFrames={75}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["SO WHAT'S ACTUALLY", "HAPPENING?"]}
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
