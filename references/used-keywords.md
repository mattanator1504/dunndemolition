# Used Keywords — Dunn Demolition

> Primary keywords already targeted on this site.
> **Rule:** check this file before picking a primary. Never reuse one, because that causes keyword cannibalization.

---

## Keyword-selection rule

1. **The primary must come from the keyword CSV** (`data/keywords.csv`). Never invent a primary.
2. **Check this file first.** Never reuse a primary.
3. **Secondaries: CSV first, invent only what's missing.**
   - Use same-intent CSV keywords and mark them `✓ CSV`.
   - Fill gaps with 4–5 invented ones from People Also Ask or Related Searches, and mark them `(invented)`.
4. **The same-intent test:** would someone searching the secondary want the same page as the primary? If not, it belongs to a different cluster.
5. **The page type decides the keyword type:**
   - Home, service and location pages are commercial: "demolition contractor virginia beach", "house demolition chesapeake va", "pool removal norfolk".
   - The Buy page is commercial, for materials: "crushed concrete for sale virginia beach", "21a stone chesapeake", "rip rap near me".
   - Blog posts are problem-led or informational: "how long does it take to demolish a house", "do i need a permit to tear down a shed in virginia", "what is 21a stone".
   - Never put a commercial city keyword on a blog post, or a "how do I…" keyword on a service page.
6. **Only target places Dunn actually serves** (VA, NC, MD, with the yards in Chesapeake and Virginia Beach). Check with Dunn before targeting a city outside Hampton Roads.
7. **Prioritize by business value, then by ease:** demolition jobs (commercial and residential) first, then site prep services, then stone sales, then informational posts.

---

## Site plan

| Page type | Count | Notes |
|-----------|-------|-------|
| Home | 1 | main service + main area ("demolition contractor hampton roads" or similar, from the CSV) |
| Core pages (about, services, FAQs, buy, contact) | 5 | services = broad "demolition services" term; buy = recycled stone/crushed concrete term; FAQs/about/contact get secondary or brand terms only |
| Service pages | up to 10 | phase 2, one per core service (see `CLAUDE.md`) |
| Location pages | [X] | phase 2, only where there's real search volume AND real local detail |
| Blog posts | [X] | phase 2, problem-led, internal links to the matching service page |

---

## Active primaries

None yet. Add a block per page **before** writing it.

### 1. `[primary keyword]` → `[/url]`

- **Primary source:** ✓ CSV `keywords.csv` (vol [X], KD [X], CPC [$X], intent [commercial/informational])
- **Page type:** [home / core / service / location / blog]
- **Used on page:** `[/url]`
- **Cluster:**

| Secondary keyword | Source |
|-------------------|--------|
| [keyword] | `✓ CSV` / `(invented)` |
| [keyword] | |
| [keyword] | |
| [keyword] | |

*CSV audit: [which CSV keywords were checked, and why each was or wasn't used]*

---

## Workflow for the next page

1. Open `data/keywords.csv`.
2. Sort by volume × (1 / KD), then weight by business value (rule 7).
3. Skip any primary already listed above.
4. Pick an unused primary.
5. Scan the CSV for same-intent secondaries (`✓ CSV`).
6. Fill gaps with invented secondaries (`(invented)`).
7. Add the section to this file **before** writing.
8. Ship it, then update "Used on page".
