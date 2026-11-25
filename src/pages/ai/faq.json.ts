import type { APIRoute } from 'astro';
import { allFaqs } from '../../lib/seo-data';

export const GET: APIRoute = async () => Response.json({ source: 'https://unfoldingword.org', questions: await allFaqs() });
