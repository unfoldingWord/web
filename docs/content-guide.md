# Content guide

How pages on unfoldingword.org are written. Everything here is plain text files in
`src/content/`; the site's look comes from the components, not from the files.

## Where things go

| What | File | URL |
|---|---|---|
| A page | `src/content/pages/en/<path>.md` (`index.md` for a folder's own page) | `/<path>/` |
| Its translation | `src/content/pages/<locale>/<path>.md` (same name) | `/<locale>/<path>/` |
| A story | `src/content/stories/en/<slug>.md` | `/stories/<slug>/` |
| A prayer request | `src/content/prayer/en/<slug>.md` | `/prayer-request/<slug>/` |
| A person | `src/content/people/en/<slug>.md` | shown by `people` blocks |
| A Sweet Publishing book | `src/content/sweet/en/<book>.md` | `/sweet-publishing/<book>/` |
| An image | `src/assets/images/<area>/<name>.jpg` | referenced as `<area>/<name>.jpg` |

File and folder names: lowercase, words separated by hyphens. Image paths in content are
relative to `src/assets/images/` (e.g. `image: give/hero-church.jpg`). A wrong path fails the
build and names the path.

## Every page needs

```yaml
---
title: Monthly giving          # the page's name; becomes "<title> | unfoldingWord"
description: >-                 # 50–200 characters, written for a search result
  Give monthly to equip church networks to translate the Bible into their own languages.
redirectFrom: [/give-monthly/]  # old URLs that should land here (301)
sections: [...]                 # the page body, as blocks (below)
---
```

Optional: `template` (`standard` · `landing` · `giving` · `article`), `heading` (H1 when there is no
hero), `noindex: true`, `updated: 2026-11-24`, `ogImage` (social image path), `schemaType`
(`AboutPage`, `ContactPage`, `FAQPage`, `CollectionPage`, `DonatePage`), `breadcrumbs: false`.
Markdown after the frontmatter is rendered as a prose section after the blocks
(`bodyPosition: before` puts it first).

## Writing rules

- **unfoldingWord** is always camelCase. Bible capitalized; biblical, church, gospel lowercase
  unless a proper noun. No ampersands in prose — "and". No Oxford comma unless needed.
- Voice: humble, clear, faithful, relational, hopeful. Local churches are the heroes, not
  unfoldingWord.
- **Every image needs real alt text** describing what is in it (`imageAlt`, `alt`). Decorative
  images on the old site that carried no meaning (logos repeated in the page, spacer images,
  badge images) are dropped, not migrated.
- One H1 per page — the hero `title` or the page `title`. Section titles are H2.
- Open key pages with a sentence that says plainly what the thing is ("Church-Centric Bible
  Translation is …"). Search and AI answer engines quote opening definitions.
- Keep the old page's wording. Fix obvious typos and broken links; do not rewrite the message.
- Links between pages use English paths (`/give/`); they are localized automatically.

## Blocks

`sections` is a list. Each item has a `type` and the fields below. Text fields accept Markdown
(`**bold**`, `[link](/path/)`, lists in multi-line fields with `|-`).

### hero — the top of a page
```yaml
- type: hero
  variant: ocean        # ocean (blue band) | photo (photo with blue overlay; needs image) | split (text beside photo) | light (quiet, utility pages)
  eyebrow: Ways to give # small label above the title (optional)
  title: Give the gospel. Change lives forever.
  lead: One or two sentences under the title.
  image: give/hero.jpg  # required for photo and split
  imageAlt: Church leaders studying a translated Bible together in Chad
  actions:
    - { label: Give now, href: '#give-form', style: give }   # style: primary | secondary | give
```

### prose — Markdown text
```yaml
- type: prose
  title: Our vision          # optional H2
  eyebrow: optional
  background: white          # white | mist | ocean
  width: prose               # prose (readable column) | wide
  serif: false
  body: |-
    Paragraphs, **bold**, [links](/ccbt/), lists…
```

### cards — a grid of items (programs, links, values)
```yaml
- type: cards
  title: What we do
  intro: optional
  columns: 3                 # 2 | 3 | 4
  background: white          # white | mist | ocean
  items:
    - title: Whole Bible, Whole Nation
      body: Short description.
      href: /wbwn/
      linkLabel: Learn more  # optional; default "Read more"
      image: programs/wbwn.jpg
      imageAlt: …
      icon: church           # instead of an image: church, language, tools, training, users, book, heart, pray, app, map…
```

### split — text beside an image or video
```yaml
- type: split
  title: Open Bible Stories
  body: |-
    Text…
  image: obs/kids.jpg
  imageAlt: …
  video: { provider: youtube, id: dQw4w9WgXcQ, title: Video title }   # instead of image
  imagePosition: end         # end | start
  background: white
  actions: [{ label: Learn more, href: /obs/ }]
```

### stats — big numbers
```yaml
- type: stats
  background: ocean          # ocean | mist | white
  items:
    - { value: '1.45 billion', label: people without the Bible in their heart language }
```

### quote
```yaml
- type: quote
  quote: It helps us reach Muslims like nothing ever has before.
  attribution: Stephen
  role: Church-Centric Bible Translation partner, Chad
  image: optional, imageAlt: …
```

### cta — a call to action band
```yaml
- type: cta
  variant: ocean             # ocean | kindle | mist
  title: Equip a church network
  body: optional
  actions: [{ label: Give, href: /give/, style: give }]
```

### video
```yaml
- type: video
  title: What is Church-Centric Bible Translation?
  provider: youtube          # youtube | vimeo
  id: VIDEO_ID               # just the id: dQw4w9WgXcQ or 1232161297
  hash: b9a8b8aab2           # unlisted Vimeo videos only: from the share link vimeo.com/1232161297/b9a8b8aab2
  caption: optional
  transcript: |-             # strongly encouraged: search and AI engines read transcripts, not video
    …
```

### giving — the Virtuous donation form
```yaml
- type: giving
  title: Give where most needed
  body: Text beside the form.
  formId: 16dec80a-ad5e-470e-ae62-4ed13821ccca   # the data-rd value from Virtuous's embed code
  image: give/side.jpg       # optional, shown beside the form on large screens
  imageAlt: …
```
The block renders its own `id="give-form"`, so a hero button can link to `#give-form`.

### faq — questions and answers (adds FAQPage schema)
```yaml
- type: faq
  title: Frequently asked questions
  items:
    - q: What is a gateway language?
      a: |-
        Answer in Markdown.
```

### people — a team from `src/content/people/`
```yaml
- type: people
  title: Board of directors
  group: board               # matches `groups` in each person file
  layout: grid               # grid | list
```
Person file (`src/content/people/en/jane-doe.md`):
```yaml
---
name: Jane Doe
role: Executive Director
groups: [leadership]
order: 10
photo: people/jane-doe.jpg
photoAlt: Jane Doe
bio: |-
  Bio in Markdown.
---
```

### storyList / prayerList
```yaml
- type: storyList
  title: Stories from the field
  limit: 3                   # omit for all
  region: africa             # optional filter
  showFilter: true           # region filter buttons (story index page)
- type: prayerList
  title: Pray with us
  limit: 4
```

### resources — downloads and links
```yaml
- type: resources
  id: publications           # optional anchor (#publications)
  title: Publications
  items:
    - title: The Gateway Languages Strategy
      description: optional
      href: https://…pdf
      kind: pdf              # pdf | link | video | audio | book | app
      meta: 24 pages         # optional
```

### steps — numbered process
```yaml
- type: steps
  title: How churches translate
  items:
    - { title: Plan, body: … }
```

### gallery
```yaml
- type: gallery
  images:
    - { src: wbwn/chad-1.jpg, alt: …, caption: optional }
```

### signup — newsletter or prayer-calendar sign-up (Virtuous)
```yaml
- type: signup
  id: prayer-signup          # optional anchor
  title: Receive the monthly prayer calendar
  body: Short explanation.
  formId: 48E8DDDB-DF9D-46F0-9715-9CDD48C535CA   # the data-vform value from Virtuous's embed code
  orgId: '7243'              # data-orgId (sign-up forms use 7243; giving forms use 41649)
```

### trust — ECFA, Candid, MinistryWatch
```yaml
- type: trust
  title: Give with confidence
```

### contactForm — address, phone (and the form when enabled)
```yaml
- type: contactForm
  title: Get in touch
```

### embed — a third-party iframe (use sparingly)
```yaml
- type: embed
  title: 2025 annual report
  src: https://heyzine.com/flip-book/5ebaad78c0.html
  aspect: 4 / 3
```

### sweetBooks — the Sweet Publishing book index

## Stories

```yaml
---
title: The angry imam
description: How Open Bible Stories in a Chadian language calmed a hostile village. (50–200 chars)
date: 2024-05-03
region: africa          # africa | asia | eurasia | latin-america | middle-east | pacific | south-asia | worldwide
country: Chad           # optional
image: stories/the-angry-imam.jpg
imageAlt: …
excerpt: One or two sentences for story cards (optional; description is used otherwise).
sensitive: false        # true if it names people or places in a security-sensitive region
redirectFrom: [/open-bible-stories/the-angry-imam/]
---
Story text in Markdown.
```

A story with a video is an `.mdx` file (same frontmatter) that places the player in the text:

```mdx
import VideoFrame from '../../../components/ui/VideoFrame.astro';

Paragraph…

<VideoFrame provider="youtube" id="FrTFf2he2ww" title="Ibrahim's story" />
```

## Prayer requests

```yaml
---
title: Checkpoints in Iran
description: …
date: 2026-10-02
region: middle-east     # optional
image: prayer/checkpoints.jpg   # optional
imageAlt: …
redirectFrom: []
---
Prayer request text.
```

## Translations

Copy the English file to the same path under the locale folder (`src/content/pages/es/give.md`),
translate the text values (not the keys, `type`s, `href`s, image paths or `formId`), and set
`translationStatus: draft`. A native reader changes it to `reviewed` after checking it. Until a
page has a translation, its locale URL shows the English text with the menus in that language.
Interface strings (menus, buttons) are in `src/i18n/ui/<locale>.json`.
