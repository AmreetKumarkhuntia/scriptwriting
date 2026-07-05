import React from "react";
import { Composition } from "remotion";
import { Spike } from "./clips/Spike";
import { ColdOpen } from "./clips/ColdOpen";
import { SealDrop } from "./clips/SealDrop";
import { Timeline } from "./clips/Timeline";
import { Network } from "./clips/Network";
import { Vault } from "./clips/Vault";
import { StampGate } from "./clips/StampGate";
import { SwitchBack } from "./clips/SwitchBack";
import { OrderVsRequest } from "./clips/OrderVsRequest";
import { Swarm } from "./clips/Swarm";
import { Outro } from "./clips/Outro";
import { Gap1 } from "./clips/Gap1";
import { Gap2 } from "./clips/Gap2";
import { Gap3 } from "./clips/Gap3";
import { Gap4 } from "./clips/Gap4";
import { Gap5 } from "./clips/Gap5";
import { Gap6 } from "./clips/Gap6";
import { Gap7 } from "./clips/Gap7";
import { Gap8 } from "./clips/Gap8";
import { Gap9 } from "./clips/Gap9";
import { O1 } from "./overlays/O1";
import { O2 } from "./overlays/O2";
import { O3 } from "./overlays/O3";
import { O4 } from "./overlays/O4";
import { O5 } from "./overlays/O5";
import { O6 } from "./overlays/O6";
import { O7 } from "./overlays/O7";
import { O8 } from "./overlays/O8";
import { O9 } from "./overlays/O9";

// AI Kill Switch — GOV-NOIR RED motion-graphics clips (1920×1080 @ 30fps).
// The video is FULLY FACELESS: the 10 KS-* takeovers + the 9 KS-Gap* clips
// cover the whole 0:00–6:08 timeline as 19 straight V2 drops (cut-sheet.md).
// KS-Gap durations = gap lengths exactly; beat frames mirror overlays/O1–O9.
//
// KSO-1…KSO-9 (transparent ProRes overlays around the talking head) are
// ARCHIVED ALTERNATES for a face-visible edit — kept registered, not used.

const FPS = 30;
const W = 1920;
const H = 1080;

const defaults = { fps: FPS, width: W, height: H } as const;

export const AIKillSwitchCompositions: React.FC = () => {
  return (
    <>
      <Composition id="KS-Spike" component={Spike} durationInFrames={90} {...defaults} />
      <Composition id="KS-ColdOpen" component={ColdOpen} durationInFrames={420} {...defaults} />
      <Composition id="KS-SealDrop" component={SealDrop} durationInFrames={300} {...defaults} />
      <Composition id="KS-Timeline" component={Timeline} durationInFrames={360} {...defaults} />
      <Composition id="KS-Network" component={Network} durationInFrames={240} {...defaults} />
      <Composition id="KS-Vault" component={Vault} durationInFrames={360} {...defaults} />
      <Composition id="KS-StampGate" component={StampGate} durationInFrames={240} {...defaults} />
      <Composition id="KS-SwitchBack" component={SwitchBack} durationInFrames={360} {...defaults} />
      <Composition id="KS-OrderVsRequest" component={OrderVsRequest} durationInFrames={270} {...defaults} />
      <Composition id="KS-Swarm" component={Swarm} durationInFrames={360} {...defaults} />
      <Composition id="KS-Outro" component={Outro} durationInFrames={465} {...defaults} />
      <Composition id="KS-Gap1" component={Gap1} durationInFrames={810} {...defaults} />
      <Composition id="KS-Gap2" component={Gap2} durationInFrames={375} {...defaults} />
      <Composition id="KS-Gap3" component={Gap3} durationInFrames={1350} {...defaults} />
      <Composition id="KS-Gap4" component={Gap4} durationInFrames={570} {...defaults} />
      <Composition id="KS-Gap5" component={Gap5} durationInFrames={1164} {...defaults} />
      <Composition id="KS-Gap6" component={Gap6} durationInFrames={771} {...defaults} />
      <Composition id="KS-Gap7" component={Gap7} durationInFrames={1185} {...defaults} />
      <Composition id="KS-Gap8" component={Gap8} durationInFrames={405} {...defaults} />
      <Composition id="KS-Gap9" component={Gap9} durationInFrames={1035} {...defaults} />
      <Composition id="KSO-1" component={O1} durationInFrames={810} {...defaults} />
      <Composition id="KSO-2" component={O2} durationInFrames={375} {...defaults} />
      <Composition id="KSO-3" component={O3} durationInFrames={1350} {...defaults} />
      <Composition id="KSO-4" component={O4} durationInFrames={570} {...defaults} />
      <Composition id="KSO-5" component={O5} durationInFrames={1164} {...defaults} />
      <Composition id="KSO-6" component={O6} durationInFrames={771} {...defaults} />
      <Composition id="KSO-7" component={O7} durationInFrames={1185} {...defaults} />
      <Composition id="KSO-8" component={O8} durationInFrames={405} {...defaults} />
      <Composition id="KSO-9" component={O9} durationInFrames={1035} {...defaults} />
    </>
  );
};
