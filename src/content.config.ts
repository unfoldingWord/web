// Content model for unfoldingword.org.
//
// Every page, story, prayer request, person and Sweet Publishing book is a
// file under src/content/{collection}/{locale}/. English (en/) is the
// source; a file with the same name under another locale folder is its
// translation. The schemas below are what makes a broken entry fail the
// build with a readable message instead of publishing a broken page.
//
// Images are referenced by path under src/assets/images/, e.g.
//   image: stories/the-angry-imam.jpg
// (resolved by src/lib/images.ts; a missing file fails the build). Every
// image needs alt text — `imageAlt` / `alt` is required wherever an image is.
//
// Pages are built from `sections`: an ordered list of blocks, each one of the
// types below. Each block type is one component in
// src/components/blocks/. To add a block type: add its schema here, its
// component there, and its case in BlockRenderer.astro; document it in
// docs/content-guide.md.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Entry ids are the file path without extension, e.g. 'en/give/monthly' —
// src/lib/routes.ts turns that into the URL /give/monthly/.
const idFromPath = ({ entry }: { entry: string }) => entry.replace(/\.(mdx?|ya?ml|json)$/, '');

// ---------- shared pieces ----------
const imagePath = z
  .string()
  .regex(/^[a-z0-9][a-z0-9/_\-.]*\.(jpe?g|png|webp|avif|gif|svg)$/i, 'Image paths are relative to src/assets/images/, e.g. "stories/my-photo.jpg"');

function hasImageAlt(data: { image?: string; imageAlt?: string }) {
  return !data.image || Boolean(data.imageAlt?.trim());
}
const missingAlt = { message: 'An image needs descriptive imageAlt text', path: ['imageAlt'] };

const href = z.string().min(1);

const action = z.object({
  label: z.string(),
  href,
  style: z.enum(['primary', 'secondary', 'give']).default('primary'),
});

const translationStatus = z.enum(['source', 'draft', 'reviewed']).default('source');

// Old URLs that should 301 to this entry (written to dist/_redirects).
const redirectFrom = z.array(z.string().regex(/^\//, 'Old URLs start with "/"')).default([]);

// ---------- blocks ----------
const hero = z.object({
  type: z.literal('hero'),
  eyebrow: z.string().optional(),
  title: z.string(),
  lead: z.string().optional(),
  image: imagePath.optional(),
  imageAlt: z.string().optional(),
  // banner — production's page-title band: photo under a 50% Ocean overlay,
  //   centered 32px title (the default opener for standard pages)
  // project — photo band with a text column (wbwn country pages)
  // heading — no band: a centered 40px title and line (donation confirmation)
  variant: z.enum(['photo', 'ocean', 'light', 'split', 'banner', 'project', 'heading']).default('ocean'),
  actions: z.array(action).default([]),
  // banner: uppercase title (production does this on most pages, not ccbt/*)
  uppercase: z.boolean().optional(),
  // banner: more title lines in the same style (about, overview)
  lines: z.array(z.string()).optional(),
  // banner: a short Kindle rule between the title lines
  divider: z.boolean().optional(),
  // banner: a smaller line under the title
  subtitle: z.string().optional(),
  // project: which half of the band holds the text
  contentPosition: z.enum(['start', 'end']).optional(),
}).refine(hasImageAlt, missingAlt);

const prose = z.object({
  type: z.literal('prose'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  body: z.string(),
  // narrow — production's 800px text column (vision and mission)
  width: z.enum(['prose', 'wide', 'narrow']).default('prose'),
  background: z.enum(['white', 'mist', 'ocean']).default('white'),
  serif: z.boolean().default(false),
  align: z.enum(['start', 'center']).optional(),
  // A short Kindle rule under the title (about "Our Strategy")
  divider: z.boolean().optional(),
  // Buttons centered under the text (production's "Donate Now")
  actions: z.array(action).optional(),
  // A white icon above the title (wbwn "Prayers" box), from ui/Icon.astro
  icon: z.string().optional(),
});

const cards = z.object({
  type: z.literal('cards'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).default(3),
  // kindle — the Kindle 25% tint band (wbwn region cards)
  background: z.enum(['white', 'mist', 'ocean', 'kindle']).default('white'),
  // plain — production's columns: no card, Inspire title, a Learn More button
  // centered — plain and centered (for-translators)
  // outlined — 1px Kindle border, centered title, outline + filled buttons (wbwn)
  variant: z.enum(['card', 'plain', 'centered', 'outlined']).optional(),
  align: z.enum(['start', 'center']).optional(),
  items: z.array(
    z.object({
      title: z.string(),
      body: z.string().optional(),
      image: imagePath.optional(),
      imageAlt: z.string().optional(),
      icon: z.string().optional(),
      href: href.optional(),
      linkLabel: z.string().optional(),
      // Kindle "Impact:" line (tools-technology)
      impact: z.string().optional(),
      // outlined: a second, filled button
      donateHref: href.optional(),
      donateLabel: z.string().optional(),
      // a small logo beside the title (tools-technology)
      logo: imagePath.optional(),
      logoAlt: z.string().optional(),
    }).refine(hasImageAlt, missingAlt).refine((i) => !i.logo || Boolean(i.logoAlt?.trim()), { message: 'A logo needs logoAlt text', path: ['logoAlt'] }),
  ),
});

const split = z.object({
  type: z.literal('split'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  body: z.string(),
  image: imagePath.optional(),
  imageAlt: z.string().optional(),
  video: z.object({ provider: z.enum(['youtube', 'vimeo']), id: z.string().regex(/^[\w-]+$/, 'Just the video id, e.g. 1232161297 — put an unlisted Vimeo video\'s h= value in `hash`'), hash: z.string().optional(), title: z.string() }).optional(),
  imagePosition: z.enum(['start', 'end']).default('end'),
  background: z.enum(['white', 'mist', 'ocean']).default('white'),
  actions: z.array(action).default([]),
  // Kindle "Impact:" line under the text (overview programs)
  impact: z.string().optional(),
  uppercase: z.boolean().optional(),
}).refine(hasImageAlt, missingAlt);

const stats = z.object({
  type: z.literal('stats'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  background: z.enum(['white', 'mist', 'ocean']).default('ocean'),
  // bars — label above a full-width colored bar holding the number (wbwn)
  variant: z.enum(['grid', 'bars']).optional(),
  items: z.array(z.object({ value: z.string(), label: z.string(), color: z.enum(['ocean', 'kindle']).optional() })),
});

const quote = z.object({
  type: z.literal('quote'),
  quote: z.string(),
  attribution: z.string().optional(),
  role: z.string().optional(),
  image: imagePath.optional(),
  imageAlt: z.string().optional(),
}).refine(hasImageAlt, missingAlt);

const cta = z.object({
  type: z.literal('cta'),
  title: z.string(),
  body: z.string().optional(),
  // split — Ocean band, heading and button beside a photo (about)
  variant: z.enum(['ocean', 'kindle', 'mist', 'split']).default('ocean'),
  actions: z.array(action).min(1),
  image: imagePath.optional(),
  imageAlt: z.string().optional(),
}).refine(hasImageAlt, missingAlt);

const video = z.object({
  type: z.literal('video'),
  title: z.string(),
  provider: z.enum(['youtube', 'vimeo']),
  id: z.string().regex(/^[\w-]+$/, 'Just the video id, e.g. dQw4w9WgXcQ or 1232161297'),
  // Unlisted Vimeo videos only play with their privacy hash: the h= value in
  // the share link (https://vimeo.com/1232161297/b9a8b8aab2 → b9a8b8aab2).
  hash: z.string().optional(),
  caption: z.string().optional(),
  // A text transcript is what search and AI engines index; add one.
  transcript: z.string().optional(),
  background: z.enum(['white', 'tint', 'ocean']).default('white'),
  // The heading shown above the video, when it should differ from `title`
  // (which names the video for screen readers and search).
  heading: z.string().optional(),
});

const giving = z.object({
  type: z.literal('giving'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  // The Virtuous form: the `data-rd` value from the embed snippet Virtuous
  // gives you (<script src=".../embed.js" data-rd="16dec80a-…">). The
  // organization id (41649) is fixed in src/lib/site.ts. See
  // docs/content-guide.md.
  formId: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 'A Virtuous form id is the data-rd value from the embed code, like 16dec80a-ad5e-470e-ae62-4ed13821ccca'),
  image: imagePath.optional(),
  imageAlt: z.string().optional(),
}).refine(hasImageAlt, missingAlt);

const faq = z.object({
  type: z.literal('faq'),
  title: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.object({ q: z.string(), a: z.string() })),
});

const peopleBlock = z.object({
  type: z.literal('people'),
  title: z.string().optional(),
  intro: z.string().optional(),
  group: z.string(),
  layout: z.enum(['grid', 'list']).default('grid'),
});

const storyList = z.object({
  type: z.literal('storyList'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  limit: z.number().int().positive().optional(),
  region: z.string().optional(),
  // Hand-picked stories, in this order (file names without .md). Overrides
  // the default "newest first".
  slugs: z.array(z.string()).optional(),
  showFilter: z.boolean().default(false),
  background: z.enum(['white', 'mist', 'ocean']).default('white'),
  // grid: cards in columns. carousel: production's home card slider (3/2/1
  // per view). rows: production's story index (diagonal photo beside text,
  // nine per page).
  layout: z.enum(['grid', 'carousel', 'rows']).default('grid'),
});

const prayerList = z.object({
  type: z.literal('prayerList'),
  title: z.string().optional(),
  intro: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

const resources = z.object({
  type: z.literal('resources'),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  // cards — bordered link cards; list — production's icon list; accordion —
  // one collapsible box per item (for-translators, publications)
  variant: z.enum(['cards', 'list', 'accordion']).optional(),
  // accordion: larger text and padding inside the boxes (publications)
  textSize: z.enum(['normal', 'large']).optional(),
  background: z.enum(['white', 'mist', 'ocean']).optional(),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // Optional only for accordion items that are all text
      href: href.optional(),
      kind: z.enum(['pdf', 'link', 'video', 'audio', 'book', 'app']).default('link'),
      image: imagePath.optional(),
      imageAlt: z.string().optional(),
      meta: z.string().optional(),
    }).refine(hasImageAlt, missingAlt),
  ),
});

const steps = z.object({
  type: z.literal('steps'),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.object({ title: z.string(), body: z.string() })),
});

const gallery = z.object({
  type: z.literal('gallery'),
  title: z.string().optional(),
  images: z.array(z.object({ src: imagePath, alt: z.string().trim().min(1), caption: z.string().optional() })),
});

const trust = z.object({ type: z.literal('trust'), title: z.string().optional() });

const contactForm = z.object({
  type: z.literal('contactForm'),
  title: z.string().optional(),
  intro: z.string().optional(),
});

const embed = z.object({
  type: z.literal('embed'),
  title: z.string(),
  src: z.url(),
  aspect: z.string().default('16 / 9'),
});

const sweetBooks = z.object({ type: z.literal('sweetBooks'), title: z.string().optional() });

// A Virtuous CRM sign-up form (newsletter, prayer calendar) — the
// virtuous.embed.min.js kind with data-vform, not a giving form.
const signup = z.object({
  type: z.literal('signup'),
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  formId: z.string().regex(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/, 'The data-vform value from the Virtuous embed code'),
  orgId: z.string().default('7243'),
  background: z.enum(['white', 'mist', 'ocean']).default('mist'),
  // band: production's home sign-up (Cultivate band, text and form in the
  // start half, `image` in the end half).
  variant: z.enum(['card', 'band']).default('card'),
  image: imagePath.optional(),
  imageAlt: z.string().optional(),
}).refine(hasImageAlt, missingAlt);

// ---------- home page blocks ----------
// Home hero: crossfading background photos under a 50% Tech overlay.
const heroSlideshow = z.object({
  type: z.literal('heroSlideshow'),
  title: z.string(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  slides: z.array(z.object({ image: imagePath, imageAlt: z.string().trim().min(5, 'Describe each slide photo in imageAlt') })).min(1),
  actions: z.array(action).default([]),
});

// Two columns of centered, bold statements. In each item `lead` is set
// larger; `tone` picks Ocean (16px) or Inspire (20px) text.
const statement = z.object({
  type: z.literal('statement'),
  columns: z.array(z.object({
    tone: z.enum(['ocean', 'inspire']).default('ocean'),
    items: z.array(z.object({ lead: z.string(), text: z.string() })).min(1),
  })).min(1).max(2),
});

// Testimonial slider: photo beside a title and quote, one at a time.
const testimonials = z.object({
  type: z.literal('testimonials'),
  title: z.string().optional(),
  items: z.array(z.object({
    title: z.string(),
    body: z.string(),
    image: imagePath.optional(),
    imageAlt: z.string().optional(),
  }).refine(hasImageAlt, missingAlt)).min(1),
});

// A row of partner logos that scrolls sideways (static when the visitor
// prefers reduced motion).
const logoMarquee = z.object({
  type: z.literal('logoMarquee'),
  title: z.string(),
  titleImage: imagePath.optional(),
  titleImageAlt: z.string().optional(),
  logos: z.array(z.object({ image: imagePath, alt: z.string().trim().min(2), href: href.optional() })).min(1),
});

export const block = z.discriminatedUnion('type', [
  hero, prose, cards, split, stats, quote, cta, video, giving, faq, peopleBlock,
  storyList, prayerList, resources, steps, gallery, trust, contactForm, embed, sweetBooks, signup,
  heroSlideshow, statement, testimonials, logoMarquee,
]);
export type Block = z.infer<typeof block>;

// ---------- collections ----------
const seo = {
  title: z.string(),
  // Shown in search results. 120–160 characters reads best.
  description: z.string().min(50, 'Write a description of at least 50 characters for search results').max(200),
  ogImage: imagePath.optional(),
  noindex: z.boolean().default(false),
  translationStatus,
  updated: z.coerce.date().optional(),
};

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    ...seo,
    // Title shown in the page itself when there is no hero (defaults to title).
    heading: z.string().optional(),
    template: z.enum(['standard', 'landing', 'giving', 'article']).default('standard'),
    sections: z.array(block).default([]),
    // Where the Markdown body goes relative to the sections.
    bodyPosition: z.enum(['before', 'after']).default('after'),
    // legal — production's policy pages: a large `heading` above the text and
    // small bold section headings (privacy, terms of use)
    // post — WordPress block-editor headings: h3 and smaller in Tech at
    // weight 500 (charitable solicitation disclosures)
    bodyStyle: z.enum(['default', 'legal', 'post']).optional(),
    // The page-title banner when there is no hero: its photo, and whether the
    // title is uppercase (production: yes on most pages).
    bannerImage: imagePath.optional(),
    bannerImageAlt: z.string().optional(),
    bannerUppercase: z.boolean().optional(),
    breadcrumbs: z.boolean().default(true),
    redirectFrom,
    // FAQPage / other extra schema.org types are derived from blocks; this
    // marks pages that describe the organization (About) for JSON-LD.
    schemaType: z.enum(['WebPage', 'AboutPage', 'ContactPage', 'FAQPage', 'CollectionPage', 'DonatePage']).default('WebPage'),
    // A/B testing: a variant file sets `variantOf` (the path of the page it
    // replaces) and `experiment`. See docs/ab-testing.md.
    experiment: z.string().optional(),
    variantOf: z.string().optional(),
  }),
});

const stories = defineCollection({
  loader: glob({ base: './src/content/stories', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    ...seo,
    date: z.coerce.date(),
    region: z.enum(['africa', 'asia', 'eurasia', 'latin-america', 'middle-east', 'pacific', 'south-asia', 'worldwide']),
    country: z.string().optional(),
    image: imagePath,
    imageAlt: z.string().trim().min(5, 'Story images need descriptive imageAlt text'),
    author: z.string().default('unfoldingWord'),
    excerpt: z.string().optional(),
    featured: z.boolean().default(false),
    // Production built a few posts in Elementor: larger text (19.36px) on a
    // 980px column. Set true to keep that look.
    largeText: z.boolean().default(false),
    // Set true when a story names people or places in a security-sensitive
    // region. Such stories need the security review in
    // .claude/skills/publish-story/ before they are committed.
    sensitive: z.boolean().default(false),
    redirectFrom,
  }),
});

const prayer = defineCollection({
  loader: glob({ base: './src/content/prayer', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    ...seo,
    date: z.coerce.date(),
    region: z.string().optional(),
    image: imagePath.optional(),
    imageAlt: z.string().optional(),
    redirectFrom,
  }).refine(hasImageAlt, missingAlt),
});

const people = defineCollection({
  loader: glob({ base: './src/content/people', pattern: '**/*.{md,yaml,yml,json}', generateId: idFromPath }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    groups: z.array(z.string()).min(1),
    order: z.number().default(100),
    photo: imagePath.optional(),
    photoAlt: z.string().optional(),
    bio: z.string().optional(),
    translationStatus,
  }).refine((p) => !p.photo || Boolean(p.photoAlt?.trim()), { message: 'A photo needs descriptive photoAlt text', path: ['photoAlt'] }),
});

const sweet = defineCollection({
  loader: glob({ base: './src/content/sweet', pattern: '**/*.{md,yaml,json}', generateId: idFromPath }),
  schema: z.object({
    ...seo,
    book: z.string(),
    order: z.number(),
    testament: z.enum(['ot', 'nt']),
    // Images live in R2 under sweet/ (see docs/sweet-publishing.md); these
    // are their file names without extension, in display order, grouped by
    // chapter.
    chapters: z.array(z.object({ chapter: z.string(), images: z.array(z.string()) })),
    redirectFrom,
  }),
});

export const collections = { pages, stories, prayer, people, sweet };
