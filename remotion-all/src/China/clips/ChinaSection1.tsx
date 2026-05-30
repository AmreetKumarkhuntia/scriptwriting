import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, sides, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { StatCounter } from "../components/StatCounter";
import { StrikeWord } from "../components/StrikeWord";
import { PointsList } from "../components/PointsList";
import { RollingText } from "../components/RollingText";
import {
  ComparisonBarChart,
  ComparisonBar,
} from "../components/ComparisonBarChart";

// SECTION 1 — THE NUMBERS · cues 11–54 · 0:28–2:25 · 3580 frames @ 30fps
// Selective full-screen coverage: question beats, the "where AI is used" list,
// and the pricing / benchmark comparisons as bar charts. Per-beat frame ranges
// are tuned to captions.md cue timing. All figures come from script.md.

// Horizontal arrow that "draws" in left-to-right (line wipes, then the head
// fades in). Used for the chatbot -> infrastructure beat.
const Arrow: React.FC<{ delay: number; width?: number }> = ({
  delay,
  width = 200,
}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame - delay, [0, 16], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const head = interpolate(frame - delay, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const h = 60;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <line
        x1={4}
        y1={h / 2}
        x2={4 + (width - 40) * draw}
        y2={h / 2}
        stroke={colors.skyLight}
        strokeWidth={8}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 12px ${colors.skyLight})` }}
      />
      <polyline
        points={`${width - 48},${h / 2 - 22} ${width - 8},${h / 2} ${width - 48},${h / 2 + 22}`}
        fill="none"
        stroke={colors.skyLight}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={head}
        style={{ filter: `drop-shadow(0 0 12px ${colors.skyLight})` }}
      />
    </svg>
  );
};

// An anonymous glowing node that pops in for the 8-labs reveal. We don't name
// the labs here — that's the payoff of Section 2 ("who are they?").
const LabNode: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 18,
  });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
        width: 120,
        height: 120,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `3px solid ${colors.skyLight}`,
        background: `radial-gradient(circle at 50% 35%, ${colors.blueMed}66, ${colors.navy}cc)`,
        boxShadow: `0 0 34px ${colors.skyLight}66`,
        fontFamily: fonts.display,
        fontSize: 64,
        color: colors.skyLight,
      }}
    >
      ?
    </div>
  );
};

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const LAB_COUNT = 8;

const usd = (n: number) => `$${n.toFixed(2)}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

export const ChinaSection1: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Beat 6: benchmark % ---
  const benchBars: ComparisonBar[] = [
    { label: "MiniMax M2.5", value: 80.2, side: "china" },
    { label: "GPT-5.5", value: 88.7, side: "us" },
  ];

  // --- Beat 7: head-to-head price ---
  const priceBars: ComparisonBar[] = [
    { label: "MiniMax M2.5", value: 0.3, side: "china" },
    { label: "GPT-5.5", value: 5.0, side: "us" },
  ];

  // --- Beat 8: the cheap field ---
  const cheapBars: ComparisonBar[] = [
    { label: "DeepSeek V4 Flash", value: 0.14, side: "china" },
    { label: "Step 3.5 Flash", value: 0.1, side: "china" },
    { label: "Qwen3 Coder", value: 0.1, side: "china" },
    { label: "GPT-5.5", value: 5.0, side: "us" },
  ];

  return (
    <AbsoluteFill>
      <SceneBackground />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — the question that opens the section */}
        <Sequence durationInFrames={75}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["ACTUALLY", "KYA BADLA?"]}
              fontSize={160}
              stagger={6}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the old assumption */}
        <Sequence from={75} durationInFrames={210}>
          <AbsoluteFill style={{ ...CENTER, gap: 36 }}>
            <KineticTitle
              lines={["THE SMARTEST", "MODEL WINS"]}
              fontSize={150}
              stagger={6}
            />
            <RollingText
              text="…and for a while, that was true."
              startDelay={72}
              stagger={4}
              fontSize={40}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — "just a chatbot" struck out, arrow points to infrastructure */}
        <Sequence from={285} durationInFrames={125}>
          <AbsoluteFill
            style={{
              ...CENTER,
              flexDirection: "row",
              gap: 50,
              padding: 80,
            }}
          >
            <StrikeWord text="JUST A CHATBOT" delay={6} fontSize={88} />
            <Arrow delay={40} width={180} />
            <div
              style={{
                opacity: interpolate(frame - 285, [50, 64], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <KineticTitle
                lines={["INFRASTRUCTURE"]}
                fontSize={120}
                startDelay={52}
                stagger={4}
                accent={sides.china}
              />
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — where AI is actually used + scale of calls */}
        <Sequence from={410} durationInFrames={320}>
          <AbsoluteFill style={{ ...CENTER, gap: 70 }}>
            <PointsList
              items={[
                "CODING AGENTS",
                "AUTONOMOUS WORKFLOWS",
                "BACKGROUND REASONING",
              ]}
              fontSize={70}
              stagger={22}
            />
            <StatCounter
              prefix="~"
              to={1000}
              suffix="s"
              startDelay={186}
              countDuration={30}
              fontSize={150}
              entrance="slide"
              heroFont="heavy"
              label="model calls, every single day"
              labelWeight={300}
              labelColor="#9FB2D8"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — the question shifts (struck question fades out as the new one arrives) */}
        <Sequence from={730} durationInFrames={420}>
          <AbsoluteFill style={CENTER}>
            <div
              style={{
                opacity: interpolate(frame - 730, [120, 145], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <StrikeWord
                text="WHICH IS THE BEST MODEL?"
                delay={10}
                fontSize={90}
              />
            </div>
            <Sequence from={150} layout="none">
              <AbsoluteFill style={CENTER}>
                <KineticTitle
                  lines={["WHAT WORKS AT SCALE —", "AND STAYS CHEAP?"]}
                  fontSize={96}
                  stagger={4}
                  accent={sides.china}
                />
              </AbsoluteFill>
            </Sequence>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 6 — benchmark comparison */}
        <Sequence from={1150} durationInFrames={300}>
          <AbsoluteFill style={{ ...CENTER, padding: 80 }}>
            <ComparisonBarChart
              bars={benchBars}
              maxValue={100}
              format={pct}
              decimals={1}
              startDelay={16}
              stagger={16}
              axisTitle="SWE-Bench Verified"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 7 — head-to-head price (17x) */}
        <Sequence from={1450} durationInFrames={280}>
          <AbsoluteFill style={{ ...CENTER, gap: 50, padding: 80 }}>
            <ComparisonBarChart
              bars={priceBars}
              maxValue={5.5}
              format={usd}
              startDelay={16}
              stagger={16}
              axisTitle="Price per 1M tokens"
            />
            <StatCounter
              to={17}
              suffix="×"
              startDelay={120}
              countDuration={26}
              fontSize={130}
              color={signal.bad}
              accent={signal.bad}
              entrance="slide"
              heroFont="heavy"
              label="more expensive — for just 8 points"
              labelWeight={300}
              labelColor="#9FB2D8"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 8 — it gets wilder: the cheap field (50x) */}
        <Sequence from={1730} durationInFrames={740}>
          <AbsoluteFill style={{ ...CENTER, gap: 46, padding: 70 }}>
            <ComparisonBarChart
              bars={cheapBars}
              maxValue={5.5}
              format={usd}
              startDelay={20}
              stagger={14}
              barWidth={130}
              axisTitle="Price per 1M tokens"
            />
            <StatCounter
              lead="UP TO"
              to={50}
              suffix="×"
              startDelay={360}
              countDuration={34}
              fontSize={150}
              color={signal.good}
              accent={signal.good}
              entrance="slide"
              heroFont="heavy"
              label="cheaper than GPT-5.5"
              labelWeight={300}
              labelColor="#9FB2D8"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 9 — the math at scale */}
        <Sequence from={2470} durationInFrames={580}>
          <AbsoluteFill style={{ ...CENTER, gap: 70 }}>
            <PointsList
              items={[
                "8% GAP? FINE.",
                "THOUSANDS OF CALLS A DAY.",
                "THE MATH IS IMPOSSIBLE TO IGNORE.",
              ]}
              fontSize={72}
              stagger={70}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 10 — not one lab: 8 labs, same window, same choice */}
        <Sequence from={3050} durationInFrames={440}>
          <AbsoluteFill style={{ ...CENTER, gap: 56, padding: 60 }}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 80,
                color: "#FFFFFF",
                letterSpacing: 3,
                opacity: interpolate(frame - 3050, [0, 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              NOT ONE LAB. EIGHT.
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 36,
                maxWidth: 1320,
              }}
            >
              {Array.from({ length: LAB_COUNT }).map((_, i) => (
                <LabNode key={i} delay={20 + i * 12} />
              ))}
            </div>
            <RollingText
              text="SAME 12-MONTH WINDOW · SAME STRATEGIC BET"
              startDelay={200}
              stagger={4}
              fontSize={36}
              weight={600}
              color={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 11 — re-hook into Section 2 */}
        <Sequence from={3490} durationInFrames={90}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["TOH YEH LOG", "HAIN KAUN?"]}
              fontSize={150}
              stagger={6}
              accent={sides.china}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
