import { Audio, Sequence } from "remotion";
import { SFX, SfxName } from "../sfx";

export type SfxCue = {
  cue: SfxName;
  at: number; // clip-local frame to start the sound
  volume?: number; // override the manifest default
  loop?: boolean; // repeat (for ambience like fire)
  durationInFrames?: number; // bound the sound (required for loop)
};

// Plays one SFX cue at a frame. Audio ignores layout/opacity, so this stays
// independent of the clip's visual fade.
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

// A whole clip's SFX track — render once near the top of each composition.
export const SfxTrack: React.FC<{ cues: SfxCue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sfx key={`${c.cue}-${c.at}-${i}`} {...c} />
    ))}
  </>
);
