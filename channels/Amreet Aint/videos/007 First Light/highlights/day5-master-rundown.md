# 007 First Light — Day 5: Master Beat Rundown (full 8h scan)

**Source VOD:** https://www.youtube.com/live/9hpcQAZr8sk — "The Best Spy is here | 007 First Light day 5"
**Channel:** Amreet Aint · **Duration:** 08:03:10 · **Commentary:** Hindi/Hinglish (ASR garbles Hindi; the game's English cutscene dialogue transcribes cleanly and is what beats key off).
**Transcript:** `/tmp/yt_9hpcQAZr8sk.en-orig.vtt` (auto-ASR) → `/tmp/yt_9hpcQAZr8sk_clean.txt` (479 min-buckets).
**Status:** beat map drafted from per-minute scan + greps; exact in/out being refined cue-level (see `day5-cut-list.md`).

> Timestamps below are VOD-relative, minute-level (from the per-minute clean). The cut-list holds the cue-level-refined IN→OUT.

## Stream structure (the 8h has NO chapters; this is the reconstructed spine)

| VOD range | Arc | Keep? |
|---|---|---|
| 00:00 – ~00:50 | **Warmup:** a battle-royale game + viewer chatting ("teams/Revenant/elim/party"). Not 007. | **Trim entirely** |
| ~00:54 – ~03:13 | **Act 1 (London) — the Web HQ "Perch" raid** → ends on the Vietnam briefing / "Chapter eight" | **PART 1** |
| ~03:13 – ~08:01 | **Act 2 (Vietnam → finale)** — Pearl resort, villa, quantum core, android factory, SC9 boss, ending | **PART 2** |

## Split decision

**Split at "Chapter eight / We are in Vietnam" (~03:13).** Rationale: it's the only game-*announced* chapter boundary in the stream, it's a London→Vietnam location/act change, and it directly follows a mission-complete + M debrief + new-mission briefing — a textbook episode ending. It's the nearest genuine act break to the ~4h target (the next real break, the android factory, is ~05:29, much farther). Highlight runtime is controlled by editing, not source length, so the source imbalance (P1 ≈ 2h19m, P2 ≈ 4h48m) is fine — P2 simply trims more aggressively.
*Alternative considered:* split at the Hyperion/quantum-core reveal (~04:38, closer to 4h) — rejected because it splits the Vietnam "Chapter 8" across both videos and gives messier titles.

**Titles:** Part 1 = "The Web HQ Heist"; Part 2 = "The Final Mission" (working titles).

---

## PART 1 — The Web HQ Heist (London) [~00:54 → ~03:13]

| # | Beat (slug) | VOD min | Description | Type |
|---|---|---|---|---|
| 1 | setup_shutdown | ~00:54–00:58 | Greenway + Bond; Webb pressuring M ("Steven Bright will force M's hand"); the plan to break into Web HQ. Coffee banter: "your age group shouldn't break into a high-security building in the middle of the night." | story |
| 2 | infiltrate_perch | ~01:05–01:23 | Sneak in; "beware the sleeping guard"; "what's Web's endgame?"; "I bet 009 found out about something"; Damian Web's office; "the perch gate is right through here." | story |
| 3 | mole_reveal_plan | ~01:31–01:39 | "It's someone already inside… a simple mole"; meet the mystery woman ("we should really stop meeting like this — you blew my cover"); the plan: CCTV room, kill the feeds, command code. | story |
| 4 | basilisk_safe | ~01:43–01:51 | Q-tech locker; the memory-aid safe; "the command code is basilisk"; "you make a fine sidekick, James." | story |
| 5 | damian_4min_escape | ~01:51–01:56 | Damian walks in; eavesdrop via mic ("stay hidden, Damian will kill you as soon as look at you"); "you only have 4 minutes, you'll never make it"; bridge retracts, zipline, "Moneypenny, we're in." | story / action |
| 6 | faraday_codewipe | ~01:56–02:18 | "The place is a giant Faraday cage"; the code wipe; server rooms; lab-coat/"Ken Banks" gag; corporate mole Isa Vale. | story / funny |
| 7 | the_reveal | ~02:31–02:36 | **CLIMAX:** mission reports (Marley 2019, Karachi 2021, the Sarzin drone strike) → "we worked off false intel every time; Web covers it up; Damian fixes the narrative; they framed 009; London 2014, a lie from the start." Thea AI villain monologue: "1.35 million killed in car accidents… zero tolerance for machine error… Player is the smartest mind on the planet… it will attain perfection." | story |
| 8 | flightdeck_chopper | ~02:36–03:02 | Big escape gunfight to the flight deck; helicopter; the jump; Greenway "there is no we, bro… I'm out." | action |
| 9 | nullspace_debrief | ~03:03–03:09 | The "null space" secret room; M reveals Webb sent footage of the raid; arrest orders; "I'm sending you on a black op to collect irrefutable proof"; "go see Q." | story |
| 10 | vietnam_briefing | ~03:10–03:13 | Q briefing: Paul Marx / Caliban the terrorist; "Damian is in Vietnam to stage a copycat killing" → "We are in Vietnam. Chapter eight." (Part 1 closer / bridge to Part 2.) | story |

**Cold-open candidates (P1):** the Thea villain monologue ("Player will attain perfection") for an eerie hook, OR the "you only have 4 minutes, you'll never make it" bridge escape for action energy.

---

## PART 2 — The Final Mission (Vietnam → finale) [~03:13 → ~08:01]

| # | Beat (slug) | VOD min | Description | Type |
|---|---|---|---|---|
| 1 | vietnam_arrival | ~03:13–03:17 | "Chapter eight"; the pier; cover story ("Go Get It" courier company); the resort. | story |
| 2 | pearl_resort_ledger | ~03:17–03:43 | The Pearl / spa ("Tranquility Cave, organic cruelty-free"); "$1000 bourbon"; glasses calibrated to read the ledger → "find out who Web is here to kill." | story / funny |
| 3 | recon_prep | ~03:43–03:54 | QT tracks (Lora, Hernandez, White alive); "Damian's men 3.5 hours out"; "I've got some time to kill." | story |
| 4 | villa_assault_ellis | ~03:54–04:18 | Villa blueprints, roof entry; "go get the girl — they'll kill Ellis"; "you can't save them all / I could sure as hell try"; "full house down there"; the gunfight. | action / story |
| 5 | hyperion_core | ~04:38–05:08 | "Quantum entangled mirror computer"; "Hyperion is Thea's brother"; "the core is the magic key — destroy it and render the quantum cloud meaningless." Web's parents built it, turned to the Americans, "their plane never made it across the Atlantic." | story |
| 6 | recky_gadget | ~05:29–05:34 | Q's "Recky" recon robot ("equipped with detection sensors"). | story / funny |
| 7 | android_factory | ~05:34–05:53 | "Aria creation — a general-purpose android, masters any skill via machine learning"; kinetics-instructor cover (David Somerset); infiltrate the factory / security office. | story |
| 8 | centrifuge_core | ~06:29–06:44 | "Stop the centrifuge"; "electrostatic discharge in 3, 2, 1"; reach the core. | action |
| 9 | crisis_quote | ~06:44 | Villain: "I don't have to kill you to stop you… Was overthrowing the government always part of the plan? A last resort. Never let a good crisis go to waste." | story |
| 10 | hostage_firefight | ~06:56–07:06 | Sustained gunfight; hostages. | action |
| 11 | son_villain_reveal | ~07:15–07:17 | **CLIMAX:** "Universal exports"; "I was hoping you'd try and save the day — how do you like the new look?"; "my father dead, the truth out, my legacy gone — all except good old Thea… I had buyers lined up, each more unsavory than the last, all thanks to you"; "why does this guy look like Greenway?!" | story |
| 12 | flood_sc9_boss | ~07:27–07:54 | "Override 50%… 75%"; "you're flooding the tunnels, you'll kill everyone"; "enough water to turn MI6 underground into a fish tank"; sentry guns at sewer junctions; the SC9 boss; "did he have any last words?" | action |
| 13 | ending_returns | ~07:54–08:01 | Final confrontation ("you're going to stop me? No need"); credits: "it's not over — there's a part two. James Bond will return." | story |

**Cold-open candidates (P2):** the son-villain reveal ("how do you like the new look?") for intrigue, OR the flood-finale chaos ("you'll kill everyone — fish tank") for stakes.
