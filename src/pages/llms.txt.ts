// /llms.txt — a plain Markdown map of the site for language models
// (https://llmstxt.org). Generated from the content, so it cannot list a page
// that does not exist. The HTML pages remain the canonical source.
import type { APIRoute } from 'astro';
import { indexableRoutes, absolute } from '../lib/seo-data';
import { SITE } from '../lib/site';

const SECTIONS: { title: string; match: (p: string) => boolean }[] = [
  { title: 'About unfoldingWord', match: (p) => /^\/(about|vision-mission|statement-of-faith|our-core-values|leadership|our-team|financial-information|careers|contact)\//.test(p) },
  { title: 'Strategy: Church-Centric Bible Translation', match: (p) => p.startsWith('/ccbt/') },
  { title: 'What we do', match: (p) => /^\/(overview|wbwn|tools-technology|strategic-language-resources|obs|open-bible-stories|catalyzation|translationcore|bt-servant|global-regional-forums|publications)\//.test(p) },
  { title: 'For Bible translators', match: (p) => p.startsWith('/for-translators/') || p.startsWith('/sweet-publishing/') },
  { title: 'Give', match: (p) => p.startsWith('/give/') || p === '/planned-giving/' || p === '/charitable-solicitation-disclosures/' },
  { title: 'Stories from the field', match: (p) => p.startsWith('/stories/') },
  { title: 'Prayer', match: (p) => p === '/pray/' || p.startsWith('/prayer-request/') },
];

export const GET: APIRoute = async () => {
  const routes = (await indexableRoutes()).filter((r) => r.locale === 'en');
  const used = new Set<string>();
  const parts: string[] = [];
  for (const s of SECTIONS) {
    const items = routes.filter((r) => !used.has(r.path) && s.match(r.basePath));
    if (!items.length) continue;
    items.forEach((r) => used.add(r.path));
    parts.push(`## ${s.title}\n\n` + items.map((r) => {
      const d = r.entry.data as { title: string; description?: string };
      return `- [${d.title}](${absolute(r.path)}): ${d.description ?? ''}`;
    }).join('\n'));
  }
  const rest = routes.filter((r) => !used.has(r.path) && r.basePath !== '/');
  if (rest.length) parts.push('## Other pages\n\n' + rest.map((r) => `- [${(r.entry.data as { title: string }).title}](${absolute(r.path)})`).join('\n'));

  const body = `# ${SITE.name}

> ${SITE.name} is a 501(c)(3) nonprofit (EIN ${SITE.ein}) based in Orlando, Florida, that equips the global church to translate the Bible into every language. It provides open-licensed biblical content, translation tools such as translationCore, training and technology so that church networks among the least reached can translate Scripture themselves — an approach it calls Church-Centric Bible Translation.

Key facts:
- Website: ${SITE.url}/
- Contact: ${absolute('/contact/')} · ${SITE.telephoneDisplay}
- Accountability: member of ECFA; Candid (GuideStar) Platinum Seal of Transparency; MinistryWatch 100% Give With Confidence
- Content license: unfoldingWord's biblical resources are released under open licenses (CC BY-SA) so the church can translate and share them freely.
- The site is available in 16 languages; English is the source.

${parts.join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
