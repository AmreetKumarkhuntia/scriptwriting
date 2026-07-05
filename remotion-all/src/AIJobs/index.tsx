import { Composition } from "remotion";
import { AIJobsHook } from "./clips/AIJobsHook";
import { AIJobsSection1 } from "./clips/AIJobsSection1";
import { AIJobsSection2 } from "./clips/AIJobsSection2";
import { AIJobsSection3 } from "./clips/AIJobsSection3";
import { AIJobsSection4 } from "./clips/AIJobsSection4";
import { AIJobsSection5 } from "./clips/AIJobsSection5";
import { AIJobsReel1 } from "./clips/AIJobsReel1";
import { AIJobsReel1Hybrid } from "./clips/AIJobsReel1Hybrid";
import { AIJobsReel1Talk } from "./clips/AIJobsReel1Talk";

// Standalone motion-graphics clips for "AI Jobs Fear" (Hindi 5-min cut).
// Each clip is a full-screen segment to drop onto the NLE timeline over the
// recorded audio. 1920x1080 @ 30fps. Durations match captions.md cue ranges.
export const AIJobsCompositions: React.FC = () => {
  return (
    <>
      {/* SHORT — HERO REEL · re-voiced English · self-contained (baked VO) ·
          1080×1920 @ 30fps · funnels back to the parent long-form. */}
      <Composition
        id="AIJobs-Reel1"
        component={AIJobsReel1}
        durationInFrames={570}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* SHORT — HERO REEL · HYBRID (face test) · graphics hook hands off to a
          real facecam clip · 1080×1920 @ 30fps */}
      <Composition
        id="AIJobs-Reel1-Hybrid"
        component={AIJobsReel1Hybrid}
        durationInFrames={495}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* SHORT — HERO REEL · TALKING-HEAD (his recording is the spine, graphics
          only support) · 1080×1920 @ 30fps */}
      <Composition
        id="AIJobs-Reel1-Talk"
        component={AIJobsReel1Talk}
        durationInFrames={555}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* SECTION 0 — HOOK · cues 1–13 · 0:00–0:37 */}
      <Composition
        id="AIJobs-Hook"
        component={AIJobsHook}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 1 — THE FALLACY · cues 14–37 · 0:37–1:35 */}
      <Composition
        id="AIJobs-Section1"
        component={AIJobsSection1}
        durationInFrames={1730}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 2 — THE DATA · cues 38–58 · 1:35–2:31 */}
      <Composition
        id="AIJobs-Section2"
        component={AIJobsSection2}
        durationInFrames={1680}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 3 — THE FLIP · cues 59–69 · 2:31–2:58 */}
      <Composition
        id="AIJobs-Section3"
        component={AIJobsSection3}
        durationInFrames={810}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 4 — SAFE JOBS · cues 70–80 · 2:58–3:25 */}
      <Composition
        id="AIJobs-Section4"
        component={AIJobsSection4}
        durationInFrames={810}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 5 — OUTRO / CTA · cues 81–91 · 3:25–3:51 */}
      <Composition
        id="AIJobs-Section5"
        component={AIJobsSection5}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
