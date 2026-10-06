// Renders build-time images with headless Chromium (run after `next build`):
// - public/images/hero-wall-poster.webp: the 3D wall's first frame (the hero poster)
// - public/og/default.png: 1200x630 share image
// - app/icon.png and app/apple-icon.png
// Usage: npm run build && node scripts/render-assets.mjs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright'));
}

const root = path.resolve(import.meta.dirname, '..');
const port = 4317;
const server = spawn('npx', ['serve', 'out', '-l', String(port), '--no-request-logging'], { cwd: root, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  // 1. Poster: render the live scene once at the frame aspect, transparent background.
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${port}/?poster=1`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__posterReady === true, null, { timeout: 30000 });
  const W = 1400;
  const dataUrl = await page.evaluate((W) => {
    const canvas = document.querySelector('#hero canvas');
    const aspect = window.__frameAspect;
    canvas.style.position = 'fixed';
    canvas.style.width = `${W / 2}px`;
    canvas.style.height = `${W / 2 / aspect}px`;
    window.__heroScene.resize();
    window.__heroScene.renderOnce();
    return canvas.toDataURL('image/png');
  }, W);
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  const meta = await sharp(png).metadata();
  await sharp(png).resize({ width: 1200 }).webp({ quality: 74, alphaQuality: 80, effort: 6 }).toFile(path.join(root, 'public/images/hero-wall-poster.webp'));
  const out = await sharp(path.join(root, 'public/images/hero-wall-poster.webp')).metadata();
  await fs.writeFile(path.join(root, 'lib/poster.generated.json'), JSON.stringify({ width: out.width, height: out.height }, null, 2) + '\n');
  console.log('poster', meta.width, 'x', meta.height, '→', out.width, 'x', out.height);

  // 2. OG image and icons, drawn in HTML with the site's fonts.
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const posterB64 = (await fs.readFile(path.join(root, 'public/images/hero-wall-poster.webp'))).toString('base64');
  await og.setContent(`<!doctype html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=DM+Sans:wght@500&display=block" rel="stylesheet">
    <style>
      *{margin:0;box-sizing:border-box} body{width:1200px;height:630px;background:#0A0A0A;color:#fff;font-family:'DM Sans';position:relative;overflow:hidden}
      .wall{position:absolute;right:-60px;top:40px;width:720px}
      .glow{position:absolute;right:0;top:0;width:800px;height:630px;background:radial-gradient(55% 55% at 55% 45%,rgba(231,176,8,.18),transparent 70%)}
      .txt{position:absolute;left:64px;top:70px;width:640px}
      .tag{display:inline-block;border:3px solid #E7B008;color:#E7B008;font:700 22px 'Space Grotesk';text-transform:uppercase;padding:6px 14px;letter-spacing:.02em}
      h1{font:700 118px/0.86 'Space Grotesk';text-transform:uppercase;letter-spacing:-.035em;margin-top:34px}
      h1 span{color:#E7B008}
      p{font:700 30px/1.15 'Space Grotesk';text-transform:uppercase;margin-top:30px;color:#fff;width:560px}
      .haz{position:absolute;left:0;right:0;bottom:0;height:22px;background:repeating-linear-gradient(-45deg,#E7B008 0 18px,#0A0A0A 18px 36px)}
    </style></head><body>
      <div class="glow"></div><img class="wall" src="data:image/webp;base64,${posterB64}">
      <div class="txt"><span class="tag">Since 1974 · VA Class A</span><h1>We break it <span>down.</span></h1><p>Dunn Demolition<br>Hampton Roads, Virginia</p></div>
      <div class="haz"></div></body></html>`);
  await og.waitForLoadState('networkidle');
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: path.join(root, 'public/og/default.png') });
  console.log('og image done');

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 34 34">
    <rect width="34" height="34" fill="#0A0A0A"/><rect x="3" y="3" width="28" height="28" fill="#E7B008"/>
    <rect x="7.5" y="19.5" width="8" height="7" fill="#0A0A0A"/><rect x="17.5" y="19.5" width="9" height="7" fill="#0A0A0A"/>
    <rect x="7.5" y="10.5" width="11" height="7" fill="#0A0A0A"/><rect x="20" y="8" width="7" height="7" fill="#0A0A0A" transform="rotate(18 23.5 11.5)"/></svg>`;
  await sharp(Buffer.from(iconSvg)).resize(512).png().toFile(path.join(root, 'app/icon.png'));
  await sharp(Buffer.from(iconSvg)).resize(180).png().toFile(path.join(root, 'app/apple-icon.png'));
  console.log('icons done');
  // Keep an existing static build in step with the new files.
  for (const f of ['public/images/hero-wall-poster.webp', 'public/og/default.png']) {
    const dest = path.join(root, 'out', f.replace(/^public\//, ''));
    await fs.mkdir(path.dirname(dest), { recursive: true }).catch(() => {});
    await fs.copyFile(path.join(root, f), dest).catch(() => {});
  }
} finally {
  await browser.close();
  server.kill();
}
