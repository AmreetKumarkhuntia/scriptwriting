import { staticFile } from "remotion";

// Cue names → files in remotion-all/public/sfx/pack — hand-picked from the
// user's SFX library (D:\videos\sound\SFX Pack). Volumes tuned to sit UNDER
// the talking-head VO these clips get dropped onto in Resolve.
export const SFX = {
  boom: { src: staticFile("sfx/pack/slam-boom.mp3"), volume: 0.55 }, // big slam / blackout
  whoosh: { src: staticFile("sfx/pack/whoosh-cinematic.mp3"), volume: 0.4 }, // camera flight
  swoosh: { src: staticFile("sfx/pack/whoosh-camera.mp3"), volume: 0.35 }, // text reveal
  pop: { src: staticFile("sfx/pack/pop.mp3"), volume: 0.35 }, // chip / label lands
  rise: { src: staticFile("sfx/pack/riser-sharp.wav"), volume: 0.45 }, // short build into a hit
  flare: { src: staticFile("sfx/pack/blast-flare.mp3"), volume: 0.45 }, // ignition / lights back
  impact: { src: staticFile("sfx/pack/slam-impact.mp3"), volume: 0.5 }, // stamp slam / big reveal
  alert: { src: staticFile("sfx/pack/alert-buzz.mp3"), volume: 0.35 }, // DENIED / restriction
  riser: { src: staticFile("sfx/pack/riser-long.wav"), volume: 0.4 }, // re-hook build
  riserBig: { src: staticFile("sfx/pack/riser-big.wav"), volume: 0.5 }, // showstopper build
  switchOff: { src: staticFile("sfx/pack/breaker-off.mp3"), volume: 0.6 }, // literal breaker OFF
  switchOn: { src: staticFile("sfx/pack/breaker-on.mp3"), volume: 0.6 }, // literal breaker ON
  cable: { src: staticFile("sfx/pack/cable-whip.mp3"), volume: 0.5 }, // plug yank
  glitch: { src: staticFile("sfx/pack/glitch.mp3"), volume: 0.3 }, // windows dying
} as const;

export type SfxName = keyof typeof SFX;
