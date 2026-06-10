import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { EditorialTitle } from "../components/EditorialTitle";
import { Lead } from "../components/Lead";
import { SubLine } from "../components/SubLine";
import { BenchmarkBars } from "../components/BenchmarkBars";
import { PriceCard } from "../components/PriceCard";
import { DemoLowerThird } from "../components/DemoLowerThird";

// SECTION 3 — KNOWLEDGE · PRICE · DEMO SETUP · cues 34–46 · 1:30–2:03 · 1000 frames
// Beats:
//   0–110     "it's not just coding"
//   110–360   GDPval bars: Fable 5 1932 / GPT-5.5 1769 / Gemini 3.1 1314
//   360–620   the catch: price card ($10 in / $50 out · 2× Opus 4.8)
//   620–760   "benchmarks are one thing — but the real world?"
//   760–1000  the test: Opus 4.8 vs Fable 5 in Claude Code

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const COL: React.CSSProperties = { ...CENTER, flexDirection: "column" };

export const Fable5Section3: React.FC = () => {
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
      <PaperBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — not just code */}
        <Sequence durationInFrames={110}>
          <AbsoluteFill style={{ ...COL, gap: 24 }}>
            <Lead text="Beyond code" delay={6} rule />
            <EditorialTitle
              lines={["It’s not just coding."]}
              fontSize={112}
              startDelay={16}
              stagger={4}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — GDPval bars */}
        <Sequence from={110} durationInFrames={250}>
          <AbsoluteFill style={{ ...COL, gap: 32 }}>
            <Lead text="Knowledge work · GDPval" delay={6} />
            <BenchmarkBars
              startDelay={20}
              decimals={0}
              maxValue={2200}
              height={420}
              bars={[
                { label: "Fable 5", value: 1932, side: "hero" },
                { label: "GPT-5.5", value: 1769, side: "rival" },
                { label: "Gemini 3.1", value: 1314, side: "rival" },
              ]}
              axisTitle="GDPval · real business tasks"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the catch (pricing) */}
        <Sequence from={360} durationInFrames={260}>
          <AbsoluteFill style={{ ...COL, gap: 30 }}>
            <Lead text="The catch" delay={6} />
            <PriceCard
              startDelay={24}
              inputPrice={10}
              outputPrice={50}
              tag="2× the price of Opus 4.8"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — but the real world? */}
        <Sequence from={620} durationInFrames={140}>
          <AbsoluteFill style={{ ...COL, gap: 22 }}>
            <EditorialTitle
              lines={["Benchmarks are one thing."]}
              fontSize={84}
              italic
              startDelay={6}
              stagger={4}
            />
            <SubLine
              text="But does it hold up in the real world?"
              delay={36}
              fontSize={46}
              color={colors.ink}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — the test setup */}
        <Sequence from={760} durationInFrames={240}>
          <AbsoluteFill style={{ ...COL, gap: 44 }}>
            <Lead text="The test" delay={6} rule />
            <DemoLowerThird
              startDelay={20}
              left="Opus 4.8"
              right="Fable 5"
              tool="Claude Code"
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
