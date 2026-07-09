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
import { colors, fonts } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { EditorialTitle } from "../components/EditorialTitle";
import { GuardrailVault } from "../components/GuardrailVault";
import { StatBlock } from "../components/StatBlock";

// ─────────────────────────────────────────────────────────────────────────
// Fable5-Reel2-Talk · TALKING-HEAD SHORT · 1080×1920 @ 30fps · 565f ≈ 18.83s
// His own recording is the spine (his voice + face carry it). A voiced ~4s
// graphics hook opens, then cuts to his real facecam clip (Hindi/Hinglish
// audio, native, un-muted); English captions gloss what he's saying; graphics
// only SUPPORT in the upper frame so his face stays visible; CTA to close.
//
// Recording window: published video (9hNiFmOZCw0) 19.04–27.67s + 30.40–34.23s
// (jump cut removes a 2.7s breath pause), cropped to recording-vert.mp4:
//   "Fable Five is a Mythos family model. But it is for the public, and on
//    this they've put a lot of restrictions — all related to cyber security
//    and hacking stuff. [cut] The model is now out for the public."
// This diverges from the original graphics-only Fable5-Reel2 script (which
// closes on "still locked away") because his REAL words end on the model
// being released — the StatBlock below is used as a forward-teasing
// cliffhanger (same pattern as AIJobsReel1Talk's HeadlineChip), not a claim
// that he says that line in this clip.
// ─────────────────────────────────────────────────────────────────────────

const HOOK_LEN = 120; // 4.0s
const RECORDING_START = HOOK_LEN;
const RECORDING_LEN = 375; // 12.5s (clip is 12.494s)
const RECORDING_END = RECORDING_START + RECORDING_LEN; // 495
const CTA_LEN = 70;
const TOTAL_DURATION = RECORDING_END + CTA_LEN; // 565

// ── centered graphics fade wrapper — takes local duration explicitly ──────
const HookFade: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
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
      style={{ justifyContent: "center", alignItems: "center", padding: 90, opacity: op }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ── lower-third caption (English gloss), keyword pops clay ────────────────
const TalkCaption: React.FC<{
  pre?: string;
  keyword?: string;
  post?: string;
  durationInFrames: number;
}> = ({ pre = "", keyword, post = "", durationInFrames }) => {
  const frame = useCurrentFrame();
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
          background: "rgba(26,25,21,0.72)",
          border: "1px solid rgba(204,120,92,0.28)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
          opacity: op,
          transform: `translateY(${rise}px)`,
          fontFamily: fonts.label,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.18,
          letterSpacing: 0.3,
          color: colors.paper,
        }}
      >
        {pre}
        {keyword ? (
          <span style={{ color: colors.clay, textShadow: `0 0 22px ${colors.clay}55` }}>
            {keyword}
          </span>
        ) : null}
        {post}
      </div>
    </AbsoluteFill>
  );
};

// ── the recording (spine) with a settle-in + warm ink scrim ────────────────
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
          src={staticFile("aitalks-shorts/02-fable-danger/src/recording-vert.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {/* warm ink scrim (Fable5 tone, not AIJobs' cool navy) for caption/overlay legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(26,25,21,0.45) 0%, rgba(26,25,21,0) 26%, rgba(26,25,21,0) 52%, rgba(26,25,21,0.68) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// upper-area holder so supports sit above his face (which is centered/lower)
const UpperSlot: React.FC<{ children: React.ReactNode; pad?: number }> = ({
  children,
  pad = 140,
}) => (
  <AbsoluteFill
    style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: pad }}
  >
    {children}
  </AbsoluteFill>
);

// ── cream editorial CTA end card (same visual language as Fable5-Reel2) ────
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
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
          fontSize: 100,
          lineHeight: 0.96,
          letterSpacing: -1,
          color: colors.ink,
          textAlign: "center",
        }}
      >
        Claude Fable 5:{" "}
        <span style={{ color: colors.clay }}>The Most Insane AI Model</span>
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

export const Fable5Reel2Talk: React.FC = () => {
  const frame = useCurrentFrame();

  const globalFade = interpolate(
    frame,
    [TOTAL_DURATION - 14, TOTAL_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* hook VO (trimmed Liam, ~3.9s) */}
      <Sequence from={0}>
        <Audio src={staticFile("aitalks-shorts/02-fable-danger/vo/r2-hook-liam.mp3")} />
      </Sequence>
      {/* whoosh into his clip */}
      <Sequence from={112}>
        <Audio src={staticFile("sfx/hook-whoosh.wav")} volume={0.7} />
      </Sequence>

      <AbsoluteFill style={{ opacity: globalFade }}>
        {/* ── HOOK (graphics + VO, 0–120) ── */}
        <Sequence durationInFrames={HOOK_LEN}>
          <HookFade durationInFrames={HOOK_LEN}>
            <EditorialTitle
              lines={["TOO DANGEROUS", "TO RELEASE"]}
              fontSize={112}
              color={colors.clay}
              weight={900}
              startDelay={3}
              stagger={6}
            />
          </HookFade>
        </Sequence>

        {/* ── HIS CLIP (spine) — his own Hindi/Hinglish audio · 120–495 ── */}
        <Sequence from={RECORDING_START} durationInFrames={RECORDING_LEN}>
          <Recording />
        </Sequence>

        {/* captions (English gloss) — timed to his delivery */}
        <Sequence from={128} durationInFrames={80}>
          <TalkCaption pre="Fable Five is " keyword="the same Mythos model" post="." durationInFrames={80} />
        </Sequence>
        <Sequence from={214} durationInFrames={80}>
          <TalkCaption pre="But it comes with " keyword="a lot of restrictions" post="." durationInFrames={80} />
        </Sequence>
        <Sequence from={300} durationInFrames={72}>
          <TalkCaption pre="All because of " keyword="security and hacking risks" post="." durationInFrames={72} />
        </Sequence>
        <Sequence from={386} durationInFrames={100}>
          <TalkCaption pre="Now it's finally " keyword="out for the public" post="." durationInFrames={100} />
        </Sequence>

        {/* supporting overlays (upper area — keep his face visible) */}
        {/* on "security and hacking risks": the literal MYTHOS 5 vault card */}
        <Sequence from={280} durationInFrames={110}>
          <UpperSlot pad={140}>
            <GuardrailVault title="MYTHOS 5" sub="TOO GOOD AT HACKING" startDelay={4} width={560} />
          </UpperSlot>
        </Sequence>
        {/* cliffhanger tease into the CTA (not a claim he says this here) */}
        <Sequence from={400} durationInFrames={90}>
          <UpperSlot pad={150}>
            <StatBlock
              to={5}
              suffix="×"
              lead="Coming up"
              label="vs GPT-5.5 →"
              fontSize={140}
              color={colors.clay}
              entrance="pop"
              startDelay={4}
              countDuration={18}
            />
          </UpperSlot>
        </Sequence>

        {/* ── CTA (495–565) ── */}
        <Sequence from={RECORDING_END} durationInFrames={CTA_LEN}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
            <EndCard />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
