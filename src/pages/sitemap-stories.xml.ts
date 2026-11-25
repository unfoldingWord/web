import type { APIRoute } from 'astro';
import { sitemapFor } from '../lib/sitemap';

export const GET: APIRoute = () => sitemapFor(['stories']);
