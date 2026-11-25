#!/usr/bin/env node
// No old URL may 404. Reads redirects/old-urls.txt (every URL the WordPress
// site served or linked to) and checks each one against the BUILT site:
// it must be a page in dist/, or a rule in dist/_redirects that reaches a page
// in ONE hop. Run after `npm run build`.
//
// Mirrors how Workers serves requests: html_handling "auto-trailing-slash"
// turns /x into /x/ when /x/index.html exists; _redirects rules match the
// path exactly (both slash forms are generated), then splat rules.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const rules = readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/));
const exact = new Map(rules.filter(([f]) => !f.includes('*')).map(([f, t, s]) => [f, { to: t, status: s }]));
const splats = rules.filter(([f]) => f.includes('*')).map(([f, t, s]) => ({ re: new RegExp('^' + f.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '(.*)') + '$'), to: t, status: s }));

const isPage = (p) => {
  const clean = decodeURI(p.split('#')[0].split('?')[0]);
  if (clean.endsWith('/')) return existsSync(join(DIST, clean, 'index.html'));
  return existsSync(join(DIST, clean)) || existsSync(join(DIST, clean, 'index.html')) || existsSync(join(DIST, `${clean}.html`));
};
function resolve(path) {
  if (isPage(path)) return { ok: true, how: 'page' };
  const r = exact.get(path) ?? exact.get(decodeURI(path));
  if (r) return /^https?:/.test(r.to) ? { ok: true, how: `→ ${r.to} (external)` } : isPage(r.to) ? { ok: true, how: `→ ${r.to}` } : { ok: false, how: `→ ${r.to} which is not a page` };
  for (const s of splats) {
    const m = path.match(s.re);
    if (m) {
      const to = s.to.replace(':splat', m[1] ?? '');
      return /^https?:/.test(to) || isPage(to) ? { ok: true, how: `→ ${to} (pattern)` } : { ok: false, how: `→ ${to} (pattern) which is not a page` };
    }
  }
  return { ok: false, how: '404' };
}

const urls = readFileSync(join(ROOT, 'redirects/old-urls.txt'), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const bad = [];
for (const u of urls) {
  const r = resolve(u);
  if (!r.ok) bad.push(`${u}  ${r.how}`);
}
if (bad.length) {
  console.error(`check:redirects — ${bad.length} of ${urls.length} old URLs would not resolve:\n  ${bad.join('\n  ')}`);
  process.exit(1);
}
console.log(`check:redirects — all ${urls.length} old URLs resolve`);
