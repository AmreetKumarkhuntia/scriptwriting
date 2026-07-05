import React from "react";
import { AbsoluteFill } from "remotion";
import {
  CaseFrame,
  KeyChip,
  MotifStrip,
  R,
  SectionTag,
  StrikeLine,
  StripLine,
} from "./Kit";

// KSO-9 — 1035f (34.5s) @ 5:18. Open source wins the argument; the answer
// lands: GOVERNMENT. Local f = (t − 318.0s) × 30.
export const O9: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={1020} />
    <SectionTag at={12} out={1016} kicker="CASE 06" label="OPEN SOURCE" />
    {/* 5:20.5 — China already open */}
    <KeyChip at={75} out={215} x={1416} y={120} title="CHINA" sub="PEHLE SE OPEN" />
    {/* 5:25.5 — the two-cell verdict */}
    <KeyChip
      at={225}
      out={422}
      x={330}
      y={916}
      title="US AI"
      sub="WASHINGTON OFF KAR SAKTA"
      accent
      w={480}
    />
    <KeyChip
      at={252}
      out={422}
      x={1110}
      y={916}
      title="OPEN CHINESE AI"
      sub="KOI SWITCH NAHI"
      w={480}
    />
    {/* 5:32.4 — best ad open source ever got */}
    <StripLine at={432} out={622} size={42}>
      YE BAN = OPEN-SOURCE KA <R>SABSE BADA AD</R>
    </StripLine>
    {/* 5:39.7 — the reframe */}
    <StripLine at={651} out={762}>
      COMPANY VS COMPANY? <R>AB NAHI</R>
    </StripLine>
    {/* 5:44.1 — the spine, final strike */}
    <MotifStrip at={783} out={920} />
    {/* 5:49.2 — THE ANSWER */}
    <StrikeLine
      at={936}
      strikeAt={952}
      replaceAt={960}
      out={1016}
      from="LABS"
      to="GOVERNMENT"
      cx={1520}
      y={200}
      size={52}
    />
  </AbsoluteFill>
);
