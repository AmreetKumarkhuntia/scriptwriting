import { Audio, Sequence } from "remotion";
import { SFX, SfxName } from "../sfx";

export type SfxCue = {
  cue: SfxName;
  at: number; // clip-local frame to start the sound
  volume?: number; // override the manifest default
  loop?: boolean;
  durationInFrames?: number; // required when loop
};

// Same pattern as AIBubble: Audio ignores layout/opacity, so the SFX track
// stays independent of the clip's visual enter/exit treatment.
export const Sfx: React.FC<SfxCue> = ({
  cue,
  at,
  volume,
  loop,
  durationInFrames,
}) => {
  const s = SFX[cue];
  const vol = volume ?? s.volume;
  return (
    <Sequence from={at} durationInFrames={durationInFrames} layout="none">
      <Audio src={s.src} volume={() => vol} loop={loop} />
    </Sequence>
  );
};

export const SfxTrack: React.FC<{ cues: SfxCue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sfx key={`${c.cue}-${c.at}-${i}`} {...c} />
    ))}
  </>
);
