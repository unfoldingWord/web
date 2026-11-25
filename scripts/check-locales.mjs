#!/usr/bin/env node
// Interface strings: every locale file must parse, use only keys that exist
// in en.json, and keep every {placeholder} its English string has. Missing
// keys are allowed (English fills in) but listed.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { locales } from '../src/i18n/locales.mjs';

const DIR = new URL('../src/i18n/ui/', import.meta.url).pathname;
const en = JSON.parse(readFileSync(join(DIR, 'en.json'), 'utf8'));
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
const enFlat = new Map(flat(en));
let errors = 0;
for (const l of locales) {
  if (l.code === 'en') continue;
  const f = join(DIR, `${l.code}.json`);
  if (!existsSync(f)) { console.log(`${l.code}: no file (all English)`); continue; }
  let data;
  try { data = JSON.parse(readFileSync(f, 'utf8')); } catch (e) { console.error(`${l.code}: invalid JSON — ${e.message}`); errors++; continue; }
  const own = new Map(flat(data).filter(([k]) => !k.startsWith('_meta')));
  const extra = [...own.keys()].filter((k) => !enFlat.has(k));
  const missing = [...enFlat.keys()].filter((k) => !own.has(k));
  const ph = [...own].filter(([k, v]) => enFlat.has(k) && typeof v === 'string').filter(([k, v]) => {
    const want = (String(enFlat.get(k)).match(/\{\w+\}/g) ?? []).sort().join();
    return (v.match(/\{\w+\}/g) ?? []).sort().join() !== want;
  }).map(([k]) => k);
  if (extra.length || ph.length) errors++;
  console.log(`${l.code}: ${own.size}/${enFlat.size} strings${data._meta?.status ? ` (${data._meta.status})` : ''}${missing.length ? `, missing: ${missing.join(', ')}` : ''}${extra.length ? `, UNKNOWN KEYS: ${extra.join(', ')}` : ''}${ph.length ? `, PLACEHOLDER MISMATCH: ${ph.join(', ')}` : ''}`);
}
process.exit(errors ? 1 : 0);
