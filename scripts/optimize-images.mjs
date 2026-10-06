// Downloads each Unsplash photo in data/images.json once, writes WebP sizes to
// public/images, and regenerates data/image-credits.csv.
// Usage: npm run images
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'data/images.json'), 'utf8'));
const cacheDir = path.join(root, '.image-cache');
const outDir = path.join(root, 'public/images');
await fs.mkdir(cacheDir, { recursive: true });
await fs.mkdir(outDir, { recursive: true });

const dims = {};
for (const img of manifest) {
  const cached = path.join(cacheDir, `${img.file}.jpg`);
  try {
    await fs.access(cached);
  } catch {
    const res = await fetch(`https://images.unsplash.com/${img.src}?w=2400&q=85&fm=jpg`);
    if (!res.ok) throw new Error(`${img.file}: HTTP ${res.status}`);
    await fs.writeFile(cached, Buffer.from(await res.arrayBuffer()));
  }
  for (const w of img.widths) {
    const out = path.join(outDir, `${img.file}-${w}.webp`);
    // Step quality down until the file fits the budget in technical-seo.md
    // (content images < 150 KB, full-width heroes < 200 KB).
    const budget = (w > 1280 ? 200 : 150) * 1024;
    let quality = 72;
    let buf;
    do {
      buf = await sharp(cached).resize({ width: w }).webp({ quality, effort: 6 }).toBuffer();
      quality -= 6;
    } while (buf.length > budget && quality >= 30);
    await fs.writeFile(out, buf);
    const info = { ...(await sharp(buf).metadata()), size: buf.length };
    dims[img.file] = { width: info.width, height: info.height, widths: img.widths, alt: img.alt };
    console.log(`${img.file}-${w}.webp ${Math.round(info.size / 1024)} KB`);
  }
}

await fs.writeFile(path.join(root, 'lib/images.generated.json'), JSON.stringify(dims, null, 2) + '\n');

const csv = ['file,unsplash_id,photographer,photographer_url,source_url,license'];
for (const img of manifest) {
  csv.push([img.file, img.id, `"${img.photographer}"`, img.profile, `https://unsplash.com/photos/${img.id}`, 'Unsplash License'].join(','));
}
await fs.writeFile(path.join(root, 'data/image-credits.csv'), csv.join('\n') + '\n');
