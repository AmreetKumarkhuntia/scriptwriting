import { Composition } from "remotion";
import { ChinaHook } from "./clips/ChinaHook";
import { ChinaSection1 } from "./clips/ChinaSection1";
import { ChinaSection2 } from "./clips/ChinaSection2";
import { ChinaSection3 } from "./clips/ChinaSection3";
import { ChinaSection4 } from "./clips/ChinaSection4";
import { ChinaSection5 } from "./clips/ChinaSection5";

// Standalone motion-graphics clips for "China Takes Over AI".
// Each clip is a full-screen replacement segment to drop onto the NLE timeline
// over the recorded footage. 1920x1080 @ 30fps. Durations match captions.md ranges.
export const ChinaCompositions: React.FC = () => {
  return (
    <>
      {/* SECTION 0 — HOOK · cues 1–10 · 0:00–0:31 */}
      <Composition
        id="China-Hook"
        component={ChinaHook}
        durationInFrames={930}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 1 — THE NUMBERS · cues 11–54 · 0:28–2:25 */}
      <Composition
        id="China-Section1"
        component={ChinaSection1}
        durationInFrames={3580}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 2 — THE PLAYERS · cues 55–102 · 2:25–4:32 */}
      <Composition
        id="China-Section2"
        component={ChinaSection2}
        durationInFrames={3795}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 3 — WHY OPEN SOURCE / PLATFORM PLAY · cues 103–132 · 4:32–5:43 */}
      <Composition
        id="China-Section3"
        component={ChinaSection3}
        durationInFrames={2116}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 4 — THE PROOF · cues 133–175 · 5:43–7:34 */}
      <Composition
        id="China-Section4"
        component={ChinaSection4}
        durationInFrames={3351}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 5 — CONCENTRATION RISK + ENDING · cues 176–239 · 7:34–10:13 */}
      <Composition
        id="China-Section5"
        component={ChinaSection5}
        durationInFrames={4784}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
