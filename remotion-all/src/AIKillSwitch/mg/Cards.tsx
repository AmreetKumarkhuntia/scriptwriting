import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { fonts, noir } from "../theme";
import { clamp, impact, overshoot, rev } from "./motion";

// ---------------------------------------------------------------------------
// The GOV-NOIR flat design system. Craft rules: surfaces get 12px radius,
// ink (bands/bars/stamps/tape) is sharp 0px; one red accent per frame;
// every element ENTERS (rise + blur-resolve + overshoot), never appears.
// All world-positioned pieces are used inside MoStage.
// ---------------------------------------------------------------------------

// shared entrance: overshoot scale + rise + blur resolve
export const useEnter = (at: number, len = 14) => {
  const frame = useCurrentFrame();
  const p = rev(frame, at, len);
  const s = overshoot(frame, at, len, 0.05);
  return {
    opacity: clamp(p * 1.6, 0, 1),
    transform: `translateY(${(1 - p) * 26}px) scale(${0.94 + 0.06 * s})`,
    filter: p < 1 ? `blur(${5 * (1 - p)}px)` : undefined,
  } as React.CSSProperties;
};

// ---- Panel: dark data card ------------------------------------------------
export const Panel: React.FC<{
  at: number;
  w?: number;
  rib?: boolean; // red left rib
  dim?: number; // 0..1 extra dimming (e.g. dead states)
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, w, rib, dim = 0, style, children }) => {
  const enter = useEnter(at);
  return (
    <div
      style={{
        width: w,
        background: `linear-gradient(180deg, #17171d 0%, #121217 100%)`,
        border: "1px solid #2c2c36",
        borderRadius: 12,
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        padding: "26px 32px",
        position: "relative",
        overflow: "hidden",
        ...enter,
        ...style,
        opacity: (enter.opacity as number) * (1 - 0.55 * dim),
      }}
    >
      {rib ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: noir.red,
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

export const PanelTitle: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 44,
  color = noir.paper,
}) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontSize: size,
      color,
      letterSpacing: 4,
      lineHeight: 1.05,
    }}
  >
    {children}
  </div>
);

export const PanelSub: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 20,
}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontSize: size,
      fontWeight: 600,
      color: noir.ash,
      letterSpacing: 3,
      textTransform: "uppercase",
      marginTop: 8,
    }}
  >
    {children}
  </div>
);

// ---- LetterCard: the government letter (paper doc, red CLASSIFIED band) ----
export const LetterCard: React.FC<{
  at: number;
  w?: number;
  heading?: string;
  bandAt?: number; // frame the red band snaps in (defaults to at+8)
}> = ({ at, w = 380, heading = "U.S. DEPT OF COMMERCE", bandAt }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(at);
  const bandP = rev(frame, bandAt ?? at + 8, 8);
  const lines = [0.92, 0.7, 0.86, 0.55, 0.78, 0.62];
  return (
    <div
      style={{
        width: w,
        aspectRatio: "3 / 4",
        background: noir.paper,
        borderRadius: 6,
        boxShadow: "0 22px 60px rgba(0,0,0,0.6)",
        padding: "7% 8%",
        display: "flex",
        flexDirection: "column",
        gap: "4.5%",
        ...enter,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: w * 0.045,
          letterSpacing: 2,
          color: "#3a3a40",
        }}
      >
        {heading}
      </div>
      {/* the red band — ink, sharp */}
      <div
        style={{
          height: w * 0.085,
          width: `${bandP * 88}%`,
          background: noir.red,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: w * 0.05,
            color: noir.paper,
            letterSpacing: 3,
            whiteSpace: "nowrap",
          }}
        >
          RESTRICTED
        </span>
      </div>
      {lines.map((lw, i) => (
        <div
          key={i}
          style={{
            height: w * 0.028,
            width: `${lw * 100 * rev(frame, at + 10 + i * 3, 8)}%`,
            background: "#b9b5ab",
          }}
        />
      ))}
      <div style={{ flex: 1 }} />
      {/* signature strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ height: w * 0.028, width: "34%", background: "#b9b5ab" }} />
        <div
          style={{
            width: w * 0.12,
            height: w * 0.12,
            borderRadius: "50%",
            border: `${Math.max(2, w * 0.012)}px solid ${noir.red}`,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};

// ---- ExhibitFrame: museum frame with corner ticks + label plate ------------
export const ExhibitFrame: React.FC<{
  at: number;
  w: number;
  h: number;
  label: string;
  accent?: boolean;
  children?: React.ReactNode;
}> = ({ at, w, h, label, accent, children }) => {
  const enter = useEnter(at);
  const tick = 26;
  const corner = (pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: tick,
        height: tick,
        borderColor: accent ? noir.red : noir.smoke,
        borderStyle: "solid",
        borderWidth: 0,
        ...pos,
      }}
    />
  );
  return (
    <div style={{ position: "relative", width: w, height: h, ...enter }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,20,26,0.7)",
          border: `1px solid ${accent ? noir.redDeep : "#2c2c36"}`,
          borderRadius: 12,
        }}
      />
      {corner({ top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3 })}
      {corner({ top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3 })}
      {corner({ bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3 })}
      {corner({ bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3 })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      {/* label plate — ink */}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: "50%",
          transform: "translateX(-50%)",
          background: accent ? noir.red : "#26262e",
          color: accent ? noir.paper : noir.ash,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 3,
          padding: "8px 18px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ---- BarrierTape: diagonal-stripe restriction tape --------------------------
export const BarrierTape: React.FC<{
  at: number;
  w: number;
  text?: string;
  angle?: number;
}> = ({ at, w, text = "US ORGS ONLY", angle = -6 }) => {
  const frame = useCurrentFrame();
  const p = rev(frame, at, 12);
  return (
    <div
      style={{
        width: w,
        height: 64,
        transform: `rotate(${angle}deg) scaleX(${p})`,
        transformOrigin: "left center",
        background: `repeating-linear-gradient(45deg, ${noir.red} 0 34px, #0c0c10 34px 68px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <span
        style={{
          background: "#0c0c10",
          color: noir.paper,
          fontFamily: fonts.display,
          fontSize: 30,
          letterSpacing: 6,
          padding: "4px 18px",
          opacity: p >= 1 ? 1 : 0,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ---- RosetteSeal: flat government seal (SVG) --------------------------------
export const RosetteSeal: React.FC<{ size: number; spin?: number }> = ({ size, spin = 0 }) => {
  const r = size / 2;
  const ticks = Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2);
  const stars = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: `rotate(${spin}deg)` }}>
      <circle cx={r} cy={r} r={r * 0.98} fill="#1b1b22" stroke="#3a3a46" strokeWidth={size * 0.008} />
      <circle cx={r} cy={r} r={r * 0.9} fill="none" stroke={noir.paper} strokeWidth={size * 0.014} />
      {ticks.map((a, i) => (
        <line
          key={i}
          x1={r + Math.cos(a) * r * 0.84}
          y1={r + Math.sin(a) * r * 0.84}
          x2={r + Math.cos(a) * r * 0.78}
          y2={r + Math.sin(a) * r * 0.78}
          stroke={noir.smoke}
          strokeWidth={size * 0.006}
        />
      ))}
      <circle cx={r} cy={r} r={r * 0.62} fill="none" stroke={noir.ash} strokeWidth={size * 0.007} />
      {stars.map((a, i) => (
        <circle
          key={i}
          cx={r + Math.cos(a) * r * 0.7}
          cy={r + Math.sin(a) * r * 0.7}
          r={size * 0.012}
          fill={noir.paper}
        />
      ))}
      <circle cx={r} cy={r} r={r * 0.34} fill={noir.red} />
      <circle cx={r} cy={r} r={r * 0.34} fill="none" stroke={noir.paper} strokeWidth={size * 0.01} />
      {/* eagle abstraction: chevron */}
      <path
        d={`M ${r - r * 0.16} ${r + r * 0.06} L ${r} ${r - r * 0.12} L ${r + r * 0.16} ${r + r * 0.06}`}
        fill="none"
        stroke={noir.paper}
        strokeWidth={size * 0.016}
        strokeLinecap="square"
      />
    </svg>
  );
};

// ---- FlatSwitch: the kill switch as a vector rocker -------------------------
// flip: 0 = ON (lever up, white pip), 1 = OFF (lever down, red)
export const FlatSwitch: React.FC<{
  flip: number;
  size?: number;
  hitAt?: number; // frame of the slam (drives an impact punch)
}> = ({ flip, size = 420, hitAt }) => {
  const frame = useCurrentFrame();
  const punch = hitAt !== undefined ? impact(frame, hitAt, 0.1, 8) : 1;
  const ang = -26 + 52 * clamp(flip, 0, 1);
  const off = flip > 0.5;
  const plateW = size;
  const plateH = size * 1.28;
  return (
    <div
      style={{
        width: plateW,
        height: plateH,
        transform: `scale(${punch})`,
        position: "relative",
      }}
    >
      {/* plate — surface */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #1a1a21 0%, #141419 100%)",
          border: "1px solid #2c2c36",
          borderRadius: 12,
          boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
        }}
      />
      {/* ON / OFF labels */}
      <div
        style={{
          position: "absolute",
          top: plateH * 0.06,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: size * 0.11,
          letterSpacing: 6,
          color: off ? "#3a3a44" : "#cfd8e6",
        }}
      >
        ON
      </div>
      <div
        style={{
          position: "absolute",
          bottom: plateH * 0.06,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: size * 0.11,
          letterSpacing: 6,
          color: off ? noir.red : "#3a3a44",
        }}
      >
        OFF
      </div>
      {/* pivot ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 0.36,
          height: size * 0.36,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: `${size * 0.02}px solid ${off ? noir.red : "#4a4a58"}`,
          background: "#101015",
          boxShadow: off ? `0 0 ${size * 0.16}px rgba(229,35,61,0.35)` : undefined,
        }}
      />
      {/* lever — rotates around the pivot */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%,-50%) rotate(${ang}deg)`,
          width: size * 0.13,
          height: size * 0.88,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "58%",
            background: "linear-gradient(180deg, #4a4a58 0%, #34343e 100%)",
          }}
        />
        {/* handle */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -size * 0.075,
            transform: "translateX(-50%)",
            width: size * 0.3,
            height: size * 0.15,
            background: noir.red,
            boxShadow: `0 0 ${size * 0.12}px rgba(229,35,61,0.5)`,
          }}
        />
      </div>
    </div>
  );
};

// ---- StampRing: diagonal bordered stamp text (DENIED / ORDER) ---------------
export const StampRing: React.FC<{
  at: number;
  children: React.ReactNode;
  size?: number;
  rotate?: number;
  color?: string;
}> = ({ at, children, size = 96, rotate = -11, color = noir.red }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 300 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotate}deg) scale(${1.55 - 0.55 * s})`,
        opacity: clamp(s * 1.5, 0, 1),
        border: `${Math.max(4, size * 0.06)}px solid ${color}`,
        color,
        fontFamily: fonts.display,
        fontSize: size,
        letterSpacing: size * 0.16,
        padding: `${size * 0.06}px ${size * 0.34}px`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// ---- ClampGlyph: the state's hand, flat ------------------------------------
export const ClampGlyph: React.FC<{ closed: number; size?: number }> = ({
  closed,
  size = 280,
}) => {
  const spread = 34 - 20 * clamp(closed, 0, 1);
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 280 250">
      {/* wrist */}
      <rect x={122} y={0} width={36} height={92} fill="#34343e" />
      <rect x={106} y={84} width={68} height={26} fill="#4a4a58" />
      {/* prongs */}
      {[-1, 0, 1].map((d) => (
        <g key={d} transform={`rotate(${d * spread} 140 104)`}>
          <rect x={132} y={104} width={16} height={104} fill="#3a3a46" />
          <rect x={128} y={200} width={24} height={30} fill={noir.red} />
        </g>
      ))}
    </svg>
  );
};

// ---- TimelineSpine: the dated spine (draw-on line + ticks) -------------------
export type SpineStation = { x: number; date: string; label?: string; at: number };

export const TimelineSpine: React.FC<{
  x: number; // world-left of the spine
  y: number;
  length: number;
  drawTo: number; // 0..1 how much of the spine is drawn
  stations: SpineStation[];
}> = ({ x, y, length, drawTo, stations }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: length, height: 2 }}>
      {/* spine line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 3,
          width: length * clamp(drawTo, 0, 1),
          background: `linear-gradient(90deg, ${noir.smoke}, ${noir.ash})`,
        }}
      />
      {stations.map((s, i) => {
        const p = rev(frame, s.at, 10);
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: s.x - x, top: 0 }}>
            {/* tick */}
            <div
              style={{
                position: "absolute",
                left: -3,
                top: -16,
                width: 6,
                height: 34 * p,
                background: noir.red,
              }}
            />
            {/* date lockup */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 34,
                transform: `translateX(-50%) translateY(${(1 - p) * 16}px)`,
                opacity: p,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 58,
                  color: noir.paper,
                  letterSpacing: 6,
                }}
              >
                {s.date}
              </div>
              {s.label ? (
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 21,
                    fontWeight: 600,
                    color: noir.ash,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---- DotField: canvas matrix of weight-squares igniting in a wave ------------
export const DotField: React.FC<{
  w: number; // world px
  h: number;
  cell?: number;
  ignite: number; // wave radius in world px from center
  origin?: [number, number]; // wave origin in field coords (default center)
  seed?: string;
}> = ({ w, h, cell = 26, ignite, origin, seed = "dots" }) => {
  const frame = useCurrentFrame();
  const ref = React.useRef<HTMLCanvasElement>(null);
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  const [ox, oy] = origin ?? [w / 2, h / 2];

  React.useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const sz = cell * 0.5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jx = noise2D(`${seed}x`, c * 0.31, r * 0.31) * cell * 0.28;
        const jy = noise2D(`${seed}y`, c * 0.37, r * 0.37) * cell * 0.28;
        const px = c * cell + cell / 2 + jx;
        const py = r * cell + cell / 2 + jy;
        const jt = Math.abs(noise2D(`${seed}t`, c * 0.7, r * 0.7)) * 90;
        const d = Math.hypot(px - ox, py - oy) + jt;
        const lit = ignite - d;
        if (lit <= 0) {
          ctx.fillStyle = "#17171d";
        } else {
          const pulse = 0.7 + 0.3 * Math.abs(noise2D(`${seed}p`, c + r * 7, frame * 0.05));
          const heat = clamp(lit / 260, 0, 1);
          const rr = Math.round(229 * pulse);
          const gg = Math.round((35 + 72 * heat) * pulse);
          const bb = Math.round((61 + 29 * heat) * pulse * 0.7);
          ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        }
        const grow = lit > 0 ? 1 + clamp(lit / 900, 0, 0.35) : 1;
        const s2 = (sz * grow) / 2;
        ctx.fillRect(px - s2, py - s2, sz * grow, sz * grow);
      }
    }
  }, [frame, w, h, cell, ignite, ox, oy, seed, cols, rows]);

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      style={{ position: "absolute", left: 0, top: 0, width: w, height: h }}
    />
  );
};

// ---- GlobeDots: abstract dotted globe whose dots die in a wave ---------------
export const GlobeDots: React.FC<{
  size: number;
  life: number; // 1 all lit → 0 all dead
  seed?: string;
}> = ({ size, life, seed = "globe" }) => {
  const frame = useCurrentFrame();
  const r = size / 2;
  const dots = React.useMemo(() => {
    const arr: { x: number; y: number; thr: number }[] = [];
    const rings = 9;
    for (let ring = 0; ring < rings; ring++) {
      const rr = (ring / (rings - 1)) * r * 0.86;
      const count = Math.max(1, Math.round((rr / r) * 30));
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + ring * 0.4;
        arr.push({
          x: r + Math.cos(a) * rr,
          y: r + Math.sin(a) * rr * 0.94,
          thr: 0.5 + 0.5 * noise2D(seed, ring * 3.1, i * 0.71),
        });
      }
    }
    return arr;
  }, [r, seed]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r * 0.97} fill="#101015" stroke="#2c2c36" strokeWidth={2} />
      {/* meridian arcs */}
      {[0.35, 0.65].map((k, i) => (
        <ellipse
          key={i}
          cx={r}
          cy={r}
          rx={r * 0.97 * (i === 0 ? 0.55 : 0.85)}
          ry={r * 0.97}
          fill="none"
          stroke="#26262e"
          strokeWidth={1.5}
        />
      ))}
      <ellipse cx={r} cy={r} rx={r * 0.97} ry={r * 0.4} fill="none" stroke="#26262e" strokeWidth={1.5} />
      {dots.map((d, i) => {
        let on = life > d.thr ? 1 : 0;
        const edge = Math.abs(life - d.thr);
        if (edge < 0.05 && life > 0.01) {
          on = Math.abs(noise2D(`${seed}f${i}`, frame * 0.5, 0)) > 0.45 ? 1 : 0;
        }
        return (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={size * 0.011}
            fill={on ? "#cfd8e6" : "#1d1d24"}
          />
        );
      })}
    </svg>
  );
};

// ---- GaugeArc: classifier % arc + big number --------------------------------
export const GaugeArc: React.FC<{
  at: number;
  size?: number;
  pct: number; // 0..100 final
}> = ({ at, size = 340, pct }) => {
  const frame = useCurrentFrame();
  const p = rev(frame, at, 26);
  const shown = Math.floor(pct * p);
  const r = size / 2 - 14;
  const circ = Math.PI * r * 1.5; // 270° arc
  const enter = useEnter(at, 10);
  return (
    <div style={{ position: "relative", width: size, height: size, ...enter }}>
      <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#26262e"
          strokeWidth={14}
          strokeDasharray={`${circ} ${Math.PI * r * 2}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={noir.red}
          strokeWidth={14}
          strokeDasharray={`${circ * p * (pct / 100)} ${Math.PI * r * 2}`}
          strokeLinecap="butt"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: size * 0.3,
            color: noir.paper,
            letterSpacing: 2,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {shown}%+
        </div>
      </div>
    </div>
  );
};

// ---- ServerCard: closed-model server + rack lights ---------------------------
export const ServerCard: React.FC<{
  at: number;
  dead: number; // 0 alive → 1 dead
  w?: number;
}> = ({ at, dead, w = 300 }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(at);
  const h = w * 1.5;
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "linear-gradient(180deg, #1a1a21, #131318)",
        border: "1px solid #2c2c36",
        borderRadius: 12,
        boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
        padding: w * 0.09,
        display: "flex",
        flexDirection: "column",
        gap: w * 0.055,
        ...enter,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => {
        const slotOn = rev(frame, at + 6 + i * 3, 6) * (1 - dead);
        return (
          <div
            key={i}
            style={{
              height: w * 0.11,
              borderRadius: 3,
              background: "#101015",
              border: "1px solid #26262e",
              display: "flex",
              alignItems: "center",
              paddingLeft: w * 0.06,
              gap: w * 0.04,
            }}
          >
            <div
              style={{
                width: w * 0.5,
                height: w * 0.032,
                background: slotOn > 0.4 ? "#cfd8e6" : "#22222a",
              }}
            />
            <div
              style={{
                width: w * 0.032,
                height: w * 0.032,
                borderRadius: "50%",
                background: slotOn > 0.4 ? noir.red : "#22222a",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
