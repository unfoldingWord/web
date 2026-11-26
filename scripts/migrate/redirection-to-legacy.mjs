#!/usr/bin/env node
// Convert a WordPress Redirection plugin export (Tools → Redirection →
// Import/Export → Redirects, JSON) into lines for redirects/legacy.txt.
//
//   node scripts/migrate/redirection-to-legacy.mjs <export.json>
//
// Run after `npm run build` (it reads dist/ to know which pages exist and
// dist/_redirects to follow rules the site already has). Prints:
//   - rules ready for legacy.txt (targets rewritten to the new URLs)
//   - rules it left out, and why
// The export itself stays out of the repository (it carries hit counts and
// dates nobody needs in git).
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const file = process.argv[2];
if (!file) { console.error('usage: redirection-to-legacy.mjs <export.json>'); process.exit(1); }
if (!existsSync(join(DIST, '_redirects'))) { console.error('run `npm run build` first'); process.exit(1); }

const { redirects } = JSON.parse(readFileSync(file, 'utf8'));
const urlMap = JSON.parse(readFileSync(join(ROOT, 'scripts/migrate/url-map.json'), 'utf8'));
const MEDIA = JSON.parse(readFileSync(join(ROOT, 'src/data/media.json'), 'utf8')).base;

// Rules the new site already has (legacy.txt + every content file's redirectFrom).
const existing = new Map();
for (const line of readFileSync(join(DIST, '_redirects'), 'utf8').split('\n')) {
  const [from, to] = line.trim().split(/\s+/);
  if (from && !from.startsWith('#') && !from.includes('*')) existing.set(from, to);
}

const withSlash = (p) => (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : `${p}/`);

// The plugin's own enabled rules chain into each other (/box2 → /sa/box2 → …);
// follow them too. Case-insensitive, like the plugin.
const plugin = new Map();
for (const r of redirects) {
  if (!r.enabled || r.match_type !== 'url' || r.url.includes('?')) continue;
  const k = withSlash(r.url.trim().replace(/\/+$/, '') || '/').toLowerCase();
  if (!plugin.has(k)) plugin.set(k, r.action_data?.url ?? '');
}
const isBuilt = (p) => {
  if (p.startsWith('/wp-content/uploads/')) return true; // sent to the media bucket
  const f = join(DIST, p);
  if (p.endsWith('/')) return existsSync(join(f, 'index.html'));
  return existsSync(f) && statSync(f).isFile();
};

// Split "/a/b/?x=1#y" into path, query, hash.
function parts(u) {
  const m = u.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  return { path: m[1] || '/', query: m[2] || '', hash: m[3] || '' };
}

// Rewrite a WordPress-era target to where that content lives now.
const local = (u) => u.trim().replace(/^https?:\/\/(www\.)?unfoldingword\.org(?=\/|\?|#|$)/i, '');
function resolve(target) {
  let t = local(target) || '/';
  if (/^https?:\/\//i.test(t)) return { to: t, external: true };
  if (!t.startsWith('/')) t = '/' + t;
  let { path, query, hash } = parts(t);
  if (!/\.[a-z0-9]+$/i.test(path)) path = withSlash(path);
  for (let hop = 0; hop < 8; hop++) {
    if (urlMap[path]) { path = urlMap[path]; continue; }
    if (!isBuilt(path) && plugin.has(path.toLowerCase())) {
      const n = local(plugin.get(path.toLowerCase())) || '/';
      if (/^https?:\/\//i.test(n)) return { to: n, external: true };
      const p = parts(n.startsWith('/') ? n : '/' + n);
      path = /\.[a-z0-9]+$/i.test(p.path) ? p.path : withSlash(p.path);
      query = query || p.query; hash = hash || p.hash;
      continue;
    }
    const next = existing.get(path) ?? existing.get(path.replace(/\/$/, ''));
    if (next && next !== path) {
      if (/^https?:/.test(next)) return { to: next + query + hash, external: true };
      const n = parts(next);
      path = n.path; query = query || n.query; hash = hash || n.hash;
      continue;
    }
    break;
  }
  return { to: path + query + hash, path, built: isBuilt(path) };
}

const out = { ok: [], external: [], unbuilt: [], isPage: [], already: [], conflict: [], disabled: [], query: [] };
const seen = new Set();
for (const r of redirects) {
  const from = r.url.trim();
  const target = r.action_data?.url ?? '';
  const row = { from, target, code: r.action_code, hits: r.hits ?? 0, last: r.last_access ?? '' };
  if (!r.enabled) { out.disabled.push(row); continue; }
  if (r.match_type !== 'url' || r.regex) { out.unbuilt.push({ ...row, why: `match type ${r.match_type}` }); continue; }
  if (from.includes('?')) { out.query.push(row); continue; }
  const src = withSlash(from.replace(/\/+$/, '') || '/');
  if (seen.has(src)) continue;
  seen.add(src);
  const res = resolve(target);
  row.to = res.to;
  if (isBuilt(src) && src !== '/') { out.isPage.push(row); continue; }
  const have = existing.get(src) ?? existing.get(src.replace(/\/$/, ''));
  if (have) { (have === res.to || have === withSlash(res.to) ? out.already : out.conflict).push({ ...row, have }); continue; }
  if (res.external) out.external.push(row);
  else if (res.built) out.ok.push(row);
  else out.unbuilt.push({ ...row, why: 'target not on the new site' });
}

const pad = (s, n) => (s.length >= n ? s + ' ' : s.padEnd(n));
const line = (r) => `${pad(r.from.replace(/\/$/, '') || '/', 44)}${pad(r.to, 1)}${r.code && r.code !== 301 ? ' ' + r.code : ''}`;
console.log(`# --- WordPress Redirection plugin export (${redirects.length} rules) ---`);
for (const r of out.ok) console.log(line(r));
console.log('\n# --- Redirection plugin: to other sites ---');
for (const r of out.external) console.log(line(r));
const report = (title, rows, f) => { console.error(`\n== ${title}: ${rows.length}`); rows.forEach((r) => console.error('  ' + f(r))); };
report('target not on the new site', out.unbuilt, (r) => `${r.from} -> ${r.target}  [${r.hits} hits, ${r.last || 'never'}] ${r.why}`);
report('source is a page on the new site (rule dropped)', out.isPage, (r) => `${r.from} -> ${r.target}`);
report('already redirected the same way', out.already, (r) => `${r.from} -> ${r.have}`);
report('already redirected DIFFERENTLY', out.conflict, (r) => `${r.from}: plugin -> ${r.to}, site -> ${r.have}`);
report('query-string sources (cannot be a _redirects rule)', out.query, (r) => `${r.from} -> ${r.target}`);
report('disabled in WordPress (left out)', out.disabled, (r) => `${r.from} -> ${r.target}`);
console.error(`\nok ${out.ok.length}, external ${out.external.length}, media ${MEDIA ? 'bucket' : ''}`);
