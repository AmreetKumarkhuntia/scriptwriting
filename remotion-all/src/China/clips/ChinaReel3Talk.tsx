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

// ─────────────────────────────────────────────────────────────────────────
// China-Reel3-Talk · TALKING-HEAD SHORT · 1080×1920 @ 30fps · 600f = 20.0s
// His own recording is the spine — real facecam + the published video's own
// bar-chart graphics (both narrated by his real voice, no synthetic TTS).
// Two source windows, joined on a whoosh:
//   Beat 1 — hook.mp4 [0.0–2.70s]: facecam, "China just took a Google [over]…"
//   Beat 2 — price.mp4 [2.70–18.60s]: facecam→bars→facecam→bars, MiniMax M2.5
//     vs GPT-5.5 (80.2% vs 88.7% SWE-Bench Verified; $0.30 vs $5.00/M tokens;
//     17x more expensive for just 8 points) — numbers verified against
//     channels/Amreet Talks/videos/China takes over AI/research.md.
// Crop scheme is asymmetric: graphics-only stretches keep the tight full-bleed
// crop (608w×1080h centered x=656 → scaled 1080×1920, verified the bar-chart
// text survives with margin); segments where his face is on camera use a
// gentler crop (900w×1080h centered x=510 → scaled 1080×1296, letterboxed
// with 312px black bars top/bottom) per the creator's feedback that facecam
// shots can zoom out with black borders. Beat 2's facecam moment (his live
// reaction to the SWE-Bench bars, ~9.4–11.87s into price.mp4) is split out
// into its own sub-clip (beat2b) so it alone gets the gentler crop while the
// bar-chart sub-clips (beat2a/beat2c) either side keep the tight crop.
// ─────────────────────────────────────────────────────────────────────────

// centered graphics line that fades in/out within its own Sequence
const FadeCenter: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
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
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 170, opacity: op }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ── lower-third caption (English), keyword can pop skyLight ───────────────
const Caption: React.FC<{
  pre?: string;
  keyword?: string;
  post?: string;
  keyColor?: string;
  durationInFrames: number;
}> = ({ pre = "", keyword, post = "", keyColor = colors.skyLight, durationInFrames }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outP = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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
          background: "rgba(1,8,45,0.7)",
          border: "1px solid rgba(173,225,251,0.22)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          opacity: op,
          transform: `translateY(${rise}px)`,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 56,
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

// ── headline receipt chip (slides in) ──────────────────────────────────────
const HeadlineChip: React.FC<{
  source: string;
  headline: string;
  fromX?: number;
  accent?: string;
}> = ({ source, headline, fromX = 120, accent = signal.good }) => {
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
        background: "rgba(1,8,45,0.92)",
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

// ── the recording (cropped-vertical facecam/graphics), settle-in zoom ─────
const Recording: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(frame, [0, 26], [1.05, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: inP }}>
      <AbsoluteFill style={{ transform: `scale(${settle})` }}>
        <OffthreadVideo
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── CTA end card ────────────────────────────────────────────────────────────
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 14 });
  const sub = interpolate(frame, [8, 18], [0, 1], {
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
          gap: 30,
          opacity: interpolate(p, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 38,
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
            fontSize: 108,
            lineHeight: 0.96,
            letterSpacing: 2,
            color: "#FFFFFF",
            textAlign: "center",
            textShadow: `0 0 55px ${colors.skyLight}33`,
          }}
        >
          CHINA'S AI IS
          <br />
          <span style={{ color: colors.skyLight }}>TAKING OVER THE WORLD</span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: 3,
            color: "#8FA3C4",
            textTransform: "uppercase",
            opacity: sub,
          }}
        >
          Link in description · Subscribe
        </div>
      </div>
    </AbsoluteFill>
  );
};

// upper-area holder so overlays sit above his face / the bar-chart headline
const UpperSlot: React.FC<{ children: React.ReactNode; pad?: number }> = ({
  children,
  pad = 130,
}) => (
  <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: pad }}>
    {children}
  </AbsoluteFill>
);

const BEAT1_FRAMES = 81; // hook.mp4 0.0–2.70s
const BEAT2_FRAMES = 477; // price.mp4 2.70–18.60s (ends on the verified silence gap)
const CTA_FRAMES = 42;

export const ChinaReel3Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const globalFade = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <SceneBackground />

      {/* whoosh into the price/score payoff */}
      <Sequence from={BEAT1_FRAMES - 5}>
        <Audio src={staticFile("sfx/hook-whoosh.wav")} volume={0.7} />
      </Sequence>

      <AbsoluteFill style={{ opacity: globalFade }}>
        {/* ── BEAT 1 — his facecam hook, real voice, real audio (0–81) ── */}
        <Sequence from={0} durationInFrames={BEAT1_FRAMES}>
          <Recording
            src={staticFile("aitalks-shorts/03-china-top6/src/beat1-vert.mp4")}
          />
        </Sequence>
        <Sequence from={6} durationInFrames={70}>
          <Caption pre="CHINA JUST " keyword="TOOK OVER" durationInFrames={70} />
        </Sequence>

        {/* ── BEAT 2a — graphics only, tight crop (81–282) ── */}
        <Sequence from={BEAT1_FRAMES} durationInFrames={201}>
          <Recording
            src={staticFile("aitalks-shorts/03-china-top6/src/beat2a-graphics-vert.mp4")}
          />
        </Sequence>

        {/* ── BEAT 2b — his facecam returns + baked dissolve, gentler letterboxed crop (282–356) ── */}
        <Sequence from={BEAT1_FRAMES + 201} durationInFrames={74}>
          <Recording
            src={staticFile("aitalks-shorts/03-china-top6/src/beat2b-facecam-vert.mp4")}
          />
        </Sequence>

        {/* ── BEAT 2c — graphics only, tight crop (356–558) ── */}
        <Sequence from={BEAT1_FRAMES + 201 + 74} durationInFrames={202}>
          <Recording
            src={staticFile("aitalks-shorts/03-china-top6/src/beat2c-graphics-vert.mp4")}
          />
        </Sequence>

        {/* bridging claim — the reel's own thesis, upper area, doesn't cover the bars */}
        <Sequence from={BEAT1_FRAMES + 6} durationInFrames={64}>
          <UpperSlot pad={120}>
            <HeadlineChip
              source="That week"
              headline="Top 6 most-used models → all Chinese"
              fromX={140}
              accent={colors.skyLight}
            />
          </UpperSlot>
        </Sequence>

        {/* his facecam returns mid-beat2 (original ~9–12s) — a quick connective caption */}
        <Sequence from={BEAT1_FRAMES + 258} durationInFrames={54}>
          <FadeCenter durationInFrames={54}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 64,
                letterSpacing: 2,
                color: colors.skyLight,
                textShadow: `0 0 30px ${colors.skyLight}55`,
              }}
            >
              HERE'S WHY ↓
            </div>
          </FadeCenter>
        </Sequence>

        {/* ── CTA (558–600) ── */}
        <Sequence from={BEAT1_FRAMES + BEAT2_FRAMES} durationInFrames={CTA_FRAMES}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
