// RSS feed of stories from the field (English). Linked from every page's
// <head>; /feed/ on the old site redirects here.
import type { APIRoute } from 'astro';
import { indexableRoutes, absolute, xmlEscape } from '../../lib/seo-data';
import { SITE } from '../../lib/site';

export const GET: APIRoute = async () => {
  const stories = (await indexableRoutes())
    .filter((r) => r.kind === 'stories' && r.locale === 'en')
    .map((r) => ({ r, d: r.entry.data as { title: string; description: string; date: Date } }))
    .sort((a, b) => b.d.date.getTime() - a.d.date.getTime());
  const items = stories
    .map(({ r, d }) => `    <item>
      <title>${xmlEscape(d.title)}</title>
      <link>${absolute(r.path)}</link>
      <guid isPermaLink="true">${absolute(r.path)}</guid>
      <pubDate>${d.date.toUTCString()}</pubDate>
      <description>${xmlEscape(d.description)}</description>
    </item>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name} — Stories from the field</title>
    <link>${absolute('/stories/')}</link>
    <atom:link href="${absolute('/stories/rss.xml')}" rel="self" type="application/rss+xml"/>
    <description>How local churches are translating the Bible into their own languages.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
