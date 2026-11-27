import media from '../data/media.json';

// Facts about the organization, used by the header, footer and JSON-LD.
// Change them here, not in components.

export const SITE = {
  name: 'unfoldingWord',
  url: 'https://unfoldingword.org',
  legalName: 'unfoldingWord',
  ein: '14-1888977',
  foundingDate: '2013',
  email: undefined as string | undefined,
  telephone: '+1-407-604-0883',
  telephoneDisplay: '407.604.0883',
  address: {
    streetAddress: '13485 Veterans Way, Suite 460',
    addressLocality: 'Orlando',
    addressRegion: 'FL',
    postalCode: '32827',
    addressCountry: 'US',
  },
  // The address as the footer's copyright line writes it (production wording).
  addressDisplay: '13485 Veterans Way Suite 460, Orlando, FL 32827',
  // Google Tag Manager container. GA4 is configured inside it. Loaded only
  // on the production hostname (see Analytics.astro).
  gtmId: 'GTM-KS32FPTM',
  productionHost: 'unfoldingword.org',
  // Virtuous giving
  virtuousOrgId: '41649',
  virtuousEmbedSrc: 'https://cdn.virtuousraise.org/embed/embed.js',
  givingFallbackUrl: 'https://give.unfoldingword.org/',
  // R2 bucket for Sweet Publishing images and uploads — see src/data/media.json.
  mediaBase: media.base,
  social: {
    facebook: 'https://www.facebook.com/unfoldingWord/',
    instagram: 'https://www.instagram.com/unfoldingword/',
    youtube: 'https://www.youtube.com/@unfoldingWord',
    linkedin: 'https://www.linkedin.com/company/unfoldingword',
    x: 'https://x.com/unfoldingWord',
  },
  // Third-party profiles that confirm who we are (schema.org sameAs).
  profiles: [
    'https://www.facebook.com/unfoldingWord/',
    'https://www.instagram.com/unfoldingword/',
    'https://www.youtube.com/@unfoldingWord',
    'https://www.linkedin.com/company/unfoldingword',
    'https://x.com/unfoldingWord',
    'https://github.com/unfoldingWord',
    'https://app.candid.org/profile/6946577/unfoldingword-14-1888977/',
    'https://db.ministrywatch.com/ministry.php?ein=141888977',
  ],
  // Footer badges and the giving trust list. `badge` is a local copy of the
  // seal (src/assets/images/brand/) or, for Candid, the live seal image that
  // Candid updates each year; `alt` describes the seal image.
  trust: [
    {
      name: 'ECFA',
      href: 'https://www.ecfa.org/Standards.aspx',
      label: 'Accredited member of the Evangelical Council for Financial Accountability',
      badge: 'ecfa',
      alt: 'ECFA accredited seal: the letters ECFA on a blue disc inside a white ring',
      newTab: false,
    },
    {
      name: 'Candid',
      href: 'https://app.candid.org/profile/6946577/unfoldingword-14-1888977/',
      label: 'Candid (GuideStar) Platinum Seal of Transparency',
      badge: 'https://widgets.candid.org/TransparencySeal/6946577/svg',
      alt: 'Candid Platinum Transparency seal for the current year',
      newTab: true,
    },
    {
      name: 'MinistryWatch',
      href: 'https://db.ministrywatch.com/ministry.php?ein=141888977',
      label: 'MinistryWatch 100% Give With Confidence rating',
      badge: 'ministrywatch',
      alt: 'MinistryWatch 2026 Give With Confidence seal in a gold rope ring',
      newTab: true,
    },
  ],
  annualReportUrl: 'https://heyzine.com/flip-book/5ebaad78c0.html',
} as const;

// Interface strings as each locale's own file has them, before English fills
// the gaps. The header and footer use this to mark a string that falls back
// to English with lang="en" dir="ltr", so a right-to-left page keeps its
// punctuation on the correct side.
const OWN_UI = import.meta.glob<Record<string, unknown>>('../i18n/ui/*.json', { eager: true, import: 'default' });

/** True when `locale`'s own file has the string at `path` (e.g. 'nav.pray'). */
export function ownsUiString(locale: string, path: string): boolean {
  if (locale === 'en') return true;
  let v: unknown = OWN_UI[`../i18n/ui/${locale}.json`];
  for (const k of path.split('.')) v = v && typeof v === 'object' ? (v as Record<string, unknown>)[k] : undefined;
  return typeof v === 'string' && v !== '';
}

/** Attributes for an element holding a UI string that may be an English fallback. */
export function fallbackAttrs(locale: string, path: string): { lang?: string; dir?: 'ltr' } {
  return ownsUiString(locale, path) ? {} : { lang: 'en', dir: 'ltr' };
}

// Main navigation. Labels are keys into src/i18n/ui/{locale}.json → nav.
// Paths are English paths; the header localizes them. An item with children
// is a dropdown; a child with children opens a flyout.
export interface NavItem {
  key: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

export const NAV: NavItem[] = [
  {
    key: 'whatWeDo',
    children: [
      { key: 'overview', href: '/overview/' },
      { key: 'transformation', href: '/transformation/' },
      { key: 'innovation', href: '/innovation/' },
      { key: 'catalyzation', href: '/catalyzation/' },
      { key: 'equippingPartners', href: '/give/' },
      { key: 'forums', href: '/global-regional-forums/' },
    ],
  },
  {
    key: 'toolsMenu',
    children: [
      { key: 'translationCore', href: '/translationcore/' },
      { key: 'btServant', href: '/bt-servant/' },
      { key: 'obs', href: '/obs/' },
      {
        key: 'forTranslators',
        href: '/for-translators/',
        children: [
          { key: 'content', href: '/for-translators/content/' },
          { key: 'translatorTools', href: '/for-translators/tools/' },
          { key: 'training', href: '/for-translators/training/' },
        ],
      },
      { key: 'publications', href: '/publications/' },
      { key: 'sweetPublishing', href: '/sweet-publishing/' },
    ],
  },
  { key: 'stories', href: '/stories/' },
  { key: 'pray', href: '/pray/' },
  {
    key: 'aboutMenu',
    children: [
      { key: 'about', href: '/about/' },
      { key: 'visionMission', href: '/vision-mission/' },
      { key: 'statementOfFaith', href: '/statement-of-faith/' },
      { key: 'coreValues', href: '/our-core-values/' },
      { key: 'leadership', href: '/leadership/' },
      { key: 'team', href: '/our-team/' },
      { key: 'financial', href: '/financial-information/' },
      { key: 'annualReport', href: SITE.annualReportUrl, external: true },
      { key: 'careers', href: '/careers/' },
      { key: 'contact', href: '/contact/' },
    ],
  },
  {
    key: 'ccbtMenu',
    children: [
      { key: 'ccbt', href: '/ccbt/' },
      { key: 'ccbtVs', href: '/ccbt/church-centric-vs-bible-centric/' },
      { key: 'howChurchesTranslate', href: '/ccbt/how-churches-translate/' },
      { key: 'openLicensed', href: '/ccbt/open-licensed-biblical-content/' },
      { key: 'establishing', href: '/ccbt/establishing-the-church/' },
      { key: 'equipping', href: '/ccbt/equipping-servants/' },
      { key: 'gatewayLanguages', href: '/ccbt/gateway-languages/' },
      { key: 'trustworthy', href: '/ccbt/trustworthy-and-trusted/' },
      { key: 'uwStrategicOverview', href: '/ccbt/strategic-overview/' },
      { key: 'glossary', href: '/ccbt/glossary/' },
      { key: 'faq', href: '/ccbt/faq/' },
    ],
  },
];

// Footer link columns. Headings and labels are keys into
// src/i18n/ui/{locale}.json → footer. The "What we do" column is built from
// the portfolios (src/lib/portfolios.ts) in Footer.astro.
export interface FooterColumn {
  key: string;
  links: NavItem[];
}

export const FOOTER_LINKS: FooterColumn[] = [
  {
    key: 'getInvolved',
    links: [
      { key: 'waysToGive', href: '/give/' },
      { key: 'giveMonthly', href: '/give/monthly/' },
      { key: 'plannedGiving', href: '/give/planned-giving/' },
      { key: 'supportStaff', href: '/give/staff/' },
      { key: 'pray', href: '/pray/' },
      { key: 'stories', href: '/stories/' },
    ],
  },
  {
    key: 'about',
    links: [
      { key: 'leadership', href: '/leadership/' },
      { key: 'ccbt', href: '/ccbt/' },
      { key: 'financial', href: '/financial-information/' },
      { key: 'careers', href: '/careers/' },
      { key: 'contact', href: '/contact/' },
    ],
  },
];
