// /llms-full.txt — the full English text of the site's main pages in one
// Markdown file, for tools that prefer one fetch. Generated from content.
import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { indexableRoutes, absolute } from '../lib/seo-data';
import { plain } from '../lib/md';
import { SITE } from '../lib/site';
import type { Block } from '../content.config';

function blockText(b: Block): string {
  const out: string[] = [];
  const push = (...xs: (string | undefined)[]) => xs.forEach((x) => x && out.push(plain(x)));
  switch (b.type) {
    case 'hero': push(b.title, b.lead); break;
    case 'prose': push(b.title, b.body); break;
    case 'cards': push(b.title, b.intro); b.items.forEach((i) => push(`${i.title}: ${i.body ?? ''}`)); break;
    case 'split': push(b.title, b.body); break;
    case 'stats': b.items.forEach((i) => push(`${i.value} ${i.label}`)); break;
    case 'quote': push(`"${b.quote}" — ${b.attribution ?? ''}`); break;
    case 'cta': push(b.title, b.body); break;
    case 'video': push(b.title, b.transcript); break;
    case 'giving': push(b.title, b.body); break;
    case 'faq': push(b.title); b.items.forEach((i) => push(`Q: ${i.q}`, `A: ${i.a}`)); break;
    case 'steps': push(b.title, b.intro); b.items.forEach((i, n) => push(`${n + 1}. ${i.title}: ${i.body}`)); break;
    case 'resources': push(b.title, b.intro); b.items.forEach((i) => push(`${i.title}${i.description ? `: ${i.description}` : ''} (${i.href})`)); break;
    default: break;
  }
  return out.filter(Boolean).join('\n\n');
}

export const GET: APIRoute = async () => {
  const routes = (await indexableRoutes()).filter((r) => r.locale === 'en' && (r.kind === 'pages' || r.kind === 'stories'));
  const docs = routes.map((r) => {
    const d = r.entry.data as { title: string; description: string; sections?: Block[] };
    const text = [...(d.sections ?? []).map(blockText), plain((r.entry as CollectionEntry<'pages'>).body ?? '')].filter(Boolean).join('\n\n');
    return `# ${d.title}\n\nURL: ${absolute(r.path)}\n\n${d.description}\n\n${text}`;
  });
  return new Response(`# ${SITE.name} — full site text\n\n${docs.join('\n\n---\n\n')}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
