import React from "react";
import { AbsoluteFill } from "remotion";
import {
  CaseFrame,
  CornerStamp,
  DocChip,
  KeyChip,
  R,
  SectionTag,
  StrikeLine,
  StripLine,
} from "./Kit";

// KSO-3 — 1350f (45s) @ 1:15.5. Beat 1 body + Beat 2 open: both models go
// dark, the "safety bug" myth dies, Amazon enters. Local f = (t − 75.5s) × 30.
export const O3: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={1335} />
    <SectionTag at={12} out={1330} kicker="CASE 01" label="THE LETTER" />
    {/* 1:19.2 — both models live… then DARK at 1:22 */}
    <KeyChip at={111} out={300} x={1416} y={120} title="FABLE 5" sub="LIVE · PUBLIC" deadAt={195} />
    <KeyChip at={126} out={300} x={1416} y={262} title="MYTHOS 5" sub="LIVE · PARTNERS" deadAt={207} />
    {/* 1:25 — how it went down */}
    <StripLine at={285} out={440} size={42}>
      NO THROTTLE · NO REGION LOCK — <R>SIRF OFF</R>
    </StripLine>
    {/* 1:30.8 — the stat */}
    <CornerStamp at={459} out={525} text="72 GHANTE LIVE" x={1340} y={180} size={54} />
    {/* 1:33.3 — history line */}
    <StripLine at={534} out={710} size={42}>
      PEHLI BAAR — <R>LIVE FRONTIER AI</R> GAYAB
    </StripLine>
    {/* 1:41.2 "safety bug?" → 1:44.1 "NAHI." */}
    <StrikeLine
      at={771}
      strikeAt={840}
      replaceAt={858}
      out={975}
      from="SAFETY BUG?"
      to="NAHI."
      cx={1560}
      y={210}
      size={46}
    />
    {/* 1:48.7 / 1:50.3 — the demo that spooked them */}
    <KeyChip at={996} out={1190} x={64} y={560} title="TRUSTED PARTNER" sub="DEMO KIYA" w={380} />
    <KeyChip at={1029} out={1190} x={64} y={700} title="JAILBREAK" accent w={380} />
    {/* 1:51.6 — what it pulled */}
    <DocChip at={1083} out={1310} x={1480} y={130} title="CYBER-ATTACK INFO" tag="RESTRICTED" />
    {/* 1:53.5 — attribution */}
    <KeyChip at={1140} out={1310} x={1480} y={420} title="PER FORTUNE" w={300} />
    {/* 1:56.1 — the reveal */}
    <KeyChip
      at={1218}
      out={1330}
      x={64}
      y={560}
      title="AMAZON"
      sub="ANTHROPIC KA SABSE BADA INVESTOR"
      subAt={1287}
      w={420}
    />
  </AbsoluteFill>
);
