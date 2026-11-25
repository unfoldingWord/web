#!/usr/bin/env node
// A/B tests: every running or draft experiment's path must be in
// wrangler.jsonc assets.run_worker_first (or the Worker never sees the
// request), every variant page must have been built, and weights must add up.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const exps = JSON.parse(readFileSync(join(ROOT, 'src/data/experiments.json'), 'utf8'));
const wrangler = JSON.parse(readFileSync(join(ROOT, 'wrangler.jsonc'), 'utf8').replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'));
const first = wrangler.assets?.run_worker_first ?? [];
const errors = [];
for (const e of exps) {
  if (e.status === 'stopped' && !e.winner) continue;
  const covered = first === true || first.some((p) => p === e.path || (p.endsWith('*') && e.path.startsWith(p.slice(0, -1))));
  if (!covered) errors.push(`${e.id}: add "${e.path}" to assets.run_worker_first in wrangler.jsonc`);
  if (e.winner && !e.variants.some((v) => v.id === e.winner)) errors.push(`${e.id}: unknown winner "${e.winner}"`);
  const total = e.variants.reduce((n, v) => n + v.weight, 0);
  if (total <= 0) errors.push(`${e.id}: variant weights add up to ${total}`);
  for (const v of e.variants) if (!existsSync(join(ROOT, 'dist', v.page, 'index.html'))) errors.push(`${e.id}/${v.id}: page ${v.page} was not built`);
}
if (errors.length) { console.error('check:experiments —\n  ' + errors.join('\n  ')); process.exit(1); }
console.log(`check:experiments — ${exps.length} experiment(s) OK`);
