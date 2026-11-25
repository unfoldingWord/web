#!/usr/bin/env node
// WordPress media library → R2 (uploads/YYYY/MM/file), so every
// /wp-content/uploads/… link (PDFs in emails, partner sites, search results)
// keeps working after WordPress is gone: dist/_redirects sends
// /wp-content/uploads/* to <media base>/uploads/*.
//
// Reads the media list from .migration-cache/wp/media.json, downloads each
// original into .migration-cache/uploads/, uploads with `wrangler r2 object
// put --remote`. Resumable (.migration-cache/uploads/uploaded.txt).
//
// Font files are skipped on purpose: the library holds licensed Avenir files
// that must not be republished in a public bucket.
//
//   CLOUDFLARE_ACCOUNT_ID=… node scripts/migrate/uploads-to-r2.mjs [bucket]
import { readFileSync, existsSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = new URL('../..', import.meta.url).pathname;
const BUCKET = process.argv[2] ?? 'unfoldingword-media';
const OUT = join(ROOT, '.migration-cache/uploads');
const LOG = join(OUT, 'uploaded.txt');
mkdirSync(OUT, { recursive: true });
const done = new Set(existsSync(LOG) ? readFileSync(LOG, 'utf8').split('\n').filter(Boolean) : []);
const media = JSON.parse(readFileSync(join(ROOT, '.migration-cache/wp/media.json'), 'utf8'));
const items = media
  .filter((m) => !/font|otf|ttf|woff/i.test(m.mime_type) && /\/wp-content\/uploads\//.test(m.source_url))
  .map((m) => ({ url: m.source_url, key: 'uploads/' + m.source_url.split('/wp-content/uploads/')[1], type: m.mime_type }))
  .filter((i) => !done.has(i.key));
console.log(`${items.length} files to copy to ${BUCKET}`);

const put = (file, key, type) =>
  new Promise((resolve, reject) => {
    const p = spawn('npx', ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--remote', '--content-type', type, '--cache-control', 'public, max-age=86400'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (c) => (c === 0 ? resolve() : reject(new Error(err.trim().split('\n').pop()))));
  });

const failed = [];
let n = 0;
await Promise.all(Array.from({ length: 12 }, async () => {
  while (items.length) {
    const it = items.shift();
    const file = join(OUT, it.key);
    try {
      if (!existsSync(file)) {
        const res = await fetch(it.url, { headers: { 'User-Agent': 'unfoldingWord-site-migration' } });
        if (!res.ok) throw new Error(`download HTTP ${res.status}`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      }
      await put(file, it.key, it.type);
      appendFileSync(LOG, it.key + '\n');
    } catch (e) {
      failed.push(`${it.key}: ${e.message}`);
    }
    if (++n % 100 === 0) console.log(`${n} done`);
  }
}));
console.log(`done: ${n - failed.length} copied, ${failed.length} failed`);
if (failed.length) console.log(failed.join('\n'));
