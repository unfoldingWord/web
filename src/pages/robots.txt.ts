// robots.txt — everything public is crawlable, including by AI search and
// answer engines (the GEO audit penalizes blocking them, and being cited is
// the point). A/B variant pages and the 404 are excluded.
import type { APIRoute } from 'astro';
import { absolute } from '../lib/seo-data';

const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended',
  'CCBot', 'DuckAssistBot', 'meta-externalagent', 'Amazonbot', 'MistralAI-User', 'cohere-ai',
];

export const GET: APIRoute = () => {
  const body = `# unfoldingword.org
User-agent: *
Allow: /
Disallow: /_variants/
Disallow: /api/

${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Allow: /
Disallow: /_variants/

Sitemap: ${absolute('/sitemap-index.xml')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
