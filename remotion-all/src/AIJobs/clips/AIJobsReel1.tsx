import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { StatCounter } from "../components/StatCounter";

// ─────────────────────────────────────────────────────────────────────────
// AIJobs-Reel1 · HERO SHORT · 1080×1920 @ 30fps · 570f ≈ 19s
// Re-voiced English (Liam) short cut for the Amreet Talks Shorts funnel.
// VO drives the timeline; beat frames are snapped to the VO's own sentence
// pauses (ffmpeg silencedetect). The on-brand kinetic text IS the caption
// track — words reveal in time and the key words pop cyan (win) / rose (fear).
// Parent: "AI Jobs Apocalypse: Reality or Panic?" (youtu.be/V2-_0JBnP2w)
//
// VO sentence map (seconds → this timeline):
//   0.00–1.66  "AI isn't coming for your job."
//   2.12–2.76  "But this is."
//   3.20–5.79  "They said AI would erase three hundred million jobs."
//   6.16–6.97  "Three years later?"
//   7.31–7.68  "Nothing."
//   8.23–9.67  "The real threat isn't AI."
//  10.18–12.09 "It's the person next to you who learned to use it."
//  12.89–14.15 "Same job, two people —"
//  14.47–16.33 "the company keeps the one using AI."
// ─────────────────────────────────────────────────────────────────────────

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// Fade a beat in (first `fadeIn`f) and out (last `fadeOut`f). Sequences overlap
// by ~8f so beats cross-dissolve instead of hard-cutting → smooth throughout.
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

// Anton slam — big impact one-liner, damped-spring pop + soft glow.
const ImpactLine: React.FC<{
  lines: string[];
  fontSize?: number;
  color?: string;
  startDelay?: number;
}> = ({ lines, fontSize = 150, color = "#FFFFFF", startDelay = 0 }) => {
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
            transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`,
            textShadow: `0 0 60px ${color}44`,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

// Uppercase caption line that fades + rises (soft ease-out).
const SubLine: React.FC<{
  text: string;
  delay?: number;
  color?: string;
  fontSize?: number;
  weight?: number;
}> = ({ text, delay = 0, color = "#C7D3E6", fontSize = 40, weight = 500 }) => {
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
        fontWeight: weight,
        fontSize,
        letterSpacing: 2,
        color,
        textTransform: "uppercase",
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

// Portrait "WITHOUT AI vs WITH AI" — two stacked full-width cards (rose lose /
// green win) sliding in from opposite sides, a VS badge popping in the seam.
// Portrait-native rebuild of VersusSplit (which is hard-wired for 1920 wide).
const PortraitVersus: React.FC<{ startDelay?: number }> = ({
  startDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = (i: number) =>
    spring({
      frame: frame - (startDelay + i * 8),
      fps,
      config: { damping: 200 },
      durationInFrames: 22,
    });
  const vs = spring({
    frame: frame - (startDelay + 16),
    fps,
    config: { damping: 11, stiffness: 130 },
    durationInFrames: 20,
  });
  const sub = interpolate(frame - (startDelay + 30), [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const Card: React.FC<{
    title: string;
    sub: string;
    color: string;
    deep: string;
    fromX: number;
    p: number;
  }> = ({ title, sub, color, deep, fromX, p }) => (
    <div
      style={{
        width: 900,
        height: 440,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [fromX, 0])}px)`,
        borderRadius: 28,
        border: `2px solid ${color}66`,
        background: `linear-gradient(160deg, ${deep}55 0%, ${deep}11 100%)`,
        boxShadow: `0 0 70px ${color}22, inset 0 0 70px ${color}11`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 150,
          lineHeight: 0.92,
          letterSpacing: 2,
          color,
          textShadow: `0 0 45px ${color}55`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: 1,
          color: "#C7D3E6",
          textTransform: "uppercase",
        }}
      >
        {sub}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 52,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 46,
        }}
      >
        <Card
          title="WITHOUT AI"
          sub="falling behind"
          color={signal.bad}
          deep={signal.badDeep}
          fromX={-140}
          p={card(0)}
        />
        <Card
          title="WITH AI"
          sub="twice as productive"
          color={signal.good}
          deep={signal.goodDeep}
          fromX={140}
          p={card(1)}
        />
        {/* VS badge in the seam */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(vs, [0, 1], [0.4, 1])})`,
            opacity: interpolate(vs, [0, 1], [0, 1]),
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "#04060E",
            border: "3px solid #FFFFFF",
            boxShadow: `0 0 55px ${colors.skyLight}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.impact,
            fontSize: 72,
            color: "#FFFFFF",
            letterSpacing: 2,
          }}
        >
          VS
        </div>
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 38,
          letterSpacing: 1,
          color: "#8FA3C4",
          textAlign: "center",
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [18, 0])}px)`,
          maxWidth: 900,
        }}
      >
        two people, same job — one uses AI, one doesn't
      </div>
    </div>
  );
};

// Last-2s CTA back to the parent long-form.
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const arrow = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 6,
          color: colors.skyLight,
          textTransform: "uppercase",
        }}
      >
        ▶ Watch the full video
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 132,
          lineHeight: 0.94,
          letterSpacing: 2,
          color: "#FFFFFF",
          textAlign: "center",
          textShadow: `0 0 55px ${colors.skyLight}33`,
        }}
      >
        AI JOBS APOCALYPSE
        <br />
        <span style={{ color: colors.skyLight }}>REALITY OR PANIC?</span>
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 36,
          letterSpacing: 3,
          color: "#8FA3C4",
          textTransform: "uppercase",
          opacity: arrow,
        }}
      >
        Link in description · Subscribe
      </div>
    </div>
  );
};

export const AIJobsReel1: React.FC = () => {
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
      <SceneBackground />
      <Audio src={staticFile("aitalks-shorts/01-aijobs-person/vo/r1-liam.mp3")} />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* B1 · HOOK — "AI isn't coming for your job." · 0.00–2.20s */}
        <Sequence durationInFrames={66}>
          <Beat>
            <ImpactLine
              lines={["AI ISN'T COMING", "FOR YOUR JOB"]}
              fontSize={132}
              startDelay={3}
            />
          </Beat>
        </Sequence>

        {/* B1b · "But this is." · 1.93–3.40s */}
        <Sequence from={58} durationInFrames={44}>
          <Beat>
            <ImpactLine
              lines={["BUT THIS IS"]}
              fontSize={200}
              color={colors.skyLight}
              startDelay={2}
            />
          </Beat>
        </Sequence>

        {/* B2 · "They said AI would erase 300M jobs." · 3.13–6.20s */}
        <Sequence from={94} durationInFrames={92}>
          <Beat gap={44}>
            <StatCounter
              to={300}
              suffix="M"
              lead="They said"
              label="jobs erased — Goldman Sachs, 2023"
              color={signal.bad}
              accent={signal.bad}
              entrance="pop"
              startDelay={6}
              countDuration={26}
              fontSize={300}
              labelColor="#C7D3E6"
            />
          </Beat>
        </Sequence>

        {/* B3 · "Three years later? Nothing." · 5.93–8.40s */}
        <Sequence from={178} durationInFrames={74}>
          <Beat>
            <SubLine text="Three years later…" delay={4} fontSize={52} />
            <ImpactLine
              lines={["NOTHING"]}
              fontSize={280}
              color={colors.skyLight}
              startDelay={36}
            />
            <SubLine
              text="zero disruption to employment"
              delay={48}
              color="#8FA3C4"
              fontSize={36}
            />
          </Beat>
        </Sequence>

        {/* B4 · "The real threat isn't AI." · 8.13–10.06s */}
        <Sequence from={244} durationInFrames={58}>
          <Beat>
            <KineticTitle
              lines={["THE REAL THREAT", "ISN'T AI"]}
              fontSize={130}
              stagger={5}
              accent={signal.bad}
            />
          </Beat>
        </Sequence>

        {/* B5 · "…the person who learned to use it. Same job, two people." · 9.90–14.40s */}
        <Sequence from={297} durationInFrames={135}>
          <Beat gap={0} fadeIn={10} fadeOut={10}>
            <PortraitVersus startDelay={4} />
          </Beat>
        </Sequence>

        {/* B7 · "the company keeps the one using AI." · 14.20–16.66s */}
        <Sequence from={426} durationInFrames={74}>
          <Beat>
            <SubLine text="The company keeps" delay={4} fontSize={56} />
            <KineticTitle
              lines={["THE ONE", "USING AI"]}
              fontSize={168}
              startDelay={22}
              stagger={6}
              accent={colors.skyLight}
              color={colors.skyLight}
            />
          </Beat>
        </Sequence>

        {/* B8 · END CARD / CTA · 16.33–19.00s */}
        <Sequence from={490} durationInFrames={80}>
          <Beat fadeOut={0}>
            <EndCard />
          </Beat>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
