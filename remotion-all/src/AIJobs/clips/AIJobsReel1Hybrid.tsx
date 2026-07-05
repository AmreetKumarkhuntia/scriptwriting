import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { StatCounter } from "../components/StatCounter";

// ─────────────────────────────────────────────────────────────────────────
// AIJobs-Reel1-Hybrid · HERO SHORT (face test) · 1080×1920 @ 30fps · 495f ≈ 16.5s
// Same setup as AIJobs-Reel1, but after the "NOTHING" beat the graphics HAND OFF
// to a real facecam clip of the creator (pre-cropped to vertical). Liam VO is
// trimmed to the setup; the creator's own clip audio carries the handoff, and the
// English payoff rides as a lower-third caption so it lands even on mute.
// Setup graphics + trimmed Liam VO  →  whoosh  →  facecam + payoff caption  →  CTA.
// ─────────────────────────────────────────────────────────────────────────

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// Cross-dissolve beat wrapper (shared with AIJobsReel1).
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

// The facecam handoff: the pre-cropped vertical clip fills the frame with a
// gentle settle-in scale, a quick dissolve, a top+bottom scrim for legibility,
// and the English payoff revealed as a lower-third over the creator's own voice.
const FacecamBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Dissolve in (10f) / out (10f).
  const opIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Gentle settle: a hair of zoom-out on entry so the cut breathes.
  const settle = interpolate(frame, [0, 24], [1.06, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(opIn, opOut) }}>
      <AbsoluteFill style={{ transform: `scale(${settle})` }}>
        <OffthreadVideo
          src={staticFile("aitalks-shorts/01-aijobs-person/src/hook-vert.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Top + bottom scrim so captions stay readable over the footage. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,6,14,0.55) 0%, rgba(4,6,14,0) 22%, rgba(4,6,14,0) 55%, rgba(4,6,14,0.82) 100%)",
        }}
      />

      {/* Top eyebrow — frames the moment. */}
      <AbsoluteFill style={{ justifyContent: "flex-start", padding: 70 }}>
        <SubLine
          text="Here's the part nobody says out loud"
          delay={12}
          color="#9FB2D0"
          fontSize={34}
          weight={600}
        />
      </AbsoluteFill>

      {/* Lower-third payoff — carries the English argument on mute. */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 130,
          gap: 14,
        }}
      >
        <SubLine
          text="The real threat isn't AI —"
          delay={22}
          color="#DCE5F2"
          fontSize={46}
          weight={600}
        />
        <ImpactLine
          lines={["IT'S THE PERSON", "WHO USES IT"]}
          fontSize={96}
          color={colors.skyLight}
          startDelay={44}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Last-2s CTA back to the parent long-form (shared with AIJobsReel1).
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

export const AIJobsReel1Hybrid: React.FC = () => {
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
      {/* Trimmed Liam VO — setup only, through "Nothing" (fades out ~8.4s). */}
      <Audio
        src={staticFile("aitalks-shorts/01-aijobs-person/vo/r1-liam-setup.mp3")}
      />
      {/* Transition whoosh into the facecam. */}
      <Sequence from={242}>
        <Audio src={staticFile("sfx/hook-whoosh.wav")} volume={0.7} />
      </Sequence>

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

        {/* HANDOFF · real facecam clip + English payoff caption · 8.33–12.73s */}
        <Sequence from={250} durationInFrames={132}>
          <FacecamBeat />
        </Sequence>

        {/* END CARD / CTA · 12.53–16.50s */}
        <Sequence from={376} durationInFrames={119}>
          <Beat fadeOut={0}>
            <EndCard />
          </Beat>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
