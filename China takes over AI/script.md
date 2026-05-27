# TITLE: China Just Took Over AI

## COLD OPEN (0:00–0:30)

**VISUALS:**
OpenAI logo. Anthropic logo. Google Gemini logo.
Hard cut to OpenRouter rankings filled with Chinese models.
Fast zooms. Token graphs. Pricing comparisons.

**SCRIPT:**

Last month, something strange happened in AI.

According to OpenRouter's token consumption rankings, the six most-used AI models in the world — for an entire week — were all made in China. The week of March 30th to April 5th, 2026.

Not OpenAI.
Not Google.
Not Anthropic.

All six.

And the number one model by usage — MiniMax M2.5 — costs around thirty cents per million tokens.

GPT-5.5 costs five dollars.

Sometimes seventeen times cheaper.

Sometimes fifty.

And almost nobody noticed.

**[TITLE CARD]**
*China Just Took Over AI*

---

## INTRO (0:30–1:15)

**SCRIPT:**

Today we're looking at how Chinese AI models became the most-used AI on the planet.

And not by a little.

For the last three years, the story of AI has been simple.

OpenAI leads. Anthropic is close. Google has the infrastructure.

That's what most people still believe.

But the data tells a completely different story.

In Q1 2026, Chinese models crossed 61% of all global token consumption as per openrouter.

The world may have already switched.

Most engineers just haven't checked.

So in this video, we'll break down five things: the numbers that prove it already happened, who's behind it, why they went open-source, how fast the shift spread, and the part that should actually alarm you.

---

# SECTION 1 — THE NUMBERS (1:15–3:00)

**VISUALS:**
OpenRouter charts climbing. Pricing comparison tables. Cursor IDE. Autonomous coding agents. Token meters rapidly increasing.

**SCRIPT:**

Let's start with what actually changed.

For years, the AI industry ran on one basic assumption:

The smartest model wins.

And for a while, that was true.

But then AI stopped being a chatbot…

…and became infrastructure.

Coding agents. Autonomous workflows. Background reasoning systems.

These systems don't send one prompt at a time.

They make thousands of model calls every single day.

And the moment that happened, pricing became everything.

Because if your product runs forty thousand AI calls daily…

a small price difference becomes enormous.

Suddenly developers weren't asking:

> "What's the absolute best model?"

They were asking:

> "What's good enough at scale?"

And here's what that looks like in practice.

MiniMax M2.5 scores 80.2% on SWE-Bench Verified.

GPT-5.5 scores 88.7%.

That's an eight-point gap.

But MiniMax costs thirty cents per million tokens.

GPT-5.5 costs five dollars.

Seventeen times more — for eight percentage points.

And it gets wilder.

DeepSeek V4 Flash costs fourteen cents.

Step 3.5 Flash costs ten cents.

Qwen3 Coder costs ten cents — that's fifty times cheaper than GPT-5.5.

For agentic workloads where you're making thousands of calls a day, the math becomes impossible to ignore.

And this wasn't one lab having a breakout quarter.

Eight different Chinese labs hit the global market in the same twelve-month window.

All making the exact same strategic choice.

So who are they?

---

# SECTION 2 — THE PLAYERS (3:00–4:45)

**VISUALS:**
Lab logos appearing one by one. Map of China with location pins. Funding graphics. Model benchmark scoreboards.

**SCRIPT:**

This is the part that makes the shift feel real.

Because this isn't just DeepSeek.

It's an entire ecosystem.

DeepSeek is based in Hangzhou. It's funded by a quantitative hedge fund called High-Flyer Capital — not a tech giant, not the government. A quant fund. Their V4 Pro model matches Google's Gemini 3.1 Pro on SWE-Bench at a fraction of the cost.

Moonshot AI is a VC-backed startup in Beijing. Their model Kimi K2.6 was the first open-weight model to beat GPT-5.4 on coding benchmarks. It handles two million tokens of context.

Zhipu — also known as Z.ai — IPO'd on the Hong Kong Stock Exchange in January 2026. Their GLM-5.1 runs on eight H100 GPUs and ships under an MIT license. It beat Claude Opus 4.6 on coding.

MiniMax, based in Shanghai, had the single most-used model on OpenRouter for an entire week. 4.55 trillion tokens in seven days.

ByteDance — the company behind TikTok — launched Doubao Seed 2.0. Multimodal. Text, image, video, voice. Eleven cents per million tokens.

Alibaba's Qwen3.7 Max hit number three on SWE-Bench Pro — the harder, contamination-free benchmark — at thirty-eight cents. Thirteen times cheaper than Claude Opus 4.7.

StepFun's Step 3.5 Flash costs ten cents per million tokens. Fifty times cheaper than GPT-5.5.

And Baidu's ERNIE 5.0 targets enterprise cloud.

Eight labs. Different backers. Different cities. Different specialties.

And every single one made the same choice: release open weights.

That's not a coincidence.

That's a strategy.

But giving away models that cost hundreds of millions to train sounds almost irrational.

So why did they do it?

---

# SECTION 3 — THE OPEN-SOURCE STRATEGY (4:45–6:30)

**VISUALS:**
GitHub repositories exploding. HuggingFace pages. Open-source communities. Fork counts increasing.

**SCRIPT:**

Because American AI companies mostly treated their models like products.

Chinese labs treated them like ecosystems.

And that difference changed everything.

Here's how it works.

You release open weights. Not small research demos — actual competitive models developers can immediately build on top of.

Then every developer who fine-tunes your model…

every startup building on top of it…

every researcher stress-testing it…

makes your ecosystem stronger.

The entire world effectively becomes part of your optimization process.

Western labs spend massive amounts on evaluation and red-teaming.

Chinese labs outsourced that process to millions of developers globally.

For free.

And the results compounded extremely fast.

Over 113,000 Qwen derivatives appeared on HuggingFace alone — more than Google and Meta combined.

Entire startups started building directly on top of Chinese foundation models.

And once developers integrate a model deeply into their workflow…

switching becomes painful.

Which means the real battle isn't just about having the smartest AI anymore.

It's about becoming the default layer everyone builds on top of.

And right now, China is winning that battle.

But strategy only matters if it moves the market.

So did it actually work?

---

# SECTION 4 — THE PROOF (6:30–8:00)

**VISUALS:**
OpenRouter charts climbing. HuggingFace download counters. Usage graphs going vertical.

**SCRIPT:**

The numbers are hard to argue with.

Chinese models now have 61% of all global token consumption on OpenRouter.

Real developers. Real production workloads. Real money.

Year-over-year growth: 12.7 times.

And here's the number that explains exactly why it compounded so fast.

In January 2025, programming made up 11% of all AI usage on OpenRouter.

By 2026: over 50%.

Coding agents. Autonomous workflows. Background AI systems.

The exact workloads where volume is massive and price is everything.

That's the shift. The moment AI became infrastructure, price became the deciding factor. And Chinese models were already there.

On HuggingFace — where developers actually download and build on foundation models — 41% of all downloads are now Chinese.

US models: 36.5%.

Chinese models have already overtaken American models by downloads.

That's not a trend that's coming.

That already happened.

And for any startup or engineer, this all sounds like great news.

Cheap. Open. Powerful.

But there's something in this picture that almost nobody's talking about.

---

# SECTION 5 — THE PART NOBODY WANTS TO TALK ABOUT (8:00–9:30)

**VISUALS:**
Dark cinematic shots. Global infrastructure graphics. Neural networks overlaying world maps.

**SCRIPT:**

Now to be clear —

this doesn't mean Chinese AI models are secretly evil.

And it doesn't mean developers should stop using them.

A lot of these systems are genuinely impressive.

That's exactly why adoption is growing so fast.

But the deeper question is this:

What happens when global AI infrastructure increasingly depends on models controlled by companies operating under a completely different political and regulatory system?

Because infrastructure shapes behavior.

Invisible defaults matter.

Alignment choices matter.

What gets filtered matters.

What assumptions models are trained on matters.

And once millions of applications build on top of a foundation layer…

Qwen already has 113,000 derivative models on HuggingFace.

Every one of those is a product, a tool, an agent — built on a Chinese foundation.

With Chinese defaults baked in.

Those decisions start spreading everywhere.

Quietly.

At scale.

That's why some people compare this moment to the Huawei 5G debate.

Not because the technologies are identical…

…but because the concern is similar.

What happens when critical infrastructure depends on systems built somewhere else?

Except this time…

the infrastructure isn't telecommunications.

It's intelligence itself.

---

# ENDING (9:30–10:15)

**VISUALS:**
Montage of AI labs, datacenters, developers coding, neural-network visuals slowly fading to black.

**SCRIPT:**

So let's pull back for a second.

Chinese AI didn't suddenly become smarter than everyone else.

On the absolute frontier, Claude Mythos and GPT-5.5 still lead.

But that's not the game that mattered.

The game that mattered was becoming the default — the cheapest layer, the open layer, the foundation the rest of the world quietly builds on.

And eight labs, in the same twelve-month window, all made the same bet.

Open weights. Aggressive pricing. Global distribution.

That week in April — when all six of the most-used AI models in the world were Chinese — wasn't an anomaly.

It was a signal.

The question isn't whether to use these models — plenty of engineers already are.

The question is whether you know what you're building on.

If you want to go deeper on any of these models, I've linked the full benchmark and pricing data in the description.

**[FADE OUT]**
