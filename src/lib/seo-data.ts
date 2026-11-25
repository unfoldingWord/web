// Shared data for the machine-readable files (sitemaps, llms.txt, /ai/*).
import { getCollection } from 'astro:content';
import { allRoutes, splitId, type Route } from './routes';
import { SITE } from './site';
import { plain } from './md';
import { byCode } from '../i18n';

/** Pages that belong in sitemaps: real (non-fallback), indexable. */
export async function indexableRoutes(): Promise<Route[]> {
  return (await allRoutes()).filter((r) => !r.fallback && !r.noindex && r.kind !== 'variant');
}

export function absolute(path: string): string {
  return new URL(path, SITE.url).href;
}

export function lastmod(r: Route): string | undefined {
  const d = r.entry.data as { updated?: Date; date?: Date };
  return (d.updated ?? d.date)?.toISOString().slice(0, 10);
}

export function hreflangTag(code: string): string {
  return byCode(code).tag;
}

/** Every FAQ item on the site (English), with the page it is on. */
export async function allFaqs(): Promise<{ q: string; a: string; url: string }[]> {
  const pages = await getCollection('pages');
  const out: { q: string; a: string; url: string }[] = [];
  const routes = await indexableRoutes();
  for (const p of pages) {
    if (splitId(p.id).locale !== 'en') continue;
    const route = routes.find((r) => r.entry.id === p.id);
    if (!route) continue;
    for (const s of p.data.sections) if (s.type === 'faq') for (const it of s.items) out.push({ q: plain(it.q), a: plain(it.a), url: absolute(route.path) });
  }
  return out;
}

export function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
