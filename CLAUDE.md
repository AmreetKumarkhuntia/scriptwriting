# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a YouTube video research and scriptwriting workspace. Each video project lives in its own folder (e.g., `China takes over AI/`). The research and scripting methodology is documented in `docs/research-framework.md`.

## Available MCP Tools

The `.mcp.json` configures four servers for the research workflow:

- **youtube-transcript** — fetch transcripts from YouTube videos (use for sourcing interviews, documentaries, talks)
- **mcp-youtube** — search and retrieve YouTube metadata
- **playwright** — browser automation for scraping articles and verifying sources
- **tavily** — web search with citations; requires `TAVILY_API_KEY` set in `.mcp.json`

> Perplexity AI is preferred over raw LLM output for factual research because it shows citations. Use Tavily for the same reason when working within Claude Code.

## Research & Scripting Workflow

Follow `docs/research-framework.md` for the full process. The short version:

1. **5W1H (Kipling Method)** — generate research questions before searching anything: What, Who, When, Where, Why, How. Not all six matter equally for every topic.
2. **Research** — Google, Wikipedia, YouTube, books. Use Tavily/Perplexity for cited answers. Use Google Scholar / Consensus for scientific topics. Avoid Quora/Reddit as primary sources.
3. **Go deep** — horizontal logic (multiple angles at the same level) + vertical logic (drilling to root causes on the most important questions).
4. **Script structure**:
   - Hook: shocking stat, story, or teaser clip — goal is curiosity
   - Main content: basics first (What/When/Who), then surprising/deep angles
   - Only rabbit-hole on questions *central* to the video's core topic
   - Link points with transitions that raise the next question — not abrupt cuts

## Project Folder Convention

Each video idea gets its own directory. Place the following inside:
- `idea.md` — seed idea or premise
- `research.md` — sourced research notes with links
- `script.md` — final script draft

## Motion Graphics

Animated graphics for the videos are built in the **`remotion-all/`** Remotion project — one
folder per video under `remotion-all/src/<VideoName>/` (e.g. `src/China/`), with one composition
clip per script section. Follow `docs/motion-graphics-guide.md` for the structure, the reusable
component library, the Remotion gotchas, and the visual/craft design language. The generic
Remotion API knowledge lives in the `remotion-best-practices` skill.
