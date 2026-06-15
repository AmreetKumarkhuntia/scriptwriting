import { Composition } from "remotion";
import { Bond007Reel } from "./Reel";
import { reelDurationInFrames } from "./clips";

// 007 First Light — Day 3 highlight reel (cold-open hook → 9 continuous story
// beats → outro). 2560×1440 @ 30fps. Clips live in public/007clips/.
// The old gun-barrel intro composition has been retired.
export const Bond007Compositions: React.FC = () => {
  return (
    <Composition
      id="Bond007-Highlights"
      component={Bond007Reel}
      durationInFrames={reelDurationInFrames()}
      fps={30}
      width={2560}
      height={1440}
    />
  );
};
