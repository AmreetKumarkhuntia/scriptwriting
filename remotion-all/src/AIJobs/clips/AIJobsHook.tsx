import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { DigitalGlitchRGB } from "@storybynumbers_/remotion-glitch-effect";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { StrikeWord } from "../components/StrikeWord";

// SECTION 0 — HOOK · cues 1–13 · 0:00–0:37 · 1110 frames @ 30fps
// Beats (relative frames):
//   0–175    glitch slam "AI IS TAKING YOUR JOBS"        (cues 1–2)
//   175–310  the popular case → strike "AI TAKES JOBS"   (cues 3–4)
//   310–540  re-hook "BUT IS IT TRUE?" / "3 YEARS"       (cues 5–7)
//   540–710  payoff "THE DATA SAYS… NOTHING"             (cues 8–9)
//   710–880  tease "THE PEOPLE AT RISK AREN'T WHO YOU THINK" (cues 10–11)
//   880–1110 re-hook "A MISTAKE… AND IT HAS A NAME"      (cues 12–13)

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// The big Anton "impact" slam used in beat 1.
const ImpactLine: React.FC<{
  lines: string[];
  fontSize?: number;
  color?: string;
  startDelay?: number;
}> = ({ lines, fontSize = 200, color = "#FFFFFF", startDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 14, stiffness: 110 },
    durationInFrames: 18,
  });
  return (
    <div style={{ textAlign: "center" }}>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: fonts.impact,
            fontSize,
            lineHeight: 0.96,
            letterSpacing: 1,
            color,
            opacity: interpolate(p, [0, 1], [0, 1]),
            transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
            textShadow: `0 0 50px ${color}44`,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

// A small uppercase caption line that fades + rises.
const SubLine: React.FC<{
  text: string;
  delay: number;
  color?: string;
  fontSize?: number;
}> = ({ text, delay, color = "#C7D3E6", fontSize = 46 }) => {
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
        fontWeight: 500,
        fontSize,
        letterSpacing: 2,
        color,
        textTransform: "uppercase",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const AIJobsHook: React.FC = () => {
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
      <SceneBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — glitch slam */}
        <Sequence durationInFrames={175}>
          <AbsoluteFill style={CENTER}>
            <DigitalGlitchRGB
              splitAmount={5}
              blurAmount={0.7}
              jitterAmount={1.6}
              burstSpacing={26}
              seed={7}
            >
              <AbsoluteFill style={CENTER}>
                <ImpactLine
                  lines={["AI IS TAKING", "YOUR JOBS"]}
                  fontSize={185}
                  startDelay={4}
                />
              </AbsoluteFill>
            </DigitalGlitchRGB>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the popular case, ending on the (wrong) verdict */}
        <Sequence from={175} durationInFrames={135}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 26 }}>
            <SubLine text="Layoffs everywhere." delay={6} />
            <SubLine text="Companies adopting weekly." delay={26} />
            <SubLine
              text="The internet's verdict:"
              delay={46}
              color="#8FA3C4"
              fontSize={40}
            />
            <div style={{ marginTop: 14 }}>
              <StrikeWord text="AI TAKES JOBS" delay={66} fontSize={120} />
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — re-hook: but is it true? 3 years of data */}
        <Sequence from={310} durationInFrames={230}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 36 }}>
            <KineticTitle
              lines={["BUT IS IT TRUE?"]}
              fontSize={150}
              stagger={6}
              accent={colors.skyLight}
            />
            <SubLine
              text="ChatGPT launched 3 years ago — so check the data"
              delay={70}
              fontSize={42}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — payoff: the data says nothing */}
        <Sequence from={540} durationInFrames={170}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 20 }}>
            <SubLine text="The data says…" delay={6} color="#8FA3C4" />
            <ImpactLine
              lines={["NOTHING"]}
              fontSize={260}
              color={colors.skyLight}
              startDelay={28}
            />
            <SubLine
              text="zero discernible disruption to employment"
              delay={70}
              fontSize={40}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — tease: the people at risk aren't who you think */}
        <Sequence from={710} durationInFrames={170}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["THE PEOPLE AT RISK", "AREN'T WHO YOU THINK"]}
              fontSize={120}
              stagger={5}
              accent={signal.bad}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 6 — re-hook into Section 1: a mistake with a name */}
        <Sequence from={880} durationInFrames={230}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 30 }}>
            <SubLine
              text="It's a mistake people keep repeating…"
              delay={8}
              fontSize={48}
            />
            <KineticTitle
              lines={["AND IT HAS A NAME"]}
              fontSize={140}
              startDelay={40}
              stagger={6}
              accent={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
