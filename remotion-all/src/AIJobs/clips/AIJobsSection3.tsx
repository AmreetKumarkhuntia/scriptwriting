import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { StrikeWord } from "../components/StrikeWord";
import { VersusSplit } from "../components/VersusSplit";

// SECTION 3 — THE FLIP · cues 59–69 · 2:31–2:58 · 810 frames @ 30fps
//   0–150    "AI ISN'T REPLACING YOU" → strike "EVERYONE"          (cues 59–61)
//   150–400  VersusSplit: WITHOUT AI vs WITH AI                    (cues 62–65)
//   400–580  the question "WHO DOES THE COMPANY KEEP?"             (cue 66)
//   580–810  payoff "HUMANS WITH AI vs HUMANS WITHOUT"             (cues 67–69)

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// A "camera punch-in": content starts slightly enlarged and settles to 1.
const PunchIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
}> = ({ children, delay = 0, from = 1.14 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 16], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ transform: `scale(${interpolate(p, [0, 1], [from, 1])})` }}>
      {children}
    </div>
  );
};

const SubLine: React.FC<{ text: string; delay: number; fontSize?: number }> = ({
  text,
  delay,
  fontSize = 44,
}) => {
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
        fontWeight: 400,
        fontSize,
        letterSpacing: 1,
        color: "#C7D3E6",
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const AIJobsSection3: React.FC = () => {
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
        {/* Beat 1 — AI isn't replacing you */}
        <Sequence durationInFrames={150}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 28 }}>
            <PunchIn>
              <KineticTitle
                lines={["AI ISN'T", "REPLACING YOU"]}
                fontSize={150}
                stagger={5}
              />
            </PunchIn>
            <SubLine
              text="it's replacing the people who don't use it"
              delay={60}
              fontSize={50}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the two-worker split */}
        <Sequence from={150} durationInFrames={250}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 50 }}>
            <VersusSplit
              left={{ title: "WITHOUT AI", sub: "falling behind" }}
              right={{ title: "WITH AI", sub: "twice as productive" }}
              startDelay={6}
            />
            <SubLine
              text="two people, same job — one uses AI, one doesn't"
              delay={70}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the question */}
        <Sequence from={400} durationInFrames={180}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["WHO DOES THE", "COMPANY KEEP?"]}
              fontSize={140}
              stagger={5}
              accent={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — the real shift / payoff */}
        <Sequence from={580} durationInFrames={230}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 18 }}>
            <SubLine
              text="This was never AI vs humans."
              delay={8}
              fontSize={48}
            />
            <PunchIn delay={36} from={1.1}>
              <KineticTitle
                lines={["HUMANS WITH AI"]}
                fontSize={130}
                startDelay={36}
                stagger={5}
                accent={signal.good}
              />
            </PunchIn>
            <div style={{ marginTop: 6 }}>
              <StrikeWord text="vs HUMANS WITHOUT" delay={90} fontSize={96} />
            </div>
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
