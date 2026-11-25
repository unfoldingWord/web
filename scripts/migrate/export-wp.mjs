#!/usr/bin/env node
// Export the live WordPress site's public content through its REST API.
//
// Reads only what the public API serves (no login): every page, post,
// prayer request and Sweet Publishing entry, the categories and tags,
// and the media library's metadata. Writes raw JSON to .migration-cache/wp/
// (gitignored). Converted content lives in src/content/ and is what gets
// committed; this cache is only the source the conversion reads from.
//
//   node scripts/migrate/export-wp.mjs            # everything
//   node scripts/migrate/export-wp.mjs pages      # one type
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'https://unfoldingword.org/wp-json/wp/v2';
const OUT = join(process.cwd(), '.migration-cache', 'wp');
const UA = { 'User-Agent': 'unfoldingWord-site-migration' };
const TYPES = {
  pages: 'pages',
  posts: 'posts',
  'prayer-request': 'prayer-request',
  'sweet-publishing': 'sweet-publishing',
  categories: 'categories',
  tags: 'tags',
  media: 'media',
  users: 'users',
};

async function getAll(base) {
  const out = [];
  for (let page = 1; ; page++) {
    const sep = base.includes('?') ? '&' : '?';
    const res = await fetch(`${BASE}/${base}${sep}per_page=100&page=${page}`, { headers: UA });
    if (res.status === 400 && page > 1) break; // past the last page
    if (!res.ok) throw new Error(`${base} page ${page}: HTTP ${res.status}`);
    const batch = await res.json();
    out.push(...batch);
    const total = Number(res.headers.get('x-wp-totalpages') || 1);
    if (page >= total) break;
  }
  return out;
}

const only = process.argv.slice(2);
await mkdir(OUT, { recursive: true });
for (const [name, base] of Object.entries(TYPES)) {
  if (only.length && !only.includes(name)) continue;
  try {
    const items = await getAll(base);
    await writeFile(join(OUT, `${name}.json`), JSON.stringify(items, null, 1));
    console.log(`${name}: ${items.length}`);
  } catch (e) {
    console.warn(`${name}: FAILED — ${e.message}`);
  }
}
