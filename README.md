# Dunn Demolition — site kit

Everything Claude Code needs to rebuild the Dunn Demolition website as a fast, fully SEO-optimised static site with 3D and scroll motion, and later to add service pages, service-area pages and blog posts quickly.

```
dunndemolition/
├── CLAUDE.md                 project guide: site map, stack, schema, design, rules
├── on-page-seo.md            checklist every page passes (home, service, location, blog)
├── technical-seo.md          Lighthouse spec, 3D/motion performance budget, form embeds
├── PROMPTS.md                the short prompts that run everything
├── .claude/skills/
│   ├── rebuild-site/         inventory the live site → rebuild the six pages with the same URLs
│   ├── write-service-page/   one page per service (/services/residential-demolition), after approval
│   ├── write-location-page/  service-area pages (/service-areas/virginia-beach), after approval
│   ├── write-blog-post/      keyword → search-results research → post as Dunn Demolition
│   ├── seo-audit/            checker + Lighthouse until it passes
│   └── launch/               GitHub, Vercel, safe DNS switch, Search Console
├── references/               voice, stats (prices, hours, addresses), stories, used keywords
├── scripts/verify-seo.mjs    automatic checker (npm run verify)
└── data/
    ├── keywords.csv          drop the keyword export here
    ├── url-inventory.csv     every live URL and where it goes
    └── image-credits.csv     every Unsplash photo used: file, photographer, source URL
```

## Fill these before running `/rebuild-site`

- `CLAUDE.md` → the live domain
- `references/stats.md` → the correct Saturday hours, which address goes on the Contact page, the demolition quote form ID, and whether the three testimonials are real
- `references/stories.md` → the company history (who founded it in 1974, how it grew, the MHR Recycling yard)
- `references/voice.md` → how Dunn talks to customers
- `data/keywords.csv` → your keyword export
- The logo file and any real job, crew or equipment photos (these replace stock)

Anything left as `[FILL]` is hidden on the site, not guessed.

## Decisions already made (change them in CLAUDE.md if you disagree)

- **Same six URLs:** `/`, `/about`, `/services`, `/faqs`, `/buy`, `/contact`. No trailing slashes, so nothing needs a redirect.
- **The apex domain is canonical.** `www` redirects to it.
- **3D and motion with a speed budget.** The hero is a real-time 3D scene (three.js / React Three Fiber) with GSAP scroll animation, but the text and a poster image render first, the 3D loads after, and reduced-motion users get a static page.
- **Photos come from Unsplash** and are self-hosted with credits logged. They're never captioned as Dunn's own work, and real Dunn photos replace them when supplied.
- **GeniusNex (GoHighLevel) stays** for both quote forms. The embeds load only on the Contact and Buy pages, on interaction.
- **Brand kept:** black, white and safety yellow `#E7B008`, square corners, Space Grotesk and DM Sans.
- **Phase 2 needs approval:** service pages, service-area pages and blog posts come only after the six-page rebuild is signed off.
- **US spelling**, `lang="en-US"`.
