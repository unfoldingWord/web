#!/usr/bin/env node
// Download an image from the old site into src/assets/images/, ready for
// Astro to optimize.
//
//   node scripts/migrate/fetch-image.mjs <url> <dest-relative-to-src/assets/images>
//   node scripts/migrate/fetch-image.mjs https://unfoldingword.org/wp-content/uploads/2024/10/x.jpg stories/the-angry-imam.jpg
//
// - Unwraps Jetpack CDN URLs (i0.wp.com/…) and WordPress's resized copies
//   (-1024x731, -scaled) to fetch the original upload.
// - Shrinks anything wider than 2400 px (the largest size any layout shows)
//   and re-encodes JPEG at quality 82, so the repository stays small. Astro
//   generates the AVIF/WebP sizes visitors actually download at build time.
// - The destination extension decides the format (.jpg/.png/.webp).
// - Prints the path to use in content: "stories/the-angry-imam.jpg".
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import sharp from 'sharp';

const [, , rawUrl, dest] = process.argv;
if (!rawUrl || !dest) {
  console.error('usage: fetch-image.mjs <url> <dest under src/assets/images/>');
  process.exit(2);
}
if (!/^[a-z0-9][a-z0-9/_\-.]*\.(jpe?g|png|webp)$/.test(dest)) {
  console.error(`destination "${dest}" must be lowercase a-z0-9/_-. and end in .jpg, .png or .webp`);
  process.exit(2);
}

function original(u) {
  let url = u.replace(/^https?:\/\/i\d\.wp\.com\//, 'https://').split('?')[0];
  url = url.replace(/-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp|avif|gif)$)/i, '').replace(/-scaled(?=\.(jpe?g|png|webp|avif)$)/i, '');
  return url;
}

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'unfoldingWord-site-migration' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const ROOT = new URL('../..', import.meta.url).pathname;
const out = join(ROOT, 'src/assets/images', dest);
let buf;
const orig = original(rawUrl);
try {
  buf = await get(orig);
} catch (e) {
  if (orig === rawUrl) throw e;
  console.warn(`original not found (${e.message}); using ${rawUrl}`);
  buf = await get(rawUrl.replace(/^https?:\/\/i\d\.wp\.com\//, 'https://'));
}
let img = sharp(buf, { failOn: 'none' }).rotate();
const meta = await img.metadata();
if ((meta.width ?? 0) > 2400) img = img.resize({ width: 2400 });
const ext = extname(dest).toLowerCase();
img = ext === '.png' ? img.png({ compressionLevel: 9 }) : ext === '.webp' ? img.webp({ quality: 82 }) : img.jpeg({ quality: 82, mozjpeg: true });
const data = await img.toBuffer();
await mkdir(dirname(out), { recursive: true });
await writeFile(out, data);
const m2 = await sharp(data).metadata();
console.log(`${dest}  ${m2.width}x${m2.height}  ${(data.length / 1024).toFixed(0)} KB  (from ${orig})`);
