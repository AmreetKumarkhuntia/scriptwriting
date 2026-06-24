#!/usr/bin/env python3
"""
firstcut_fcpxml.py — generate a DaVinci-importable FCPXML "first cut" from a beats manifest.

Designed for the "Claude designs the first cut -> user polishes in DaVinci (free)" workflow:
clips are laid end-to-end in story order, razor-cut at each interesting beat, with a
reframe ("zoom-to-face") transform on the zoom segments and a labelled marker at every beat.
No motion graphics. The user eases the push-ins and tunes the reframe by hand.

Usage:
    python3 scripts/firstcut_fcpxml.py <manifest.json> <out.fcpxml>

Manifest shape: see channels/Amreet Aint/videos/007 First Light/highlights/day4-firstcut.beats.json
Notes are rational at the timeline fps (frames/fps "s"). DaVinci runs on Windows, so asset
paths are written as Windows file:// URLs built from manifest "windows_dir".
"""
import json
import sys
import urllib.parse
from xml.sax.saxutils import escape, quoteattr


def file_url(windows_dir: str, name: str) -> str:
    # e.g. F:/recordings/007/part 4 + 01_x.mp4 -> file:///F:/recordings/007/part%204/01_x.mp4
    path = f"{windows_dir}/{name}.mp4"
    return "file:///" + urllib.parse.quote(path, safe=":/")


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    manifest_path, out_path = sys.argv[1], sys.argv[2]
    with open(manifest_path, encoding="utf-8") as fh:
        m = json.load(fh)

    fps = int(m["fps"])
    W, H = int(m["width"]), int(m["height"])
    windows_dir = m["windows_dir"].rstrip("/")
    rf = m.get("reframe", {"scale": 1.5, "position": "-450 -260"})
    rf_scale = rf["scale"]
    rf_pos = rf["position"]
    # DaVinci's FCPXML importer mis-scales <adjust-transform> and throws the shot off-canvas
    # (black). Default OFF: still split the clip + drop a marker at each zoom beat, but let the
    # user apply the reframe themselves (they ease/keyframe it anyway). Set true only if a future
    # importer handles it.
    apply_reframe = bool(m.get("apply_reframe_transform", False))

    def tc(frames: int) -> str:
        return f"{frames}/{fps}s"

    clips = m["clips"]
    durs = {c["name"]: int(c["duration_s"]) * fps for c in clips}  # duration in frames

    # group beats by clip
    beats_by_clip: dict[str, list[dict]] = {}
    for b in m["beats"]:
        beats_by_clip.setdefault(b["clip"], []).append(b)

    # ---- resources ----
    res = [
        f'    <format id="r1" name="FFVideoFormat{W}x{H}p{fps}" frameDuration="1/{fps}s" '
        f'width="{W}" height="{H}" colorSpace="1-1-1 (Rec. 709)"/>'
    ]
    asset_id = {}
    for i, c in enumerate(clips, start=1):
        aid = f"a{i}"
        asset_id[c["name"]] = aid
        durf = durs[c["name"]]
        url = file_url(windows_dir, c["name"])
        res.append(
            f'    <asset id="{aid}" name={quoteattr(c["name"])} start="0s" duration="{tc(durf)}" '
            f'hasVideo="1" hasAudio="1" format="r1" videoSources="1" '
            f'audioSources="1" audioChannels="2" audioRate="48000">\n'
            f'      <media-rep kind="original-media" src={quoteattr(url)}/>\n'
            f'    </asset>'
        )

    # ---- spine ----
    spine = []
    timeline = 0  # running timeline offset in frames
    total_zoom = total_marker = 0

    for c in clips:
        name = c["name"]
        aid = asset_id[name]
        durf = durs[name]
        cbeats = beats_by_clip.get(name, [])

        # zoom beats become split points; collect (start_f, end_f, label)
        zooms = []
        for b in cbeats:
            if b["kind"] == "zoom":
                s = int(round(b["start_s"] * fps))
                e = int(round(b["end_s"] * fps))
                s = max(0, min(s, durf))
                e = max(s, min(e, durf))
                if e > s:
                    zooms.append((s, e, b["label"]))
        zooms.sort()

        # split points across the clip
        points = [0]
        for s, e, _ in zooms:
            points += [s, e]
        points.append(durf)
        points = sorted(set(p for p in points if 0 <= p <= durf))

        # build segments
        segments = []  # (src_start_f, seg_dur_f, reframed)
        for k in range(len(points) - 1):
            s0, s1 = points[k], points[k + 1]
            if s1 <= s0:
                continue
            reframed = any(zs <= s0 < ze for zs, ze, _ in zooms)
            segments.append((s0, s1 - s0, reframed))

        # markers: place each beat on the segment containing its start frame
        def seg_index_for(frame: int) -> int:
            acc = 0
            for idx, (s0, sd, _) in enumerate(segments):
                if s0 <= frame < s0 + sd:
                    return idx
            return len(segments) - 1

        markers_by_seg: dict[int, list[tuple[int, str]]] = {}
        for b in cbeats:
            f = int(round(b["start_s"] * fps))
            f = max(0, min(f, durf - 1))
            prefix = {"zoom": "ZOOM→FACE", "tune": "ZOOM→FACE (tune)", "meme": "MEME"}.get(b["kind"], b["kind"].upper())
            markers_by_seg.setdefault(seg_index_for(f), []).append((f, f'{prefix}: {b["label"]}'))
            total_marker += 1

        # emit each segment as an asset-clip
        for idx, (s0, sd, reframed) in enumerate(segments):
            children = []
            if reframed:
                total_zoom += 1
                if apply_reframe:
                    children.append(f'        <adjust-transform scale="{rf_scale} {rf_scale}" position="{rf_pos}"/>')
            for f, val in sorted(markers_by_seg.get(idx, [])):
                children.append(f'        <marker start="{tc(f)}" duration="1/{fps}s" value={quoteattr(val)}/>')

            open_tag = (
                f'      <asset-clip ref="{aid}" name={quoteattr(name)} '
                f'offset="{tc(timeline)}" start="{tc(s0)}" duration="{tc(sd)}" '
                f'format="r1" tcFormat="NDF"'
            )
            if children:
                spine.append(open_tag + ">")
                spine.extend(children)
                spine.append("      </asset-clip>")
            else:
                spine.append(open_tag + "/>")
            timeline += sd

    total_frames = timeline
    doc = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        "<!DOCTYPE fcpxml>\n"
        '<fcpxml version="1.9">\n'
        "  <resources>\n"
        + "\n".join(res)
        + "\n  </resources>\n"
        f'  <library>\n    <event name={quoteattr(m["project"])}>\n'
        f'      <project name={quoteattr(m["project"])}>\n'
        f'        <sequence format="r1" duration="{tc(total_frames)}" tcStart="0s" '
        f'tcFormat="NDF" audioLayout="stereo" audioRate="48k">\n'
        "          <spine>\n"
        + "\n".join("  " + line for line in spine)
        + "\n          </spine>\n"
        "        </sequence>\n"
        "      </project>\n"
        "    </event>\n"
        "  </library>\n"
        "</fcpxml>\n"
    )

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(doc)

    mins = total_frames / fps / 60
    print(f"wrote {out_path}")
    print(f"  clips={len(clips)}  timeline={total_frames} frames (~{mins:.1f} min @ {fps}fps)")
    print(f"  zoom segments={total_zoom}  markers={total_marker}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
