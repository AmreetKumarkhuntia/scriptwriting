---
name: blender-video-editing
description: How Claude edits video in Blender's Video Sequence Editor (VSE) via the blender MCP — import cut clips, drop in memes/images, add zoom punch-ins, and render. Runs from Windows Claude (Blender + MCP both on Windows). Use when assembling or finishing a reel in Blender instead of (or alongside) Remotion/DaVinci.
metadata:
  tags: blender, vse, video-editing, mcp, render, davinci
---

# Blender Video Editing (VSE via MCP)

How Claude drives **Blender's Video Sequence Editor** to cut, layer, zoom, and render video. The
editing is done by Claude writing Blender Python that the **`blender` MCP** runs inside Blender via
its `execute_blender_code` tool. This is the timeline-editing counterpart to
[`motion-graphics-guide.md`](motion-graphics-guide.md) (graphics in Remotion) — read that for
animated overlays; read this for cutting clips and laying memes/zoom over recorded footage.

> `blender-mcp` is built for 3D scenes, so there are no purpose-built "add cut" tools — everything
> here goes through `execute_blender_code` (raw Python into the VSE data API). The recipes below are
> the house patterns; prefer the **data API** (`sequences.new_*`) over `bpy.ops.sequencer.*`, which
> needs a context override and is flaky when called from the MCP.

## Where this runs (read first)

Blender, `uvx blender-mcp`, and the Claude that drives them all live on **Windows**. The WSL Claude
in this repo does research/scripting and the clip-cutting pipeline; **Windows Claude does the Blender
editing**. To use it:

1. The `blender` MCP is registered in Windows Claude user scope:
   `claude mcp add blender -s user -- uvx blender-mcp`
2. Blender is open with the **BlenderMCP** addon connected (viewport → `N` → **BlenderMCP** tab →
   **Connect to Claude**; socket on `localhost:9876`). **Blender must run with its GUI** — the addon
   refuses to serve in background (`blender -b`) mode.
3. Windows Claude has this repo open via `\\wsl.localhost\Ubuntu\home\amreet_khuntia\repos\scriptwriting`.

## Path translation: `/mnt/f` ⇔ `F:\` (the #1 gotcha)

Blender is a **Windows** process, so every filepath you hand it must be a **Windows path**. The media
drive is the same bytes either way:

| WSL pipeline (cuts clips here)            | Blender on Windows (reads them here)      |
| ----------------------------------------- | ----------------------------------------- |
| `/mnt/f/recordings/<proj>/clips/02.mp4`   | `F:\recordings\<proj>\clips\02.mp4`       |
| `/mnt/f/recordings/<proj>/out.mp4`        | `F:\recordings\<proj>\out.mp4`            |

In Python string literals, Windows backslashes must be escaped (`"F:\\recordings\\..."`) or use a raw
string (`r"F:\recordings\..."`). Clips produced by [`vod-clip-extraction`](../.claude/skills/vod-clip-extraction/SKILL.md)
at `/mnt/f/recordings/<proj>/clips` are exactly the files Blender opens at `F:\recordings\<proj>\clips`.

## 1. Scene setup (match the pipeline spec)

Init the VSE and pin the scene to the same spec the clips were normalized to (h264, **2560×1440**,
**30 fps**, yuv420p) so nothing rescales:

```python
import bpy

scene = bpy.context.scene
scene.render.resolution_x = 2560
scene.render.resolution_y = 1440
scene.render.fps = 30
scene.render.fps_base = 1.0
scene.render.use_sequencer = True          # render the VSE, not the 3D camera

se = scene.sequence_editor or scene.sequence_editor_create()
# start clean:
for s in list(se.sequences_all):
    se.sequences.remove(s)
```

## 2. Import a cut (movie strip + its audio)

`new_movie` adds only the picture; add `new_sound` at the same `frame_start` for the clip's audio.
`channel` is the timeline track (higher = on top). `frame_start` is where the clip's frame 0 lands.

```python
path = r"F:\recordings\007\clips\02_briefing.mp4"
start, ch = 1, 2

vid = se.sequences.new_movie(name="02_briefing", filepath=path, channel=ch, frame_start=start)
snd = se.sequences.new_sound(name="02_briefing_a", filepath=path, channel=ch + 1, frame_start=start)
# vid.frame_final_duration is auto-set from the file; to butt the next clip up against it:
next_start = vid.frame_start + vid.frame_final_duration
```

Append a sequence of cuts by carrying `next_start` forward (hard cuts, like the Remotion manifest).

## 3. Drop in a meme / image overlay

Image strips go on a **higher channel** so they sit on top of the footage. Set the on-screen duration
explicitly, and size/position with the strip transform (in pixels relative to centre):

```python
meme = se.sequences.new_image(
    name="meme_pog", filepath=r"F:\recordings\007\memes\pog.png",
    channel=4, frame_start=420)
meme.frame_final_duration = 45             # ~1.5 s at 30 fps
meme.blend_type = 'ALPHA_OVER'             # respect PNG transparency
meme.transform.scale_x = meme.transform.scale_y = 0.4
meme.transform.offset_x = 700              # px right of centre
meme.transform.offset_y = -350             # px below centre
```

For an animated meme (mp4/gif), use `new_movie` on the same higher channel instead, and `blend_type`
`'ALPHA_OVER'` if it has alpha.

## 4. Zoom punch-in (keyframed scale)

Punch in by keyframing the strip's `transform.scale_x/scale_y`. Blender's default keyframe
interpolation is Bézier, so it already eases in/out — no extra work for a smooth push:

```python
clip = vid                                  # the strip to zoom
f0 = clip.frame_start + 90                   # start of the punch (3 s in)
hold, out = f0 + 12, f0 + 12 + 30            # ramp 12f → hold 30f → ramp back

for f, s in [(f0, 1.0), (hold, 1.3), (out, 1.3), (out + 12, 1.0)]:
    clip.transform.scale_x = clip.transform.scale_y = s
    clip.transform.keyframe_insert("scale_x", frame=f)
    clip.transform.keyframe_insert("scale_y", frame=f)
```

To bias the zoom toward a subject, also keyframe `transform.offset_x/offset_y`. For a snappier "whip"
punch, set the fcurve interpolation to `'BACK'`/`'ELASTIC'` on those keys.

## 5. Cuts & trims

Trim a strip without re-importing by moving its in/out points (`frame_final_start` / `frame_final_end`
are timeline frames; `frame_offset_start/end` trim from the source):

```python
clip.frame_offset_start = 15                # drop first 15 source frames
clip.frame_final_end = clip.frame_final_start + 150   # keep 5 s on the timeline
```

To split a strip at a playhead frame the ops way (needs a Sequencer context), prefer just creating two
trimmed strips from the same file via the data API — it's deterministic from the MCP.

## 6. Render to /mnt/f

Render the VSE to a Windows path (which is `/mnt/f/...` from WSL), matching the pipeline's encode so it
slots into the rest of the flow:

```python
r = scene.render
r.image_settings.file_format = 'FFMPEG'
r.ffmpeg.format = 'MPEG4'
r.ffmpeg.codec = 'H264'
r.ffmpeg.constant_rate_factor = 'HIGH'      # ~ crf 18-ish quality
r.ffmpeg.audio_codec = 'AAC'
r.ffmpeg.audio_bitrate = 192
r.filepath = r"F:\recordings\007\007_blender_cut.mp4"

scene.frame_start = 1
scene.frame_end = int(max(s.frame_final_end for s in se.sequences_all)) - 1
bpy.ops.render.render(animation=True)
```

The file appears at `/mnt/f/recordings/007/007_blender_cut.mp4` from WSL. For a quick check, render a
single still instead: set `scene.frame_set(<frame>)`, `file_format='PNG'`, and
`bpy.ops.render.render(write_still=True)`.

## How Claude invokes all of this

Claude writes the Python above and runs it with the MCP **`execute_blender_code`** tool. Build a reel
incrementally — one `execute_blender_code` call per step (setup → import clips → overlays → zoom →
render) — and call **`get_scene_info`** / **`get_viewport_screenshot`** between steps to confirm
state. Keep edits idempotent (clear the VSE in step 1) so re-running a step doesn't double up strips.

## Gotchas

- **Windows paths only**, backslash-escaped or raw strings — `/mnt/f/...` will silently fail to load.
- **Keep Blender open** with the addon **Connected**; the socket dies if you close Blender or hit
  Disconnect. Background (`blender -b`) mode won't serve the MCP.
- **One client at a time** — the addon serves a single socket connection.
- **Prefer the data API** (`se.sequences.new_movie/new_image/new_sound`, `strip.transform.*`) over
  `bpy.ops.sequencer.*`; ops need an area/region context override that isn't present when code runs
  from the MCP.
- `use_sequencer = True` or the render comes out as the empty 3D camera view, not your timeline.
- Auto-set `frame_final_duration` comes from the source file — don't hardcode clip lengths; read it back.

## Where this fits

This is an alternative/addition to the existing finishing step. The pipeline is:
[`youtube-transcript-analysis`] → [`vod-clip-extraction`] (cuts clips to `/mnt/f`) →
[`remotion-highlight-reel`] (hard-cut assembly + graphics) → **finish**. Today "finish" is DaVinci;
Blender VSE is a scriptable alternative — Claude can do the cuts/memes/zoom here in Python instead of
by hand. Companion docs: [`motion-graphics-guide.md`](motion-graphics-guide.md),
[`scripting-framework.md`](scripting-framework.md).
