# Channels

This workspace produces videos for **two separate YouTube channels**. Each channel has its own folder
here with a `channel.md` (identity + strategy) and a `videos/` directory holding one folder per video
project. Keeping the two channels separate keeps the audience signal clean for the algorithm.

| Channel | Folder | Niche | Language | Notes |
|---|---|---|---|---|
| **Amreet Talks** | [`Amreet Talks/`](./Amreet%20Talks/channel.md) | AI / tech business & strategy explainers | English (some Hindi) | Faceless, motion-graphics (Remotion). ~3 subs, restarting. |
| **Amreet Aint** | [`Amreet Aint/`](./Amreet%20Aint/channel.md) | Gaming — cinematic story + **Hindi horror** | Hindi / Hinglish | Facecam-in-corner, PS5+PC. ~855 subs. Growth plan: [`growth-strategy.md`](./Amreet%20Aint/growth-strategy.md). |

## Repo map
- `channels/<Channel>/videos/<Video>/` — per-video research/script/cut docs (see each channel's convention).
- `docs/` — shared frameworks: `research-framework.md`, `scripting-framework.md`,
  `motion-graphics-guide.md`, `blender-video-editing.md`.
- `remotion-all/src/<VideoName>/` — motion-graphics compositions (Amreet Talks). Independent of the
  `channels/.../videos/` paths.
- `scripts/firstcut_fcpxml.py` — turns a beat manifest into an editable DaVinci FCPXML first cut (gaming).
- Media (VODs/clips/renders) live on the Windows **F: drive** (`/mnt/f`), not in the repo.
