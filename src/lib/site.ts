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
  trust: [
    { name: 'ECFA', href: 'https://www.ecfa.org/', label: 'Accredited member of the Evangelical Council for Financial Accountability' },
    { name: 'Candid', href: 'https://app.candid.org/profile/6946577/unfoldingword-14-1888977/', label: 'Candid (GuideStar) Platinum Seal of Transparency' },
    { name: 'MinistryWatch', href: 'https://db.ministrywatch.com/ministry.php?ein=141888977', label: 'MinistryWatch 100% Give With Confidence rating' },
  ],
  annualReportUrl: 'https://heyzine.com/flip-book/5ebaad78c0.html',
} as const;

// Main navigation. Labels are keys into src/i18n/ui/{locale}.json → nav.
// Paths are English paths; the header localizes them.
export interface NavItem {
  key: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

export const NAV: NavItem[] = [
  {
    key: 'whoWeAre',
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
    ],
  },
  {
    key: 'whatWeDo',
    children: [
      { key: 'overview', href: '/overview/' },
      { key: 'wbwn', href: '/wbwn/' },
      { key: 'tools', href: '/tools-technology/' },
      { key: 'slr', href: '/strategic-language-resources/' },
      { key: 'obs', href: '/obs/' },
      { key: 'catalyzation', href: '/catalyzation/' },
      { key: 'stories', href: '/stories/' },
      {
        key: 'forTranslators',
        href: '/for-translators/',
        children: [
          { key: 'content', href: '/for-translators/content/' },
          { key: 'translatorTools', href: '/for-translators/tools/' },
          { key: 'training', href: '/for-translators/training/' },
        ],
      },
    ],
  },
  {
    key: 'getInvolved',
    children: [
      { key: 'forums', href: '/global-regional-forums/' },
      { key: 'prayer', href: '/pray/' },
    ],
  },
  {
    key: 'strategicOverview',
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
  {
    key: 'waysToGive',
    children: [
      { key: 'giveWhereNeeded', href: '/give/' },
      { key: 'monthly', href: '/give/monthly/' },
      { key: 'planned', href: '/give/planned-giving/' },
      { key: 'initiative', href: '/give/initiative/' },
      { key: 'staff', href: '/give/staff/' },
      { key: 'disclosures', href: '/charitable-solicitation-disclosures/' },
    ],
  },
  { key: 'contact', href: '/contact/' },
];

export const FOOTER_LINKS: NavItem[] = [
  { key: 'whoWeAre', href: '/about/' },
  { key: 'whatWeDo', href: '/overview/' },
  { key: 'waysToGive', href: '/give/' },
  { key: 'strategicOverview', href: '/ccbt/' },
  { key: 'stories', href: '/stories/' },
  { key: 'prayer', href: '/pray/' },
  { key: 'careers', href: '/careers/' },
  { key: 'contact', href: '/contact/' },
];
