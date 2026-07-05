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
// AIJobs-Reel1-Talk · TALKING-HEAD SHORT · 1080×1920 @ 30fps · 585f ≈ 19.5s
// The creator's OWN recording is the spine (his voice + face carry it). A short
// 4.5s graphics hook opens, then cuts to his recording; graphics/searches only
// SUPPORT what he's saying (receipts + stat), captions in English, CTA to close.
// One narrative — his — with graphics in a supporting role.
//
// Recording window used: raw mkv 16.25–29.6s (a clean self-contained arc):
//   "If AI were really taking your jobs, look at 3 years of data. The data says
//    nothing. And the people actually at risk aren't who you think."
// His clip (recording-vert.mp4) starts at comp frame 135. Captions are timed to
// his delivery inside that clip.
// ─────────────────────────────────────────────────────────────────────────

// ── shared helpers (mirrors AIJobsReel1) ──────────────────────────────────
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

// centered graphics line that fades in/out within its own Sequence
const FadeCenter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const op = Math.min(
    interpolate(frame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: 90, opacity: op }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ── lower-third caption (English), keyword can pop cyan ───────────────────
const Caption: React.FC<{
  pre?: string;
  keyword?: string;
  post?: string;
  keyColor?: string;
  big?: boolean;
}> = ({ pre = "", keyword, post = "", keyColor = colors.skyLight, big = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outP = interpolate(
    frame,
    [durationInFrames - 7, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const op = Math.min(inP, outP);
  const rise = interpolate(inP, [0, 1], [16, 0]);
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}
    >
      <div
        style={{
          maxWidth: 900,
          textAlign: "center",
          padding: "20px 34px",
          borderRadius: 22,
          background: "rgba(4,6,14,0.66)",
          border: "1px solid rgba(120,150,190,0.22)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          opacity: op,
          transform: `translateY(${rise}px)`,
          fontFamily: fonts.body,
          fontWeight: big ? 800 : 700,
          fontSize: big ? 62 : 52,
          lineHeight: 1.16,
          letterSpacing: 0.5,
          color: "#F2F6FC",
        }}
      >
        {pre}
        {keyword ? (
          <span style={{ color: keyColor, textShadow: `0 0 26px ${keyColor}66` }}>
            {keyword}
          </span>
        ) : null}
        {post}
      </div>
    </AbsoluteFill>
  );
};

// ── news-headline receipt chip (slides in) ────────────────────────────────
const HeadlineChip: React.FC<{
  source: string;
  headline: string;
  fromX?: number;
  accent?: string;
}> = ({ source, headline, fromX = 120, accent = signal.bad }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [fromX, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "18px 26px",
        borderRadius: 16,
        background: "rgba(10,14,24,0.9)",
        borderLeft: `6px solid ${accent}`,
        boxShadow: "0 12px 34px rgba(0,0,0,0.5)",
        maxWidth: 760,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {source}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.15,
          color: "#EAF0F8",
        }}
      >
        {headline}
      </div>
    </div>
  );
};

// ── search-bar receipt card (types-in query + result snippet) ─────────────
const SearchCard: React.FC<{
  query: string;
  result: string;
  source: string;
}> = ({ query, result, source }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });
  const resultP = interpolate(frame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)`,
        width: 860,
        borderRadius: 22,
        background: "rgba(10,14,24,0.94)",
        border: "1px solid rgba(120,150,190,0.25)",
        boxShadow: "0 18px 46px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      {/* search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "22px 28px",
          borderBottom: "1px solid rgba(120,150,190,0.18)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: `4px solid ${colors.skyLight}`,
            boxShadow: `inset 0 0 0 6px transparent`,
            position: "relative",
          }}
        />
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 34,
            color: "#DCE6F2",
          }}
        >
          {query}
        </div>
      </div>
      {/* result snippet */}
      <div style={{ padding: "20px 28px", opacity: resultP }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 30,
            lineHeight: 1.25,
            color: "#EAF0F8",
          }}
        >
          {result}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: colors.skyLight,
          }}
        >
          {source}
        </div>
      </div>
    </div>
  );
};

// ── the recording (spine) with a settle-in + dissolve ─────────────────────
const Recording: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(frame, [0, 26], [1.06, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: inP }}>
      <AbsoluteFill style={{ transform: `scale(${settle})` }}>
        <OffthreadVideo
          src={staticFile("aitalks-shorts/01-aijobs-person/src/recording-vert.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {/* light top+bottom scrim for caption/overlay legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,6,14,0.5) 0%, rgba(4,6,14,0) 26%, rgba(4,6,14,0) 52%, rgba(4,6,14,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── CTA end card (shared look with the other reels) ───────────────────────
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const arrow = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
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
    </AbsoluteFill>
  );
};

// upper-area holder so supports sit above his face (which is centered/lower)
const UpperSlot: React.FC<{ children: React.ReactNode; pad?: number }> = ({
  children,
  pad = 150,
}) => (
  <AbsoluteFill
    style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: pad }}
  >
    {children}
  </AbsoluteFill>
);

export const AIJobsReel1Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const globalFade = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill>
      <SceneBackground />

      {/* hook VO (trimmed Liam, ~3s) — gives the opening a voice */}
      <Sequence from={0}>
        <Audio src={staticFile("aitalks-shorts/01-aijobs-person/vo/r1-hook-liam.mp3")} />
      </Sequence>
      {/* whoosh into his clip */}
      <Sequence from={97}>
        <Audio src={staticFile("sfx/hook-whoosh.wav")} volume={0.7} />
      </Sequence>

      <AbsoluteFill style={{ opacity: globalFade }}>
        {/* ── HOOK (graphics + VO, 0–105) ── */}
        <Sequence durationInFrames={105}>
          {/* line 1 (0–56) — exits before line 2 */}
          <Sequence durationInFrames={56}>
            <FadeCenter>
              <ImpactLine
                lines={["AI ISN'T COMING", "FOR YOUR JOB"]}
                fontSize={124}
                startDelay={2}
              />
            </FadeCenter>
          </Sequence>
          {/* line 2 (48–105) */}
          <Sequence from={48} durationInFrames={57}>
            <FadeCenter>
              <ImpactLine
                lines={["BUT THIS IS"]}
                fontSize={188}
                color={colors.skyLight}
                startDelay={2}
              />
            </FadeCenter>
          </Sequence>
        </Sequence>

        {/* ── HIS CLIP (spine) — turn+cliffhanger, his voice · 105–506 ── */}
        <Sequence from={105} durationInFrames={401}>
          <Recording />
        </Sequence>

        {/* captions (English) — timed to his delivery (clip starts frame 105) */}
        <Sequence from={111} durationInFrames={72}>
          <Caption pre="If AI were really taking your jobs…" />
        </Sequence>
        <Sequence from={186} durationInFrames={66}>
          <Caption pre="look at " keyword="3 YEARS of data" post="." />
        </Sequence>
        <Sequence from={256} durationInFrames={68}>
          <Caption pre="the data says… " keyword="NOTHING" />
        </Sequence>
        <Sequence from={328} durationInFrames={86}>
          <Caption pre="and the people actually at risk…" />
        </Sequence>
        <Sequence from={416} durationInFrames={84}>
          <Caption pre="aren't " keyword="who you think" post="." />
        </Sequence>

        {/* supporting overlays (upper area — keep his face visible) */}
        {/* on "3 years of data": a search receipt */}
        <Sequence from={184} durationInFrames={74}>
          <UpperSlot pad={140}>
            <SearchCard
              query="did AI actually cause the layoffs?"
              result="No measurable employment impact found across 2022–2025 data."
              source="Yale Budget Lab · Brookings, 2025"
            />
          </UpperSlot>
        </Sequence>
        {/* on "NOTHING": the 300M-predicted stat, struck by reality */}
        <Sequence from={256} durationInFrames={90}>
          <UpperSlot pad={150}>
            <StatCounter
              to={300}
              suffix="M"
              lead="Predicted · Goldman 2023"
              label="actual disruption in 3 years: basically none"
              color={signal.bad}
              accent={signal.bad}
              entrance="pop"
              startDelay={4}
              countDuration={22}
              fontSize={180}
              labelColor="#C7D3E6"
            />
          </UpperSlot>
        </Sequence>
        {/* cliffhanger tease */}
        <Sequence from={420} durationInFrames={86}>
          <UpperSlot pad={150}>
            <HeadlineChip
              source="The real risk"
              headline="It's not low-skill workers →"
              fromX={140}
              accent={colors.skyLight}
            />
          </UpperSlot>
        </Sequence>

        {/* ── CTA (500–555) ── */}
        <Sequence from={500} durationInFrames={55}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
