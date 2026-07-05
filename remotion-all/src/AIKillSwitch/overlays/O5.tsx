import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, CornerStamp, KeyChip, MotifStrip, R, SectionTag, StripLine } from "./Kit";

// KSO-5 — 1164f (38.8s) @ 2:39.5. The export law's blast radius + the real
// bomb: the license. Local f = (t − 159.5s) × 30.
export const O5: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={1150} />
    <SectionTag at={12} out={1146} kicker="CASE 03" label="EXPORT LAW" />
    {/* 2:40.4–2:45 — nobody, nowhere: cascade */}
    <KeyChip at={27} out={380} x={1416} y={120} title="NO PUBLIC ACCESS" w={420} />
    <KeyChip at={100} out={380} x={1416} y={240} title="NO NATIONS" w={420} />
    <KeyChip at={170} out={380} x={1416} y={360} title="NO ONE" accent w={420} />
    {/* 2:48.1 — the compliance trap */}
    <StripLine at={258} out={452} size={42}>
      PASSPORT SE SORT? <R>NAHI HO SAKTA</R>
    </StripLine>
    {/* 2:52.9 — so: everyone */}
    <CornerStamp at={402} out={560} text="SAB KE LIYE OFF" x={1330} y={170} size={54} />
    {/* 2:55.8 — the thesis line */}
    <StripLine at={489} out={710} size={40}>
      EK EXPORT RULE → <R>PURI DUNIYA KA SOFTWARE OFF</R>
    </StripLine>
    {/* 3:06 — the spine, second strike */}
    <MotifStrip at={795} out={940} />
    {/* 3:08.8 — asli bomb */}
    <CornerStamp at={879} out={1020} text="ASLI BOMB" x={1490} y={180} rot={-6} />
    {/* 3:14.3 — it came back only with a license */}
    <KeyChip
      at={1044}
      out={1146}
      x={1416}
      y={380}
      title="WAPSI = LICENSE"
      sub="GOVERNMENT KI MARZI"
      w={440}
    />
  </AbsoluteFill>
);
