# On-Page SEO Checklist — matthewrissik.com

The single source of truth for on-page SEO on this site. Every page must pass every item that applies to its type.

**Every page skill reads this file before writing. Every page is checked against it before shipping.** `npm run verify` checks the ⚙ items automatically; the rest are checked by reading the page.

| Type | URL pattern | Job |
|------|-------------|-----|
| **Home** | `/` | Rank for the brand + main offer; send people to a call |
| **Service** | `/services/[slug]` | Rank for a commercial service keyword; book a call |
| **Industry** | `/for/[industry]` | Rank for "[service] for [industry]"; book a call |
| **Case study** | `/projects/[slug]` | Proof; rank for "[industry] [result] case study"; book a similar system |
| **Blog** | `/blog/[slug]` | Rank for a problem/question keyword; send readers to the matching service |
| **Static** | `/about`, `/projects`, `/blog`, `/roi-calculator`, `/book`, legal | |

---

## 1. Head / metadata (all pages)

- [ ] ⚙ **Title** 50–60 characters, primary keyword first, `| Matthew Rissik` at the end (that suffix is 17 characters, so the keyword part gets about 40). Drop the suffix if the keyword needs the room.
- [ ] ⚙ **Meta description** 140–160 characters: keyword + the outcome + soft CTA ("Book 30 minutes…"). Unique per page.
- [ ] ⚙ **Canonical** — absolute `https://matthewrissik.com/...`, self-referencing, no trailing slash
- [ ] ⚙ **Open Graph**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (`article` for posts and case studies)
- [ ] ⚙ **Twitter Card**: `summary_large_image`
- [ ] ⚙ **`lang="en-US"`**, charset, viewport
- [ ] **Favicon** + `apple-touch-icon`
- [ ] **No `noindex`** on anything meant to rank (`/book` and legal pages may be noindex)

## 2. URL structure

- [ ] ⚙ **Lowercase, hyphens only**
- [ ] **Keyword in the slug**, under 60 characters, no dates, no stop words unless needed
- [ ] **Existing URLs never change** without a 301 in `vercel.json`

## 3. Headings

- [ ] ⚙ **Exactly one H1**, containing the primary keyword
- [ ] ⚙ **No skipped levels**
- [ ] **H2s use secondary keywords and real buyer questions** — written for a founder skimming, not for a crawler

## 4. Body copy

- [ ] **Primary keyword in the first 100 words**
- [ ] **Direct answer first** — 40–60 words that answer the search on their own
- [ ] **Length:** blog posts per `write-blog-post` (body 800–1,400, article ≤ 1,800). The SERP-length rule does **not** apply to the homepage, service, industry or landing pages. Their limits: homepage ≤ 450 words, service pages ≤ 400, `/services` ≤ 300, landing pages 700–1,000
- [ ] **Short paragraphs** (1–4 sentences), grade 8–10, active voice, first person
- [ ] **Real proof inline** — at least one number from `references/stats.md` with where it came from ("across client campaigns", "for one SaaS client")
- [ ] **"Here's what I'd fix first"** — every blog post leaves the reader with one thing they could do this week without hiring anyone. On the homepage and service pages it lives in the closing CTA ("I'll tell you what I'd fix first")
- [ ] **Voice files applied** — passes "Tells that it's AI-written" in `references/voice.md`

## 5. FAQ

- [ ] **Real questions** (People Also Ask + what prospects actually ask on calls): 4–5 on blog posts and landing pages, **3 on service pages** (≤ 30 words each). None on the homepage.
- [ ] **2–4 sentence answers**, first sentence answers alone
- [ ] ⚙ **FAQPage JSON-LD** matching the visible text exactly

## 6. Images

- [ ] ⚙ **Alt text on every image** (decorative → `alt=""`); project screenshots describe what's shown ("Med spa booking page on mobile")
- [ ] ⚙ **`width` + `height` on every image**
- [ ] **Descriptive filenames** — `med-spa-booking-funnel.webp`
- [ ] **WebP**, content images under 150 KB, hero under 200 KB
- [ ] **Hero not lazy** (`fetchpriority="high"`); everything below the fold lazy
- [ ] **Real screenshots before stock.** Stock only where no real image exists.
- [ ] **OG image** 1200×630 per page (falls back to site default)

## 7. Internal links

- [ ] **Blog posts: 3–5 internal links**, at least **one to the matching service page** and one to a relevant case study
- [ ] **Service pages: link to 2–3 case studies**, plus related posts once they exist (one line under the proof)
- [ ] **Industry pages: link to the case study from that industry** and the services used
- [ ] **Case studies: link to the services used** and "Book a similar system"
- [ ] **ROI calculator linked** from the outbound service page and outbound blog posts
- [ ] **Descriptive anchors** — never "click here" / "read more"
- [ ] ⚙ **Breadcrumbs on every page except home**
- [ ] **No orphan pages**

## 8. External links

- [ ] **Blog posts: 2–3 authoritative sources** (Google Search Central, Google's sender guidelines, platform docs, original research — never another agency's blog)
- [ ] **Every link opened and checked** before publishing
- [ ] ⚙ **`target="_blank"` always with `rel="noopener"`**

## 9. Schema (JSON-LD)

Generated from `lib/site.ts` + content via `lib/seo.ts`. Never hand-typed.

| Schema | Where |
|--------|-------|
| `Organization` + `WebSite` | site-wide |
| `Person` (Matthew) | site-wide, full version on `/about` |
| `Service` | service + industry pages |
| `BlogPosting` (author = Matthew `Person`) | blog posts |
| `Article` | case studies |
| `BreadcrumbList` | every page except home |
| `FAQPage` | any page with a visible FAQ |

- [ ] ⚙ **Every block parses**
- [ ] **Passes Google's Rich Results Test**
- [ ] **Schema only describes what's visible**
- [ ] **No `LocalBusiness`** — this isn't a local business
- [ ] **No `Review` / `AggregateRating`** for Matthew's own services from his own site

## 10. E-E-A-T

This is where a personal-brand site wins or loses.

- [ ] **Byline "Matthew Rissik"** on every post, linking to `/about`
- [ ] **Author card** at the end of every post: photo, one-line bio, LinkedIn link
- [ ] **Published + "Last updated" dates** visible, matching schema
- [ ] **Real proof** — numbers, client types and screenshots from `references/` only
- [ ] **About page** with the real story, photo, what Matthew does and doesn't do, socials
- [ ] **Case studies on-site** (not only on Gamma) so the proof builds this domain's authority

## 11. Accessibility

- [ ] ⚙ **Landmarks** — `<header>`, `<nav>`, `<main>`, `<footer>`; `<article>` for posts and case studies
- [ ] ⚙ **Skip-to-content link** first
- [ ] **Contrast** ≥ 4.5:1 body, ≥ 3:1 large text — check the accent colour on buttons
- [ ] **Visible focus rings**
- [ ] **Labels on every form field and calculator slider** (sliders need visible values + `aria-valuetext`)
- [ ] ⚙ **No vague link text**
- [ ] **Project filter buttons** are real `<button>`s with `aria-pressed`

## 12. Mobile

- [ ] Body text ≥ 16 px, tap targets ≥ 48 px, no horizontal scroll at 360 px, no popups on load

## 13. Conversion (home, service, industry, case study pages)

- [ ] ⚙ **"Book a Call" CTA above the fold** linking to `/book` (or the booking URL)
- [ ] **CTA repeated** — after proof, mid-page, end of page
- [ ] **"No pitch, no pressure" framing** — 30 minutes, what Matthew will look at, "whether or not we end up working together"
- [ ] **Proof near every CTA** — a stat or case study card
- [ ] **Service pages: what it is → who it's for (with one "not for" sentence) → what you get (max 5 bullets) → proof → 3 FAQs → book a call.** Nothing else
- [ ] **Format/pricing honesty** — fixed-scope vs retainer; actual price only if it's in `stats.md`
- [ ] **Testimonials only if real** and in `stats.md`. None is better than invented.

## 14. Industry pages (extra rules)

Same doorway-page risk as location pages. Google penalises the same page with the industry name swapped.

- [ ] **Only build one where there's a real project in that industry** (from `stories.md`) **and** search demand in `data/keywords.csv`
- [ ] **50%+ of the copy unique to that industry** — how buyers in that industry search, their sales cycle, what the case study fixed, industry-specific objections
- [ ] **Features that industry's case study** with its real numbers

## 15. Long-form (1,500+ words)

- [ ] **Table of contents** linking to each H2, ⚙ **`id` on every H2**, **back-to-top** link

---

## How to use this file

1. Every page skill reads this first.
2. Every page passes every item for its type.
3. `npm run build && npm run verify` — ⚙ items fail the check if missing.
4. Read the page once against the rest, then ship.
5. Site-wide technical items live in `technical-seo.md`.
