import type { APIRoute } from 'astro';
import { absolute } from '../lib/seo-data';

export const GET: APIRoute = () => {
  const maps = ['sitemap-pages.xml', 'sitemap-stories.xml', 'sitemap-sweet.xml'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${maps.map((m) => `  <sitemap><loc>${absolute(`/${m}`)}</loc></sitemap>`).join('\n')}
</sitemapindex>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
