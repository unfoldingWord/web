// schema.org JSON-LD. Every page carries one @graph with the Organization
// and WebSite nodes plus the page's own nodes (WebPage, BreadcrumbList,
// Article, FAQPage …). One consistent name — "unfoldingWord" — everywhere,
// which the GEO audit checks across <title>, og:title, H1 and schema.
import { SITE } from './site';

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

type Node = Record<string, unknown>;

export function organizationNode(): Node {
  return {
    '@type': ['NGO', 'Organization'],
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/brand/unfoldingword-logo.png`, width: 1200, height: 210 },
    description:
      'unfoldingWord is a nonprofit that equips the global church to translate the Bible into every language, providing open-licensed biblical content, translation tools, training and technology to church networks among the least reached.',
    foundingDate: SITE.foundingDate,
    taxID: SITE.ein,
    nonprofitStatus: 'Nonprofit501c3',
    address: { '@type': 'PostalAddress', ...SITE.address },
    telephone: SITE.telephone,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: SITE.telephone,
        url: `${SITE.url}/contact/`,
        availableLanguage: ['English'],
      },
    ],
    sameAs: SITE.profiles,
    knowsAbout: ['Bible translation', 'Church-centric Bible translation', 'Open-licensed biblical content', 'Gateway languages', 'Bible translation software', 'Open Bible Stories'],
    areaServed: 'Worldwide',
  };
}

export function websiteNode(lang: string): Node {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    publisher: { '@id': ORG_ID },
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageNode(opts: { url: string; title: string; description?: string; lang: string; type?: string; image?: string; dateModified?: Date; datePublished?: Date; breadcrumbId?: string }): Node {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    author: { '@id': ORG_ID },
    primaryImageOfPage: opts.image ? { '@type': 'ImageObject', url: opts.image } : undefined,
    datePublished: opts.datePublished?.toISOString(),
    dateModified: opts.dateModified?.toISOString(),
    breadcrumb: opts.breadcrumbId ? { '@id': opts.breadcrumbId } : undefined,
  };
}

export function breadcrumbNode(url: string, items: { name: string; url: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function articleNode(opts: { url: string; title: string; description: string; image?: string; date: Date; modified?: Date; author: string; lang: string; section?: string }): Node {
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    image: opts.image ? [opts.image] : undefined,
    datePublished: opts.date.toISOString(),
    dateModified: (opts.modified ?? opts.date).toISOString(),
    author: opts.author === SITE.name ? { '@id': ORG_ID } : { '@type': 'Person', name: opts.author },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
    inLanguage: opts.lang,
    articleSection: opts.section,
  };
}

export function faqNode(url: string, items: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };
}

export function videoNode(opts: { url: string; title: string; description?: string; provider: 'youtube' | 'vimeo'; id: string; transcript?: string }): Node {
  const embed = opts.provider === 'youtube' ? `https://www.youtube-nocookie.com/embed/${opts.id}` : `https://player.vimeo.com/video/${opts.id}`;
  return {
    '@type': 'VideoObject',
    '@id': `${opts.url}#video-${opts.id}`,
    name: opts.title,
    description: opts.description ?? opts.title,
    embedUrl: embed,
    thumbnailUrl: opts.provider === 'youtube' ? `https://i.ytimg.com/vi/${opts.id}/hqdefault.jpg` : undefined,
    transcript: opts.transcript,
    publisher: { '@id': ORG_ID },
  };
}

/** Drop undefined values and serialize one @graph. `<` is escaped so text
 *  can never close the <script> element. */
export function serializeGraph(nodes: Node[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, (_k, v) => (v === undefined ? undefined : v)).replace(/</g, '\\u003c');
}
