// The four portfolios the work is presented in (docs/design-system/README.md).
// Strategic Language Resources and Tools and Technology both sit inside
// Innovation. Unrestricted giving is called Equipping Partners on the public
// site; do not use the word "unrestricted".
//
// `key` is what content files write (`portfolio: innovation`); the CSS class
// `pf-<key>` sets the portfolio color (src/styles/global.css).
export const PORTFOLIO_KEYS = ['transformation', 'innovation', 'catalyzation', 'equipping'] as const;
export type PortfolioKey = (typeof PORTFOLIO_KEYS)[number];

export interface Portfolio {
  key: PortfolioKey;
  /** Interface-string key under nav (src/i18n/ui/*.json). */
  navKey: string;
  href: string;
  /** Where "Give to this portfolio" goes. */
  giveHref: string;
}

export const PORTFOLIOS: Portfolio[] = [
  { key: 'transformation', navKey: 'transformation', href: '/transformation/', giveHref: '/give/wbwn/' },
  { key: 'innovation', navKey: 'innovation', href: '/innovation/', giveHref: '/innovation/#give' },
  { key: 'catalyzation', navKey: 'catalyzation', href: '/catalyzation/', giveHref: '/give/' },
  { key: 'equipping', navKey: 'equippingPartners', href: '/give/', giveHref: '/give/' },
];

export const portfolio = (key: PortfolioKey) => PORTFOLIOS.find((p) => p.key === key)!;
