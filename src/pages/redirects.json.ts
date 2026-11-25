// Build-time list of every content redirect (`redirectFrom` in content
// files), for scripts/postbuild.mjs to turn into dist/_redirects. The JSON
// file itself is deleted from dist/ after use.
import type { APIRoute } from 'astro';
import { allRoutes } from '../lib/routes';

export const GET: APIRoute = async () => {
  const routes = await allRoutes();
  const out: { from: string; to: string; source: string }[] = [];
  for (const r of routes) {
    if (r.fallback || r.kind === 'variant') continue;
    const from = (r.entry.data as { redirectFrom?: string[] }).redirectFrom ?? [];
    for (const f of from) out.push({ from: f, to: r.path, source: `${r.kind}/${r.entry.id}` });
  }
  const pages = routes.map((r) => r.path);
  return new Response(JSON.stringify({ redirects: out, pages }, null, 1), { headers: { 'Content-Type': 'application/json' } });
};
