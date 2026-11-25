// A/B assignment — pure functions, unit-tested in ab.test.mjs.
//
// An experiment (src/data/experiments.json) lists the page path it runs on and
// its variants with weights. Each variant names the built page that serves it:
// variant "a" is normally the page itself, "b" a page built under
// /_variants/… from src/content/pages/en/_experiments/.
//
// A visitor is assigned once and keeps the assignment in a cookie, so they see
// the same version on every visit for the life of the test.

export interface Variant {
  id: string;
  weight: number;
  page: string;
}
export interface Experiment {
  id: string;
  status: 'draft' | 'running' | 'stopped';
  path: string;
  variants: Variant[];
  start?: string | null;
  end?: string | null;
  goal?: string;
  description?: string;
  /** After a test: the variant every visitor now gets. */
  winner?: string | null;
}

export const COOKIE_PREFIX = 'uwab_';

/** The experiment that applies to this path right now, if any. Draft tests
 *  run only when forced with ?ab=<variant> (for previewing). */
export function experimentFor(path: string, list: Experiment[], now: Date, forcedId: string | null): Experiment | undefined {
  const norm = path.endsWith('/') ? path : `${path}/`;
  return list.find((e) => {
    if (e.path !== norm) return false;
    const forced = e.variants.some((v) => v.id === forcedId);
    if (e.status === 'stopped') return e.variants.some((v) => v.id === e.winner);
    if (e.status === 'running') {
      if (e.winner) return true;
      if (e.start && now < new Date(`${e.start}T00:00:00Z`)) return forced;
      if (e.end && now > new Date(`${e.end}T23:59:59Z`)) return forced;
      return true;
    }
    return forced;
  });
}

/** Weighted pick from a number in [0, 1). */
export function pickVariant(variants: Variant[], r: number): Variant {
  const total = variants.reduce((n, v) => n + Math.max(0, v.weight), 0);
  if (total <= 0) return variants[0];
  let x = r * total;
  for (const v of variants) {
    x -= Math.max(0, v.weight);
    if (x < 0) return v;
  }
  return variants[variants.length - 1];
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) {
      try {
        return decodeURIComponent(rest.join('='));
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

/** Which variant this request gets: forced (?ab=b) > winner > cookie > new pick. */
export function assign(
  exp: Experiment,
  opts: { cookieHeader: string | null; forced?: string | null; random: number },
): { variant: Variant; fresh: boolean } {
  const byId = (id: string | null | undefined) => exp.variants.find((v) => v.id === id);
  const forced = byId(opts.forced);
  if (forced) return { variant: forced, fresh: false };
  const winner = byId(exp.winner);
  if (winner) return { variant: winner, fresh: false };
  const existing = byId(readCookie(opts.cookieHeader, COOKIE_PREFIX + exp.id));
  if (existing) return { variant: existing, fresh: false };
  return { variant: pickVariant(exp.variants, opts.random), fresh: true };
}
