import {
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, signal, fonts } from "../theme";
import { Plane } from "../components/Plane";
import { Title } from "../components/Title";
import { RollingText } from "../components/RollingText";
import { StatCounter } from "../components/StatCounter";
import { ComparisonBarChart } from "../components/ComparisonBarChart";
import { Bubble } from "../components/Bubble";
import { SfxTrack, SfxCue } from "../components/Sfx";

// SECTION 2 — THE CHINA PROBLEM · cues 31–46 · 1:15–1:58 · 1267 frames @ 30fps.
// Accent green = cheap. DeepSeek enters, undercuts Claude ~89×, Google flinches,
// and OpenAI is left with an impossible choice.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const priceFmt = (n: number) => `$${n < 1 ? n.toFixed(2) : n.toFixed(0)}`;

const SFX_CUES: SfxCue[] = [
  { cue: "swoosh", at: 2 }, // title
  { cue: "popIn", at: 60 }, // DeepSeek bubble
  { cue: "whoosh", at: 185 }, // → price face-off
  { cue: "money", at: 218 }, // DeepSeek cheap bar
  { cue: "alert", at: 236, volume: 0.35 }, // Claude expensive bar
  { cue: "impact", at: 478 }, // 89× slam
  { cue: "alert", at: 672, volume: 0.4 }, // Google −40%
  { cue: "whoosh", at: 915 }, // → impossible choice
  { cue: "alert", at: 957, volume: 0.32 }, // MATCH card
  { cue: "alert", at: 987, volume: 0.32 }, // HOLD card
  { cue: "impact", at: 1065 }, // "koi achha version nahi" line
];

const OptionCard: React.FC<{
  head: string;
  body: string;
  color: string;
  startDelay: number;
}> = ({ head, body, color, startDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 18, stiffness: 110 },
    durationInFrames: 22,
  });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
        width: 560,
        padding: "44px 40px",
        borderRadius: 28,
        background: colors.paper,
        border: `2px solid ${color}`,
        boxShadow: `0 24px 60px ${color}22`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 56,
          letterSpacing: -1,
          color: colors.ink,
        }}
      >
        {head}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 32,
          color,
          letterSpacing: 0.5,
        }}
      >
        {body}
      </div>
    </div>
  );
};

export const AIBubbleSection2: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <Plane />
      <SfxTrack cues={SFX_CUES} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — China enters (cues 31–33) */}
        <Sequence durationInFrames={185}>
          <AbsoluteFill style={{ ...CENTER, gap: 50 }}>
            <Title lines={["CHINA ENTERED THE CHAT."]} fontSize={100} />
            <Bubble
              size={230}
              label="DEEPSEEK"
              tint={signal.good}
              ring={signal.good}
              startDelay={60}
              seed="deepseek"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — price face-off (cues 33–37) */}
        <Sequence from={185} durationInFrames={285}>
          <AbsoluteFill style={{ ...CENTER, gap: 40 }}>
            <Title lines={["DEEPSEEK  vs  CLAUDE OPUS"]} fontSize={56} />
            <ComparisonBarChart
              bars={[
                { label: "DeepSeek V4", value: 0.14, side: "good" },
                { label: "Claude Opus", value: 25, side: "bad" },
              ]}
              maxValue={28}
              format={priceFmt}
              startDelay={30}
              stagger={16}
              height={420}
              axisTitle="output · $ per million tokens"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the gap stat (cues 37–39) */}
        <Sequence from={470} durationInFrames={170}>
          <AbsoluteFill style={{ ...CENTER, gap: 30 }}>
            <StatCounter
              to={89}
              suffix="×"
              startDelay={8}
              countDuration={26}
              fontSize={300}
              color={signal.good}
              label="cheaper"
              labelColor={colors.inkSoft}
            />
            <RollingText
              text="aur DeepSeek koi khilona nahi — coding benchmarks pe competitive"
              startDelay={50}
              stagger={2}
              fontSize={34}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — Google flinched (cues 40–43) */}
        <Sequence from={640} durationInFrames={275}>
          <AbsoluteFill style={{ ...CENTER, gap: 34 }}>
            <Title lines={["GOOGLE FLINCHED."]} fontSize={96} />
            <StatCounter
              to={40}
              prefix="−"
              suffix="%"
              startDelay={30}
              countDuration={22}
              fontSize={200}
              color={signal.bad}
              heroFont="mono"
              label="AI subscription · June 2026"
              labelColor={colors.inkSoft}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — the impossible choice + re-hook (cues 44–46) */}
        <Sequence from={915} durationInFrames={352}>
          <AbsoluteFill style={{ ...CENTER, gap: 44 }}>
            <Title lines={["OpenAI · IMPOSSIBLE CHOICE"]} fontSize={62} startDelay={4} />
            <div style={{ display: "flex", gap: 44, alignItems: "stretch" }}>
              <OptionCard
                head="MATCH PRICES"
                body="paisa aur tezi se jalega"
                color={signal.warn}
                startDelay={40}
              />
              <OptionCard
                head="HOLD PRICES"
                body="users chale jaayenge"
                color={signal.bad}
                startDelay={70}
              />
            </div>
            <RollingText
              text="inke liye koi achha version hai hi nahi"
              startDelay={150}
              stagger={3}
              fontSize={38}
              color={colors.ink}
              weight={600}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
