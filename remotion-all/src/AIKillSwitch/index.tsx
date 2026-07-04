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

// AI Kill Switch — GOV-NOIR RED 3D takeover clips (1920×1080 @ 30fps).
// Scenes are dropped onto the DaVinci timeline over the talking-head cut
// at the timecodes in the video's cut-sheet.md.

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
      <Composition id="KS-Outro" component={Outro} durationInFrames={300} {...defaults} />
    </>
  );
};
