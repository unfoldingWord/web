// Generate the English reading copy from the same templates used by visitors.
// This includes collection-backed blocks and renders MDX components before
// extracting text, so neither editor code nor template markup enters the feed.
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import mdxRenderer from '@astrojs/mdx/server.js';
import { compile } from 'html-to-text';
import PageTemplate from '../components/templates/PageTemplate.astro';
import StoryTemplate from '../components/templates/StoryTemplate.astro';
import { indexableRoutes, absolute } from '../lib/seo-data';
import { SITE } from '../lib/site';

const articleText = compile({
  baseElements: { selectors: ['main'], returnDomByDefault: false },
  wordwrap: false,
  selectors: [
    { selector: 'nav', format: 'skip' },
    { selector: 'noscript', format: 'skip' },
    { selector: '.virtuous-loading', format: 'skip' },
    { selector: '.sr-only', format: 'skip' },
    { selector: 'img', options: { baseUrl: SITE.url } },
    { selector: 'a', options: { baseUrl: SITE.url, hideLinkHrefIfSameAsText: true } },
    ...['h1', 'h2', 'h3', 'h4'].map((selector) => ({ selector, options: { uppercase: false } })),
  ],
});

export const GET: APIRoute = async () => {
  const container = await AstroContainer.create({ astroConfig: { site: SITE.url } });
  container.addServerRenderer({ renderer: mdxRenderer });
  const docs = [];
  for (const route of await indexableRoutes()) {
    if (route.locale !== 'en' || (route.kind !== 'pages' && route.kind !== 'stories')) continue;
    const url = absolute(route.path);
    const html = await container.renderToString(route.kind === 'pages' ? PageTemplate : StoryTemplate, {
      props: { route, crumbs: [] },
      request: new Request(url),
    });
    docs.push(`# ${route.entry.data.title}\n\nURL: ${url}\n\n${route.entry.data.description}\n\n${articleText(html)}`);
  }
  return new Response(`# ${SITE.name} — full site text\n\n${docs.join('\n\n---\n\n')}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
