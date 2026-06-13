# Research: The AI Bubble

_Last updated: June 13, 2026. Verify figures before scripting — this space moves fast._

---

## 1. OpenAI Financial Reality

| Metric | Figure | Source | Date |
|--------|--------|--------|------|
| ARR (current) | ~$25B run rate | [Future Search](https://futuresearch.ai/openai-revenue-forecast/) | June 2026 |
| Projected 2026 loss | $14B net loss | [RD World Online](https://www.rdworldonline.com/facing-14b-losses-in-2026-openai-is-now-seeking-100b-in-funding-but-can-it-ever-turn-a-profit/) | 2026 |
| Projected 2026 cash burn | ~$27B | [ainvest](https://www.ainvest.com/news/openai-14-billion-2026-loss-burn-priced-2603/) | 2026 |
| Projected 2027 cash burn | ~$63B | [ainvest](https://www.ainvest.com/news/openai-14-billion-2026-loss-burn-priced-2603/) | 2026 |
| Cumulative losses through 2029 | $115B | [Yahoo Finance](https://finance.yahoo.com/news/openais-own-forecast-predicts-14-150445813.html) | 2026 |
| Break-even (cash flow positive) | 2030 | [AOL Finance](https://www.aol.com/finance/openai-says-plans-report-stunning-161814673.html) | 2026 |
| New funding sought | $100B | [RD World Online](https://www.rdworldonline.com/facing-14b-losses-in-2026-openai-is-now-seeking-100b-in-funding-but-can-it-ever-turn-a-profit/) | 2026 |
| H1 2025 net loss | $13.5B | [Sacra](https://sacra.com/c/openai/) | 2025 |
| Total spending 2026 (est.) | ~$22B against ~$13B sales* | Internal projection leak | 2026 |

> *Note: The $13B sales vs. $22B spend figure comes from earlier internal projections — the $25B ARR is the more current run rate figure as of June 2026. Spending is growing alongside revenue.

**Key narrative stat:** OpenAI's own projections show losses of $14B in 2026 against roughly $13B in sales, with total spending hitting ~$22B. Even with the $25B ARR, they will not be cash-flow positive until 2030.

---

## 2. Anthropic Financial Reality (Counterpoint)

| Metric | Figure | Source | Date |
|--------|--------|--------|------|
| Valuation (Series H) | $965B | [Anthropic Blog](https://www.anthropic.com/news/series-h) | 2026 |
| Series H raised | $65B | [Anthropic Blog](https://www.anthropic.com/news/series-h) | 2026 |
| ARR (May 2026) | ~$47B | [CNBC](https://www.cnbc.com/2026/05/20/anthropic-revenue-explosive-growth-ipo-profitable-quarter.html) | May 2026 |
| ARR (end of 2025) | $9B | [Sacra](https://sacra.com/c/anthropic/) | Dec 2025 |
| Q1 2026 revenue | $4.8B | [CNBC](https://www.cnbc.com/2026/05/20/anthropic-revenue-explosive-growth-ipo-profitable-quarter.html) | Q1 2026 |
| Q2 2026 revenue (expected) | $10.9B | [CNBC](https://www.cnbc.com/2026/05/20/anthropic-revenue-explosive-growth-ipo-profitable-quarter.html) | Q2 2026 |
| First profitable quarter | June 2026 (expected) | [CNBC](https://www.cnbc.com/2026/05/20/anthropic-revenue-explosive-growth-ipo-profitable-quarter.html) | 2026 |
| Revenue multiple (valuation/ARR) | ~20x | Calculated: $965B / $47B ARR | 2026 |

**Key narrative insight:** Anthropic is the counterintuitive survivor. Revenue grew 5x ($9B → $47B ARR) in 5 months of 2026. While OpenAI burns, Anthropic is approaching profitability. The $965B valuation at 20x ARR is aggressive — but not insane by fast-growing tech standards.

---

## 3. API Pricing — Western vs. Chinese Models

| Model | Provider | Input ($/M tokens) | Output ($/M tokens) | Notes |
|-------|----------|---------------------|----------------------|-------|
| GPT-5.2 | OpenAI | $1.75 | $14.00 | [AIonX](https://aionx.co/ai-comparisons/ai-pricing-comparison/) |
| Claude Opus 4.8 | Anthropic | $5.00 | $25.00 | [IntuitionLabs](https://intuitionlabs.ai/articles/claude-pricing-plans-api-costs) |
| Claude Sonnet 4.6 | Anthropic | $3.00 | $15.00 | [IntuitionLabs](https://intuitionlabs.ai/articles/claude-pricing-plans-api-costs) |
| Claude Haiku 4.5 | Anthropic | $1.00 | $5.00 | [IntuitionLabs](https://intuitionlabs.ai/articles/claude-pricing-plans-api-costs) |
| Gemini (Google) | Google | ~$1-2 | ~$5-10 | Varies by tier |
| **DeepSeek V4 Flash** | DeepSeek | **$0.14** | **$0.28** | [ChinaBizInsider](https://chinabizinsider.com/deepseek-slashes-api-pricing-by-97-5-triggering-agent-model-cost-war/) |
| **Qwen 3** | Alibaba | **$0.38** | **$0.38** | [TokenMix](https://tokenmix.ai/blog/best-chinese-ai-models-2026-comparison-guide) |
| **Kimi K2.5** | Moonshot | **— ** | **$3.00** | [TokenMix](https://tokenmix.ai/blog/best-chinese-ai-models-2026-comparison-guide) |

**Price gap:** DeepSeek V4 Flash vs. Claude Opus 4.8 output = **89x cheaper**. DeepSeek cut its own API prices by **97.5%** in a single announcement. Qwen3 is 25-40x cheaper than US frontier models at comparable quality.

**The forced response:** Google cut AI Plus from $7.99 → $4.99/month in June 2026, citing competitive pressure. ([TechCrunch via search](https://www.techtimes.com/articles/318181/20260610/deepseek-hits-541-million-visits-fifth-worldwidechina-ai-price-war-tests-us-bills-and-data.htm))

---

## 4. Subscription vs. True Cost Math

| Usage level | Monthly tokens | True API cost (Claude Sonnet) | Subscription price | Subsidy |
|-------------|---------------|-------------------------------|-------------------|---------|
| Light user | 500K tokens | ~$9 | $20 | User overpays (profitable) |
| Average user | 2M tokens | ~$36 | $20 | Company loses $16/user |
| Power user | 5M tokens | ~$90 | $20 | Company loses $70/user |

Source: Calculated from [IntuitionLabs pricing](https://intuitionlabs.ai/articles/claude-pricing-plans-api-costs) + [PricePerToken.com](https://pricepertoken.com/subscription-calculator)

**Key insight:** Subscriptions are priced to attract users, not to make money. The company profits from light users and loses significantly on power users. The $20/month price point was set to drive adoption — and it worked. But the math only works if AI gets cheaper faster than user engagement grows.

---

## 5. Data Center Crisis

| Metric | Figure | Source |
|--------|--------|--------|
| Global data center power demand by 2026 | ~1,100 TWh (= Japan's total electricity consumption) | [ZestLab](https://zestlab.io/en/trends/ai-data-center-energy-crisis-2026) |
| US planned data center builds delayed/canceled 2026 | ~50% | [Tech Insider](https://tech-insider.org/ai-data-center-power-crisis-2026/) |
| Virginia new data center permits | Effectively halted | Grid capacity hit |
| Power demand: AI data center | 100–300 MW continuous | [CarbonCredits](https://carboncredits.com/ai-data-centers-power-crisis-massive-energy-demand-threatens-emissions-targets-and-latest-delays-signal-market-shift/) |
| Power demand: conventional data center | 10–50 MW | CarbonCredits |
| Hyperscaler response | Nuclear power purchase agreements | Microsoft, Google, Amazon |

**Key narrative insight:** Even with unlimited money, you can't build fast enough. The physical grid is the bottleneck. Virginia — where 70% of US internet traffic routes — can't issue new permits. AI scaling is hitting a wall that isn't financial.

---

## 6. VC Funding Trends

| Metric | Figure | Source |
|--------|--------|--------|
| Global VC Q1 2026 | $330.9B (record) | [Angel Investors Network](https://angelinvestorsnetwork.com/venture-capital/vc-funding-q2-2026-trends) |
| % going to AI in Q1 2026 | 80% | [Angel Investors Network](https://angelinvestorsnetwork.com/venture-capital/vc-funding-q2-2026-trends) |
| Deal count change YoY | **Down 31.5%** | [Angel Investors Network](https://angelinvestorsnetwork.com/venture-capital/vc-funding-q2-2026-trends) |
| AI % of global VC in 2025 | 61% ($258.7B) | [OECD](https://www.oecd.org/en/publications/venture-capital-investments-in-artificial-intelligence-through-2025_a13752f5-en/full-report.html) |
| Application layer pool | ~$72B | [Digital Applied](https://www.digitalapplied.com/blog/ai-venture-funding-2026-where-242b-went-data-atlas) |

**Key nuance:** Money is NOT drying up — it's concentrating. Fewer deals, bigger rounds. The mega-rounds go to infrastructure and frontier model companies. Application layer startups compete for a $72B pool that's actually a normal-sized venture year hidden inside a boom.

---

## 7. Dot-Com vs. AI Bubble Comparison

| Metric | Dot-Com Peak (2000) | AI 2026 | Interpretation |
|--------|---------------------|---------|----------------|
| NASDAQ-100 P/E ratio | ~200 | ~30 | AI is NOT as overvalued as dot-com |
| Who funds capex | VC-backed startups with no revenue | Microsoft, Google, Amazon (profitable) | Much stronger foundation |
| Infrastructure builder valuation | Cisco (P/E: 200, no real earnings) | NVIDIA ($4.3T market cap, $216B revenue, 71% margin) | NVIDIA is real; Cisco wasn't |
| "Pets.com equivalent" | dot-com application cos | OpenAI (high burn, unclear path to profit) | OpenAI is most like dot-com startups |
| Who survived dot-com | Amazon (real infrastructure) | AWS/Azure/GCP (same logic) | Infrastructure layer survives |

Sources: [FXCM](https://www.fxcm.com/markets/insights/is-the-ai-boom-another-dot-com-bubble/), [IntuitionLabs](https://intuitionlabs.ai/articles/ai-bubble-vs-dot-com-comparison), [Seeking Alpha](https://seekingalpha.com/article/4912079-ai-bubble-way-bigger-than-dot-com)

**Key narrative framing:** The bubble isn't AI. The bubble is *specific AI companies* at the frontier model layer that haven't solved unit economics. The infrastructure companies (chips, cloud) are real. The application companies are the dot-com era startups.

---

## 8. The Survivor Map

| Company | Risk Level | Why |
|---------|------------|-----|
| NVIDIA | Very safe | $216B revenue, 71% gross margins, only GPU supplier at scale |
| AWS / Azure / GCP | Safe | Real enterprise contracts, profitable parent cos, infrastructure moat |
| Anthropic | Surprisingly safe | $47B ARR, approaching profitability, Claude Code enterprise traction |
| Google DeepMind | Safe | Profitable parent, own infrastructure, Gemini integrated into $2T business |
| Meta AI | Safe | $0 revenue model (ads fund it), can subsidize indefinitely |
| OpenAI | Most at risk | $27B burn, $115B losses ahead, no hardware moat, Chinese price war on core product |
| Application layer startups | High risk | Building on expensive Western APIs, getting squeezed by Chinese price war |

---

## 9. Key Stats for Script / Hook

- OpenAI 2026 projected cash burn: **$27 billion**
- OpenAI cumulative losses before profitability: **$115 billion**
- Year OpenAI turns cash-flow positive: **2030**
- New funding OpenAI is seeking: **$100 billion**
- DeepSeek API price cut: **97.5% in a single announcement**
- Price of DeepSeek V4 Flash vs. Claude Opus output: **~89x cheaper**
- % of US planned data centers delayed in 2026: **~50%**
- Anthropic Q2 2026 expected revenue: **$10.9B** (profitable quarter)
- VC deal count YoY change: **-31.5%** (fewer, larger bets)
- Dot-com NASDAQ P/E peak: **200** | AI 2026 NASDAQ P/E: **~30**

---

## 10. Threads to Investigate Further (Go Deeper)

- [ ] OpenAI's $100B fundraising round: who are the investors, what terms?
- [ ] Exact cost-per-query breakdown for ChatGPT (public analyses or leaked compute costs)
- [ ] Microsoft's AI revenue disclosure: what % of Azure growth is AI-attributable?
- [ ] Nuclear power deals: exact details of Microsoft/Google agreements
- [ ] DeepSeek daily active users vs. ChatGPT — closing the gap?
- [ ] Kimi K2.6 benchmark vs GPT-5.2: what does quality parity actually look like?
- [ ] YouTube transcripts: ColdFusion (eXXwN_TDdLU), Hank Green (AcjnLc4TH4M), Bloomberg Anthropic (v1wZwxY3CMg)
