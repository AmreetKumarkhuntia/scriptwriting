import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ColdOpenTitle } from "./ColdOpenTitle";
import { LowerThird } from "./LowerThird";
import { ReactionCallout } from "./ReactionCallout";
import { colors, fonts } from "./theme";
import { CLIPS, TEASER_FILE, TEASER_FRAMES, TITLE_FRAMES, OUTRO_FRAMES } from "./clips";

// Cinematic teaser: the dramatic clip plus a subtle vignette/grade so it reads
// as a "cold open," with the game audio (the betrayal line) carrying the hook.
const Teaser: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.ink }}>
    <OffthreadVideo
      src={staticFile(`007clips/${TEASER_FILE}`)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 92,
          letterSpacing: 8,
          color: colors.gold,
          textShadow: "0 0 24px rgba(212,175,55,0.35)",
        }}
      >
        DAY 4 TOMORROW
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 6,
          color: colors.bone,
          textTransform: "uppercase",
        }}
      >
        Amreet Aint · 007 First Light
      </div>
    </AbsoluteFill>
  );
};

// The reel: cold-open teaser → title slam → 8 continuous story beats → outro.
// Everything is a HARD CUT (no transitions) — fades/transitions are added in
// DaVinci. <OffthreadVideo> carries each clip's audio on render (no preview
// audio in Studio).
export const Bond007Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Series>
        <Series.Sequence durationInFrames={TEASER_FRAMES}>
          <Teaser />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TITLE_FRAMES}>
          <ColdOpenTitle />
        </Series.Sequence>
        {CLIPS.map((clip) => (
          <Series.Sequence key={clip.file} durationInFrames={clip.frames}>
            <AbsoluteFill style={{ backgroundColor: colors.ink }}>
              <OffthreadVideo
                src={staticFile(`007clips/${clip.file}`)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {clip.lowerThird ? (
                <Sequence durationInFrames={Math.min(110, clip.frames)} layout="none">
                  <LowerThird label={clip.lowerThird.label} sub={clip.lowerThird.sub} />
                </Sequence>
              ) : null}
              {clip.callout ? (
                <Sequence from={clip.callout.at} durationInFrames={80} layout="none">
                  <ReactionCallout text={clip.callout.text} tone={clip.callout.tone} />
                </Sequence>
              ) : null}
            </AbsoluteFill>
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={OUTRO_FRAMES}>
          <OutroCard />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
