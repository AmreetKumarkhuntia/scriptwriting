import { Composition } from "remotion";
import { Fable5Hook } from "./clips/Fable5Hook";
import { Fable5Reel2 } from "./clips/Fable5Reel2";
import { Fable5Reel2Talk } from "./clips/Fable5Reel2Talk";
import { Fable5Section1 } from "./clips/Fable5Section1";
import { Fable5Section2 } from "./clips/Fable5Section2";
import { Fable5Section3 } from "./clips/Fable5Section3";
import { Fable5Section4 } from "./clips/Fable5Section4";

// Motion-graphics clips for "Claude Fable 5" — Anthropic warm-ivory editorial
// styling. Each clip is a full-screen segment to drop onto the NLE timeline over
// the recorded (Hindi) audio. 1920x1080 @ 30fps. Durations match captions.md
// cue ranges (total ≈ 2:42). On-screen numbers come from script.md.
export const Fable5Compositions: React.FC = () => {
  return (
    <>
      {/* SHORT — REEL #2 · "Too dangerous to release" · re-voiced English ·
          self-contained (baked VO) · 1080×1920 @ 30fps */}
      <Composition
        id="Fable5-Reel2"
        component={Fable5Reel2}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* SHORT — REEL #2 TALKING-HEAD VARIANT · his own recording is the
          spine, English captions, supporting graphics only · 1080×1920 @ 30fps */}
      <Composition
        id="Fable5-Reel2-Talk"
        component={Fable5Reel2Talk}
        durationInFrames={565}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* SECTION 0 — HOOK · cues 1–15 · 0:00–0:41 */}
      <Composition
        id="Fable5-Hook"
        component={Fable5Hook}
        durationInFrames={1230}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 1 — SWE-BENCH PRO · cues 16–23 · 0:41–1:01 */}
      <Composition
        id="Fable5-Section1"
        component={Fable5Section1}
        durationInFrames={610}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 2 — FRONTIERCODE DIAMOND · cues 24–33 · 1:01–1:30 */}
      <Composition
        id="Fable5-Section2"
        component={Fable5Section2}
        durationInFrames={865}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 3 — KNOWLEDGE · PRICE · DEMO SETUP · cues 34–46 · 1:30–2:03 */}
      <Composition
        id="Fable5-Section3"
        component={Fable5Section3}
        durationInFrames={1000}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 4 — OUTRO / CTA · cues 47–62 · 2:03–2:42.5 */}
      <Composition
        id="Fable5-Section4"
        component={Fable5Section4}
        durationInFrames={1180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
