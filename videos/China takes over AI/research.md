# Research: China Takes Over AI

*Last updated: May 2026. Verify live pricing at artificialanalysis.ai before scripting.*

---

## Market Dominance Stats

| Metric | Figure | Source | Date |
|--------|--------|--------|------|
| Chinese models' share of global token consumption (OpenRouter) | **61%** | dataconomy.com | Feb–Mar 2026 |
| Top models by global token usage (week Mar 30–Apr 5) | **All top 6 Chinese** | people.cn / cgtn.com | Apr 2026 |
| Chinese models' share of Hugging Face downloads | **41%** (vs 36.5% US) | HF Spring 2026 report | Feb 2026 |
| OpenRouter weekly token consumption total | **12.1T tokens/week** | aicost.org | Apr 2026 |
| YoY growth in OpenRouter token consumption | **12.7x** | aicost.org | Apr 2026 |
| MiniMax M2.5 single-week token consumption | **~4.55T tokens** | aicost.org | Apr 2026 |
| Kimi K2.5 single-week token consumption | **~4.02T tokens** | aicost.org | Apr 2026 |
| Programming share of OpenRouter token usage | **>50%** (was 11% in Jan 2025) | OpenRouter State of AI | 2026 |
| Qwen derivative models on Hugging Face | **113,000+** | HF Spring 2026 report | 2026 |

---

## Chinese Model Roster (Mid-2026)

| Model | Lab | Release | Price (input / output per M tokens) | Key Benchmark | Notes |
|-------|-----|---------|--------------------------------------|---------------|-------|
| **DeepSeek V4 Pro** | DeepSeek | 2026 | $0.28 / $2.48 | 80.6% SWE-Bench Verified | 1.6T params / 49B active; 1M context |
| **DeepSeek V4 Flash** | DeepSeek | 2026 | $0.14 / $0.28 | — | Budget-tier; lowest-cost Chinese frontier |
| **DeepSeek V3.2** | DeepSeek | 2026 | $0.028–$0.28 (cached) | ~90% HumanEval | Workhorse price/perf; pioneered aggressive cache pricing |
| **Kimi K2.6** | Moonshot AI | Apr 20, 2026 | $0.95 / $4.00 | 80.2% SWE-Bench Verified | First open-weight to beat GPT-5.4 (xhigh); 2M context |
| **Kimi K2.5** | Moonshot AI | Jan 27, 2026 | $0.58 / $3.00 | — | Reasoning-focused; 256K context |
| **GLM-5.1** | Zhipu/Z.ai | Mar 2026 | ~$0.80 / — | 77.8% SWE-bench Verified | 744B MoE / 40B active; MIT license; beat Claude Opus 4.6 on coding; runs on 8x H100 |
| **GLM-4.7** | Zhipu/Z.ai | Dec 22, 2025 | $3/month sub | 84.9% LiveCodeBench | Beats Claude Sonnet 4.5; free to run locally |
| **Qwen3.7 Max** | Alibaba | 2026 | ~$0.38 | Score 92 BenchLM; **#3 SWE-Bench Pro** | 262K context (1M extended); trained on 36T tokens |
| **Qwen3 Coder** | Alibaba | 2026 | $0.10 / — | 67% SWE-bench | 30x cheaper than Claude Sonnet 4.6 ($3/M) |
| **MiniMax M2.7** | MiniMax | Mar 18, 2026 | $0.279 / $1.20 | 56.2% SWE-Bench Pro | Open-weight; 230B params / 10B active; 205K context; self-hostable |
| **MiniMax M2.5** | MiniMax | early 2026 | $0.30 / $1.10 | 80.2% SWE-bench Verified | #1 OpenRouter token volume (week Apr 2026) |
| **Doubao Seed 2.0** | ByteDance | Feb 14, 2026 | ~$0.11 / — | — | Multimodal: text/image/video/voice; 4 variants |
| **Step 3.5 Flash** | StepFun | 2026 | $0.10 / $0.30 | Comparable math to GPT-4o | 50x cheaper than GPT-5.5 input price |
| **Baidu ERNIE 5.0** | Baidu | 2026 | Enterprise pricing | — | MoE architecture; enterprise/cloud focus |

---

## Western Model Reference (for comparison)

| Model | Lab | Release | Price (input / output per M tokens) | SWE-Bench Verified | Notes |
|-------|-----|---------|--------------------------------------|-------------------|-------|
| **Claude Mythos Preview** | Anthropic | Apr 8, 2026 | $25 / $125 | **93.9%** | Invitation-only (Project Glasswing); research preview, not publicly available |
| **GPT-5.5** | OpenAI | Apr 23, 2026 | $5 / $30 | 88.7% | |
| **Claude Opus 4.7** | Anthropic | Apr 16, 2026 | $5 / $25 | 87.6% | |
| **GPT-5.3-Codex** | OpenAI | — | — | 85.0% | |
| **Claude Opus 4.6** | Anthropic | 2025 | $5 / $25 | 80.8% | |
| **Gemini 3.1 Pro Preview** | Google | Feb 19, 2026 | $2 / $12 | 80.6% | #1 on 12/18 tracked benchmarks; 94.3% GPQA Diamond |
| **Claude Sonnet 4.6** | Anthropic | — | $3 / $15 | — | |

**Price gap summary:**
- Claude Mythos ($25/M) vs Step 3.5 Flash ($0.10/M): **250x price gap**
- GPT-5.5 ($5/M) vs MiniMax M2.5 ($0.30/M): **17x cheaper** for 8 SWE-Bench points less
- GPT-5.5 ($5/M) vs DeepSeek V4 Flash ($0.14/M): **36x cheaper**
- GPT-5.5 ($5/M) vs Step Flash / Qwen3 Coder ($0.10/M): **50x cheaper**
- DeepSeek V3.2 cached ($0.028/M) vs GPT-5.5 ($5/M): **~180x cheaper**

---

## SWE-Bench Benchmarks

> **Important context:** SWE-Bench Verified (500 problems) may be contaminated — OpenAI now recommends SWE-Bench Pro as the primary benchmark. Both tables below. Chinese models perform better relative to Western on Pro (harder, cleaner).

### SWE-Bench Verified (May 2026)

| Rank | Model | Score | Price (input/M) | Lab | Type |
|------|-------|-------|-----------------|-----|------|
| 1 | Claude Mythos Preview | **93.9%** | $25.00 | Anthropic | Closed (invite-only) |
| 2 | GPT-5.5 | **88.7%** | $5.00 | OpenAI | Closed |
| 3 | Claude Opus 4.7 | **87.6%** | $5.00 | Anthropic | Closed |
| 4 | GPT-5.3-Codex | 85.0% | — | OpenAI | Closed |
| 5 | Claude Opus 4.5 | 80.9% | $5.00 | Anthropic | Closed |
| 6 | Claude Opus 4.6 | 80.8% | $5.00 | Anthropic | Closed |
| 7 | **DeepSeek V4 Pro** | **80.6%** | **$0.28** | DeepSeek | Open-weight |
| 7 | Gemini 3.1 Pro | 80.6% | $2.00 | Google | Closed |
| 9 | **Kimi K2.6** | **80.2%** | **$0.95** | Moonshot AI | Open-weight |
| 9 | **MiniMax M2.5** | **80.2%** | **$0.30** | MiniMax | Closed |
| 11 | **GLM-5.1** | **77.8%** | **~$0.80** | Zhipu/Z.ai | Open-weight |

### SWE-Bench Pro — Contamination-Free (May 2026)

| Rank | Model | Score | Price (input/M) | Lab |
|------|-------|-------|-----------------|-----|
| 1 | Claude Mythos Preview | **77.8%** | $25.00 | Anthropic |
| 2 | Claude Opus 4.7 | 64.3% | $5.00 | Anthropic |
| 3 | **Qwen3.7 Max** | **60.6%** | **~$0.38** | Alibaba — **#3 globally, 13x cheaper than Opus 4.7** |
| 4 | GPT-5.4 (xHigh) | 59.1% | — | OpenAI |
| 5 | **MiniMax M2.7** | **56.2%** | **$0.279** | MiniMax |
| 6 | GPT-5.3-Codex | 56.8% | — | OpenAI |
| 7 | GPT-5.2-Codex | 56.4% | — | OpenAI |
| 8 | Muse Spark | 55.0% | — | Meta |

**Key framing:** On Verified, the top 6 are Western/closed. On Pro (the harder, cleaner benchmark), Chinese Qwen3.7 Max cracks the top 3 globally. The gap is narrowing in the benchmark that actually matters.

---

## BenchLM Overall Rankings (Chinese models, mid-2026)

1. Qwen3.7 Max — **92**
2. DeepSeek V4 Pro (Max) — **87**
3. Kimi K2.6 — **84**
4. GLM-5.1 — **83**
5. Qwen3.5 397B (Reasoning) — **79**

---

## Key Labs — Quick Reference

| Lab | Location | Flagship Model | Specialty | Funder / Parent |
|-----|----------|----------------|-----------|-----------------|
| DeepSeek | Hangzhou | V4 Pro, V4 Flash, V3.2 | Price/performance, coding | High-Flyer Capital (quant fund) |
| Alibaba DAMO | Hangzhou | Qwen3.7 Max | Open-source breadth, multilingual | Alibaba Group |
| Moonshot AI | Beijing | Kimi K2.6 | Agentic tasks, long-context (2M) | VC-backed startup |
| Zhipu/Z.ai | Beijing | GLM-5.1 | Open-source coding, sovereignty | IPO'd HKEx Jan 2026 |
| MiniMax | Shanghai | M2.7 | Multimodal, high token volume | VC-backed |
| ByteDance | Beijing | Doubao Seed 2.0 | Multimodal, consumer reach | ByteDance (TikTok parent) |
| StepFun | Shanghai | Step 3.5 Flash | Math reasoning, ultra-low cost | VC-backed |
| Baidu | Beijing | ERNIE 5.0 | Enterprise, Chinese cloud | Baidu (public company) |

---

## Open-Source Landscape

- **Qwen**: Most downloaded model series on Hugging Face 2025 + 2026. 113,000+ derivative models — more than Google and Meta combined. Overtook Meta's Llama in cumulative downloads.
- **GLM-5.1**: MIT license. Runs on 8x H100s with vLLM. Enterprise-deployable without API dependency.
- **DeepSeek V4**: Open-weights. Top Hugging Face downloads.
- **MiniMax M2.7**: Open-weight; 230B params / 10B active; self-hostable.
- **General trend**: Chinese labs releasing open weights while OpenAI/Anthropic increasingly close up. GPT-5.5 and Claude Opus 4.7 are both closed-source. Claude Mythos Preview is invite-only.
- **HF total**: Chinese models = 41% of downloads (Feb 2025–Feb 2026) vs 36.5% US.

---

## Where Chinese Models Still Lag

- Long-form English copywriting polish (occasional ESL patterns)
- Customer-facing prose where Claude/GPT fluency is preferred
- Very top of SWE-Bench Verified: Claude Mythos (93.9%), GPT-5.5 (88.7%), Opus 4.7 (87.6%) all ahead of Chinese frontier
- GPQA Diamond (graduate-level science): Gemini 3.1 Pro leads at 94.3%; Claude Opus 4.7 at 94.2%
- Claude Mythos: unique capabilities (autonomous zero-day vulnerability discovery) without Chinese equivalent yet

---

## Sources

### Live Data (check before scripting — numbers change fast)
- [Artificial Analysis — All Models](https://artificialanalysis.ai/models) — price + intelligence index
- [LLM Stats](https://llm-stats.com) — benchmarks
- [BenchLM — Best Chinese Models](https://benchlm.ai/best/chinese-models)
- [LMSYS Chatbot Arena](https://lmarena.ai) — human preference rankings
- [Price Per Token — 300+ Models](https://pricepertoken.com/)
- [AI API Pricing Comparison May 2026](https://devtk.ai/en/blog/ai-api-pricing-comparison-2026/)
- [SWE-Bench Verified Leaderboard May 2026](https://www.marc0.dev/en/leaderboard)
- [SWE-Bench Verified — BenchLM (47 models)](https://benchlm.ai/benchmarks/sweVerified)
- [SWE-Bench Pro — BenchLM (32 models)](https://benchlm.ai/benchmarks/swePro)
- [SWE-Bench Pro vs Verified explainer](https://www.morphllm.com/swe-bench-pro)

### Western Model Benchmarks / Pricing
- [Claude Mythos Preview: $25/$125, 93.9% SWE-Bench, invite-only](https://llm-stats.com/blog/research/claude-mythos-preview-launch) — LLM Stats
- [Claude Opus 4.7 — Artificial Analysis](https://artificialanalysis.ai/models/claude-opus-4-7)
- [Claude Opus 4.7 Launch](https://llm-stats.com/blog/research/claude-opus-4-7-launch) — $5/$25, Apr 16, 2026
- [Introducing GPT-5.5 — OpenAI](https://openai.com/index/introducing-gpt-5-5/) — $5/$30, 88.7% SWE-Bench, Apr 23 2026
- [Gemini 3.1 Pro Preview — Artificial Analysis](https://artificialanalysis.ai/models/gemini-3-1-pro-preview) — $2/$12

### Market Adoption
- [Chinese AI Models Hit 61% Market Share On OpenRouter](https://dataconomy.com/2026/02/25/chinese-ai-models-hit-61-market-share-on-openrouter/) — Dataconomy, Feb 2026
- [Chinese AI Models Overtake US Rivals in Global Token Consumption](https://www.trendingtopics.eu/chinese-ai-models-overtake-us-rivals-in-global-token-consumption/) — TrendingTopics
- [State of Open Source on Hugging Face: Spring 2026](https://huggingface.co/blog/huggingface/state-of-os-hf-spring-2026) — Hugging Face
- [OpenRouter Monthly Token Usage Ranking 2026](https://aicost.org/blog/openrouter-monthly-token-usage-ranking-2026-chinese-models-dominate) — AICost Blog
- [OpenRouter State of AI — 100T Token Study](https://openrouter.ai/state-of-ai)
- [Chinese AI models take top six spots in global usage](https://en.people.cn/n3/2026/0408/c90000-20444562.html) — People's Daily, Apr 2026
- [Token War: China Takes the First Move](https://thechinaacademy.org/token-war-china-takes-the-first-move/) — China Academy

### Model Comparisons
- [Best Chinese AI Models 2026 — Q2 Update](https://tokenmix.ai/blog/best-chinese-ai-models-2026-comparison-guide) — TokenMix
- [Best Chinese LLMs 2026 — BenchLM](https://benchlm.ai/blog/posts/best-chinese-llm)
- [MiniMax M2.7: Self-Evolving AI Model](https://wavespeed.ai/blog/posts/minimax-m2-7-self-evolving-agent-model-features-benchmarks-2026/) — WaveSpeed
- [MiniMax M2.7 — Artificial Analysis](https://artificialanalysis.ai/models/minimax-m2-7)
- [Kimi K2.6 Explained: ties GPT-5.5 on Coding](https://miraflow.ai/blog/kimi-k2-6-explained-moonshot-ai-open-source-model-ties-gpt-5-5-coding) — MiraFlow
- [4 Chinese Open-Weights Models in 12 Days](https://www.abhs.in/blog/chinese-open-weights-models-4-in-12-days-glm-minimax-kimi-deepseek-cost-war-2026) — Abhishek Gautam
- [Three Weeks, Four Chinese Coding Models](https://medium.com/@candemir13/three-weeks-four-chinese-coding-models-whats-actually-real-and-what-s-overstated-4cb58199e83d) — Medium, May 2026
- [LLM Coding Benchmark Apr 2026: DeepSeek, Kimi, GPT-5.5](https://akitaonrails.com/en/2026/04/24/llm-benchmarks-parte-3-deepseek-kimi-mimo/)
- [GLM-5.1 vs Claude, GPT, Gemini, DeepSeek](https://wavespeed.ai/blog/posts/glm-5-1-vs-claude-gpt-gemini-deepseek-llm-comparison/) — WaveSpeed
- [Late-April 2026 Chinese LLM Stack](https://dev.to/bean_bean/the-late-april-2026-chinese-llm-stack-qwen-36-deepseek-v4plus-kimi-k26-minimax-m27-glm-51-2bif) — DEV Community
- [Chinese AI Models 90% Cheaper Than GPT-5](https://aicost.org/blog/chinese-ai-models-cost-advantage-2026) — AICost Blog

### Narrative / Analysis
- [China's open-source bet](https://www.technologyreview.com/2026/04/21/1135658/china-open-source-models-ai-artificial-intelligence/) — MIT Technology Review, Apr 2026
- [What's next for Chinese open-source AI](https://www.technologyreview.com/2026/02/12/1132811/whats-next-for-chinese-open-source-ai/) — MIT Technology Review, Feb 2026
- [China is winning the open source AI race](https://thenewstack.io/china-leads-open-ai-models/) — The New Stack

---

## Chained Research Questions (Q1→Q5)

Each question answers the previous and opens the next — the chain that drives the video's narrative.

---

**Q1 — WHAT (The Shock)**
> "Everyone assumes OpenAI and Anthropic are the AI market. So how did Chinese models end up as all 6 of the most-used AI models in the world — by actual token consumption — in the same week?"

*Answer:* 61% OpenRouter share, benchmark parity at 5–18x lower cost, 113K+ Qwen derivatives on HF. The data is undeniable.

*Re-hook → Q2:* "But this wasn't one lab having a breakthrough moment. It was 8 different labs all hitting the global market at roughly the same time. So who are these people, and why did they all converge?"

---

**Q2 — WHO (The Players)**
> "Eight Chinese labs — DeepSeek, Alibaba, Moonshot, Zhipu, MiniMax, ByteDance, StepFun, Baidu — all releasing world-class models in the same 12-month window. That's not a coincidence. What's actually going on here?"

*Answer:* Each lab's origin and backer. DeepSeek: built by a quant fund. ByteDance: TikTok's global distribution. Zhipu: just IPO'd in Hong Kong. Not scrappy startups — and every single one made the same deliberate strategic choice.

*Re-hook → Q3:* "And here's what's bizarre: every one of them went open-source. They're giving away models that cost hundreds of millions to train. Why would any rational company do that?"

---

**Q3 — WHY (The Strategy)**
> "Chinese labs gave away world-class AI for free — open weights, MIT license, run it yourself. OpenAI and Anthropic locked everything down. Why did China go the opposite direction, and what do they know that Silicon Valley doesn't?"

*Answer:* Open-source as a global network effect. Release → global fine-tuning → 113K+ Qwen derivatives → feedback and eval data returns to the lab for free. Western labs pay for red-teaming. Chinese labs outsource it to the entire global developer community. It's not charity — it's compounding leverage.

*Re-hook → Q4:* "Strategy on paper doesn't mean actual market control. Has the market actually shifted — or is this still mostly hype?"

---

**Q4 — HOW (The Spread)**
> "If the models are as good and cost 50x less, why would anyone keep paying for GPT-5.5 or Claude? How fast has the market actually moved — and who's using Chinese AI right now?"

*Answer:* OpenRouter: 61% token consumption, 12.7x YoY growth, programming now >50% of usage (was 11% in Jan 2025). Startups and enterprises switching for agentic coding workloads where volume makes price matter. Real, measurable, accelerating.

*Re-hook → Q5:* "So the market has moved. The adoption is real. And if you're a startup or engineer, this looks like great news. But there's something in this picture nobody's talking about — and it's the part that should actually alarm you."

---

**Q5 — THE ALARM (The Trap)**
> "What does it mean for the world if Qwen, GLM, and Kimi become the default AI foundation that every developer and enterprise builds on — and those models are controlled by labs operating under Chinese law?"

*Answer:* The open-source trap. Defaults, alignment, future versions — all controlled by Chinese labs. Qwen already has 113K+ derivatives. Every product built on top inherits the assumptions of the foundation. This is the Huawei 5G debate at the software/model layer — already far more advanced, far harder to regulate, already inside the global dev stack.

*(Terminal — this lands the thesis. No re-hook.)*

---

## Vertical Logic Threads — Ordered by Ascending Shock Value

*(2nd-best first → best near the end. Each closes with a re-hook into the next.)*

---

### Thread 1 — Efficiency Always Beats Brute Force *(foundation)*
Western labs bet: more compute → better models → defensible moat. Chinese labs disproved it. MoE architectures, distillation, and aggressive cache pricing let them match performance at 1/10th the cost. Once proven, every market — startups, enterprises, governments, emerging economies — defaults to cheaper. The expensive labs must justify a shrinking premium every quarter. There is no obvious floor.

*Opens Thread 2:* "But cheaper alone doesn't explain how you beat the open-source flywheel effect that companies like Meta were supposed to own..."

---

### Thread 2 — The Open-Source Flywheel *(mechanism)*
Chinese labs release open weights → global devs fine-tune and ship → 113,000+ Qwen derivatives → adoption data and feedback return at zero cost. Western closed-source labs pay for their own red-teaming and evals. Chinese labs outsource that work to the world. More derivatives than Google and Meta combined. Not a lead — a compounding network effect that widens every month.

*Opens Thread 3:* "The economics are destroying the Western business model. But the business model question is almost secondary to what happens when inference basically costs zero."

---

### Thread 3 — When Inference Costs Zero, Everything Changes *(economic consequence)*
DeepSeek V3.2 cached: $0.028/M. Step Flash: $0.10/M. GPT-5.5: $5/M. This isn't a pricing war — it restructures the entire industry. "AI as a service" collapses as a moat. Value migrates entirely to data, distribution, and the application layer. The pricing architecture OpenAI and Anthropic were built on gets destroyed from underneath. This doesn't hurt one lab — it reshapes every company that built a business model on inference margins.

*Opens Thread 4:* "Destroying the Western business model is one thing. What's more alarming is what it means when Chinese models become the default infrastructure — not just cheaper, but foundational."

---

### Thread 4 — The Open-Source Trap *(the climax)*
When Qwen, GLM, Kimi become the default open-source foundation the global developer community builds on — and that's already happening at 113K derivatives — the defaults, alignment decisions, and future versions of those foundations are controlled by Chinese labs operating under Chinese law. Every product, every agent, every enterprise system built on top inherits those assumptions. You can't easily see them, you can't audit them, and once your stack depends on them, switching costs are enormous. This is the Huawei 5G debate — not at the network layer, but at the model layer. And it's already inside the global dev stack.
