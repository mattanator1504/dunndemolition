# On-Page SEO Checklist — Dunn Demolition

The single source of truth for on-page SEO on this site. Every page must pass every item that applies to its type.

**Every page skill reads this file before writing. Every page is checked against it before shipping.** `npm run verify` checks the ⚙ items automatically. The rest are checked by reading the page.

| Type | URL pattern | Job |
|------|-------------|-----|
| **Home** | `/` | Rank for the brand + main service + main area. Send people to a free quote or a phone call. |
| **Core** | `/services`, `/buy` | Services: rank for the broad "demolition services" term. Buy: rank for recycled stone and crushed concrete. Get a quote. |
| **Service** | `/services/[slug]` | Rank for a commercial service keyword ("house demolition virginia beach"). Get a free quote. (Phase 2) |
| **Location** | `/service-areas/[slug]` | Rank for "demolition contractor [city]". Get a free quote. (Phase 2) |
| **Blog** | `/blog/[slug]` | Rank for a problem or question keyword. Send readers to the matching service page. (Phase 2) |
| **Static** | `/about`, `/faqs`, `/contact`, `/blog`, `/privacy` | |

---

## 1. Head / metadata (all pages)

- [ ] ⚙ **Title:** 50–60 characters, primary keyword first, `| Dunn Demolition` at the end (that suffix is 18 characters, which leaves about 40 for the keyword). Drop the suffix if the keyword needs the room.
- [ ] ⚙ **Meta description:** 140–160 characters. Include the keyword, a real fact from `stats.md` ("since 1974", "VA Class A", "50–75% recycled") and a soft CTA ("Free quote: 757-472-4142."). Unique per page.
- [ ] ⚙ **Canonical:** absolute `site.url` + path (the domain is set in `lib/site.ts`), self-referencing, no trailing slash.
- [ ] ⚙ **Open Graph:** `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (`article` for posts)
- [ ] ⚙ **Twitter Card:** `summary_large_image`
- [ ] ⚙ **`lang="en-US"`**, charset, viewport
- [ ] **Favicon** + `apple-touch-icon` (from the Dunn logo)
- [ ] **No `noindex`** on anything meant to rank (only `/privacy` may be noindex)

## 2. URL structure

- [ ] ⚙ **Lowercase, hyphens only**
- [ ] **Keyword in the slug,** under 60 characters, no dates, no stop words unless needed (`/services/pool-removal`, `/service-areas/chesapeake`)
- [ ] **Existing URLs never change** without a 301 in `vercel.json`. The six live paths (`/`, `/about`, `/services`, `/faqs`, `/buy`, `/contact`) stay exactly as they are.

## 3. Headings

- [ ] ⚙ **Exactly one H1,** containing the primary keyword. A brand hero line ("We break it down.") can be styled as the big display text, but the H1 still carries the keyword, either in the same block or as the eyebrow.
- [ ] ⚙ **No skipped levels**
- [ ] **H2s use secondary keywords and real customer questions,** written for a homeowner or developer skimming on a phone, not for a crawler. They're statements, not labels (see `voice.md`).

## 4. Body copy

- [ ] **Primary keyword in the first 100 words**
- [ ] **Direct answer first:** 40–60 words that answer the search on their own
- [ ] **Length:** blog posts follow `write-blog-post` (body 800–1,400 words, article ≤ 1,800). The search-results length rule does **not** apply to the other page types. Their limits are: home ≤ 600 words, `/services` ≤ 700, service pages 500–900, location pages 700–1,000.
- [ ] **Short paragraphs** (1–4 sentences), grade 8–10, active voice, "we" for Dunn
- [ ] **Real proof inline:** at least one number from `references/stats.md` ("since 1974", "3 crews, never more than 3 jobs at once", "50–75% of material recycled", "typically 2–4 days for a house")
- [ ] **"Do this first":** every blog post leaves the reader with one thing they can do this week before hiring anyone (permit check, utility disconnects, ask for the insurance declaration page; see `opinions.md`). On service and location pages it goes in the closing CTA ("We'll walk the site and tell you what needs to happen first.")
- [ ] **Voice files applied:** passes "Tells that it's AI-written" in `references/voice.md`. Blog posts also pass `humor.md`.

## 5. FAQ

- [ ] **Real questions** (People Also Ask, plus what customers actually ask Dunn on the phone, starting with the 19 on `/faqs`): 4–5 on blog posts and location pages, **3 on service pages** (≤ 30 words each), 4 on the homepage linking to `/faqs`, all 19 on `/faqs`
- [ ] **2–4 sentence answers.** The first sentence answers on its own.
- [ ] ⚙ **FAQPage JSON-LD** matching the visible text exactly
- [ ] **The same answer text everywhere it appears.** Facts come from `stats.md`, so a lead time or duration never differs between pages.

## 6. Images

- [ ] ⚙ **Alt text on every image** (decorative images get `alt=""`). Describe what's actually shown ("Excavator with hydraulic thumb pulling down a brick wall"). Never claim stock is a Dunn job ("Dunn crew demolishing…" only on real Dunn photos).
- [ ] ⚙ **`width` + `height` on every image**
- [ ] **Descriptive filenames,** like `excavator-demolishing-house.webp` or `crushed-concrete-21a-stockpile.webp`
- [ ] **WebP or AVIF,** content images under 150 KB, hero poster under 200 KB
- [ ] **Hero not lazy** (`fetchpriority="high"`). Everything below the fold is lazy. The 3D canvas is never the hero's LCP element: the poster image or the H1 is.
- [ ] **Real Dunn photos before stock.** Unsplash only where no real photo exists, and every one is logged in `data/image-credits.csv`.
- [ ] **OG image** 1200×630 per page (falls back to the site default: logo on black and yellow)

## 7. Internal links

- [ ] **Blog posts: 3–5 internal links,** at least **one to the matching service page** and one to `/contact` (or `/buy` for stone topics)
- [ ] **Service pages: link to 2–3 related services** (house demolition ↔ pool removal ↔ tank removal ↔ site clearing), the location pages where it's offered, and related posts once they exist
- [ ] **Location pages: link to the services offered there** and the nearest yard's details on `/services` or `/contact`
- [ ] **`/buy` is linked** from the concrete recycling service page, the home stone banner and every stone or material blog post
- [ ] **`/faqs` is linked** from the home FAQ block and every service page FAQ
- [ ] **Descriptive anchors.** Never "click here" or "read more".
- [ ] ⚙ **Breadcrumbs on every page except home**
- [ ] **No orphan pages.** Every page is in the nav, the footer, or linked from a parent page.

## 8. External links

- [ ] **Blog posts: 2–3 authoritative sources:** VDOT specifications, city permit pages (Virginia Beach, Chesapeake, Norfolk), Virginia DPOR, EPA, OSHA, utility companies' disconnect pages. Never a competitor's blog.
- [ ] **Every link opened and checked** before publishing
- [ ] ⚙ **`target="_blank"` always with `rel="noopener"`**

## 9. Schema (JSON-LD)

Generated from `lib/site.ts` + content via `lib/seo.ts`. Never hand-typed.

| Schema | Where |
|--------|-------|
| `HomeAndConstructionBusiness` (a `LocalBusiness` subtype) + `WebSite` | site-wide. Full NAP, hours, `areaServed` (VA, NC, MD), `foundingDate` 1974, each yard as a `department` |
| `Service` (`provider` → the business) | `/services`, service pages, location pages (with `areaServed` set to that city) |
| `Product` + `Offer` per material | `/buy`, prices from `stats.md` only |
| `BlogPosting` (`author` + `publisher` → the business) | blog posts |
| `BreadcrumbList` | every page except home |
| `FAQPage` | any page with a visible FAQ |

- [ ] ⚙ **Every block parses**
- [ ] **Passes Google's Rich Results Test**
- [ ] **Schema only describes what's visible.** The NAP, hours and prices in the schema match the page text exactly.
- [ ] **No `Review` or `AggregateRating`** from Dunn's own site about Dunn (Google treats these as self-serving). Real reviews live on the Google Business Profile.

## 10. E-E-A-T and local trust

This is where a local contractor site wins or loses.

- [ ] **Byline "Dunn Demolition"** on every post, linking to `/about` (switch to a named person only once Dunn names one in `voice.md`)
- [ ] **Company card** at the end of every post: logo, one line ("Demolition contractor since 1974, Virginia Class A, fully insured"), phone, and a link to `/about`
- [ ] **Published and "Last updated" dates** visible, matching the schema
- [ ] **Real proof:** numbers, licenses, insurance and photos from `references/` only
- [ ] **About page** with the real history, license and insurance list, crews and equipment, and real crew or yard photos once supplied
- [ ] **NAP is identical everywhere:** name, address and phone in the footer, on `/contact`, in the schema and on the Google Business Profile, character for character
- [ ] **Phone number on every page,** as a tap-to-call link

## 11. Accessibility

- [ ] ⚙ **Landmarks:** `<header>`, `<nav>`, `<main>`, `<footer>`, plus `<article>` for posts
- [ ] ⚙ **Skip-to-content link** first
- [ ] **Contrast** ≥ 4.5:1 for body text and ≥ 3:1 for large text. Safety yellow `#E7B008` goes behind black text or on black, never as text on white.
- [ ] **Visible focus rings** (black on yellow buttons, yellow on dark sections)
- [ ] **Labels on every form field.** The GeniusNex embed gets a `title` on its iframe.
- [ ] ⚙ **No vague link text**
- [ ] **FAQ accordions** use real `<button>`s with `aria-expanded` and `aria-controls`, and the answers stay in the HTML
- [ ] **The pricing guide is a real `<table>`** with header cells, not styled divs
- [ ] **The 3D canvas is `aria-hidden="true"`** and holds no content. Everything it shows also exists as text or as an image with alt text.
- [ ] **Motion respects `prefers-reduced-motion`:** no 3D animation, parallax, smooth scroll or count-ups, only final states

## 12. Mobile

- [ ] Body text ≥ 16 px, tap targets ≥ 48 px, no horizontal scroll at 360 px, no popups on load
- [ ] **Tap-to-call** is visible in the header (or a sticky bar) on mobile on every page

## 13. Conversion (home, core, service and location pages)

- [ ] ⚙ **"Get a free quote" CTA above the fold** linking to `/contact`, with the phone number beside it
- [ ] **CTA repeated** after proof, mid-page and at the end of the page
- [ ] **"Free consultation" framing:** we look at the site, explain what's involved (permits, disconnects, timing) and give a written quote, with no pressure
- [ ] **Proof near every CTA:** "since 1974", "VA Class A", "fully insured" or "50–75% recycled"
- [ ] **Service pages follow this order:** what it is → who it's for (with one "not for" sentence, such as "a garden shed you can take apart in a weekend") → how we do it (max 5 bullets) → proof → 3 FAQs → free quote. Nothing else.
- [ ] **Pricing honesty:** demolition is quoted per job, so never publish a demolition price. Material prices only from `stats.md`.
- [ ] **Testimonials only if confirmed** as real in `stats.md`. None is better than invented.

## 14. Location pages (extra rules)

These carry a doorway-page risk. Google penalizes the same page with the city name swapped.

- [ ] **Only build one where Dunn actually works** (confirmed by Dunn) **and** there's search demand in `data/keywords.csv`
- [ ] **50%+ of the copy unique to that city:** its permit office and process, distance from the nearest Dunn yard, the types of jobs common there, and local landmarks or neighborhoods only where they're relevant
- [ ] **A real local detail** from `stories.md` or `stats.md` (a job there, the nearest yard), or don't build the page

## 15. Long-form (1,500+ words)

- [ ] **Table of contents** linking to each H2, ⚙ **an `id` on every H2**, and a **back-to-top** link

---

## How to use this file

1. Every page skill reads this first.
2. Every page passes every item for its type.
3. Run `npm run build && npm run verify`. Missing ⚙ items fail the check.
4. Read the page once against everything else, then ship.
5. Site-wide technical items live in `technical-seo.md`.
