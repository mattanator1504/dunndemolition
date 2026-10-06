# Technical SEO — Dunn Demolition

Site-wide technical SEO. Built once when the site is scaffolded, re-checked before every deploy.
On-page items (titles, headings, schema per page) live in `on-page-seo.md`.

**Target:** Lighthouse **100 / 100 / 100 / 100** (Performance, Accessibility, Best Practices, SEO) on desktop, **including the 3D homepage**.

**Honest note on mobile Performance:** Lighthouse's mobile test simulates a slow phone on a slow network, and the score moves a few points between runs on the same page. Accessibility, Best Practices and SEO must be 100 on mobile too. Mobile Performance must be **≥ 95 on three runs in a row** on every page. Chase 100, but don't wreck the design for the last two points. If the 3D scene can't hold 95 on mobile, mobile gets the lighter scene or the static poster (see §4). The score wins over the effect.

---

## 1. Build setup (Next.js static export)

`next.config.ts`:

```ts
const nextConfig = {
  output: 'export',          // every page pre-rendered to HTML in /out
  trailingSlash: false,      // /about, /buy, matching the current site's URLs, so nothing needs redirecting
  images: { unoptimized: true }, // static export can't resize at runtime, so we pre-optimize images ourselves
};
export default nextConfig;
```

These rules keep it static. Breaking any of them breaks the export:
- No `cookies()`, `headers()` or `searchParams` in server components
- No `cache: 'no-store'`, no `dynamic = 'force-dynamic'`, no API routes
- Every `[slug]` route has `generateStaticParams`
- All content is read at build time from `/content`

`app/layout.tsx` sets these once, for every page:
- `metadataBase: new URL(site.url)`, so every canonical and OG URL is absolute
- `<html lang="en-US">`
- Default OG image, Twitter card and icons
- `HomeAndConstructionBusiness` (LocalBusiness) + `WebSite` JSON-LD, built from `lib/site.ts`
- Google Search Console verification (`metadata.verification.google`) once you have the code

## 2. Crawling and indexing

- [ ] **`app/robots.ts`:** allow all and point at the sitemap. Add `export const dynamic = 'force-static'`.
  ```ts
  export const dynamic = 'force-static';
  export default function robots() {
    return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${site.url}/sitemap.xml` };
  }
  ```
- [ ] **`app/sitemap.ts`:** generated from `/content`, so new pages appear automatically. Use `force-static`. Include every indexable page, with `lastModified` from the content's `updated` date. No redirects, no 404s and no noindex pages in it.
- [ ] **A canonical on every page** via `metadata.alternates.canonical`
- [ ] **`app/not-found.tsx`:** a real 404 page with links to services, buy materials, contact and the phone number (exports to `404.html`)
- [ ] **One domain version:** `site.url` (the apex domain, `[FILL]` in `CLAUDE.md`). `www` 301s to it (set in Vercel domains).
- [ ] **Old URLs redirect.** Every URL on the current site either exists at the same path or has a 301 in `vercel.json` (see §10).
- [ ] **`/privacy`** can be `noindex` and left out of the sitemap.
- [ ] **No staging or preview URLs indexed.** Vercel adds `X-Robots-Tag: noindex` to preview deployments by default. The current preview (`dunndemolition.renovostudio.co`) must be noindexed or taken down at launch so it doesn't compete with the real domain.
- [ ] **All page text is in the HTML.** Nothing a crawler needs (headings, copy, prices, FAQs, NAP) is rendered only by client JS, only inside the 3D canvas, or hidden behind an animation that needs JS to show it.

## 3. Performance (Core Web Vitals)

Targets: **LCP < 2.5 s, CLS < 0.1, INP < 200 ms**, Total Blocking Time ≈ 0.

**Images** (the #1 cause of lost points)
- [ ] Pre-optimize every image to **WebP or AVIF**, sized to the largest it displays at. Do this with `sharp` when the Unsplash photo is downloaded, not at runtime.
- [ ] Hero poster image: **not lazy**, `fetchpriority="high"`, under 200 KB
- [ ] Everything below the fold: `loading="lazy"`
- [ ] `width` + `height` on every `<img>`
- [ ] No images used as text, and no huge background images in CSS (parallax photos are `<img>` elements moved with `transform`)

**Fonts**
- [ ] `next/font` only (self-hosted at build, no request to Google on load), `display: 'swap'`
- [ ] **Space Grotesk + DM Sans: max 2 families, max 4 weights in total.** Every extra weight is another file.

**JavaScript**
- [ ] Server components by default. Use `'use client'` only where it's genuinely needed (mobile menu, FAQ accordion, the 3D scene, scroll timelines).
- [ ] **Simple reveals and hovers use CSS** (`IntersectionObserver` toggling a class). GSAP is loaded only for pinned or scrubbed scroll timelines, and only on the pages that have them.
- [ ] **Animations move only `transform` and `opacity`.** Never animate `top`, `left`, `width`, `height` or `margin`, because that causes CLS and jank.
- [ ] **Content is never hidden waiting for JS.** Reveal animations start from the visible state in the HTML and only hide elements after a `js-motion` class is added. If JS fails, the page still reads perfectly.
- [ ] **No third-party scripts on page load.** These are what usually stop you hitting 100:
  | Script | Do this instead |
  |--------|-----------------|
  | GeniusNex / GoHighLevel form embed | Only on `/contact` and `/buy`. Show a facade (a styled box with the form title and a "Start your quote" button, plus the phone number) and swap in the iframe on click or when it scrolls into view. Never on content pages. |
  | GoHighLevel form embed script (`form_embed.js`) | Loaded together with the iframe above, never in the layout |
  | GoHighLevel chat widget | None. The phone number and quote form are the CTAs. |
  | GoHighLevel tracking script | `next/script` with `strategy="lazyOnload"`, or drop it if the form already captures the lead |
  | Google Maps iframe | A static map image (WebP, with alt text) linking to Google Maps directions for each yard. Swap in the iframe only on click. |
  | YouTube embed | Thumbnail + play button that swaps in the iframe on click |
  | Google Analytics / GTM | `next/script` with `strategy="lazyOnload"`, or lightweight analytics (Plausible, Cloudflare Web Analytics) |
  | Facebook pixel, Hotjar, etc. | Only if genuinely used, with `lazyOnload` |
- [ ] Re-run Lighthouse after adding **any** script.

**CSS**
- [ ] Tailwind only, purged at build. No CSS frameworks or icon fonts loaded from a CDN.
- [ ] Icons as inline SVG.

**Caching** (host config in `vercel.json`)
- [ ] `/_next/static/*` → `Cache-Control: public, max-age=31536000, immutable`
- [ ] `/images/*` and `/models/*` → long cache (use versioned filenames when they change)

## 4. 3D and motion budget

The 3D is what makes this site different. It's also the easiest way to lose the score. These rules keep both.

**Loading**
- [ ] **Three.js, React Three Fiber, drei and GSAP are never in the initial bundle.** The scene component is imported with `next/dynamic` (`ssr: false`).
- [ ] **The scene mounts after the page is interactive:** on first user interaction (scroll, pointer, touch) or `requestIdleCallback` after `load`, whichever comes first. The hero's text and poster image are fully rendered before any 3D code is downloaded.
- [ ] **The poster image sits underneath the canvas** and matches the scene's first frame, so the canvas fades in over it with no layout shift. The canvas container has fixed dimensions (zero CLS).
- [ ] **No 3D at all when it can't run well:** under `prefers-reduced-motion`, with WebGL unavailable, with `navigator.connection.saveData`, or on low-power devices (`navigator.hardwareConcurrency <= 4` or a small screen). Those visitors keep the poster.

**Weight**
- [ ] **3D JS chunk ≤ 250 KB gzipped** (three + R3F + scene code). Import only the drei helpers that are used.
- [ ] **Models:** `.glb` with Draco or Meshopt compression, **≤ 1 MB each**, in `/public/models`
- [ ] **Textures:** WebP or KTX2, max 1024 px (512 px on mobile)
- [ ] **One heavy 3D scene per page at most.** Other sections use CSS 3D (`perspective`, `rotateX/Y`) for tilt and depth, which costs no WebGL.

**Rendering**
- [ ] **DPR capped at 1.5** (`dpr={[1, 1.5]}`), and lower on mobile
- [ ] **Stop rendering when it isn't seen:** `frameloop="demand"`, or pause when the canvas leaves the viewport (`IntersectionObserver`) or the tab is hidden (`visibilitychange`)
- [ ] **Particle counts and physics bodies are capped,** with lower caps on mobile. Test on a mid-range Android phone, not just a laptop.
- [ ] **Dispose of geometries, materials and textures** on unmount, so client-side navigation doesn't leak GPU memory.
- [ ] **Smooth scroll (Lenis) is off** under reduced motion and on touch devices that already scroll natively.

## 5. Accessibility (must be 100)

The usual failures, in the order they come up:
- [ ] Text contrast under 4.5:1 (light gray text, or yellow `#E7B008` used as text on white). Check the accent color first.
- [ ] Links distinguishable only by color inside body text → underline them
- [ ] Icon-only buttons with no `aria-label` (menu toggle, social icons, tap-to-call icon)
- [ ] Form inputs with no `<label>`, or a form iframe with no `title`
- [ ] Heading levels skipped (an H4 used for styling)
- [ ] Tap targets too small or too close (footer links, phone numbers)
- [ ] `<html>` missing `lang`
- [ ] Duplicate `id`s (two accordions using the same ids)
- [ ] A missing skip link or missing `<main>`
- [ ] The 3D canvas not `aria-hidden`, or motion that ignores `prefers-reduced-motion`

## 6. Best Practices (must be 100)

- [ ] HTTPS everywhere, no mixed content (no `http://` image or script URLs)
- [ ] **Zero console errors** on every page, including WebGL and three.js warnings
- [ ] Images displayed at their real aspect ratio and served at the right resolution
- [ ] No deprecated APIs, no `document.write`
- [ ] Source maps not required. Don't ship them to production.
- [ ] Security headers at the host: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`

## 7. SEO category (must be 100)

Lighthouse's SEO check is basic, so a failure here means something is badly wrong:
- [ ] Title and meta description present
- [ ] Page not blocked by `noindex` or robots.txt
- [ ] Valid `robots.txt`
- [ ] Links have descriptive text and are crawlable (`<a href>`, not JS click handlers). The nav and CTAs work without the 3D or smooth scroll.
- [ ] Images have alt text
- [ ] Valid `hreflang` (only if the site has languages, so usually skip it)
- [ ] Canonical is valid

## 8. How to test

```bash
npm run build                     # must show every route as ○ (Static)
npm run verify                    # on-page checks across every built page
npx serve out -l 3000             # serve the static build (NOT npm run dev, because dev mode scores badly)
npx lighthouse http://localhost:3000/ --preset=desktop --view
npx lighthouse http://localhost:3000/ --view          # mobile (default)
```

Test at least: home (3D), `/services`, `/buy` (pricing table + form facade), `/contact` (form facade), `/faqs` (accordion), and once they exist, one service page, one location page and one blog post. They use different templates, so they fail differently.

Also check by hand:
- **Reduced motion on** (OS setting or DevTools emulation): no 3D, no parallax, and everything still reads
- **JavaScript off:** all text, prices, FAQs and contact details are still there
- **A real mid-range phone:** the 3D is smooth, the battery doesn't drain and the page doesn't get hot

After deploying, re-test the live URL on [PageSpeed Insights](https://pagespeed.web.dev/). That's the score Google and Dunn will look at.

## 9. After launch

- [ ] Google Search Console: verify it (a DNS TXT record is best, because it covers every subdomain and protocol; `metadata.verification.google` works too)
- [ ] Submit `sitemap.xml` in Search Console
- [ ] URL Inspection → Request indexing for home, the core pages and each service page
- [ ] Bing Webmaster Tools: import from Search Console (two clicks)
- [ ] **Google Business Profile:** link the website, match the NAP to the site exactly, set the primary category to "Demolition contractor", add the services, hours and real photos. List each yard as its own profile only if it's genuinely staffed and signed.
- [ ] **Citations:** the same name, address and phone on Bing Places, Apple Business Connect, Yelp, BBB and Angi. Fix any old listings showing a different phone or address.
- [ ] After 7 days, check Search Console → Pages. Anything "Crawled – currently not indexed" usually needs more unique content or more internal links.

## 10. Moving off the current site (one-time)

The current site is a single-page app on a site builder (preview at `dunndemolition.renovostudio.co`). Its six routes (`/`, `/about`, `/services`, `/faqs`, `/buy`, `/contact`) keep the same paths. The GeniusNex (GoHighLevel) forms stay, and only the website moves.

1. **Inventory every live URL** before building: the six routes above, plus any older URLs from a previous Dunn site on the real domain (check Search Console → Pages, the Wayback Machine and Google `site:` results). Save the list in `data/url-inventory.csv`.
2. **Same path where possible.**
3. **301 everything else** in `vercel.json`:
   ```json
   {
     "redirects": [
       { "source": "/old-path", "destination": "/new-path", "permanent": true }
     ]
   }
   ```
4. **Keep the form leads flowing.** Both GeniusNex forms (material quote `xb5iVcnYUS5fS3lUUw3z` and the demolition quote form) must submit into the same GoHighLevel pipeline after the switch. Send a test submission through each one on the preview URL.
5. **Switch DNS last** (see the `launch` skill), after the new site passes `seo-audit` on its Vercel preview URL.
6. **After the switch,** check Search Console → Pages and Crawl stats daily for two weeks. Any 404 from an old URL gets a 301.
