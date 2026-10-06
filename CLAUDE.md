# Dunn Demolition — project guide

**What this is:** the website for **Dunn Demolition** ("Dunn Demo"): residential, commercial and industrial demolition, interior gut-outs, site clearing, concrete recycling and recycled stone sales. In business since 1974, a Virginia Class A Contractor, serving Virginia, North Carolina and Maryland from Chesapeake and Virginia Beach, VA.
**Job of the site:** get property owners, developers and contractors to **request a free demolition quote**, and get stone buyers to **request a material quote**. Everything else supports those two actions.
**Domain:** `[FILL]` (the current preview is https://dunndemolition.renovostudio.co). The apex domain is canonical and `www` 301s to it.
**Spelling:** US English, `lang="en-US"`

This rebuilds the current single-page-app site as a static Next.js site with 3D and scroll motion. The GeniusNex (GoHighLevel) form backend stays. This repo replaces only the website.

---

## Read first, every time

| Before you… | Read |
|-------------|------|
| Do anything | this file |
| Write any words a visitor will read | `references/voice.md` → `stats.md` → `stories.md` |
| Write a blog post | the row above, plus `references/humor.md` → `opinions.md` (blog only, never on site pages) |
| Pick a keyword | `references/used-keywords.md` |
| Build or edit any page | `on-page-seo.md` |
| Touch layout, 3D, motion, config, scripts, redirects or deploy | `technical-seo.md` |
| Add or swap a photo | `data/image-credits.csv` and the Images section below |

## Skills (`.claude/skills/`)

| Skill | Use it to |
|-------|-----------|
| `rebuild-site` | Rebuild the current six pages with the same URLs and facts, faster, fully optimised, in 3D and motion |
| `write-service-page` | Build one page per service, such as `/services/residential-demolition` (needs approval first) |
| `write-location-page` | Build a service-area page, such as `/service-areas/virginia-beach`, under the anti-doorway rule (needs approval first) |
| `write-blog-post` | Pick a keyword, research the search results, and write one post as Dunn Demolition with full on-page SEO (needs approval first) |
| `seo-audit` | Run the checker and Lighthouse and fix everything until it passes |
| `launch` | Push to GitHub, deploy, switch the domain safely, set up Search Console and Google Business Profile links |

---

## Non-negotiables

1. **Never invent facts.** Every number, price, address, hour, license, project and testimonial comes from `references/stats.md` and `references/stories.md`. Don't invent reviews, ratings, client names, project photos, years in business or results. A `[FILL]` gap gets written around, not filled with a guess.
2. **Stock is never presented as Dunn's work.** Unsplash photos set the scene. They're never captioned as a Dunn job, a Dunn crew or Dunn equipment. When Dunn supplies real job photos, those replace stock.
3. **No outcome promises.** State what Dunn does and the typical ranges in `stats.md`, such as "residential demolitions typically take 2 to 4 days." Never guarantee a price, date or result.
4. **Company voice.** Write as "we" (Dunn Demolition). Write plainly and directly, like a contractor who's done this for 50 years. See `voice.md`.
5. **Voice and SEO on the first draft.** Don't write a plain draft that gets "voiced" or "SEO'd" later.
6. **One primary keyword per page, never reused.** Log it in `references/used-keywords.md` before writing.
7. **Keep live URLs.** `/`, `/about`, `/services`, `/faqs`, `/buy` and `/contact` keep the same paths. Any URL that changes gets a 301 in `vercel.json`.
8. **Static only.** Nothing that breaks `output: 'export'`.
9. **Motion never costs content or speed.** All text is in the HTML. 3D loads after first paint, is never the LCP element, and has a static fallback. Everything respects `prefers-reduced-motion`.
10. **New page types need approval.** Service pages, location pages and blog posts are built only after the six-page rebuild is signed off.
11. **Build passes before "done".** `npm run build && npm run verify` with zero errors.

---

## Tech stack

- **Next.js** (App Router, latest stable) + **TypeScript**
- **Static export:** `output: 'export'`, `trailingSlash: false`, so the current URLs work without redirects
- **Tailwind CSS**
- **3D:** `three` via `@react-three/fiber` + `@react-three/drei`. Client components loaded with `next/dynamic` (`ssr: false`), mounted on idle or when scrolled into view.
- **Motion:** GSAP + ScrollTrigger for scroll-driven sequences, and Lenis for smooth scroll (off under reduced motion). Small UI transitions use CSS.
- **Content:** TypeScript files in `/content`
- **Images:** Unsplash, downloaded once and self-hosted as pre-optimised WebP/AVIF in `/public/images`, with the photographer credited in `data/image-credits.csv`. Real Dunn photos replace stock as they arrive. Don't hotlink.
- **Forms:** GeniusNex (GoHighLevel) embeds, loaded on interaction or when in view (see `technical-seo.md`). The material quote form is `xb5iVcnYUS5fS3lUUw3z`. The demolition quote form ID is `[FILL]`.
- **Hosting:** Vercel, deployed from GitHub. Redirects and headers live in `vercel.json`.
- **Checker:** `scripts/verify-seo.mjs` (`npm run verify`)

## Site map

**Phase 1: rebuild (same URLs as the live site)**

| URL | Page | Notes |
|-----|------|-------|
| `/` | Home | 3D hero "We break it down." → stats → 6 service cards → why Dunn → recycled stone banner → how it works (4 steps) → testimonials (only if verified) → 4 FAQs → quote CTA. Keep it to 600 words or fewer. |
| `/about` | About | The Dunn legacy since 1974, crews and experience, licensing and insurance, safety and permits |
| `/services` | Services overview | Demolition services, recycling and stone sales, equipment, locations and hours, who to call |
| `/faqs` | FAQs | All 19 Q&As, FAQPage schema |
| `/buy` | Buy materials | Pricing guide and material quote form |
| `/contact` | Contact | Phone, email, service area, hours, demolition quote form |
| `/privacy` | Privacy | New page, required because of the forms |

**Phase 2: only after approval**

| URL | Page | Notes |
|-----|------|-------|
| `/services/[slug]` | Service pages | Commercial, residential, interior gut-outs, industrial dismantling, site clearing and concrete removal, oil and septic tank removal, pool removal, tree removal, concrete recycling, container and hauling |
| `/service-areas/[slug]` | Location pages | Only for areas Dunn actually works, with real local detail. No city-swapped copies. |
| `/blog` | Blog index | |
| `/blog/[slug]` | Posts | |

## File structure

```
app/
  layout.tsx                    lang, fonts, header, footer, metadataBase, LocalBusiness + WebSite schema
  page.tsx                      home
  about/page.tsx
  services/page.tsx
  services/[slug]/page.tsx      phase 2
  service-areas/[slug]/page.tsx phase 2
  faqs/page.tsx
  buy/page.tsx
  contact/page.tsx
  blog/page.tsx  blog/[slug]/page.tsx   phase 2
  privacy/page.tsx  not-found.tsx
  sitemap.ts  robots.ts
components/
  site/       Header, Footer, SkipLink, QuoteButton, CallButton, Breadcrumbs
  sections/   Hero, Stats, ServiceCards, WhyDunn, StoneBanner, Process, Testimonials, Faq, PricingTable, Locations, QuoteCta
  three/      HeroScene, DebrisField, Excavator (all 'use client', dynamic import only)
  motion/     Reveal, Parallax, CountUp, SmoothScroll ('use client')
  forms/      GeniusNexForm (facade → iframe on interaction)
  seo/        JsonLd + one builder per schema type
content/
  services/*.ts  areas/*.ts  blog/*.ts  faqs.ts  pricing.ts
lib/
  site.ts        single source of truth that mirrors references/stats.md
  seo.ts         buildMetadata() + schema builders
  content.ts     loaders used by pages AND sitemap
references/      voice, humor (blog only), opinions, stats, stories, used-keywords
data/            keywords.csv, url-inventory.csv, image-credits.csv
public/images/   public/models/ (compressed .glb, Draco/Meshopt)   public/og/
scripts/verify-seo.mjs
vercel.json      redirects + headers
```

## How the pieces connect

- **`lib/site.ts` mirrors `references/stats.md`**: name, phones, email, addresses, hours, licenses, headline stats, pricing. Components import from it. Never hard-code a phone number, price or stat in a component. When a number changes, it changes in one place.
- **`lib/seo.ts`** has `buildMetadata({ title, description, path, image, type })` and the schema builders. Every page uses them.
- **Content files** carry `slug`, `title`, `metaDescription`, `h1`, `primaryKeyword`, `secondaryKeywords`, `published`, `updated`, `heroImage`, `answer`, `body`, `faqs` and `relatedServices`.
- **`sitemap.ts` reads `lib/content.ts`**, so new pages appear automatically.

## Schema for this site

This is a local business with three physical locations.

- **Site-wide:** `HomeAndConstructionBusiness` (as a `LocalBusiness` subtype) for Dunn Demolition with `name`, `telephone`, `email`, `address`, `openingHoursSpecification`, `areaServed` (VA, NC, MD), `foundingDate: 1974`, `logo` and `sameAs` (Google Business Profile and socials when supplied). Each yard is listed as a `department` with its own address. Add `WebSite` too.
- **Service pages:** `Service` with `provider` → the business, `serviceType` and `areaServed`
- **Buy page:** `Product` + `Offer` per material, but only with the prices in `stats.md`
- **Blog posts:** `BlogPosting` with `author` and `publisher` → the business
- **Everywhere except home:** `BreadcrumbList`. Add `FAQPage` wherever an FAQ is visible.
- Don't add `AggregateRating` or `Review` unless the reviews are real and verifiable.

---

## Design

**Heavy-duty, 3D, in motion.** This keeps the current brand and adds depth.

- **Colors:** ink `#0A0A0A`, white `#FFFFFF`, light gray `#F5F5F5`, muted text `#525252`, and one accent, **safety yellow `#E7B008`** (`text-accent` / `bg-accent`). Yellow sits behind black text or is used as a mark on black, never as body text on white (it fails contrast). Alternate between dark and light sections.
- **Shape:** square corners (`--radius: 0`), 2px black borders, hard offset shadows (`6px 6px 0 #0A0A0A` or yellow on dark), and hazard-stripe accents used sparingly.
- **Type:** **Space Grotesk** bold for headings, all caps and tight tracking (the hero runs huge). **DM Sans** for body. Tabular numerals for stats and prices.
- **Images:** dark, high-contrast photos of excavators, rubble, concrete and stone piles, from Unsplash until Dunn supplies its own. Use duotone or darkened overlays so text stays readable.

**3D and motion**

- **Hero:** a real-time 3D scene behind "We break it down." (for example, a wall of concrete blocks that fractures and falls as you scroll, with dust particles and a slow camera dolly). The hero text and a static poster image render first. The canvas fades in after load.
- **Scroll:** sections reveal with staggered fade-up and slide; parallax on photos; stats count up; the "How it works" steps advance on a pinned scroll timeline; service cards tilt slightly in 3D on hover.
- **Rules:** one heavy 3D scene per page at most. Pause rendering when it's off-screen or the tab is hidden. Cap the device pixel ratio at 1.5. Keep each model under 1 MB. On mobile and low-power devices, use the static poster or a lighter scene. Under `prefers-reduced-motion`, show no 3D animation, smooth scroll, parallax or count-ups, only the final states.
- Tokens and rationale go at the top of `app/globals.css`.

## Known data conflicts (resolve before launch)

- **Hours:** the Services page says Mon–Fri 7am–5pm and Sat 8am–2pm. The Contact page says Sat–Sun closed.
- **Experience:** the home page says "50+ years" (company age, since 1974). The About page says "45+ years" (combined operator experience). Both can be true, so label them clearly.
- **Contact address:** the live Contact page shows a junk string. Decide which address to show.
- **Testimonials:** Robert K., Sarah M. and David T. on the live site are unverified. Keep them only if Dunn confirms they're real.

## Working rules

- Look before you create. One component per file.
- Do what's asked. Ask before adding pages, features or folders.
- Ask before publishing anything as fact that isn't in `references/`.
- Never commit secrets. `.env.local` (including `UNSPLASH_ACCESS_KEY`) is gitignored.

## Done means

- [ ] `npm run build` passes, and every route is `○ (Static)`
- [ ] `npm run verify` reports zero errors
- [ ] Changed pages have been checked against `on-page-seo.md`
- [ ] Copy has been re-read against `references/voice.md` → "Tells that it's AI-written"
- [ ] No console errors, and no WebGL errors on mobile Safari or Chrome
- [ ] Reduced motion has been checked, and the page reads fully with JS and 3D off
- [ ] Layout, 3D or script changes: Lighthouse re-run (`technical-seo.md`)
- [ ] Every new Unsplash photo is logged in `data/image-credits.csv`
