# Granny — cut list (fill after recording)

Watchback pass: scrub the raw session and timestamp every scare / loud reaction / near-catch / death.
Those are the ONLY keepers. Then assign them to the beat slots below and feed a beats manifest to
`scripts/firstcut_fcpxml.py` (see `../007 First Light/highlights/day4-firstcut.beats.json` for the shape).

| Beat | Target time | Raw VOD in–out | Note / why it stays | Zoom-to-face? |
|---|---|---|---|---|
| Cold open (scariest scare) | 0:00–0:15 | `__:__ – __:__` | the loudest scream of the run | yes |
| Hook (VO over b-roll) | 0:15–0:40 | — | "akela, raat ko, 5 din me bachna hai" | — |
| Setup (locked in + goal) | 0:40–1:30 | `__:__ – __:__` | first creak / near-miss | — |
| Beat 1 | ~1:30 | `__:__ – __:__` | scare/near-catch → tease next | on appearance |
| Beat 2 | ~3:00 | `__:__ – __:__` |  | on appearance |
| Beat 3 | ~4:30 | `__:__ – __:__` |  | on appearance |
| Beat 4 | ~6:00 | `__:__ – __:__` |  | on appearance |
| Beat 5 (optional) | ~7:30 | `__:__ – __:__` |  | on appearance |
| Climax (escape / death) | 8:30–9:30 | `__:__ – __:__` | the title payoff | yes |
| CTA + chain | 9:30–10:00 | — | tease next week's horror game | — |

**Cut rules:** drop all menus, backtracking, empty-room wandering, repeated deaths; merge beats ≤~90s apart;
cut on complete scene/dialogue boundaries; a scare/reaction/new-question every ~90s. Target final length 8–12 min.

**Media:** raw VOD + extracted clips live on `/mnt/f` (F: drive). Export manifest `windows_dir` accordingly.
