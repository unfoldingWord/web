// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { locales, defaultLocale } from './src/i18n/locales.mjs';

// unfoldingword.org — static Astro site served by Cloudflare Workers (static
// assets). See README.md for the moving parts and docs/plans/ for the plan.
//
// URL scheme matches openbiblestories.org: English at /, every other locale
// at /{lang}/. All routes come from one catch-all (src/pages/[...path].astro)
// driven by src/lib/routes.ts, so this i18n block only tells Astro which
// locales exist (for astro:i18n helpers); it does not generate routes.
export default defineConfig({
  site: 'https://unfoldingword.org',
  trailingSlash: 'always',
  devToolbar: { enabled: false },

  // Astro 7 defaults to JSX whitespace rules, which drop the space between
  // inline elements. Migrated prose is full of `<a>…</a> <em>…</em>`, so
  // keep HTML-aware compression.
  compressHTML: true,

  // src/fetch.ts is reserved for advanced routing from Astro 7; this site
  // does not use it.
  fetchFile: null,

  i18n: {
    defaultLocale,
    locales: locales.map((l) => l.code),
    routing: { prefixDefaultLocale: false },
  },

  image: {
    // Responsive <img srcset> for every astro:assets image by default.
    layout: 'constrained',
    responsiveStyles: true,
  },

  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
