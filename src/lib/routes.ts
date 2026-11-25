// Every URL the site builds, in one place.
//
// src/pages/[...path].astro, the sitemaps, llms.txt, hreflang and the
// redirect generator all read this list, so they cannot disagree about which
// pages exist.
//
// URL rules
//   src/content/pages/en/index.md            → /
//   src/content/pages/en/give/monthly.md     → /give/monthly/
//   src/content/pages/es/give/monthly.md     → /es/give/monthly/
//   src/content/stories/en/<slug>.md         → /stories/<slug>/
//   src/content/prayer/en/<slug>.md          → /prayer-request/<slug>/
//   src/content/sweet/en/<book>.md           → /sweet-publishing/<book>/
//
// Translations: a file with the same name under another locale folder is the
// translation. Where it does not exist yet, a FALLBACK page is built at the
// locale URL: the interface (menus, buttons) in that language, the body in
// English with a notice, canonical pointing at the English page, and left out
// of the sitemap and hreflang. Set FALLBACK_PAGES to false to build only real
// translations instead.
import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, locales, localizePath } from '../i18n';

export const FALLBACK_PAGES = true;

type Coll = 'pages' | 'stories' | 'prayer' | 'sweet';
export type AnyEntry = CollectionEntry<Coll>;

export interface Route {
  /** URL path with leading and trailing slash, locale prefix included. */
  path: string;
  /** Path without the locale prefix — the same for every translation. */
  basePath: string;
  locale: string;
  kind: Coll | 'variant';
  /** The entry whose content is shown (English when this is a fallback). */
  entry: AnyEntry;
  /** True when the locale has no translation and English is shown. */
  fallback: boolean;
  /** Locales that have a real translation of this page (for hreflang). */
  translations: string[];
  noindex: boolean;
}

export function splitId(id: string): { locale: string; rest: string } {
  const i = id.indexOf('/');
  return { locale: id.slice(0, i), rest: id.slice(i + 1) };
}

export function basePathFor(kind: Coll, rest: string): string {
  switch (kind) {
    case 'pages': {
      const clean = rest.replace(/(^|\/)index$/, '');
      return clean ? `/${clean}/` : '/';
    }
    case 'stories':
      return `/stories/${rest}/`;
    case 'prayer':
      return `/prayer-request/${rest}/`;
    case 'sweet':
      return `/sweet-publishing/${rest}/`;
  }
}

let cached: Route[] | undefined;

export async function allRoutes(): Promise<Route[]> {
  if (cached) return cached;
  const out: Route[] = [];
  for (const kind of ['pages', 'stories', 'prayer', 'sweet'] as Coll[]) {
    const entries = (await getCollection(kind)) as AnyEntry[];
    // Group translations by their locale-free id.
    const byRest = new Map<string, Map<string, AnyEntry>>();
    for (const e of entries) {
      const { locale, rest } = splitId(e.id);
      if (!byRest.has(rest)) byRest.set(rest, new Map());
      byRest.get(rest)!.set(locale, e);
    }
    for (const [rest, versions] of byRest) {
      const source = versions.get(defaultLocale);
      if (!source) throw new Error(`${kind}/${rest} has translations but no English source file (src/content/${kind}/en/${rest}.md)`);
      const data = source.data as { variantOf?: string; noindex?: boolean };
      // A/B variants are built at a hidden path and served by the Worker.
      if (kind === 'pages' && data.variantOf) {
        for (const [locale, entry] of versions) {
          const basePath = `/_variants/${rest.replace(/^_experiments\//, '')}/`;
          out.push({ path: localizePath(basePath, locale), basePath, locale, kind: 'variant', entry, fallback: false, translations: [], noindex: true });
        }
        continue;
      }
      const basePath = basePathFor(kind, rest);
      const translations = [...versions.keys()];
      for (const l of locales) {
        const own = versions.get(l.code);
        if (!own && !FALLBACK_PAGES) continue;
        const entry = own ?? source;
        out.push({
          path: localizePath(basePath, l.code),
          basePath,
          locale: l.code,
          kind,
          entry,
          fallback: !own,
          translations,
          noindex: Boolean((entry.data as { noindex?: boolean }).noindex) || !own,
        });
      }
    }
  }
  // Duplicate paths would silently overwrite each other in the build.
  const seen = new Map<string, Route>();
  for (const r of out) {
    const prev = seen.get(r.path);
    if (prev) throw new Error(`Two entries build the same URL ${r.path}: ${prev.kind}/${prev.entry.id} and ${r.kind}/${r.entry.id}`);
    seen.set(r.path, r);
  }
  cached = out;
  return out;
}

/** The route for an English path, for building links between pages. */
export async function routeFor(path: string, locale = defaultLocale): Promise<Route | undefined> {
  const routes = await allRoutes();
  return routes.find((r) => r.basePath === path && r.locale === locale);
}

/** Every path the build produces (pages only, not assets). */
export async function builtPaths(): Promise<Set<string>> {
  return new Set((await allRoutes()).map((r) => r.path));
}
