# Amreet Aint — Growth Strategy (Hindi Horror Gameplay)

> Research deliverable, 2026-06-24. Sources: vidIQ (demand/breakout/saturation), Google Trends India,
> and web validation — all adversarially vetted. This is the canonical strategy doc; start future
> gaming-growth work here.

## TL;DR
A **855-sub Hindi/Hinglish** gaming channel grows fastest in the **Hindi horror-gameplay** lane — it's the
cleanest sub-1k breakout zone in India *and* the creator's proven format. Run a weekly **"Fresh Hindi Horror,
Har Hafte"** series. **Next video = Granny (newest version).** Backups and a day-one watchlist below.

## Why horror (lane decision)
Cross-validated by vidIQ outliers/keywords/trending + Google Trends India:
- **Proof of pattern:** the Indian horror game *Kamla* did **143k views on a 5.7k-sub channel**; *Barnik On
  Fire* did **71k on 1,170 subs**. Horror = high CTR (scary thumbnails), high retention (tension), fast
  iteration (a short horror game = 1–2 videos), and it fits the creator's commentary + facecam reactions.
- **Alternatives ruled out:** GTA-5 "Franklin+Shinchan mods" (off-brand kids/factory vibe), Minecraft Hindi
  (giant-owned: GamerFleet/Junkeyy/Karry Kraft), mobile-sim/hypercasual (faceless, no brand), FIFA WC eFootball
  (wrong format), GTA 6 (news/hype, not playable).
- Horror is **evergreen** in India (no seasonal trough now) with an **October/Halloween** upside to build toward.

## Exclusions (already covered — never re-pitch)
**Kamla, Maya: Ek Pishachini, Silent Hill F, Anant Express** (+ "This Indian Horror Game Actually Broke Me",
"Caught by Her at 3 AM"). Parked by data: **Thekku Island** (past-peak; Malayalam game; the Hindi "Thekku
Island" query is owned by a **Total Gaming 1M-view dub**; Google Trends India ≈ 0 Hindi search demand) and
**The Classrooms** (Google Trends India flat **0–1 for 3 months** — globally viral but no Hindi search lane).

## 🎯 Make-today flagship: GRANNY (newest version), in Hindi
- **Why it wins now:** on the 7-day **hourly** India window `granny game` = **97 (peak + sustained)** while
  `poppy playtime chapter 5` fades 60→18. Its India queries are **Hindi-native** — *"granny wala game",
  "granny ka game", "granny grandpa game"* — and all flagged **Breakout**. That's a real small-Hindi-channel
  lane, not a giant-owned English one.
- **Fit:** **solo**, PC + mobile, ~30-min escape loops → trivially cut to a tight **10 min**. Clean dupe
  (jumpscare-escape is a new genre for this channel vs its narrative horror). Refresh angle: the **newest
  version / current viral wave** (frequent updates; *Granny: Escape Together* coming to PS5/Xbox keeps it hot).
- **Packaging:** see [`videos/Granny/idea.md`](./videos/Granny/idea.md).

### Ranked alternatives
1. **Poppy Playtime: Chapter 5 — strong #2 this week.** Huge live India demand, but **giant-owned in English**
   (BeastBoyShub/Mythpat/Techno-Gamerz tier). Edge for a small channel = a **Hindi "ENDING explained" +
   facecam-reaction** angle on the new chapter, NOT an English full-playthrough. Solo, PC/PS5.
2. **Evergreen high-floor cluster — Granny / Grandpa / Eyes.** Durable peak-100 India demand, all-Breakout
   Hindi queries. Reliable views to rotate between flagships.
3. **Variety swing — a brand-new June-2026 solo release** (e.g. *Broken Lore: Follow*, PC/PS5). Freshest/lowest
   competition, fits the narrative-horror strength, but unproven India demand. **Avoid co-op** (Shift at
   Midnight, Meccha Chameleon) — the creator is solo.

### Day-one watchlist (wishlist now; publish within 24–72h of release in Hindi)
Being **first in Hindi** is what pulls (e.g. Thekku Island's day-one Malayalam creator got 936k). Since the
existing Indian-horror hits are done, the highest-ceiling move is to be the first authentic-Hindi creator on the
next **desi-horror** drop: **Occult Chambers** (UE5 Himalayan occult, PC+PS5), **Rakshasa** (Tantrik-vs-asura
RPG-horror), **MUKTI** (PS5 narrative, Sony India Hero Project), **Shutter Story** (photo/paranormal, Q3 2026).

## The repeatable engine — "Fresh Hindi Horror, Har Hafte"
1. **Source (Mon, ~30 min):** scan Steam India-dev curators, Steam "Horror + New Releases", India Games
   Showcase / Outlook Respawn. Keep the day-one watchlist wishlisted so a release = instant trigger.
2. **Pick (Mon):** top *uncovered-in-Hindi* item. Priority: **Indian-setting > rising-demand > short-runtime >
   giants-haven't-claimed-it.** Already done it? Drop a row — never blocked.
3. **Record (Tue):** one solo PS5/PC session, Hindi commentary, corner facecam; ≤2–3h games so one sitting =
   one video; perform the scariest moment for the cold open.
4. **Cut to 10 min (Wed):** `scripts/firstcut_fcpxml.py` (FCPXML → DaVinci). Keep cold-open + 4–6 reaction
   spikes + climax + ending; cut menus/backtracking/dead-air; reframe facecam-corner on big scares; merge beats
   ≤~90s apart.
5. **Package (Wed):** `[GAME] — [Hinglish hook] | Hindi Horror Game [emoji]`, face-vs-monster thumbnail
   (scared facecam + monster + 2–3 huge Hinglish words + dark/red palette), reuse the tag set.
6. **Publish + chain (Thu):** India evening **~6–9 PM IST, Fri/Sat**; pin a first comment; end-screen +
   "Indian Horror Games (Hindi)" playlist; verbally tease next week's title.

## Packaging principles (what wins for Hindi horror)
- **Lead the title with the GAME NAME + "Indian/Hindi Horror Game"** — generic "scary game hindi" has ~0
  search pull; named-game queries carry the volume. One end emoji (😱/😨/👻), one CAPS shock word, named entity.
- **Thumbnail = face-vs-monster:** big *scared facecam* (pulled large out of the in-game corner) on one third,
  the monster on the other, one bold Devanagari/Hinglish word, deep black + one hot red/orange accent. ≤3
  elements; readable at phone size.
- **Structure = cold-open first:** open on the scariest jumpscare + loudest real reaction (no intro); then a
  scare/reaction/new-question every ~90s; climax pays off the title; outro chains the next video.

## Verification (did the bet work?)
- **Before publishing:** `vidiq_score_title` + `vidiq_score_thumbnail` (cheap, high-leverage).
- **After ~7–14 days:** `vidiq_video_stats` / `vidiq_channel_analytics` — watch **impressions CTR**,
  **avg view %**, **Browse/Suggested vs Search** share, subs gained.
- **Success signal:** a video clearing ~**5–10k views** (vs ~400 baseline) with **CTR >4%** and **avg-view
  >40%** → repeat the format weekly; iterate the game per the engine.
- **vidIQ credits are limited** (~4 left this cycle; resets ~Jul 16, 5/call) — spend on title/thumbnail scoring
  + the post-mortem, not bulk discovery.
