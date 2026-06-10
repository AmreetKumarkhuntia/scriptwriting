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

// SECTION 1 — SWE-BENCH PRO · cues 16–23 · 0:41–1:01 · 610 frames @ 30fps
// Beats:
//   0–150     title: "SWE-Bench Pro" — real GitHub issues
//   150–470   bars: Fable 5 80.3 / GPT-5.5 58.6 / Gemini 3.1 Pro 54.2
//   470–610   payoff: "not a close race" · +22 / +26

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const COL: React.CSSProperties = { ...CENTER, flexDirection: "column" };

export const Fable5Section1: React.FC = () => {
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
        {/* Beat 1 — title */}
        <Sequence durationInFrames={150}>
          <AbsoluteFill style={{ ...COL, gap: 26 }}>
            <Lead text="Benchmark 01" delay={6} rule />
            <EditorialTitle
              lines={["SWE-Bench Pro"]}
              fontSize={132}
              startDelay={16}
              stagger={4}
            />
            <SubLine
              text="Real GitHub issues, real repos — can it actually ship the fix?"
              delay={48}
              fontSize={42}
              maxWidth={1300}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — bars */}
        <Sequence from={150} durationInFrames={320}>
          <AbsoluteFill style={{ ...COL, gap: 34 }}>
            <Lead text="The gold standard for coding" delay={6} />
            <BenchmarkBars
              startDelay={24}
              suffix="%"
              decimals={1}
              maxValue={100}
              bars={[
                { label: "Fable 5", value: 80.3, side: "hero" },
                { label: "GPT-5.5", value: 58.6, side: "rival" },
                { label: "Gemini 3.1 Pro", value: 54.2, side: "rival" },
              ]}
              axisTitle="SWE-Bench Pro · % resolved"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the gap */}
        <Sequence from={470} durationInFrames={140}>
          <AbsoluteFill style={{ ...COL, gap: 24 }}>
            <EditorialTitle
              lines={["Not a close race."]}
              fontSize={108}
              startDelay={6}
              stagger={4}
            />
            <SubLine
              text="+22 points over OpenAI   ·   +26 over Google"
              delay={40}
              fontSize={46}
              weight={600}
              color={colors.clay}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
