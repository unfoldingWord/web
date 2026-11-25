#!/usr/bin/env node
// Every internal link and image in the built HTML must point at something
// that exists (a page, a file, or a redirect to one). Checks English pages
// and one sample of each other locale's pages. Run after `npm run build`.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const redirects = new Set(readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/)[0]));
const splats = [...redirects].filter((r) => r.includes('*')).map((r) => new RegExp('^' + r.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'));

function* html(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* html(p);
    else if (f.endsWith('.html')) yield p;
  }
}
const exists = (p) => {
  const clean = decodeURI(p.split('#')[0].split('?')[0]);
  if (!clean) return true;
  if (existsSync(join(DIST, clean)) && (clean.endsWith('/') ? existsSync(join(DIST, clean, 'index.html')) : true)) return true;
  if (existsSync(join(DIST, clean, 'index.html'))) return true;
  return redirects.has(clean) || splats.some((s) => s.test(clean));
};
const bad = new Map();
let pages = 0;
for (const file of html(DIST)) {
  const rel = '/' + relative(DIST, file).replace(/index\.html$/, '');
  // fallback locale pages share English content; checking English is enough
  const m = rel.match(/^\/([a-z]{2})\//);
  if (m && m[1] !== 'en' && !rel.match(/^\/[a-z]{2}\/$/)) continue;
  pages++;
  const h = readFileSync(file, 'utf8');
  for (const [, attr, url] of h.matchAll(/\s(href|src)="(\/[^"/][^"]*|\/)"/g)) {
    if (url.startsWith('//')) continue;
    if (!exists(url)) {
      if (!bad.has(url)) bad.set(url, new Set());
      bad.get(url).add(rel);
    }
  }
}
if (bad.size) {
  console.error(`check:links — ${bad.size} broken internal link target(s):`);
  for (const [u, on] of bad) console.error(`  ${u}   on ${[...on].slice(0, 3).join(', ')}${on.size > 3 ? ` +${on.size - 3}` : ''}`);
  process.exit(1);
}
console.log(`check:links — ${pages} pages, all internal links resolve`);
