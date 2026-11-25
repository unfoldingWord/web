#!/usr/bin/env node
// After `astro build`: write dist/_redirects and refuse to ship a broken one.
//
// Sources, in order of precedence:
//   1. redirects/legacy.txt              — short links, plugin rules, system URLs
//   2. dist/redirects.json               — every content file's `redirectFrom`
//      (emitted by src/pages/redirects.json.ts, deleted here after use)
//   3. category / attachment / feed patterns WordPress answered implicitly
//
// Fails (exit 1) when a rule:
//   - points at a site path that was not built (would be a redirect to a 404)
//   - redirects FROM a path that is also a built page (the page would vanish)
//   - chains through another redirect (two hops)
//   - is declared twice with different targets
// and when the file exceeds Cloudflare's limits (2,000 static + 100 dynamic).
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const MEDIA = JSON.parse(readFileSync(join(ROOT, 'src/data/media.json'), 'utf8')).base;
const DIST = join(ROOT, 'dist');
const manifestPath = join(DIST, 'redirects.json');
if (!existsSync(manifestPath)) {
  console.error('postbuild: dist/redirects.json missing — did astro build run?');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
rmSync(manifestPath);

const built = new Set(manifest.pages);
const isBuilt = (p) => {
  const path = p.split('#')[0].split('?')[0];
  if (path.startsWith('/wp-content/uploads/')) return true; // redirected to the media bucket by the pattern rule below
  if (built.has(path)) return true;
  // files (rss, sitemaps, pdfs in public/)
  return existsSync(join(DIST, path)) && !path.endsWith('/');
};
const withSlash = (p) => (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : `${p}/`);
const noSlash = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

const rules = new Map(); // from -> { to, status, source }
const errors = [];
function add(from, to, status, source) {
  if (!from.startsWith('/')) return errors.push(`${source}: "${from}" must start with /`);
  // Uploads live in the media bucket: send straight there (one hop).
  if (to.startsWith('/wp-content/uploads/')) to = `${MEDIA}/uploads/${to.slice('/wp-content/uploads/'.length)}`;
  const target = to.startsWith('/') && !/\.[a-z0-9]+$/i.test(to.split('#')[0]) ? withSlash(to.split('#')[0]) + (to.includes('#') ? '#' + to.split('#')[1] : '') : to;
  for (const f of new Set([noSlash(from), withSlash(from)])) {
    if (f === '/' || f === target.split('#')[0]) continue; // /x → /x/ is html_handling's job
    const prev = rules.get(f);
    if (prev && prev.to !== target) errors.push(`${f} is redirected twice: → ${prev.to} (${prev.source}) and → ${target} (${source})`);
    if (!prev || source.startsWith('legacy')) rules.set(f, { to: target, status, source });
  }
}

// 1. legacy.txt
const legacy = readFileSync(join(ROOT, 'redirects/legacy.txt'), 'utf8').split('\n');
legacy.forEach((line, i) => {
  const s = line.replace(/#.*$/, '').trim();
  if (!s || line.trim().startsWith('#')) return;
  const [from, to, status = '301'] = s.split(/\s+/);
  add(from, to, Number(status), `legacy.txt:${i + 1}`);
});
// 2. content
for (const r of manifest.redirects) add(r.from, r.to, 301, r.source);

// Validate
for (const [from, { to, source }] of rules) {
  if (built.has(withSlash(from)) && withSlash(from) === from) errors.push(`${from} (${source}) is a built page AND a redirect source — remove the redirect or the page`);
  if (to.startsWith('/')) {
    const base = to.split('#')[0];
    if (!isBuilt(base)) errors.push(`${from} → ${to} (${source}): target was not built`);
    if (rules.has(base)) errors.push(`${from} → ${to} → ${rules.get(base).to} (${source}): chain; point it straight at the final page`);
  }
}

// 3. WordPress pattern rules (dynamic, placed last so static rules win)
const dynamic = [
  // category archives: /category/africa/ → stories index
  ['/category/*', '/stories/', 301],
  // the old story index's pagination
  ['/stories-from-the-field/page/*', '/stories/', 301],
  ['/tag/*', '/stories/', 301],
  ['/author/*', '/about/', 301],
  // feeds of any page
  ['/*/feed/', '/stories/rss.xml', 301],
  // uploads: PDFs and images are being moved to R2 (media.unfoldingword.org)
  ['/wp-content/uploads/*', `${MEDIA}/uploads/:splat`, 302], // 302 until the permanent media.unfoldingword.org address exists
];

const staticLines = [...rules].map(([from, { to, status }]) => `${from} ${to} ${status}`);
const dynamicLines = dynamic.map(([f, t, s]) => `${f} ${t} ${s}`);
if (staticLines.length > 2000) errors.push(`${staticLines.length} static redirects: Cloudflare's limit is 2,000 — move the overflow to Bulk Redirects`);
if (dynamicLines.length > 100) errors.push(`${dynamicLines.length} dynamic redirects: limit is 100`);

if (errors.length) {
  console.error(`postbuild: ${errors.length} redirect problem(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}

const header = `# Generated by scripts/postbuild.mjs from redirects/legacy.txt and content redirectFrom. Do not edit.\n`;
writeFileSync(join(DIST, '_redirects'), header + [...staticLines, ...dynamicLines].join('\n') + '\n');

// Site search index (/search/): Pagefind indexes the <main data-pagefind-body>
// of real pages — not language fallbacks, A/B variants or noindex pages.
execFileSync(join(ROOT, 'node_modules/.bin/pagefind'), ['--site', DIST, '--silent'], { stdio: 'inherit' });
console.log(`postbuild: _redirects written — ${staticLines.length} static, ${dynamicLines.length} dynamic; ${built.size} pages built`);
