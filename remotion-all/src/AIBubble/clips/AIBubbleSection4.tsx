import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, signal } from "../theme";
import { Plane } from "../components/Plane";
import { Title } from "../components/Title";
import { RollingText } from "../components/RollingText";
import { ComparisonBarChart } from "../components/ComparisonBarChart";
import { StrikeWord } from "../components/StrikeWord";
import { Bubble } from "../components/Bubble";
import { SfxTrack, SfxCue } from "../components/Sfx";

// SECTION 4 — THE PARALLEL · cues 63–73 · 2:36–3:02 · 777 frames @ 30fps.
// Accent blue (analysis). Not dot-com 2.0: the P/E is ~30 not 200, and the
// people funding the capex are profitable. The bubble is specific companies.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const SFX_CUES: SfxCue[] = [
  { cue: "alert", at: 10, volume: 0.4 }, // "DOT-COM 2.0" strike
  { cue: "whoosh", at: 185 }, // → P/E chart
  { cue: "alert", at: 208, volume: 0.4 }, // 200 (towering)
  { cue: "ding", at: 226 }, // 30 (small/healthy)
  { cue: "popIn", at: 408 }, // builder bubbles
  { cue: "popIn", at: 432 },
  { cue: "popIn", at: 456 },
  { cue: "impact", at: 566 }, // thesis line
];

export const AIBubbleSection4: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // delays are relative to this beat's <Sequence from={400}>
  const builders = [
    { label: "MICROSOFT", seed: "msft", delay: 10 },
    { label: "GOOGLE", seed: "googl", delay: 40 },
    { label: "AMAZON", seed: "amzn", delay: 70 },
  ];

  return (
    <AbsoluteFill>
      <Plane />
      <SfxTrack cues={SFX_CUES} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — not dot-com 2.0 (cues 63–64) */}
        <Sequence durationInFrames={185}>
          <AbsoluteFill style={{ ...CENTER, gap: 40 }}>
            <StrikeWord text="DOT-COM 2.0" delay={10} fontSize={120} />
            <Title lines={["MUJHE AISA NAHI LAGTA."]} fontSize={84} startDelay={36} />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the P/E reality (cues 65–67) */}
        <Sequence from={185} durationInFrames={215}>
          <AbsoluteFill style={{ ...CENTER, gap: 36 }}>
            <ComparisonBarChart
              bars={[
                { label: "Dot-com 2000", value: 200, side: "bad" },
                { label: "AI 2026", value: 30, side: "neutral" },
              ]}
              maxValue={220}
              startDelay={20}
              stagger={18}
              height={460}
              axisTitle="NASDAQ P/E ratio"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the funders are profitable (cues 68–70) */}
        <Sequence from={400} durationInFrames={160}>
          <AbsoluteFill style={{ ...CENTER, gap: 50 }}>
            <div style={{ display: "flex", gap: 70, alignItems: "center" }}>
              {builders.map((b) => (
                <Bubble
                  key={b.label}
                  size={210}
                  label={b.label}
                  tint={signal.good}
                  ring={signal.good}
                  startDelay={b.delay}
                  seed={b.seed}
                />
              ))}
            </div>
            <RollingText
              text="profitable companies — VC ke 'hope' pe nahi chal rahe"
              startDelay={96}
              stagger={2}
              fontSize={40}
              color={colors.ink}
              weight={600}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — the thesis + re-hook (cues 71–73) */}
        <Sequence from={560} durationInFrames={217}>
          <AbsoluteFill style={{ ...CENTER, gap: 26 }}>
            <Title lines={["BUBBLE 'AI' NAHI HAI."]} fontSize={96} startDelay={6} />
            <Title
              lines={["BUBBLE wo COMPANIES hain —", "jinhe paisa kamana nahi aata."]}
              fontSize={64}
              color={signal.bad}
              startDelay={40}
              stagger={4}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
