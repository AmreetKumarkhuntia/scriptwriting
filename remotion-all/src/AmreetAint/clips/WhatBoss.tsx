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

// A single streamer-reaction banner over the cancer-boss clip. The clip
// (public/eldenclips/01_cancer_boss.mp4) already has word-synced captions at
// the facecam/gameplay seam + a subscribe end-card baked in — this only adds
// the "WHAT THE HELL IS THIS BOSS?" hook over the top-third of the frame,
// clear of that caption band, springing in early and fading before the
// end-card.

// ── tunables (a still-render sweet spot, easy to nudge) ───────────────────
const BANNER_IN = 12; // frame the banner springs in
const BANNER_HOLD_UNTIL = 132; // frame it starts fading
const BANNER_FADE = 18; // fade-out length in frames
const BANNER_TOP = 120; // px from top — over the wall, clear of his eyes below AND the top platform-chrome strip

const ReactionBanner: React.FC<{ line1: string; line2: string }> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const scale = interpolate(pop, [0, 1], [0.72, 1]);
  const fadeOut = interpolate(
    frame,
    [BANNER_HOLD_UNTIL - BANNER_IN, BANNER_HOLD_UNTIL - BANNER_IN + BANNER_FADE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", opacity: fadeOut }}>
      <div
        style={{
          marginTop: BANNER_TOP,
          transform: `scale(${scale}) rotate(-2deg)`,
          background: "rgba(7,7,11,0.82)",
          border: `4px solid ${colors.alert}`,
          borderRadius: 16,
          padding: "22px 40px",
          textAlign: "center",
          boxShadow: `0 0 34px ${colors.alert}66, 0 10px 30px rgba(0,0,0,0.65)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.impact,
            fontSize: 88,
            lineHeight: 0.98,
            letterSpacing: 1,
            color: colors.bone,
            textTransform: "uppercase",
            textShadow: "0 3px 10px rgba(0,0,0,0.6)",
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontFamily: fonts.impact,
            fontSize: 88,
            lineHeight: 0.98,
            letterSpacing: 1,
            color: colors.alert,
            textTransform: "uppercase",
            textShadow: "0 3px 10px rgba(0,0,0,0.6)",
          }}
        >
          {line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const WhatBoss: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("eldenclips/01_cancer_boss.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Sequence from={BANNER_IN} durationInFrames={BANNER_HOLD_UNTIL + BANNER_FADE} layout="none">
        <ReactionBanner line1="What the hell" line2="is this boss?" />
      </Sequence>
    </AbsoluteFill>
  );
};
