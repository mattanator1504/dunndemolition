# Technical SEO — matthewrissik.com

Site-wide technical SEO. Built once when the site is scaffolded, re-checked before every deploy.
On-page items (titles, headings, schema per page) live in `on-page-seo.md`.

**Target:** Lighthouse **100 / 100 / 100 / 100** (Performance, Accessibility, Best Practices, SEO) on desktop.

**Honest note on mobile Performance:** Lighthouse's mobile test simulates a slow phone on a slow network, and the score moves a few points between runs on the same page. Accessibility, Best Practices and SEO must be 100 on mobile too. Mobile Performance must be **≥ 95 on three runs in a row**; chase 100 but don't wreck the design for the last two points.

---

## 1. Build setup (Next.js static export)

`next.config.ts`:

```ts
const nextConfig = {
  output: 'export',          // every page pre-rendered to HTML in /out
  trailingSlash: false,      // /blog/my-post — matches the current GoHighLevel URLs, so nothing needs redirecting
  images: { unoptimized: true }, // static export can't resize at runtime → we pre-optimise images ourselves
};
export default nextConfig;
```

Rules that keep it static (breaking any of these breaks the export):
- No `cookies()`, `headers()`, `searchParams` in server components
- No `cache: 'no-store'`, no `dynamic = 'force-dynamic'`, no API routes
- Every `[slug]` route has `generateStaticParams`
- All content read at build time from `/content`

`app/layout.tsx` sets once, for every page:
- `metadataBase: new URL(site.url)` — so every canonical and OG URL is absolute
- `<html lang="en-US">`
- Default OG image, Twitter card, icons
- Organization + Person (Matthew) + WebSite JSON-LD
- Google Search Console verification (`metadata.verification.google`) once you have the code

## 2. Crawling and indexing

- [ ] **`app/robots.ts`** — allow all, point at the sitemap. Add `export const dynamic = 'force-static'`.
  ```ts
  export const dynamic = 'force-static';
  export default function robots() {
    return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${site.url}/sitemap.xml` };
  }
  ```
- [ ] **`app/sitemap.ts`** — generated from `/content` so new pages appear automatically. `force-static`. Every indexable page, with `lastModified` from the content's `updated` date. No redirects, no 404s, no noindex pages in it.
- [ ] **Canonical on every page** via `metadata.alternates.canonical`
- [ ] **`app/not-found.tsx`** — a real 404 page with links to services and contact (exports to `404.html`)
- [ ] **One domain version:** `https://matthewrissik.com`. `www` 301s to it (set in Vercel domains).
- [ ] **Old URLs redirect.** Every URL on the current site either exists at the same path or has a 301 in `vercel.json` (see §9).
- [ ] **`/book`, `/privacy`, `/terms`** can be `noindex` and left out of the sitemap.
- [ ] **No staging/preview URLs indexed** — preview deployments get `X-Robots-Tag: noindex` from the host (Vercel does this by default)

## 3. Performance (Core Web Vitals)

Targets: **LCP < 2.5 s, CLS < 0.1, INP < 200 ms**, Total Blocking Time ≈ 0.

**Images** (the #1 cause of lost points)
- [ ] Pre-optimise every image to **WebP**, sized to the largest it displays at — `scripts/` or `sharp` at download time, not at runtime
- [ ] Hero image: **not lazy**, `fetchpriority="high"`, under 200 KB
- [ ] Everything below the fold: `loading="lazy"`
- [ ] `width` + `height` on every `<img>`
- [ ] No images used as text, no huge background images in CSS

**Fonts**
- [ ] `next/font` only (self-hosted at build, no request to Google on load), `display: 'swap'`
- [ ] **Max 2 families, max 4 weights total.** Every extra weight is another file.

**JavaScript**
- [ ] Server components by default. `'use client'` only for things that genuinely need it (mobile menu, accordion). No animation libraries for simple fades — use CSS.
- [ ] **No third-party scripts on page load.** These are what usually stop you hitting 100:
  | Script | Do this instead |
  |--------|-----------------|
  | GoHighLevel calendar embed | Only on `/book`, loaded on click ("Show available times") or after the page has painted. Every other page links to `/book`. |
  | GoHighLevel form / chat widget | No chat widget. Forms: link to `/book`, or a plain HTML form posting to a GoHighLevel webhook/form endpoint — no embed script on content pages |
  | GoHighLevel tracking script | `next/script` with `strategy="lazyOnload"`, or drop it if the calendar already captures the lead |
  | Google Maps iframe | Not needed — not a local business |
  | YouTube embed | Thumbnail + play button that swaps in the iframe on click |
  | Live chat widget | Load on first scroll/interaction, or skip it |
  | Google Analytics / GTM | `next/script` with `strategy="lazyOnload"`, or a lightweight analytics (Plausible, Cloudflare Web Analytics) |
    | Facebook pixel, Hotjar, etc. | Only if genuinely used; `lazyOnload` |
- [ ] Re-run Lighthouse after adding **any** script.

**CSS**
- [ ] Tailwind only, purged at build. No CSS frameworks or icon fonts loaded from a CDN.
- [ ] Icons as inline SVG.

**Caching** (host config — `vercel.json`, `_headers` for Cloudflare/Netlify)
- [ ] `/_next/static/*` → `Cache-Control: public, max-age=31536000, immutable`
- [ ] Images → long cache

## 4. Accessibility (must be 100)

The usual failures, in the order they come up:
- [ ] Text contrast under 4.5:1 (light grey text, white text on the accent colour) — check the accent colour first
- [ ] Links distinguishable only by colour inside body text → underline them
- [ ] Icon-only buttons with no `aria-label` (menu toggle, social icons)
- [ ] Form inputs with no `<label>`
- [ ] Heading levels skipped (an H4 used for styling)
- [ ] Tap targets too small or too close (footer links, social icons)
- [ ] `<html>` missing `lang`
- [ ] Duplicate `id`s (two accordions using the same ids)
- [ ] Missing skip link, missing `<main>`

## 5. Best Practices (must be 100)

- [ ] HTTPS everywhere, no mixed content (no `http://` image or script URLs)
- [ ] **Zero console errors** on every page
- [ ] Images displayed at their real aspect ratio, served at the right resolution
- [ ] No deprecated APIs, no `document.write`
- [ ] Source maps not required; don't ship them to production
- [ ] Security headers at the host: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`

## 6. SEO category (must be 100)

Lighthouse's SEO check is basic, so a failure here means something is badly wrong:
- [ ] Title and meta description present
- [ ] Page is not blocked by `noindex` or robots.txt
- [ ] Valid `robots.txt`
- [ ] Links have descriptive text and are crawlable (`<a href>`, not JS click handlers)
- [ ] Images have alt
- [ ] Valid `hreflang` (only if the site has languages — usually skip)
- [ ] Canonical is valid

## 7. How to test

```bash
npm run build                     # must show every route as ○ (Static)
npm run verify                    # on-page checks across every built page
npx serve out -l 3000             # serve the static build (NOT npm run dev — dev mode scores badly)
npx lighthouse http://localhost:3000/ --preset=desktop --view
npx lighthouse http://localhost:3000/ --view          # mobile (default)
```

Test at least: home, one service page, one case study, one blog post, `/roi-calculator` and `/book`. They use different templates, so they fail differently.

After deploying, re-test the live URL on [PageSpeed Insights](https://pagespeed.web.dev/) — that's the score clients and tenants will look at.

## 8. After launch

- [ ] Google Search Console: verify (DNS TXT record is best — covers every subdomain and protocol; `metadata.verification.google` works too)
- [ ] Submit `sitemap.xml` in Search Console
- [ ] URL Inspection → Request indexing for home + each service page
- [ ] Bing Webmaster Tools: import from Search Console (two clicks)
- [ ] Google Business Profile linked to the site (if the business has one)
- [ ] Check Search Console → Pages after 7 days: anything "Crawled – currently not indexed" usually needs more unique content or more internal links

## 9. Moving off GoHighLevel (one-time)

The current site runs on GoHighLevel. GoHighLevel stays as CRM, calendar and forms; only the website moves.

1. **Inventory every live URL** before building: home, `/services`, `/projects`, `/about`, `/blog`, every `/blog/...` post, `/roi-calculator`, the case study pages, `/privacy`, `/terms`, and anything else in the GoHighLevel site builder or Search Console → Pages. Save the list in `data/url-inventory.csv`.
2. **Same path where possible.** Blog slugs stay identical.
3. **301 everything else** in `vercel.json`:
   ```json
   {
     "redirects": [
       { "source": "/silver-soloutions", "destination": "/projects/silver-solutions", "permanent": true },
       { "source": "/fractional-ceo", "destination": "/projects/fractional-ceo", "permanent": true }
     ]
   }
   ```
4. **Keep the booking links working.** Find every place a calendar link is used (email signatures, LinkedIn, Instagram bio, cold email sequences) and make sure the URL still works after the switch.
5. **Switch DNS last** (see the `launch` skill), after the new site passes `seo-audit` on its Vercel preview URL.
6. **After the switch:** Search Console → Pages and Crawl stats daily for two weeks. Any 404 from an old URL gets a 301.
