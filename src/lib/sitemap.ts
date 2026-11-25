// One sitemap file per content kind. Only real translations are listed, each
// with xhtml:link alternates for its other real translations (hreflang).
import { indexableRoutes, absolute, lastmod, hreflangTag, xmlEscape } from './seo-data';
import type { Route } from './routes';

export async function sitemapFor(kinds: Route['kind'][]): Promise<Response> {
  const routes = (await indexableRoutes()).filter((r) => kinds.includes(r.kind));
  const byBase = new Map<string, Route[]>();
  for (const r of routes) byBase.set(r.basePath, [...(byBase.get(r.basePath) ?? []), r]);
  const urls = routes.map((r) => {
    const alts = byBase.get(r.basePath) ?? [];
    const links =
      alts.length > 1
        ? alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${hreflangTag(a.locale)}" href="${xmlEscape(absolute(a.path))}"/>`).join('\n') +
          `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(absolute(r.basePath))}"/>`
        : '';
    const lm = lastmod(r);
    return `  <url>\n    <loc>${xmlEscape(absolute(r.path))}</loc>${lm ? `\n    <lastmod>${lm}</lastmod>` : ''}${links ? `\n${links}` : ''}\n  </url>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
