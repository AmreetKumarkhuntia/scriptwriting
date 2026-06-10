import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";

// SECTION 5 — OUTRO / CTA · cues 81–91 · 3:25–3:51 · 780 frames @ 30fps
//   0–200    Q&A: change your job? YES · take it? PROBABLY NOT     (cues 81–84)
//   200–430  "replaced by people who use AI" bridge               (cues 85–87)
//   430–590  payoff "THE REAL RISK: NOT ADOPTING AI"              (cue 88)
//   590–780  CTA end card                                         (cues 89–91)

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const QA: React.FC<{
  q: string;
  a: string;
  delay: number;
  color: string;
}> = ({ q, a, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qp = interpolate(frame - delay, [0, 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ap = spring({
    frame: frame - (delay + 24),
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 18,
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 46,
          letterSpacing: 1,
          color: "#C7D3E6",
          opacity: qp,
          transform: `translateY(${interpolate(qp, [0, 1], [16, 0])}px)`,
        }}
      >
        {q}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 130,
          lineHeight: 0.95,
          letterSpacing: 2,
          color,
          opacity: interpolate(ap, [0, 1], [0, 1]),
          transform: `scale(${interpolate(ap, [0, 1], [0.6, 1])})`,
          textShadow: `0 0 44px ${color}55`,
        }}
      >
        {a}
      </div>
    </div>
  );
};

const SubLine: React.FC<{ text: string; delay: number; fontSize?: number }> = ({
  text,
  delay,
  fontSize = 48,
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

const CtaButton: React.FC<{ text: string; delay: number; filled?: boolean }> = ({
  text,
  delay,
  filled = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness: 120 },
    durationInFrames: 18,
  });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        padding: "22px 56px",
        borderRadius: 999,
        background: filled ? signal.bad : "transparent",
        border: filled ? "none" : `3px solid ${colors.skyLight}`,
        color: filled ? "#FFFFFF" : colors.skyLight,
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 48,
        letterSpacing: 3,
        textTransform: "uppercase",
        boxShadow: filled
          ? `0 0 50px ${signal.bad}66`
          : `0 0 40px ${colors.skyLight}33`,
      }}
    >
      {text}
    </div>
  );
};

export const AIJobsSection5: React.FC = () => {
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
        {/* Beat 1 — the two answers */}
        <Sequence durationInFrames={200}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 60 }}>
            <QA
              q="Will AI change your job?"
              a="YES."
              delay={6}
              color={colors.skyLight}
            />
            <QA
              q="Will AI take your job?"
              a="PROBABLY NOT."
              delay={96}
              color={signal.good}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the bridge */}
        <Sequence from={200} durationInFrames={230}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 26 }}>
            <SubLine text="You won't be replaced by AI." delay={8} fontSize={56} />
            <KineticTitle
              lines={["BUT BY SOMEONE", "WHO USES IT BETTER"]}
              fontSize={120}
              startDelay={44}
              stagger={5}
              accent={signal.bad}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the real risk */}
        <Sequence from={430} durationInFrames={160}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["THE REAL RISK:", "NOT ADOPTING AI"]}
              fontSize={140}
              stagger={5}
              accent={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — CTA end card */}
        <Sequence from={590} durationInFrames={190}>
          <AbsoluteFill style={{ ...CENTER, flexDirection: "column", gap: 44 }}>
            <KineticTitle
              lines={["ENJOYED THIS?"]}
              fontSize={110}
              stagger={6}
            />
            <div style={{ display: "flex", gap: 40 }}>
              <CtaButton text="Like" delay={40} />
              <CtaButton text="Subscribe" delay={56} filled />
            </div>
            <SubLine
              text="see you in the next one"
              delay={90}
              fontSize={44}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
