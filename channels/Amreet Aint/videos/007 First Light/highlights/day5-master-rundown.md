# 007 First Light — Day 5: Master Beat Rundown (full 8h scan)

**Source VOD:** https://www.youtube.com/live/9hpcQAZr8sk — "The Best Spy is here | 007 First Light day 5"
**Channel:** Amreet Aint · **Duration:** 08:03:10 · **Commentary:** Hindi/Hinglish (ASR garbles Hindi; the game's English cutscene dialogue transcribes cleanly and is what beats key off).
**Transcript:** `/tmp/yt_9hpcQAZr8sk.en-orig.vtt` (auto-ASR) → `/tmp/yt_9hpcQAZr8sk_clean.txt` (479 min-buckets).
**Status:** beat map drafted from per-minute scan + greps; exact in/out refined cue-level in the per-part cut lists (`day5 p1/cut-list.md`, `day5 p2/cut-list.md`).

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

> **Refined 2026-06-28 (full-coverage re-scan).** Combat is dialogue-sparse, so the v1 minute-scan under-counted fights. Re-scanned with the transcript **and** 30s contact sheets (HUD up = gameplay / HUD drop = cutscene); the full beat set below feeds the 35-clip v2 cut in `day5 p2/cut-list.md`.

| # | Beat (slug) | VOD time | Description | Type |
|---|---|---|---|---|
| 1 | vietnam_arrival | ~03:13–03:16 | "Chapter eight"; the pier; "Go Get It" courier cover; "Welcome to the Pearl." | story |
| 2 | pearl_ledger | ~03:16–03:18 | "$1000 bourbon"; glasses calibrated to read the ledger → "find out who Web is here to kill." | story / funny |
| 3 | recon_guests | ~03:19–03:31 | "Three profiles fit Caliban's MO" (Hernandez, Theresa Lorca, Ellis White); the mystery woman; social-stealth recon. | story |
| 4 | pearl_twist | ~03:43–03:54 | "Damian and his men are on their way"; **"It's not Damian — I've been tracking the wrong SUVs"** → the assault triggers. | story |
| 5 | villa_assault_ellis | ~03:54–04:08 | "Go get the girl — they'll kill Ellis"; **"you can't save them all / I could sure as hell try"**; rescue Ellis; villa firefight. | action / story |
| 6 | damian_confront | ~04:08–04:10 | "MI6 knows what you did… start running"; "Perfection? I'm the sod who gets his hands dirty"; **"you'll never defeat my father. Hyperion will see to that."** | story |
| 7 | villa_quarry_firefight | ~04:10–04:23 | "Damian's men moving in — get to cover"; extended firefight alongside Greenway ("Reloading", "hostile down"); "corner Damian, put him down." | action |
| 8 | greenway_death | ~04:23–04:24 | **"I'll hold them off. Go find Damian."** → **"Damn, bro. Greenway."** (Greenway down); "I'm taking care of Webb Jr." / "But I'm not." | story |
| 9 | damian_boss | ~04:24–04:30 | **BOSS — Damian (Webb Jr.):** "Come on, Damian. Do your worst"; synthetic-compound buff; golden mask + health-bar fight in a red-laser arena; "it's done. He's gone." | boss |
| 10 | mi6_interlude | ~04:30–04:37 | Damian defeated; Greenway aftermath; M briefing; **"THEIA is a complete scam. Webb lied to MI6 for more than a decade… destroying 009 and Greenway's lives."** | story |
| 11 | hyperion_core | ~04:37–04:41 | "Quantum entangled mirror computer"; "Hyperion is Thea's brother"; **"the core is the magic key."** Q gears Bond up. | story |
| 12 | isa_backstory | ~05:00–05:09 | Yacht flashback with Isa; "the quantum supercomputer… they got killed"; "their plane never made it across the Atlantic." | story |
| 13 | antarctica_arrival | ~04:50–05:09 | "THE BETRAYAL" chapter card; the ice/snow approach to Webb's **Antarctic** facility. | story |
| 14 | aria_factory | ~05:25–05:46 | "Wrecky" demolition robot ("make Wrecky demolish those"); "Aria — a general-purpose android, masters any skill"; kinetics-instructor cover (Somerset). | story / funny |
| 15 | factory_infiltration | ~05:37–05:50 | "Are we compromised?… we're not supposed to be here." Stealth → firefight inside the facility. | action |
| 16 | isa_encounter | ~05:50–05:53 | Isa Vale: "Sir Nicholas expects a debriefing"; "even Damian was never invited down here"; "Webb harnessed his son's worst impulses." | story |
| 17 | hyperion_chamber | ~06:05–06:09 | "At the heart of his operation"; "with Thea offline, Web's free to use his mirror computer"; **"James Bond is here — sound the alarm"**; "time to settle scores." | story |
| 18 | hyperion_firefight | ~06:09–06:20 | "Grenade down. Chase them — don't let up." Gunfight + level-two alert pushing to the core. | action |
| 19 | centrifuge_core | ~06:29–06:38 | "Got to stop the centrifuge"; "electrostatic discharge in 3, 2, 1"; the spinning centrifuge arena. *(MISSION FAILED retry at ~06:33 — avoid.)* | action |
| 20 | webb_core_crisis | ~06:43–06:46 | Golden Hyperion core. Webb: "I don't have to kill you to stop you"; **"never let a good crisis go to waste."** | story |
| 21 | webb_dead_betrayal | ~06:46–06:47 | **"Web's dead. I stopped the leak, but Isa stayed with the core. Send in the cavalry."** (Isa's betrayal — she takes Hyperion.) | story |
| 22 | ice_escape | ~06:47–06:52 | **A daring escape** — the ice-canyon sled/boat run + the helicopter; Isa (neck brace). | action |
| 23 | mi6_under_attack | ~06:53–07:00 | Back at MI6 HQ — red alert, the building is breached; "the hostiles are taking out the cameras." | action |
| 24 | hostage_firefight | ~07:01–07:09 | **"There are hostages here";** sustained firefight; the blue data-center push ("clear the room"). | action |
| 25 | qlab_setup | ~07:11–07:14 | "Secondary strike team breached through the tunnels in Q Lab"; "enter the core unarmed (magnetic shielding)." | story |
| 26 | son_villain_reveal | ~07:15–07:17 | **CLIMAX:** "Universal exports"; **"how do you like the new look?"**; "my legacy all gone, all except good old Thea… buyers lined up, each more unsavory than the last"; "why does this guy look like Greenway?!" | story |
| 27 | qlab_valhalla | ~07:18–07:20 | "Damian's only escape is through the tunnels"; **"We have the Valhalla. It's the only thing with enough firepower."** | story |
| 28 | last_stand | ~07:25–07:28 | "Intruder alert — emergency lockdown"; "override in progress — 50%… 75%"; grenades; "everyone get ready to clear out." | action |
| 29 | valhalla_chase | ~07:29–07:34 | **The Aston Martin Valhalla car chase** — reveal → on fire → night tunnel chase → "what a crazy car is this!" → the crash. | action |
| 30 | flood_warning | ~07:39–07:41 | "You're flooding the tunnels — you'll kill everyone"; "enough water to turn MI6 underground into a fish tank"; "a sentry gun should do it." | action / story |
| 31 | sewer_boss | ~07:41–07:54 | **FINAL BOSS — Damian (golden mask):** sentry guns at sewer junctions; shoot the explosive tubes. *(MISSION FAILED retry at ~07:52:30 — avoid; takedown cutscene starts 07:54:06.)* | boss |
| 32 | finale_takedown | ~07:54–07:58 | Boss takedown cutscene → confrontation → underwater finale → aftermath. | action / story |
| 33 | ending_returns | ~07:58–08:01 | The memorial; "Since I was the seventh recruit… 007."; credits: **"James Bond will return."** | story |

**Note on names:** the back half is canonically **Vietnam (Ch 8) → Antarctic android facility / Hyperion (Ch 9) → MI6 HQ finale (Ch 10)**. What the v1 notes called "SC9 boss" is the **golden-mask Damian** final boss in the flood/sewer. The villain reveal is **Damian (Webb Jr.)**; the mastermind is his father **Sir Nicholas Webb**; the AI is **THEIA** with its quantum twin **Hyperion**.

**Cold-open candidate (P2):** the son-villain reveal ("how do you like the new look?") — used as clip `01` (dup of #26).
