import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { EditorialTitle } from "../components/EditorialTitle";
import { GuardrailVault } from "../components/GuardrailVault";
import { StatBlock } from "../components/StatBlock";
import { SubLine } from "../components/SubLine";

// ─────────────────────────────────────────────────────────────────────────
// Fable5-Reel2 · "Too dangerous to release" · 1080×1920 @ 30fps · 600f = 20s
// Re-voiced English (Liam) short for the Amreet Talks Shorts funnel.
// Parent: "Claude Fable 5: The Most Insane AI Model" (youtu.be/9hNiFmOZCw0)
//
// VO sentence map (seconds → frames @ 30fps):
//   0.00–3.85  "Anthropic built an AI so dangerous, they refused to release it."
//   4.45–8.14  "It could find security holes in Windows and Chrome faster than pro hackers."
//   8.52–11.01 "So they shipped a safer version — Fable 5."
//  11.53–15.34 "That safer one is 5 times better than GPT-5.5."
//  15.87–16.68 "The dangerous model?"
//  17.03–17.89 "Still locked away."
// ─────────────────────────────────────────────────────────────────────────

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// Cross-dissolve beat wrapper (same pattern as AIJobsReel1).
const Beat: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  gap?: number;
}> = ({ children, fadeIn = 9, fadeOut = 9, gap = 28 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opIn =
    fadeIn <= 0
      ? 1
      : interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const opOut =
    fadeOut <= 0
      ? 1
      : interpolate(
          frame,
          [durationInFrames - fadeOut, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
  return (
    <AbsoluteFill
      style={{
        ...CENTER,
        flexDirection: "column",
        gap,
        padding: 90,
        opacity: Math.min(opIn, opOut),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Cream editorial CTA end card.
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const sub = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.label,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 7,
          color: colors.clay,
          textTransform: "uppercase",
        }}
      >
        ▶ Watch the full video
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 108,
          lineHeight: 0.96,
          letterSpacing: -1,
          color: colors.ink,
          textAlign: "center",
        }}
      >
        Claude Fable 5:{" "}
        <span style={{ color: colors.clay }}>
          The Most Insane AI Model
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.label,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: 3,
          color: colors.inkSoft,
          textTransform: "uppercase",
          opacity: sub,
        }}
      >
        Link in description · Subscribe
      </div>
    </div>
  );
};

export const Fable5Reel2: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <PaperBackground />
      <Audio src={staticFile("aitalks-shorts/02-fable-danger/vo/r2-liam.mp3")} />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* B1 · HOOK — "...so dangerous, they refused to release it." · 0.00–4.33s */}
        <Sequence durationInFrames={130}>
          <Beat>
            <EditorialTitle
              lines={["TOO DANGEROUS", "TO RELEASE"]}
              fontSize={112}
              color={colors.clay}
              weight={900}
              startDelay={3}
              stagger={6}
            />
          </Beat>
        </Sequence>

        {/* B2 · "...security holes in Windows and Chrome..." · 4.07–8.67s */}
        <Sequence from={122} durationInFrames={138}>
          <Beat gap={32}>
            <GuardrailVault
              title="MYTHOS 5"
              sub="TOO GOOD AT HACKING"
              startDelay={4}
              width={920}
            />
            <SubLine
              text="security holes in Windows & Chrome — faster than pro hackers"
              delay={32}
              fontSize={38}
              maxWidth={900}
            />
          </Beat>
        </Sequence>

        {/* B3 · "So they shipped a safer version — Fable 5." · 8.40–11.67s
            "FABLE 5" slams at local f46 = pause after "version —" (9.94s) */}
        <Sequence from={252} durationInFrames={98}>
          <Beat gap={18}>
            <SubLine
              text="So they shipped a safer version —"
              delay={4}
              fontSize={50}
              color={colors.inkSoft}
            />
            <EditorialTitle
              lines={["FABLE 5"]}
              fontSize={200}
              color={colors.clay}
              weight={900}
              startDelay={46}
              stagger={10}
            />
          </Beat>
        </Sequence>

        {/* B4 · "That safer one is 5 times better than GPT-5.5." · 11.40–15.47s */}
        <Sequence from={342} durationInFrames={122}>
          <Beat>
            <StatBlock
              to={5}
              suffix="×"
              lead="Safer version"
              label="better than GPT-5.5"
              fontSize={280}
              color={colors.clay}
              entrance="pop"
              startDelay={4}
              countDuration={20}
            />
          </Beat>
        </Sequence>

        {/* B5 · "The dangerous model? Still locked away." · 15.20–18.07s
            guardDelay=55 → bars sweep at local f55 = global f511 = 17.03s */}
        <Sequence from={456} durationInFrames={86}>
          <Beat gap={0} fadeIn={10} fadeOut={10}>
            <GuardrailVault
              title="THE DANGEROUS MODEL"
              sub="STILL LOCKED AWAY"
              startDelay={4}
              width={920}
              guardDelay={55}
              guardCount={5}
            />
          </Beat>
        </Sequence>

        {/* B6 · END CARD / CTA · 17.67–20.00s */}
        <Sequence from={530} durationInFrames={70}>
          <Beat fadeOut={0}>
            <EndCard />
          </Beat>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
