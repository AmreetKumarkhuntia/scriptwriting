import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { ClaudeSpark } from "../components/ClaudeSpark";
import { EditorialTitle } from "../components/EditorialTitle";
import { Lead } from "../components/Lead";
import { SubLine } from "../components/SubLine";
import { GuardrailVault } from "../components/GuardrailVault";

// SECTION 0 — HOOK · cues 1–15 · 0:00–0:41 · 1230 frames @ 30fps
// Beats (relative frames):
//   0–160     opening: "the most powerful model they've ever made public"  (cues 1–2)
//   160–340   the paradox: "two weeks earlier they said they couldn't"     (cues 3–5)
//   340–600   Mythos LOCKED — the vault                                    (cues 6–9)
//   600–800   why it stayed locked (Windows/Chrome, red teams, govs)       (cues 9–12)
//   800–1010  "they shipped it anyway · June 9, 2026"                       (cues 12–13)
//   1010–1230 reveal "Claude Fable 5" + rehook to the benchmarks           (cues 13–15)

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const COL: React.CSSProperties = { ...CENTER, flexDirection: "column" };

export const Fable5Hook: React.FC = () => {
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
        {/* Beat 1 — opening */}
        <Sequence durationInFrames={160}>
          <AbsoluteFill style={{ ...COL, gap: 34 }}>
            <ClaudeSpark size={84} startDelay={2} />
            <Lead text="Anthropic · June 2026" delay={10} rule />
            <EditorialTitle
              lines={["The most powerful model", "they’ve ever made public."]}
              fontSize={96}
              startDelay={18}
              stagger={4}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the paradox */}
        <Sequence from={160} durationInFrames={180}>
          <AbsoluteFill style={{ ...COL, gap: 30 }}>
            <EditorialTitle
              lines={["Two weeks earlier, they said", "they couldn’t."]}
              fontSize={90}
              italic
              startDelay={6}
              stagger={4}
            />
            <SubLine text="It was too dangerous to release." delay={50} fontSize={44} />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — Mythos locked */}
        <Sequence from={340} durationInFrames={260}>
          <AbsoluteFill style={CENTER}>
            <GuardrailVault
              title="MYTHOS 5"
              sub="Too good at hacking"
              startDelay={6}
              width={780}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — why it stayed locked */}
        <Sequence from={600} durationInFrames={200}>
          <AbsoluteFill style={{ ...COL, gap: 28 }}>
            <Lead text="Why it stayed locked" delay={6} />
            <SubLine
              text="Found severe vulnerabilities in Windows, Chrome & major browsers"
              delay={30}
              fontSize={46}
              color={colors.ink}
              maxWidth={1250}
            />
            <SubLine
              text="Faster than most professional red teams"
              delay={56}
              fontSize={46}
              color={colors.ink}
              maxWidth={1250}
            />
            <SubLine
              text="Governments were nervous. So was Anthropic."
              delay={84}
              fontSize={40}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — shipped anyway */}
        <Sequence from={800} durationInFrames={210}>
          <AbsoluteFill style={{ ...COL, gap: 30 }}>
            <Lead text="June 9, 2026" delay={6} rule />
            <EditorialTitle
              lines={["They shipped it anyway."]}
              fontSize={108}
              startDelay={20}
              stagger={4}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 6 — the reveal + rehook */}
        <Sequence from={1010} durationInFrames={220}>
          <AbsoluteFill style={{ ...COL, gap: 26 }}>
            <ClaudeSpark size={72} startDelay={2} />
            <EditorialTitle
              lines={["Claude Fable 5"]}
              fontSize={150}
              weight={900}
              color={colors.clay}
              startDelay={14}
              stagger={4}
            />
            <SubLine
              text="Same Mythos intelligence. Guardrails on top."
              delay={50}
              fontSize={44}
            />
            <SubLine
              text="And the benchmarks? Almost unfair."
              delay={80}
              fontSize={38}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
