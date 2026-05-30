import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, fonts, sides } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { StatCounter } from "../components/StatCounter";
import { StrikeWord } from "../components/StrikeWord";

// SECTION 0 — HOOK · cues 1–10 · 0:00–0:31 · 930 frames @ 30fps
// Beats (relative frames):
//   0–90    "CHINA JUST TOOK OVER AI"          (cue 1)
//   90–195  "NOT OPENAI. NOT ANTHROPIC."       (cue 2)
//   195–390 "APRIL 2026 · 6 OF 6" stat slam    (cues 3–4)
//   390–570 the six Chinese models list        (cues 5–7)
//   570–750 "HOW?  WHAT?  WHY?" stinger         (cues 7–9)
//   750–930 "LET'S FIND OUT" → fade out         (cue 10)

const MODELS = ["MINIMAX", "DEEPSEEK", "KIMI", "QWEN", "GLM", "STEP"];

// One model "chip" that scales in.
const ModelChip: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        padding: "18px 34px",
        borderRadius: 14,
        border: `2px solid ${colors.skyLight}`,
        background: `${colors.blueMed}33`,
        boxShadow: `0 0 28px ${colors.skyLight}44`,
        fontFamily: fonts.display,
        fontSize: 54,
        color: colors.skyLight,
        letterSpacing: 2,
      }}
    >
      {text}
    </div>
  );
};

// A single big question word for the stinger.
const QWord: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        fontFamily: fonts.display,
        fontSize: 150,
        color: "#FFFFFF",
        letterSpacing: 4,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        display: "inline-block",
        textShadow: `0 0 40px ${colors.skyLight}66`,
      }}
    >
      {text}
    </span>
  );
};

export const ChinaHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Global fade-out over the final 18 frames.
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <SceneBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — main slam */}
        <Sequence durationInFrames={90}>
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <KineticTitle
              lines={["CHINA JUST", "TOOK OVER AI"]}
              fontSize={170}
              stagger={6}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — not OpenAI, not Google, not Anthropic */}
        <Sequence from={90} durationInFrames={105}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 22,
            }}
          >
            <StrikeWord text="NOT GOOGLE" delay={4} />
            <StrikeWord text="NOT OPENAI" delay={24} />
            <StrikeWord text="NOT ANTHROPIC" delay={44} />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — April 2026 / 6 of 6 stat slam */}
        <Sequence from={195} durationInFrames={195}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 30,
            }}
          >
            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: 8,
                color: colors.skyLight,
                textTransform: "uppercase",
                opacity: interpolate(frame - 195, [0, 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              April 2026
            </div>
            <StatCounter
              to={6}
              suffix=" / 6"
              startDelay={20}
              countDuration={34}
              fontSize={260}
              label="top models were Chinese"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — the six model chips */}
        <Sequence from={390} durationInFrames={180}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 50,
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 70,
                color: "#FFFFFF",
                letterSpacing: 3,
                opacity: interpolate(frame - 390, [0, 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              ALL SIX. ALL CHINA.
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 26,
                maxWidth: 1300,
              }}
            >
              {MODELS.map((m, i) => (
                <ModelChip key={m} text={m} delay={20 + i * 12} />
              ))}
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — HOW? WHAT? WHY? stinger */}
        <Sequence from={570} durationInFrames={180}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 80,
            }}
          >
            <QWord text="HOW?" delay={6} />
            <QWord text="WHAT?" delay={28} />
            <QWord text="WHY?" delay={50} />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 6 — let's find out */}
        <Sequence from={750} durationInFrames={180}>
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <KineticTitle
              lines={["LET'S FIND OUT"]}
              fontSize={140}
              stagger={7}
              accent={sides.china}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
