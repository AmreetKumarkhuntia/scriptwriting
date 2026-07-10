import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

// Parameterized banner over a finished Amreet Aint clip. The clip already has
// captions + beep + end-card baked in (ffmpeg pipeline). This only layers the
// hook banner. Two modes:
//   "hook"       — springs in top-center, holds ~4s, fades (safe on any layout).
//   "persistent" — a thin full-width bar sitting JUST ABOVE the seam (bottom
//                  edge of the upper feed), for the whole clip. Captions live
//                  just BELOW the seam, so the bar clears them; but it does sit
//                  on the upper feed's edge (facecam chest OR gameplay bottom,
//                  depending on layout) — the unavoidable tradeoff since the
//                  facecam/gameplay border is a hard line with no dead gap.
export type ClipBannerProps = {
  clipFile: string;
  hook: string;
  seamY: number;
  mode: "hook" | "persistent";
  durationInFrames: number;
};

const HOOK_IN = 12;
const HOOK_HOLD_UNTIL = 132;
const HOOK_FADE = 18;
const HOOK_TOP = 120;

const HookBanner: React.FC<{ hook: string }> = ({ hook }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const scale = interpolate(pop, [0, 1], [0.72, 1]);
  const fade = interpolate(
    frame,
    [HOOK_HOLD_UNTIL - HOOK_IN, HOOK_HOLD_UNTIL - HOOK_IN + HOOK_FADE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", opacity: fade }}>
      <div
        style={{
          marginTop: HOOK_TOP,
          transform: `scale(${scale}) rotate(-2deg)`,
          background: "rgba(7,7,11,0.82)",
          border: `4px solid ${colors.alert}`,
          borderRadius: 16,
          padding: "20px 40px",
          maxWidth: 960,
          textAlign: "center",
          boxShadow: `0 0 34px ${colors.alert}66, 0 10px 30px rgba(0,0,0,0.65)`,
          fontFamily: fonts.impact,
          fontSize: 76,
          lineHeight: 1.0,
          letterSpacing: 1,
          color: colors.bone,
          textTransform: "uppercase",
          textShadow: "0 3px 10px rgba(0,0,0,0.6)",
        }}
      >
        {hook}
      </div>
    </AbsoluteFill>
  );
};

// Persistent framed caption-badge: a centered black rounded frame with bright
// glowing yellow text, sitting ON the border (its bottom edge at the seam) for
// the whole clip. Clears the face (above) and the word-captions (below the
// seam). Springs in once at the start, then holds. Deliberately calm — a
// premium hook, not a chaotic bar.
const GOLD = "#FFD23F";
const ENDCARD_FRAMES = 90; // ~3s subscribe end-card — badge hides over it
const PersistentBadge: React.FC<{ hook: string; seamY: number }> = ({ hook, seamY }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 16 });
  const scale = interpolate(pop, [0, 1], [0.8, 1]);
  // hold, then fade out just before the end-card so it never covers the CTA
  const endFade = interpolate(
    frame,
    [durationInFrames - ENDCARD_FRAMES - 12, durationInFrames - ENDCARD_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = interpolate(pop, [0, 1], [0, 1]) * endFade;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: seamY,
          display: "flex",
          justifyContent: "center",
          opacity,
        }}
      >
        <div
          style={{
            transform: `translateY(-100%) rotate(-6deg) scale(${scale})`,
            transformOrigin: "center bottom",
            marginBottom: 8,
            background: "rgba(0,0,0,0.82)",
            borderRadius: 12,
            padding: "12px 30px",
            maxWidth: 960,
            textAlign: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.55)",
            fontFamily: fonts.impact,
            fontSize: 44,
            letterSpacing: 1.5,
            color: GOLD,
            textTransform: "uppercase",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {hook}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ClipBanner: React.FC<ClipBannerProps> = ({ clipFile, hook, seamY, mode }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("eldenclips/" + clipFile)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {mode === "persistent" ? (
        <PersistentBadge hook={hook} seamY={seamY} />
      ) : (
        <Sequence from={HOOK_IN} durationInFrames={HOOK_HOLD_UNTIL + HOOK_FADE} layout="none">
          <HookBanner hook={hook} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
