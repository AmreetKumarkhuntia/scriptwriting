import { Composition } from "remotion";
import { WhatBoss } from "./clips/WhatBoss";
import { ClipBanner, ClipBannerProps } from "./clips/ClipBanner";

// Amreet Aint gaming shorts — Remotion overlay pass. The cut+captioned+beeped+
// end-carded clip comes from the ffmpeg pipeline; this project layers the hook
// banner on top. 1080×1920 @ 30fps. AmreetAint-Clip is parameterized: render
// each clip with --props='{"clipFile":"..","hook":"..","seamY":731,"mode":"hook"|
// "persistent","durationInFrames":N}'. durationInFrames comes from props via
// calculateMetadata (no @remotion/media-utils dependency needed).
export const AmreetAintCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="AmreetAint-Clip"
        component={ClipBanner}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          clipFile: "05_deathbird-clutch-win.mp4",
          hook: "1 HP CLUTCH WIN",
          seamY: 731,
          mode: "hook",
          durationInFrames: 840,
        } as ClipBannerProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props as ClipBannerProps).durationInFrames,
        })}
      />
      <Composition
        id="AmreetAint-WhatBoss"
        component={WhatBoss}
        durationInFrames={1740}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
