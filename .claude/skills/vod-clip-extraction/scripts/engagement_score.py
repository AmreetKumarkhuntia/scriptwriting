#!/usr/bin/env python3
"""engagement_score.py — a local, learned-free "hold score" for stacked
facecam-on-top / gameplay-below vertical clips (Amreet Aint's layout).

This is the Phase-0 validation scorer for the attention/engagement-prediction
plan. Instead of a heavy pretrained VLM (VideoLLaMA2/Qwen-VL — 7B, Baidu-hosted
checkpoints, ~16GB VRAM), it encodes the *same heuristics the human already
wrote down* in the Elden Ring `cut-list.md` as cheap signals from ffmpeg:

  positive  · facecam reaction-swing   — the face must visibly MOVE across the
                                          window (a flat facecam is the explicit
                                          "never include" warning sign)
            · game action + continuity  — continuous combat/motion, not dead time
            · audio energy + spikes      — shouting / reaction beats / hits
            · speech density             — words/sec from the .words.json ASR
  negative  · dead-air fraction          — bins that are BOTH still and quiet
                                           (menu / loading / idle traversal)

Everything runs off two ffmpeg pipes (downscaled gray rawvideo + mono PCM), so
the only dependency is numpy — already in this skill's .venv. No cv2, no torch.

Usage
-----
  # one clip -> JSON of features + composite + per-second curve
  python3 engagement_score.py --clip CLIP.mp4 [--words CLIP.mp4.words.json]

  # score a whole directory, rank, and (with --labels prefix) correlate the
  # score against the S/A tier encoded in the filename prefix (01..12 = S,
  # a01..a25 = A). Prints a ranked table + Spearman rho.
  python3 engagement_score.py --batch DIR [--labels prefix] [--out results.json]

The composite weights live in WEIGHTS below and mirror cut-list.md's stated
priorities (facecam swing + continuous action first, dead-air the hard killer).
"""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

# --- run under this skill's .venv (numpy), same trick as detect_seam.py -------
_VENV_DIR = Path(__file__).resolve().parent.parent / ".venv"
_VENV_PY = _VENV_DIR / "bin/python3"
if _VENV_PY.exists() and Path(sys.prefix).resolve() != _VENV_DIR.resolve():
    os.execv(str(_VENV_PY), [str(_VENV_PY), __file__, *sys.argv[1:]])

import numpy as np

# downscaled sampling grid — small is fine, we only measure motion/brightness
SAMPLE_W = 128
SAMPLE_H = 228          # ~1080x1920 aspect, forced (minor distortion is irrelevant)
SAMPLE_FPS = 5          # 5 frames/s -> 0.2s between motion samples
AUDIO_SR = 16000

# composite weights — TUNED in the Phase-0 kept-vs-rejected spike (36 kept clips
# vs 17 documented rejected windows). Audio energy + game motion carry the
# separation (per-feature z-sep +0.95 / +0.68); facecam swing/motion turned out
# useless (~0), so they're computed for diagnostics but weighted 0. Leading with
# audio+game lifted AUC(kept>rejected) 0.72 -> 0.79; audio alone hit 0.855 on
# this set but is fooled by loud loading/menu screens, so game motion stays in
# as a robustness term. See videos/Elden Ring/engagement-scoring-phase0.md.
WEIGHTS = {
    "facecam_swing": 0.0,    # diagnostic only — did not separate good from dead
    "facecam_motion": 0.0,
    "game_action": 0.32,     # gameplay-region motion (combat/action)
    "game_continuity": 0.10, # fraction of window that stays active (no dead middle)
    "audio_energy": 0.34,    # strongest signal: shouting / reactions / hits
    "audio_spikes": 0.10,
    "speech_density": 0.12,  # words/sec from words.json
    "dead_air": -0.42,       # BOTH still and quiet -> penalty
}


def _ffprobe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(out)


def _read_gray_frames(path):
    """Decode PATH to a (T, H, W) uint8 array of downscaled gray frames at SAMPLE_FPS."""
    proc = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path),
         "-vf", f"fps={SAMPLE_FPS},scale={SAMPLE_W}:{SAMPLE_H},format=gray",
         "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        capture_output=True, check=True,
    )
    buf = np.frombuffer(proc.stdout, dtype=np.uint8)
    n = buf.size // (SAMPLE_W * SAMPLE_H)
    return buf[: n * SAMPLE_W * SAMPLE_H].reshape(n, SAMPLE_H, SAMPLE_W)


def _read_audio_rms(path, n_bins):
    """Return per-second RMS (float array length n_bins), robust to no audio."""
    try:
        proc = subprocess.run(
            ["ffmpeg", "-v", "error", "-i", str(path), "-vn",
             "-ac", "1", "-ar", str(AUDIO_SR), "-f", "s16le", "-"],
            capture_output=True, check=True,
        )
        pcm = np.frombuffer(proc.stdout, dtype=np.int16).astype(np.float32) / 32768.0
    except subprocess.CalledProcessError:
        pcm = np.zeros(0, dtype=np.float32)
    rms = np.zeros(n_bins, dtype=np.float32)
    if pcm.size:
        per_bin = AUDIO_SR
        for b in range(n_bins):
            seg = pcm[b * per_bin:(b + 1) * per_bin]
            if seg.size:
                rms[b] = float(np.sqrt(np.mean(seg * seg)))
    return rms


_FACE_CASCADE = None


def _get_cascade():
    global _FACE_CASCADE
    if _FACE_CASCADE is None:
        import cv2
        _FACE_CASCADE = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    return _FACE_CASCADE


def _facecam_side(path, seam_ds):
    """Which band holds the facecam? The facecam always contains a face, so we
    run a Haar detector on a handful of higher-res frames and see whether faces
    land above or below the seam. Layout is NOT consistent across these VODs:
    some streams put the facecam on top, others on the bottom. Returns
    'top' or 'bottom' (defaults 'top' if no face is ever found)."""
    proc = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path),
         "-vf", "fps=1,scale=360:640,format=gray", "-frames:v", "14",
         "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        capture_output=True, check=True,
    )
    buf = np.frombuffer(proc.stdout, dtype=np.uint8)
    n = buf.size // (360 * 640)
    if n == 0:
        return "top"
    frames = buf[: n * 360 * 640].reshape(n, 640, 360)
    cascade = _get_cascade()
    seam_640 = seam_ds / SAMPLE_H * 640
    top_area = bot_area = 0.0
    for fr in frames:
        for (x, y, w, h) in cascade.detectMultiScale(fr, 1.2, 5, minSize=(48, 48)):
            if y + h / 2 < seam_640:
                top_area += w * h
            else:
                bot_area += w * h
    if top_area == 0 and bot_area == 0:
        return "top"
    return "top" if top_area >= bot_area else "bottom"


def _detect_seam(frames):
    """Row (in downscaled coords) of the facecam/gameplay seam.
    Same idea as gaming-clip-captions/detect_seam.py: sharpest row-to-row
    brightness discontinuity in the 25-65% vertical band, but averaged over
    ALL sampled frames for stability instead of a single frame."""
    mean_frame = frames.mean(axis=0)              # (H, W)
    row_means = mean_frame.mean(axis=1)           # (H,)
    diffs = np.abs(np.diff(row_means))
    lo, hi = int(SAMPLE_H * 0.25), int(SAMPLE_H * 0.65)
    return lo + int(np.argmax(diffs[lo:hi]))


def _bin_per_second(per_frame, n_bins, fps=SAMPLE_FPS):
    """Average a per-frame signal into per-second bins."""
    out = np.zeros(n_bins, dtype=np.float32)
    for b in range(n_bins):
        seg = per_frame[b * fps:(b + 1) * fps]
        if seg.size:
            out[b] = float(seg.mean())
    return out


def _speech_words_per_sec(words_path, duration):
    if not words_path or not Path(words_path).exists():
        return None
    try:
        words = json.loads(Path(words_path).read_text())
    except Exception:
        return None
    if not words:
        return 0.0
    return len(words) / max(duration, 1.0)


def extract_features(clip_path, words_path=None):
    """Return a dict of raw (un-normalized) per-clip features + per-second curves."""
    clip_path = str(clip_path)
    duration = _ffprobe_duration(clip_path)
    frames = _read_gray_frames(clip_path).astype(np.float32)
    if len(frames) < 2:
        raise RuntimeError(f"too few frames decoded from {clip_path}")
    n_bins = max(1, int(round(duration)))

    seam = _detect_seam(frames)
    side = _facecam_side(clip_path, seam)   # facecam layout varies per stream
    if side == "top":
        face, game = frames[:, :seam, :], frames[:, seam:, :]
    else:
        face, game = frames[:, seam:, :], frames[:, :seam, :]

    # per-frame-pair motion (mean abs diff), split by region
    face_mot = np.abs(np.diff(face, axis=0)).mean(axis=(1, 2))   # (T-1,)
    game_mot = np.abs(np.diff(game, axis=0)).mean(axis=(1, 2))
    face_bri = face.mean(axis=(1, 2))                            # (T,) brightness track

    face_mot_s = _bin_per_second(face_mot, n_bins)
    game_mot_s = _bin_per_second(game_mot, n_bins)
    face_bri_s = _bin_per_second(face_bri, n_bins)
    rms_s = _read_audio_rms(clip_path, n_bins)

    # ---- strip a trailing FROZEN end-card (the "SUBSCRIBE" freeze-frame the
    # captions skill appends). Trim only bins that are essentially motionless
    # (< 1% of the clip's 90th-pct motion) at the very end — calm-walk filler
    # still has motion and is intentionally kept so it drags the score down.
    total_mot = face_mot_s + game_mot_s
    if total_mot.max() > 0:
        frozen = total_mot < 0.01 * np.percentile(total_mot, 90)
        keep = n_bins
        while keep > 1 and frozen[keep - 1]:
            keep -= 1
        if keep < n_bins:
            face_mot_s, game_mot_s = face_mot_s[:keep], game_mot_s[:keep]
            face_bri_s, rms_s = face_bri_s[:keep], rms_s[:keep]
            n_bins = keep

    # ---- scalar features -----------------------------------------------------
    # facecam reaction SWING: how much the facecam changes over the window.
    # combine temporal spread of facecam motion and of facecam brightness
    # (both rise when the streamer actually reacts vs. sits frozen).
    facecam_swing = float(np.std(face_mot_s) + 0.5 * np.std(face_bri_s))
    facecam_motion = float(np.mean(face_mot_s))
    game_action = float(np.mean(game_mot_s))

    # continuity: fraction of seconds where the game region is meaningfully
    # active (>= 40% of this clip's own active level). Punishes a real beat
    # buried in a mostly-dead window (the pass-2 failure mode in cut-list.md).
    active_ref = np.percentile(game_mot_s, 75) if game_mot_s.size else 0.0
    game_continuity = float(np.mean(game_mot_s >= 0.4 * active_ref)) if active_ref > 0 else 0.0

    audio_energy = float(np.mean(rms_s))
    # spikes: reaction beats / hits — bins loud relative to this clip's own base
    if rms_s.size and rms_s.std() > 0:
        thresh = rms_s.mean() + 1.5 * rms_s.std()
        audio_spikes = float(np.mean(rms_s > thresh))
    else:
        audio_spikes = 0.0

    speech = _speech_words_per_sec(words_path, duration)

    # ---- dead-air fraction: seconds that are BOTH still and quiet -------------
    game_lo = game_mot_s < (0.25 * (np.median(game_mot_s) + 1e-6))
    face_lo = face_mot_s < (0.25 * (np.median(face_mot_s) + 1e-6))
    rms_lo = rms_s < (0.4 * (np.median(rms_s) + 1e-9))
    dead_air = float(np.mean((game_lo & face_lo) | (game_lo & rms_lo)))

    # per-second composite curve (fixed-scale, for the hook/sliding-window view)
    curve = (
        _norm(face_mot_s) * 0.35
        + _norm(game_mot_s) * 0.35
        + _norm(rms_s) * 0.30
    ).tolist()

    return {
        "clip": Path(clip_path).name,
        "duration": round(duration, 2),
        "seam_row_ds": seam,
        "facecam_side": side,
        "features": {
            "facecam_swing": facecam_swing,
            "facecam_motion": facecam_motion,
            "game_action": game_action,
            "game_continuity": game_continuity,
            "audio_energy": audio_energy,
            "audio_spikes": audio_spikes,
            "speech_density": speech if speech is not None else 0.0,
            "dead_air": dead_air,
        },
        "has_speech": speech is not None,
        "curve": curve,
    }


def _norm(x):
    x = np.asarray(x, dtype=np.float32)
    rng = x.max() - x.min()
    return (x - x.min()) / rng if rng > 1e-9 else np.zeros_like(x)


# ---------- cross-clip normalization + composite (batch mode) -----------------
def _zscore(vals):
    v = np.asarray(vals, dtype=np.float64)
    sd = v.std()
    return (v - v.mean()) / sd if sd > 1e-9 else np.zeros_like(v)


def composite_scores(records):
    """Given a list of extract_features() dicts, z-score each feature across the
    batch and combine with WEIGHTS. Returns list of (record, composite)."""
    keys = list(WEIGHTS.keys())
    cols = {k: _zscore([r["features"][k] for r in records]) for k in keys}
    scores = np.zeros(len(records))
    for k in keys:
        scores += WEIGHTS[k] * cols[k]
    return list(zip(records, scores.tolist()))


def spearman(a, b):
    """Spearman rank correlation without scipy."""
    a = np.asarray(a, dtype=np.float64)
    b = np.asarray(b, dtype=np.float64)
    ra, rb = _rankdata(a), _rankdata(b)
    ra, rb = ra - ra.mean(), rb - rb.mean()
    denom = np.sqrt((ra * ra).sum() * (rb * rb).sum())
    return float((ra * rb).sum() / denom) if denom > 0 else 0.0


def _rankdata(x):
    order = np.argsort(x, kind="mergesort")
    ranks = np.empty(len(x), dtype=np.float64)
    ranks[order] = np.arange(1, len(x) + 1)
    # average ties
    _, inv, counts = np.unique(x, return_inverse=True, return_counts=True)
    sums = np.zeros(len(counts))
    np.add.at(sums, inv, ranks)
    return (sums / counts)[inv]


def _tier_from_name(name):
    """01.._12 -> S (2), a01..a25 -> A (1). None if unlabeled."""
    stem = Path(name).name
    if stem[:1].lower() == "a" and stem[1:2].isdigit():
        return ("A", 1)
    if stem[:2].isdigit():
        return ("S", 2)
    return (None, None)


def run_batch(clip_dir, labels, out_path):
    clip_dir = Path(clip_dir)
    clips = sorted(p for p in clip_dir.iterdir()
                   if p.suffix.lower() in (".mp4", ".mkv", ".mov", ".webm"))
    if not clips:
        sys.exit(f"no video files in {clip_dir}")
    records = []
    for p in clips:
        words = _find_words(p)
        try:
            rec = extract_features(p, words)
        except Exception as e:
            print(f"  !! skip {p.name}: {e}", file=sys.stderr)
            continue
        tier, tval = _tier_from_name(p.name)
        rec["tier"], rec["tier_val"] = tier, tval
        records.append(rec)
        print(f"  scored {p.name}  (seam={rec['seam_row_ds']}, dur={rec['duration']}s)",
              file=sys.stderr)

    scored = composite_scores(records)
    scored.sort(key=lambda rs: rs[1], reverse=True)

    print("\n rank  score   tier  dead  fcSwing  gameAct  audio  clip")
    print(" " + "-" * 78)
    for i, (r, s) in enumerate(scored, 1):
        f = r["features"]
        print(f" {i:>3}  {s:+6.2f}   {r['tier'] or '-':>2}   "
              f"{f['dead_air']:.2f}   {f['facecam_swing']:6.2f}  "
              f"{f['game_action']:6.2f}  {f['audio_energy']:.3f}  {r['clip']}")

    # Spearman vs tier, if labeled
    if labels == "prefix":
        pairs = [(s, r["tier_val"]) for r, s in scored if r["tier_val"] is not None]
        if len(pairs) >= 4:
            rho = spearman([p[0] for p in pairs], [p[1] for p in pairs])
            n_s = sum(1 for _, t in pairs if t == 2)
            n_a = sum(1 for _, t in pairs if t == 1)
            s_mean = np.mean([sc for sc, t in pairs if t == 2])
            a_mean = np.mean([sc for sc, t in pairs if t == 1])
            print(f"\n Spearman(score, tier)  = {rho:+.3f}   "
                  f"(n={len(pairs)}: {n_s} S, {n_a} A)")
            print(f" mean score  S={s_mean:+.2f}  A={a_mean:+.2f}  "
                  f"(gap {s_mean - a_mean:+.2f})")

    if out_path:
        Path(out_path).write_text(json.dumps(
            [{"clip": r["clip"], "tier": r["tier"], "composite": s,
              "features": r["features"], "duration": r["duration"]}
             for r, s in scored], indent=2))
        print(f"\n wrote {out_path}", file=sys.stderr)
    return scored


def _find_words(clip_path):
    """words.json lives next to the clip or in a sibling raw/ dir."""
    p = Path(clip_path)
    for cand in (p.with_suffix(p.suffix + ".words.json"),
                 p.parent.parent / "raw" / (p.name + ".words.json")):
        if cand.exists():
            return str(cand)
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--clip", help="score a single clip")
    ap.add_argument("--words", help="path to the .words.json (default: auto-discover)")
    ap.add_argument("--batch", help="score every .mp4 in this directory")
    ap.add_argument("--labels", choices=["prefix"], help="derive S/A tier from filename to correlate")
    ap.add_argument("--out", help="write batch results JSON here")
    args = ap.parse_args()

    if args.batch:
        run_batch(args.batch, args.labels, args.out)
    elif args.clip:
        words = args.words or _find_words(args.clip)
        rec = extract_features(args.clip, words)
        print(json.dumps(rec, indent=2))
    else:
        ap.error("pass --clip or --batch")


if __name__ == "__main__":
    main()
