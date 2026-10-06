// Checks every built page in /out against the ⚙ items in on-page-seo.md.
// Usage: npm run build && npm run verify   (exits 1 on any error)
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'out');
const siteSrc = await fs.readFile(path.join(root, 'lib/site.ts'), 'utf8');
const siteUrl = siteSrc.match(/url:\s*'([^']+)'/)[1];

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

async function htmlFiles(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_next') continue;
      out.push(...(await htmlFiles(p)));
    } else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const VAGUE = /^(click here|here|read more|learn more|more|this|link)$/i;
const files = (await htmlFiles(outDir)).filter((f) => !/\/(404|_not-found)\.html$/.test(f));
const sitemap = await fs.readFile(path.join(outDir, 'sitemap.xml'), 'utf8').catch(() => '');

for (const file of files) {
  const rel = path.relative(outDir, file);
  const route = rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, '').replace(/\/index$/, '');
  const html = await fs.readFile(file, 'utf8');
  const doc = parse(html);
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content') ?? '';
  const robots = meta('meta[name="robots"]');
  const noindex = /noindex/.test(robots);

  // 1. Head
  const title = doc.querySelector('title')?.text ?? '';
  if (!noindex && (title.length < 50 || title.length > 60)) err(route, `title is ${title.length} chars (50–60): "${title}"`);
  if (!title.includes('Dunn Demolition')) warn(route, 'title has no "| Dunn Demolition" suffix');
  const desc = meta('meta[name="description"]');
  if (!noindex && (desc.length < 140 || desc.length > 160)) err(route, `meta description is ${desc.length} chars (140–160)`);
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const expected = route === '/' ? siteUrl : `${siteUrl}${route}`;
  if (canonical !== expected) err(route, `canonical "${canonical}" should be "${expected}"`);
  if (canonical.length > siteUrl.length && canonical.endsWith('/')) err(route, 'canonical has a trailing slash');
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) if (!meta(`meta[property="${p}"]`)) err(route, `missing ${p}`);
  if (meta('meta[name="twitter:card"]') !== 'summary_large_image') err(route, 'twitter:card should be summary_large_image');
  if (doc.querySelector('html')?.getAttribute('lang') !== 'en-US') err(route, 'html lang should be en-US');
  if (!doc.querySelector('meta[charset]') && !/charset/i.test(html.slice(0, 500))) err(route, 'missing charset');
  if (!doc.querySelector('meta[name="viewport"]')) err(route, 'missing viewport');

  // 2. URL
  if (route !== route.toLowerCase() || /[_ ]/.test(route)) err(route, 'URL should be lowercase with hyphens');

  // 3. Headings
  const main = doc.querySelector('main');
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length !== 1) err(route, `${h1s.length} <h1> elements (need exactly 1)`);
  let prev = 1;
  for (const h of main?.querySelectorAll('h1, h2, h3, h4, h5, h6') ?? []) {
    const level = Number(h.tagName[1]);
    if (level > prev + 1) err(route, `heading jumps h${prev} → h${level} at "${h.text.trim().slice(0, 50)}"`);
    prev = level;
  }

  // 6. Images
  for (const img of doc.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (img.getAttribute('alt') === undefined) err(route, `img without alt: ${src}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) err(route, `img without width/height: ${src}`);
  }

  // 7–8. Links
  for (const a of doc.querySelectorAll('a')) {
    const text = (a.text || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    if (VAGUE.test(text)) err(route, `vague link text "${text}"`);
    if (!text && !a.querySelector('img[alt]:not([alt=""])')) err(route, `link with no accessible name: ${a.getAttribute('href')}`);
    if (a.getAttribute('target') === '_blank' && !/noopener/.test(a.getAttribute('rel') ?? '')) err(route, `target=_blank without rel=noopener: ${a.getAttribute('href')}`);
  }
  if (route !== '/' && !doc.querySelector('nav[aria-label="Breadcrumb"]')) err(route, 'missing breadcrumbs');

  // 9. Schema
  const blocks = doc.querySelectorAll('script[type="application/ld+json"]');
  const types = [];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b.text);
      const collect = (d) => {
        if (Array.isArray(d)) return d.forEach(collect);
        if (d && typeof d === 'object') {
          if (d['@type']) types.push(d['@type']);
          if (d['@graph']) collect(d['@graph']);
        }
      };
      collect(data);
    } catch (e) {
      err(route, `JSON-LD does not parse: ${e.message}`);
    }
  }
  if (!types.includes('HomeAndConstructionBusiness')) err(route, 'missing business schema');
  if (route !== '/' && !types.includes('BreadcrumbList')) err(route, 'missing BreadcrumbList schema');
  const hasFaq = main?.querySelectorAll('details').length > 0;
  if (hasFaq && !types.includes('FAQPage')) err(route, 'visible FAQ but no FAQPage schema');
  if (types.includes('AggregateRating') || types.includes('Review')) err(route, 'self-serving Review/AggregateRating schema');

  // 11. Accessibility landmarks
  for (const tag of ['header', 'nav', 'main', 'footer']) if (!doc.querySelector(tag)) err(route, `missing <${tag}>`);
  const firstLink = doc.querySelector('body a');
  if (firstLink?.getAttribute('href') !== '#main') err(route, 'skip link is not the first link');

  // 13. Conversion: a quote CTA in the page
  if (!noindex && route !== '/contact' && !doc.querySelectorAll('main a[href="/contact"]').length) err(route, 'no "Get a free quote" link to /contact in the page body');

  // 4. Length limits
  const words = (main?.text ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const limits = { '/': 600, '/services': 700 };
  if (limits[route] && words > limits[route]) err(route, `${words} words in <main> (limit ${limits[route]})`);
  if (words > 1500) {
    for (const h2 of main.querySelectorAll('h2')) if (!h2.getAttribute('id')) err(route, `long page: h2 without id "${h2.text.slice(0, 40)}"`);
  }

  // Sitemap
  if (!noindex && !sitemap.includes(`<loc>${expected}</loc>`)) err(route, 'indexable page missing from sitemap.xml');
  if (noindex && sitemap.includes(`<loc>${expected}</loc>`)) err(route, 'noindex page is in sitemap.xml');

  console.log(`${errors.some((e) => e.startsWith(route + ':')) ? '✗' : '✓'} ${route.padEnd(10)} ${String(words).padStart(4)} words  "${title}" (${title.length})`);
}

if (warnings.length) console.log('\nWarnings:\n  ' + warnings.join('\n  '));
if (errors.length) {
  console.log(`\n${errors.length} error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`\nAll ${files.length} pages pass.`);
