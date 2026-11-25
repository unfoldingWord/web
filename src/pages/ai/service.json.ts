import type { APIRoute } from 'astro';
import { SITE } from '../../lib/site';
import { absolute } from '../../lib/seo-data';

export const GET: APIRoute = () =>
  Response.json({
    name: SITE.name,
    description: 'Nonprofit equipping the global church to translate the Bible into every language.',
    url: absolute('/'),
    // What an AI agent can do on this site (geo-checklist.dev convention).
    capabilities: [
      'Explain Church-Centric Bible Translation and the Gateway Languages strategy',
      'Find open-licensed biblical content, translation tools and training for Bible translators',
      'Read stories from the field and current prayer requests',
      'Give to support Bible translation (secure Virtuous giving forms)',
      'Download Sweet Publishing Bible illustrations',
    ],
    provider: SITE.name,
    services: [
      { name: 'Church-Centric Bible Translation strategy', url: absolute('/ccbt/'), audience: 'Church networks and Bible translation partners' },
      { name: 'Open-licensed biblical content (Bibles, translation helps, Open Bible Stories)', url: absolute('/for-translators/content/'), audience: 'Bible translators' },
      { name: 'Translation tools (translationCore and others)', url: absolute('/for-translators/tools/'), audience: 'Bible translators and checkers' },
      { name: 'Training', url: absolute('/for-translators/training/'), audience: 'Church-based translation teams' },
      { name: 'Whole Bible | Whole Nation', url: absolute('/wbwn/'), audience: 'Partners and donors' },
      { name: 'Ways to give', url: absolute('/give/'), audience: 'Donors' },
    ],
    actions: [
      { name: 'Give', url: absolute('/give/') },
      { name: 'Contact', url: absolute('/contact/') },
      { name: 'Read stories from the field', url: absolute('/stories/') },
    ],
  });
