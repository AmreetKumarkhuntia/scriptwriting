#!/usr/bin/env python3
"""GPU-accelerated persistent hook badge — the fast replacement for the Remotion
banner pass.

Remotion can't touch the GPU on this WSL box (Chrome is software-only here, and
Remotion never GPU-encodes on Linux anyway), so every banner render was CPU-bound
at ~1 min/clip. This does the same overlay in two cheap steps:

  1. Render the badge once as a transparent PNG with Pillow — a tilted black
     rounded box with gold Impact text and a soft drop shadow, matching the
     approved Remotion design (font matches the burned-in captions too).
  2. Composite it onto the clip with ffmpeg's h264_nvenc hardware encoder — the
     5070's dedicated NVENC chip, which works over CUDA in WSL. Seconds/clip.

The badge fades in at the start and fades out just before the subscribe end-card
so it never covers the CTA. Bottom edge sits on the facecam/gameplay seam, so it
clears the face (above) and the word-captions (below).

Usage:
  python3 badge_nvenc.py CLIP.mp4 OUT.mp4 --hook "TEXT" --seam 731 \
      [--endcard 3.0] [--tilt 6] [--fontsize 44]
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = "/mnt/d/Thumbnails/Thumbnail making/FONTS/impact.ttf"  # same as captions
GOLD = (255, 210, 63, 255)      # #FFD23F
BOX_RGBA = (0, 0, 0, 209)       # rgba(0,0,0,0.82)
PAD_X, PAD_Y = 30, 14
RADIUS = 12
TRACK = 2                       # letter spacing (px) ~ Remotion letterSpacing 1.5
MAXW = 960                      # Remotion maxWidth; shrink font if text exceeds

# ffmpeg with NVENC (BtbN static build) + the WSL driver's encode lib.
FF = os.environ.get("FF_NVENC", "/mnt/e/tools/ffmpeg-nvenc/ffmpeg")
WSL_LIB = "/usr/lib/wsl/lib"


def text_size(draw, text, font):
    """Width/height of the tracked (letter-spaced) uppercase text."""
    w = 0
    h = 0
    for ch in text:
        bbox = draw.textbbox((0, 0), ch, font=font)
        w += (bbox[2] - bbox[0]) + TRACK
        h = max(h, bbox[3] - bbox[1])
    return max(0, w - TRACK), h


def draw_tracked(draw, xy, text, font, fill):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        bbox = draw.textbbox((0, 0), ch, font=font)
        x += (bbox[2] - bbox[0]) + TRACK


def make_badge(hook, tilt, fontsize):
    """Render the badge sprite (RGBA, tight-ish) with drop shadow, then tilt it."""
    hook = hook.upper()
    probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    # shrink to fit maxwidth
    fs = fontsize
    while fs > 22:
        font = ImageFont.truetype(FONT, fs)
        tw, th = text_size(probe, hook, font)
        if tw <= MAXW - 2 * PAD_X:
            break
        fs -= 2
    font = ImageFont.truetype(FONT, fs)
    tw, th = text_size(probe, hook, font)

    # Impact metrics: give generous vertical room so descenders/caps aren't clipped.
    asc, desc = font.getmetrics()
    box_w = tw + 2 * PAD_X
    box_h = asc + desc + 2 * PAD_Y

    # sprite has margin for the drop shadow (offset y=6, blur 18)
    m = 40
    sprite = Image.new("RGBA", (box_w + 2 * m, box_h + 2 * m), (0, 0, 0, 0))

    # drop shadow: blurred black rounded rect, offset down 6px, 55% alpha
    shadow = Image.new("RGBA", sprite.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([m, m + 6, m + box_w, m + box_h + 6], radius=RADIUS,
                         fill=(0, 0, 0, 140))
    shadow = shadow.filter(ImageFilter.GaussianBlur(9))
    sprite.alpha_composite(shadow)

    # the box
    d = ImageDraw.Draw(sprite)
    d.rounded_rectangle([m, m, m + box_w, m + box_h], radius=RADIUS, fill=BOX_RGBA)

    # text: subtle shadow (0 2px 4px) then gold
    tx = m + PAD_X
    ty = m + PAD_Y
    draw_tracked(d, (tx + 1, ty + 2), hook, font, (0, 0, 0, 200))
    draw_tracked(d, (tx, ty), hook, font, GOLD)

    if tilt:
        # CSS rotate(-6deg) == counter-clockwise == PIL positive angle
        sprite = sprite.rotate(tilt, expand=True, resample=Image.BICUBIC)
    return sprite


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip")
    ap.add_argument("out")
    ap.add_argument("--hook", required=True)
    ap.add_argument("--seam", type=int, required=True)
    ap.add_argument("--endcard", type=float, default=3.0,
                    help="seconds of subscribe end-card at the tail (badge fades before it)")
    ap.add_argument("--tilt", type=float, default=6.0)
    ap.add_argument("--fontsize", type=int, default=44)
    ap.add_argument("--cq", type=int, default=21)
    args = ap.parse_args()

    W, H = 1080, 1920
    badge = make_badge(args.hook, args.tilt, args.fontsize)

    # place on full-frame transparent canvas: centered x, bottom edge on the seam
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bx = (W - badge.width) // 2
    by = args.seam - badge.height
    canvas.alpha_composite(badge, (bx, max(0, by)))
    png = Path(args.out).with_suffix(".badge.png")
    canvas.save(png)

    dur = float(subprocess.run(
        [str(Path(FF).with_name("ffprobe")), "-v", "error", "-show_entries",
         "format=duration", "-of", "csv=p=0", args.clip],
        capture_output=True, text=True, env=_env()).stdout.strip())
    fade_out = max(0.5, dur - args.endcard - 0.4)

    # The badge is a single PNG. It MUST be looped into a real 30fps stream, or
    # fade=in:st=0 collapses the lone t=0 frame to alpha 0 and overlay repeats
    # that transparent frame for the whole clip (badge never shows).
    fc = (
        f"[1:v]format=rgba,fade=in:st=0:d=0.4:alpha=1,"
        f"fade=out:st={fade_out:.3f}:d=0.4:alpha=1[ov];"
        f"[0:v][ov]overlay=0:0:shortest=1[v]"
    )
    cmd = [FF, "-y", "-i", args.clip,
           "-loop", "1", "-framerate", "30", "-t", f"{dur:.3f}", "-i", str(png),
           "-filter_complex", fc, "-map", "[v]", "-map", "0:a?",
           "-c:v", "h264_nvenc", "-preset", "p6", "-tune", "hq",
           "-rc", "vbr", "-cq", str(args.cq), "-b:v", "0",
           "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart",
           args.out]
    r = subprocess.run(cmd, capture_output=True, text=True, env=_env())
    if r.returncode != 0:
        print(r.stderr[-2500:], file=sys.stderr)
        raise SystemExit(f"nvenc overlay failed (exit {r.returncode})")
    png.unlink(missing_ok=True)
    print(f"[badge-nvenc] {args.out} (fontsize fit, fade_out={fade_out:.1f}s)")


def _env():
    e = dict(os.environ)
    e["LD_LIBRARY_PATH"] = WSL_LIB + ":" + e.get("LD_LIBRARY_PATH", "")
    return e


if __name__ == "__main__":
    main()
