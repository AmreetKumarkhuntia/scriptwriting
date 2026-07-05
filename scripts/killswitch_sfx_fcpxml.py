#!/usr/bin/env python3
"""
killswitch_sfx_fcpxml.py — emit the AI Kill Switch SFX track as a DaVinci-importable FCPXML.

One 1080p30 timeline: all 19 clips (10 takeovers + 9 KS-Gap gap-fillers — the video is fully
faceless, zero spine gaps, 0:00→6:08) sit at their cut-sheet drop-in offsets, and every SFX
cue hangs off its clip as a connected audio asset-clip (lane -1/-2/…) with the mix level from
the Remotion render baked in as <adjust-volume>. Import into Resolve, copy the audio lanes
into the master assembly, mute the clips' baked audio.

The CUES table below mirrors the SfxTrack blocks in remotion-all/src/AIKillSwitch/clips/*.tsx
and the manifest defaults in src/AIKillSwitch/sfx.ts — regenerate this file if either changes.

Usage:
    python3 scripts/killswitch_sfx_fcpxml.py <out.fcpxml> <out-cue-table.md>
"""
import math
import subprocess
import sys
import urllib.parse
from pathlib import Path
from xml.sax.saxutils import quoteattr

FPS = 30
W, H = 1920, 1080
WIN_BASE = "F:/videoEditing/kill switch"
MNT_BASE = Path("/mnt/f/videoEditing/kill switch")


def subdir(clip: str) -> str:
    """KS-Gap* renders live in gaps/, everything else in takeovers/."""
    return "gaps" if clip.startswith("KS-Gap") else "takeovers"

# cue name -> (file in takeovers/sfx/, manifest default volume)  [src/AIKillSwitch/sfx.ts]
SFX = {
    "boom": ("slam-boom.mp3", 0.55),
    "whoosh": ("whoosh-cinematic.mp3", 0.40),
    "swoosh": ("whoosh-camera.mp3", 0.35),
    "pop": ("pop.mp3", 0.35),
    "rise": ("riser-sharp.wav", 0.45),
    "flare": ("blast-flare.mp3", 0.45),
    "impact": ("slam-impact.mp3", 0.50),
    "alert": ("alert-buzz.mp3", 0.35),
    "riser": ("riser-long.wav", 0.40),
    "riserBig": ("riser-big.wav", 0.50),
    "switchOff": ("breaker-off.mp3", 0.60),
    "switchOn": ("breaker-on.mp3", 0.60),
    "cable": ("cable-whip.mp3", 0.50),
    "glitch": ("glitch.mp3", 0.30),
}

# (clip, drop-at frame on the master timeline, clip duration f, [(cue, local frame, volume|None)])
# drop-at frames come from the cut-sheet drop-in table; None volume = manifest default.
CLIPS = [
    ("KS-ColdOpen", 0, 420, [
        ("whoosh", 0, 0.35), ("rise", 60, 0.40), ("swoosh", 100, 0.30), ("pop", 146, None),
        ("switchOff", 196, None), ("boom", 196, 0.45), ("riser", 235, 0.35),
        ("glitch", 250, None), ("glitch", 275, None), ("glitch", 300, None),
        ("boom", 338, 0.40),
    ]),
    ("KS-Gap1", 420, 810, [
        ("whoosh", 0, 0.30), ("pop", 12, None), ("whoosh", 164, 0.35), ("swoosh", 212, 0.30),
        ("whoosh", 497, 0.35), ("riser", 520, 0.35), ("boom", 545, 0.35),
        ("whoosh", 665, 0.35), ("impact", 713, None), ("whoosh", 762, 0.30),
    ]),
    ("KS-SealDrop", 1230, 300, [
        ("whoosh", 0, 0.30), ("pop", 22, None), ("pop", 34, None), ("pop", 46, None),
        ("rise", 140, 0.50), ("boom", 208, 0.60), ("impact", 208, 0.55),
    ]),
    ("KS-Gap2", 1530, 375, [
        ("whoosh", 0, 0.30), ("pop", 62, None), ("swoosh", 90, 0.30),
        ("whoosh", 255, 0.35), ("riser", 262, 0.35), ("impact", 301, None),
    ]),
    ("KS-Timeline", 1905, 360, [
        ("whoosh", 0, 0.30), ("flare", 28, 0.35), ("whoosh", 88, 0.40), ("pop", 134, None),
        ("whoosh", 198, 0.40), ("riser", 215, 0.40), ("alert", 256, 0.30),
        ("whoosh", 292, 0.35), ("boom", 302, 0.35),
    ]),
    ("KS-Gap3", 2265, 1350, [
        ("whoosh", 0, 0.30), ("pop", 113, None), ("pop", 128, None),
        ("glitch", 195, 0.30), ("glitch", 207, 0.30), ("whoosh", 243, 0.35),
        ("whoosh", 417, 0.35), ("impact", 461, None), ("whoosh", 492, 0.30),
        ("pop", 642, None), ("whoosh", 729, 0.30), ("riser", 810, 0.35),
        ("boom", 860, 0.40), ("whoosh", 954, 0.35), ("pop", 998, None),
        ("pop", 1031, None), ("alert", 1085, 0.30), ("pop", 1142, None),
        ("whoosh", 1176, 0.35), ("boom", 1220, 0.40),
    ]),
    ("KS-Network", 3615, 240, [
        ("pop", 12, None), ("pop", 20, None), ("swoosh", 30, 0.30),
        ("alert", 95, 0.35), ("alert", 150, 0.40), ("swoosh", 172, 0.30),
    ]),
    ("KS-Gap4", 3855, 570, [
        ("rise", 8, 0.35), ("impact", 32, None), ("pop", 80, None),
        ("whoosh", 120, 0.35), ("pop", 164, None), ("boom", 239, 0.40),
        ("whoosh", 279, 0.35), ("pop", 323, None), ("alert", 407, 0.35),
        ("whoosh", 500, 0.30),
    ]),
    ("KS-Vault", 4425, 360, [
        ("whoosh", 0, 0.30), ("swoosh", 24, 0.30), ("pop", 112, None),
        ("whoosh", 190, 0.35), ("riser", 205, 0.35), ("impact", 232, None),
        ("alert", 246, 0.30),
    ]),
    ("KS-Gap5", 4785, 1164, [
        ("whoosh", 0, 0.30), ("pop", 29, None), ("pop", 102, None),
        ("boom", 172, 0.35), ("whoosh", 216, 0.35), ("alert", 292, 0.30),
        ("whoosh", 360, 0.35), ("impact", 404, None), ("riserBig", 478, 0.45),
        ("flare", 492, 0.40), ("whoosh", 753, 0.35), ("riser", 770, 0.35),
        ("boom", 797, 0.35), ("whoosh", 837, 0.35), ("impact", 881, None),
        ("pop", 1046, None),
    ]),
    ("KS-StampGate", 5949, 240, [
        ("rise", 36, 0.35), ("impact", 52, None), ("alert", 118, 0.40),
        ("pop", 140, None), ("swoosh", 172, 0.35),
    ]),
    ("KS-Gap6", 6189, 771, [
        ("whoosh", 0, 0.30), ("pop", 54, None), ("swoosh", 95, 0.30),
        ("whoosh", 186, 0.35), ("switchOff", 252, 0.45), ("whoosh", 333, 0.35),
        ("boom", 377, 0.40), ("whoosh", 489, 0.35), ("riser", 682, 0.35),
        ("impact", 701, None),
    ]),
    ("KS-SwitchBack", 6960, 360, [
        ("swoosh", 20, 0.30), ("pop", 62, None), ("rise", 92, 0.40),
        ("switchOn", 132, None), ("boom", 132, 0.45), ("flare", 148, None),
        ("whoosh", 282, 0.40), ("alert", 300, None),
    ]),
    ("KS-Gap7", 7320, 1185, [
        ("whoosh", 0, 0.30), ("pop", 47, None), ("pop", 131, None), ("pop", 203, None),
        ("whoosh", 306, 0.35), ("boom", 350, 0.40), ("boom", 360, 0.35),
        ("whoosh", 546, 0.30), ("boom", 626, 0.40), ("whoosh", 630, 0.30),
        ("pop", 674, None), ("pop", 737, None), ("pop", 782, None),
        ("boom", 821, 0.35), ("whoosh", 861, 0.30), ("pop", 905, None),
        ("swoosh", 995, 0.30), ("whoosh", 1016, 0.30), ("alert", 1076, 0.35),
    ]),
    ("KS-OrderVsRequest", 8505, 270, [
        ("pop", 16, None), ("pop", 30, None), ("impact", 58, 0.45),
        ("swoosh", 120, 0.30), ("rise", 150, 0.35), ("boom", 212, 0.40),
    ]),
    ("KS-Gap8", 8775, 405, [
        ("whoosh", 0, 0.30), ("pop", 16, None), ("pop", 28, None),
        ("rise", 140, 0.35), ("impact", 155, None), ("whoosh", 192, 0.35),
        ("switchOff", 300, 0.40), ("pop", 317, None),
    ]),
    ("KS-Swarm", 9180, 360, [
        ("cable", 70, None), ("alert", 80, 0.25), ("whoosh", 112, 0.40),
        ("riserBig", 138, None), ("flare", 156, None), ("pop", 268, None),
        ("pop", 284, None),
    ]),
    ("KS-Gap9", 9540, 1035, [
        ("whoosh", 0, 0.30), ("pop", 64, None), ("whoosh", 183, 0.35),
        ("pop", 227, None), ("pop", 254, None), ("whoosh", 390, 0.30),
        ("boom", 434, 0.40), ("whoosh", 609, 0.30), ("boom", 685, 0.35),
        ("whoosh", 741, 0.35), ("riser", 900, 0.40), ("impact", 954, None),
        ("boom", 962, 0.45), ("whoosh", 970, 0.35),
    ]),
    ("KS-Outro", 10575, 465, [
        ("switchOff", 40, None), ("boom", 40, 0.35), ("switchOn", 84, None),
        ("boom", 84, 0.35), ("whoosh", 120, 0.35), ("riser", 148, 0.40),
        ("swoosh", 170, 0.35), ("pop", 232, None),
    ]),
]


def tc(frames: int) -> str:
    return f"{frames}/{FPS}s"


def file_url(rel: str) -> str:
    return "file:///" + urllib.parse.quote(f"{WIN_BASE}/{rel}", safe=":/")


def probe(path: Path) -> tuple[float, int, int]:
    """duration s, sample rate, channels"""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
         "stream=sample_rate,channels", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.split()
    rate, ch = out[0].split(",")
    return float(out[1]), int(rate), int(ch)


def db(vol: float) -> str:
    return f"{20 * math.log10(vol):.1f}dB"


def abs_tc(frames: int) -> str:
    s = frames / FPS
    return f"{int(s // 60)}:{s % 60:04.1f}"


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    out_xml, out_md = sys.argv[1], sys.argv[2]

    for rel, _ in SFX.values():
        p = MNT_BASE / "takeovers" / "sfx" / rel
        assert p.exists(), f"missing on F:: {p}"
    for name, *_ in CLIPS:
        p = MNT_BASE / subdir(name) / f"{name}.mp4"
        assert p.exists(), f"missing on F:: {p}"

    meta = {cue: probe(MNT_BASE / "takeovers" / "sfx" / rel) for cue, (rel, _) in SFX.items()}

    # ---- resources ----
    res = [
        f'    <format id="r1" name="FFVideoFormat{W}x{H}p{FPS}" frameDuration="1/{FPS}s" '
        f'width="{W}" height="{H}" colorSpace="1-1-1 (Rec. 709)"/>'
    ]
    vid_id = {}
    for i, (name, _, durf, _) in enumerate(CLIPS, start=1):
        aid = f"v{i}"
        vid_id[name] = aid
        res.append(
            f'    <asset id="{aid}" name={quoteattr(name)} start="0s" duration="{tc(durf)}" '
            f'hasVideo="1" hasAudio="1" format="r1" videoSources="1" '
            f'audioSources="1" audioChannels="2" audioRate="48000">\n'
            f'      <media-rep kind="original-media" src={quoteattr(file_url(f"{subdir(name)}/{name}.mp4"))}/>\n'
            f'    </asset>'
        )
    sfx_id = {}
    for i, (cue, (rel, _)) in enumerate(SFX.items(), start=1):
        aid = f"s{i}"
        sfx_id[cue] = aid
        dur_s, rate, ch = meta[cue]
        durf = math.ceil(dur_s * FPS)
        res.append(
            f'    <asset id="{aid}" name={quoteattr(Path(rel).stem)} start="0s" '
            f'duration="{tc(durf)}" hasAudio="1" audioSources="1" '
            f'audioChannels="{ch}" audioRate="{rate}">\n'
            f'      <media-rep kind="original-media" src={quoteattr(file_url("takeovers/sfx/" + rel))}/>\n'
            f'    </asset>'
        )

    # ---- spine: takeover clips at cut-sheet offsets, SFX as connected lanes ----
    spine = []
    md_rows = []
    cursor = 0
    n_cues = 0
    max_lanes = 0
    for name, drop, durf, cues in CLIPS:
        if drop > cursor:
            spine.append(f'      <gap name="Gap" offset="{tc(cursor)}" duration="{tc(drop - cursor)}"/>')
        # lane packing: overlapping sounds go to deeper lanes
        lanes: list[int] = []  # per lane, end frame of its last clip
        placed = []
        for cue, at, vol in sorted(cues, key=lambda c: c[1]):
            dur_s, _, _ = meta[cue]
            cdur = math.ceil(dur_s * FPS)
            cdur = min(cdur, durf - at) if at + cdur > durf else cdur  # keep inside the clip
            cdur = max(cdur, 1)
            lane = next((i for i, end in enumerate(lanes) if end <= at), None)
            if lane is None:
                lanes.append(0)
                lane = len(lanes) - 1
            lanes[lane] = at + cdur
            v = vol if vol is not None else SFX[cue][1]
            placed.append((cue, at, cdur, lane + 1, v))
            md_rows.append((name, at, drop + at, cue, SFX[cue][0], db(v)))
            n_cues += 1
        max_lanes = max(max_lanes, len(lanes))

        spine.append(
            f'      <asset-clip ref="{vid_id[name]}" name={quoteattr(name)} '
            f'offset="{tc(drop)}" start="0s" duration="{tc(durf)}" format="r1" tcFormat="NDF">'
        )
        for cue, at, cdur, lane, v in placed:
            spine.append(
                f'        <asset-clip ref="{sfx_id[cue]}" lane="-{lane}" name={quoteattr(cue)} '
                f'offset="{tc(at)}" start="0s" duration="{tc(cdur)}">\n'
                f'          <adjust-volume amount="{db(v)}"/>\n'
                f'        </asset-clip>'
            )
        spine.append("      </asset-clip>")
        cursor = drop + durf

    total = cursor
    doc = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        "<!DOCTYPE fcpxml>\n"
        '<fcpxml version="1.9">\n'
        "  <resources>\n" + "\n".join(res) + "\n  </resources>\n"
        '  <library>\n    <event name="KS SFX">\n      <project name="KS SFX">\n'
        f'        <sequence format="r1" duration="{tc(total)}" tcStart="0s" '
        f'tcFormat="NDF" audioLayout="stereo" audioRate="48k">\n'
        "          <spine>\n"
        + "\n".join("  " + line for line in spine)
        + "\n          </spine>\n"
        "        </sequence>\n      </project>\n    </event>\n  </library>\n</fcpxml>\n"
    )
    Path(out_xml).write_text(doc, encoding="utf-8")

    # ---- cue reference table ----
    md = [
        "# AI Kill Switch — SFX track reference",
        "",
        "Generated by `scripts/killswitch_sfx_fcpxml.py` (source of truth: the `SfxTrack`",
        "blocks in `remotion-all/src/AIKillSwitch/clips/*.tsx`). The importable timeline is",
        r"`F:\videoEditing\kill switch\takeovers\KS-SFX.fcpxml`; sound files live in",
        r"`F:\videoEditing\kill switch\takeovers\sfx\`; gap-clip MP4s in",
        r"`F:\videoEditing\kill switch\gaps\`.",
        "",
        "**Import:** File → Import → Timeline → KS-SFX.fcpxml in Resolve. All 19 clips (10",
        "takeovers + 9 gap-fillers — the full faceless 0:00–6:08 video, no spine gaps) sit on",
        "the video track at their cut-sheet positions with every SFX hit as its own clip on the",
        "audio tracks below, levels pre-set to match the baked mix. This IS the assembly: keep",
        "the video track, add the VO + music underneath, then **mute the clips' baked audio**.",
        "If your importer drops the volume adjustments, clips land at 0 dB — the dB column",
        "below is the target level per hit.",
        "",
        "| Clip | Local frame | Timeline @ | Cue | File | Level |",
        "|---|---|---|---|---|---|",
    ]
    for name, at, absf, cue, rel, level in md_rows:
        md.append(f"| {name} | {at} | {abs_tc(absf)} | {cue} | {rel} | {level} |")
    Path(out_md).write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"wrote {out_xml} ({n_cues} cues, {len(CLIPS)} clips, {total}f ≈ {total/FPS:.1f}s)")
    print(f"wrote {out_md}  (max audio lanes: {max_lanes})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
