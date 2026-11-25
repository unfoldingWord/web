// Localization helpers.
//
// Interface strings live in src/i18n/ui/{code}.json, one file per locale.
// English (en.json) is the source; every other file may be partial — a
// missing key falls back to English (deep merge), so a half-translated locale
// still renders completely. `npm run check:locales` lists what is missing.
//
// Page and story content is localized separately, one file per locale under
// src/content/{collection}/{code}/ (see src/lib/routes.ts).
import { locales as LOCALES, defaultLocale as DEFAULT } from './locales.mjs';
import en from './ui/en.json';

export type LocaleCode = (typeof LOCALES)[number]['code'];
export interface LocaleDef {
  code: string;
  name: string;
  english: string;
  tag: string;
  dir: 'ltr' | 'rtl';
  script: string;
}

export const locales = LOCALES as LocaleDef[];
export const defaultLocale = DEFAULT;
export const localeCodes = locales.map((l) => l.code);

export function byCode(code: string): LocaleDef {
  const l = locales.find((x) => x.code === code);
  if (!l) throw new Error(`Unknown locale "${code}"`);
  return l;
}

export function isLocale(code: string | undefined): code is string {
  return !!code && localeCodes.includes(code);
}

/** Self-hosted font stylesheet for a locale's script, or null for Latin. */
export function fontHrefFor(code: string): string | null {
  const { script } = byCode(code);
  return script === 'latin' || script === 'cyrillic' ? null : `/fonts/${script}.css`;
}

/** Prefix a site path with the locale ('/about/' → '/es/about/'). */
export function localizePath(path: string, locale: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean === '/' ? '/' : clean}`;
}

/** Split '/es/about/' into { locale: 'es', path: '/about/' }. */
export function splitLocale(pathname: string): { locale: string; path: string } {
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (m && isLocale(m[1]) && m[1] !== defaultLocale) return { locale: m[1], path: m[2] || '/' };
  return { locale: defaultLocale, path: pathname };
}

// ---------- UI strings ----------
type Dict = typeof en;
const modules = import.meta.glob<{ default: Partial<Dict> }>('./ui/*.json', { eager: true });

function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null || over === '') return base;
  if (Array.isArray(base) && Array.isArray(over)) return base.map((b, i) => merge(b, over[i])) as T;
  if (base && typeof base === 'object' && typeof over === 'object') {
    const out: Record<string, unknown> = { ...(over as object) };
    for (const [k, v] of Object.entries(base as object)) out[k] = merge(v, (over as Record<string, unknown>)[k]);
    return out as T;
  }
  return over as T;
}

const cache = new Map<string, Dict>();
/** All interface strings for a locale, English filled in where missing. */
export function ui(locale: string): Dict {
  if (!cache.has(locale)) {
    const own = modules[`./ui/${locale}.json`]?.default;
    cache.set(locale, locale === defaultLocale ? en : merge(en, own));
  }
  return cache.get(locale)!;
}

/** `{name}`-style interpolation for a UI string. */
export function fmt(template: string, args: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(args[k] ?? `{${k}}`));
}

/** Locale-aware date, e.g. "12 March 2026" / "12 de marzo de 2026". */
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(byCode(locale).tag, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}
