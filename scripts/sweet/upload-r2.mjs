#!/usr/bin/env node
// Sweet Publishing images → R2, step 2 of 2: upload.
//
// Uploads .migration-cache/sweet/{jpg,web,thumb}/** to the R2 bucket
// (default unfoldingword-media) under sweet/{jpg,web,thumb}/…, with long
// cache lifetimes. Uses `wrangler r2 object put --remote` (needs
// `wrangler login` and CLOUDFLARE_ACCOUNT_ID). Records each uploaded key in
// .migration-cache/sweet/uploaded.txt so a re-run resumes where it stopped.
//
//   CLOUDFLARE_ACCOUNT_ID=… node scripts/sweet/upload-r2.mjs [bucket]
import { readdirSync, statSync, existsSync, readFileSync, appendFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = new URL('../..', import.meta.url).pathname;
const SRC = join(ROOT, '.migration-cache/sweet');
const BUCKET = process.argv[2] ?? 'unfoldingword-media';
const LOG = join(SRC, 'uploaded.txt');
const done = new Set(existsSync(LOG) ? readFileSync(LOG, 'utf8').split('\n').filter(Boolean) : []);

function* walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}
const files = [];
for (const kind of ['thumb', 'web', 'jpg']) for (const f of walk(join(SRC, kind))) files.push(f);
const todo = files.map((f) => ({ f, key: `sweet/${relative(SRC, f)}` })).filter(({ key }) => !done.has(key));
console.log(`${files.length} files, ${todo.length} to upload to ${BUCKET}`);

const put = ({ f, key }) =>
  new Promise((resolve, reject) => {
    const type = f.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    const p = spawn('npx', ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', f, '--remote', '--content-type', type, '--cache-control', 'public, max-age=31536000, immutable'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err.trim().split('\n').pop()))));
  });

let n = 0;
const failed = [];
await Promise.all(Array.from({ length: 16 }, async () => {
  while (todo.length) {
    const job = todo.shift();
    for (let attempt = 1; ; attempt++) {
      try {
        await put(job);
        appendFileSync(LOG, job.key + '\n');
        break;
      } catch (e) {
        if (attempt >= 3) { failed.push(`${job.key}: ${e.message}`); break; }
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    if (++n % 250 === 0) console.log(`${n} uploaded`);
  }
}));
console.log(`done: ${n - failed.length} uploaded, ${failed.length} failed`);
if (failed.length) { console.log(failed.slice(0, 50).join('\n')); process.exit(1); }
