// The Worker in front of unfoldingword.org's static files.
//
// It does almost nothing, on purpose. Static files are served by Workers
// static assets without running this code, except:
//   1. Paths listed in wrangler.jsonc `run_worker_first` — pages with an A/B
//      test. The visitor is assigned a variant (cookie), and that variant's
//      built page is served AT THE SAME URL: no redirect, no flicker, and
//      search engines see one URL (variant pages are noindex).
//   2. /api/contact, also listed explicitly so POST reaches its handler
//      even with the assets binding configured to serve a static 404.
import experiments from '../src/data/experiments.json';
import { assign, experimentFor, COOKIE_PREFIX, type Experiment } from './ab';
import { handleContact } from './contact';

export interface Env {
  ASSETS: Fetcher;
  PRODUCTION_HOST: string;
  CONTACT_TO?: string;
  TURNSTILE_SECRET?: string;
  SEND_EMAIL?: { send(message: unknown): Promise<void> };
}

const LIST = experiments as Experiment[];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') return handleContact(request, env);

    if (request.method === 'GET' || request.method === 'HEAD') {
      const forcedId = url.searchParams.get('ab');
      const exp = experimentFor(url.pathname, LIST, new Date(), forcedId);
      if (exp) return serveVariant(request, env, url, exp, forcedId);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function serveVariant(request: Request, env: Env, url: URL, exp: Experiment, forcedId: string | null): Promise<Response> {
  const { variant, fresh } = assign(exp, {
    cookieHeader: request.headers.get('Cookie'),
    forced: forcedId,
    random: crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32,
  });
  const assetUrl = new URL(variant.page, url);
  const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (!asset.ok) return env.ASSETS.fetch(request); // a missing variant never breaks the page

  const res = new Response(asset.body, asset);
  // Every visitor's HTML may differ, so no shared caching of this page.
  res.headers.set('Cache-Control', 'private, no-store');
  res.headers.append('Vary', 'Cookie');
  res.headers.set('X-Experiment', `${exp.id}:${variant.id}`);
  if (fresh) {
    const maxAge = 60 * 60 * 24 * 90;
    res.headers.append('Set-Cookie', `${COOKIE_PREFIX}${exp.id}=${encodeURIComponent(variant.id)}; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`);
  }
  // The variant page carries data-variant="b"; variant A is the page itself
  // and needs its attributes added here so analytics can tell them apart.
  return new HTMLRewriter()
    .on('html', {
      element(el) {
        el.setAttribute('data-experiment', exp.id);
        el.setAttribute('data-variant', variant.id);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', new URL(exp.path, `https://${env.PRODUCTION_HOST}`).href);
      },
    })
    .on('meta[data-variant-only]', { element(el) { el.remove(); } })
    .transform(res);
}
