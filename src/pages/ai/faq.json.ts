import type { APIRoute } from 'astro';
import { allFaqs } from '../../lib/seo-data';

// Shape follows the geo-checklist.dev convention the GEO audit reads:
// { faqs: [{ question, answer }] }, plus the page each answer comes from.
export const GET: APIRoute = async () =>
  Response.json({
    source: 'https://unfoldingword.org',
    faqs: (await allFaqs()).map((f) => ({ question: f.q, answer: f.a, url: f.url })),
  });
