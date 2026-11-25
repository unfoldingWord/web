#!/usr/bin/env node
// Sweet Publishing images → R2, step 1 of 2: download and make web sizes.
//
// Reads every image name from src/content/sweet/en/*.md, downloads each
// original JPEG from the old pCloud folder (filedn.com) into
// .migration-cache/sweet/jpg/{NN}/, and writes
//   .migration-cache/sweet/web/{NN}/{name}.webp    1280 px wide
//   .migration-cache/sweet/thumb/{NN}/{name}.webp   480 px wide
// plus .migration-cache/sweet/manifest.json (size + sha256 per original).
// Re-running skips files already present. Step 2: upload-r2.mjs.
//
// The originals are kept byte-for-byte; only the two web sizes are new.
import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const ROOT = new URL('../..', import.meta.url).pathname;
const SRC = 'https://filedn.com/lD0GfuMvTstXgqaJfpLL87S/sweet_images/jpg';
const OUT = join(ROOT, '.migration-cache/sweet');
const names = new Set();
for (const f of readdirSync(join(ROOT, 'src/content/sweet/en'))) {
  for (const m of readFileSync(join(ROOT, 'src/content/sweet/en', f), 'utf8').matchAll(/^\s+- (\d+_[A-Za-z0-9]+_\d+_[0-9a-z]+_[A-Za-z]+)$/gm)) names.add(m[1]);
}
const list = [...names];
console.log(`${list.length} images`);
const manifestPath = join(OUT, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const p = (kind, n, ext) => join(OUT, kind, n.slice(0, 2), `${n}.${ext}`);
let done = 0, failed = [];
async function one(n) {
  const jpg = p('jpg', n, 'jpg');
  if (!existsSync(jpg) || !manifest[n]) {
    let buf;
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch(`${SRC}/${n.slice(0, 2)}/${n}.jpg`, { headers: { 'User-Agent': 'unfoldingWord-site-migration' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        buf = Buffer.from(await res.arrayBuffer());
        break;
      } catch (e) {
        if (attempt >= 4) throw e;
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
    mkdirSync(dirname(jpg), { recursive: true });
    writeFileSync(jpg, buf);
    manifest[n] = { bytes: buf.length, sha256: createHash('sha256').update(buf).digest('hex') };
  }
  for (const [kind, width, q] of [['web', 1280, 80], ['thumb', 480, 72]]) {
    const out = p(kind, n, 'webp');
    if (existsSync(out)) continue;
    mkdirSync(dirname(out), { recursive: true });
    await sharp(jpg).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: q }).toFile(out);
  }
}
const queue = [...list];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const n = queue.shift();
    try { await one(n); } catch (e) { failed.push(`${n}: ${e.message}`); }
    if (++done % 200 === 0) { console.log(`${done}/${list.length}`); writeFileSync(manifestPath, JSON.stringify(manifest)); }
  }
}));
writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
const total = Object.values(manifest).reduce((s, m) => s + m.bytes, 0);
console.log(`done: ${list.length - failed.length} ok, ${failed.length} failed, originals ${(total / 1e9).toFixed(2)} GB`);
if (failed.length) { console.log(failed.join('\n')); process.exit(1); }
