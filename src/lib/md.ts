// Markdown for text fields inside blocks (frontmatter strings like a card's
// body or an FAQ answer). Page bodies use Astro's own Markdown pipeline.
//
// Content is authored in this repository, so raw HTML in it is trusted —
// the same trust Astro gives Markdown files.
import { Marked } from 'marked';
import media from '../data/media.json';

const marked = new Marked({ gfm: true, breaks: false });

/** Block-level Markdown → HTML (paragraphs, lists, links). With a locale,
 *  site links ("/give/") point at that locale's page ("/es/give/"). */
export function md(text: string | undefined, locale?: string): string {
  if (!text) return '';
  return localizeLinks(marked.parse(text, { async: false }) as string, locale);
}

/** Inline Markdown → HTML (no wrapping <p>), for one-line fields. */
export function mdInline(text: string | undefined, locale?: string): string {
  if (!text) return '';
  return localizeLinks(marked.parseInline(text, { async: false }) as string, locale);
}

// Paths that are files, not pages, keep their URL in every locale.
const NOT_PAGES = /^\/(fonts|brand|_astro|wp-content|media|favicon|apple-touch|robots|sitemap|llms|ai\/|\.well-known)/;

/** A site path in the given locale; external links and files unchanged. */
export function localizeHref(href: string, locale?: string): string {
  if (href.startsWith('/wp-content/uploads/')) return `${media.base}/uploads/${href.slice('/wp-content/uploads/'.length)}`;
  if (!locale || locale === 'en' || !href.startsWith('/') || href.startsWith('//') || NOT_PAGES.test(href)) return href;
  if (/^\/[a-z]{2}\//.test(href)) return href;
  return `/${locale}${href}`;
}

function localizeLinks(html: string, locale?: string): string {
  // Old WordPress upload links go straight to the media bucket.
  html = html.replace(/(href|src)="\/wp-content\/uploads\//g, `$1="${media.base}/uploads/`);
  if (!locale || locale === 'en') return html;
  return html.replace(/href="(\/[^"]*)"/g, (_, h) => `href="${localizeHref(h, locale)}"`);
}

/** Markdown → plain text, for meta descriptions and JSON-LD. */
export function plain(text: string | undefined): string {
  return md(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
