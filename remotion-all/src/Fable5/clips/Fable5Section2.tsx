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
import { StatBlock } from "../components/StatBlock";
import { ClaudeSpark } from "../components/ClaudeSpark";

// SECTION 2 — FRONTIERCODE DIAMOND · cues 24–33 · 1:01–1:30 · 865 frames @ 30fps
// Beats:
//   0–200     title: "FrontierCode Diamond" — a senior engineer's full day
//   200–560   bars: Fable 5 29.3 / Opus 4.8 13.4 / GPT-5.5 5.7
//   560–865   payoff: "5× better" + rehook "and it's not just code…"

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const COL: React.CSSProperties = { ...CENTER, flexDirection: "column" };

export const Fable5Section2: React.FC = () => {
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
        <Sequence durationInFrames={200}>
          <AbsoluteFill style={{ ...COL, gap: 26 }}>
            <Lead text="Benchmark 02 · the hard one" delay={6} rule />
            <EditorialTitle
              lines={["FrontierCode Diamond"]}
              fontSize={116}
              startDelay={16}
              stagger={4}
            />
            <SubLine
              text="Novel codebases, multi-file tasks — a senior engineer’s full day."
              delay={48}
              fontSize={42}
              maxWidth={1300}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — bars */}
        <Sequence from={200} durationInFrames={360}>
          <AbsoluteFill style={{ ...COL, gap: 34 }}>
            <Lead text="The hardest coding test there is" delay={6} />
            <BenchmarkBars
              startDelay={24}
              suffix="%"
              decimals={1}
              maxValue={36}
              bars={[
                { label: "Fable 5", value: 29.3, side: "hero" },
                { label: "Opus 4.8", value: 13.4, side: "rival" },
                { label: "GPT-5.5", value: 5.7, side: "rival" },
              ]}
              axisTitle="FrontierCode Diamond · % solved"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — 5x payoff + rehook */}
        <Sequence from={560} durationInFrames={305}>
          <AbsoluteFill style={{ ...COL, gap: 20 }}>
            <ClaudeSpark size={70} startDelay={2} />
            <StatBlock
              to={5}
              suffix="×"
              lead="vs GPT-5.5"
              label="better on the hardest coding tasks"
              fontSize={250}
              numFont="serif"
              entrance="pop"
              color={colors.clay}
              startDelay={14}
              countDuration={26}
            />
            <SubLine
              text="And it’s not just code…"
              delay={76}
              fontSize={42}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
