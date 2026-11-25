---
name: new-giving-page
description: Create a new giving or donation page with a Virtuous form — for a campaign, appeal, initiative or giving day.
---

# New giving page

A giving page is one file in `src/content/pages/en/give/` that shows a short appeal, a photo, the Virtuous donation form and the trust marks. Existing ones to copy from: `src/content/pages/en/give/monthly.md`, `src/content/pages/en/give/index.md`.

## Gather from the editor

Ask for anything missing, all in one message:

1. **The Virtuous form.** Either the embed code Virtuous gives (`<script src="https://cdn.virtuousraise.org/embed/embed.js" data-rd="…">`) or just the `data-rd` value. Use exactly what they give; a made-up or reused form id sends gifts to the wrong fund.
2. **The page name and URL**, e.g. "Easter 2027" → `/give/easter-2027/`. Lowercase, hyphens.
3. **The appeal text**: a headline, one or two sentences under it, and a short paragraph beside the form. Their words; tidy them to the writing rules in `docs/content-guide.md` without changing the message.
4. **One to three photos** (files or links), and who/what/where is in each (for alt text).

Done when you have the form id and the text. Photos are optional: without one, use the `ocean` hero.

## Build it

1. Save each photo with `node scripts/migrate/fetch-image.mjs <link-or-file-path> give/<page-name>-<n>.jpg` (it accepts a link or a local file, and shrinks oversized photos). Look at each photo and write alt text describing what is in it.
2. Write `src/content/pages/en/give/<page-name>.md`:

```yaml
---
title: Easter 2027                                    # page name
description: 120–160 characters: what a gift does, for search results.
template: giving
schemaType: DonatePage
sections:
  - type: hero
    variant: photo                                    # or ocean when there is no photo
    eyebrow: Ways to give
    title: <headline>
    lead: <one or two sentences>
    image: give/<page-name>-1.jpg
    imageAlt: <what is in the photo>
    actions: [{ label: Give now, href: '#give-form', style: give }]
  - type: giving
    title: <form heading, e.g. "Give to the Easter appeal">
    body: <the short paragraph>
    formId: <data-rd value>
  - type: trust
    title: Give with confidence
---
```

3. Check every line against the writing rules in `docs/content-guide.md` (unfoldingWord camelCase, no ampersands, local churches as the heroes).
4. Should the page be in the main menu? Usually not — campaign pages are linked from emails. Only add it to `NAV` in `src/lib/site.ts` if the editor asks.

Done when `npm run build` passes and the page renders the form in the local or preview build.

## Then

Use the **publish-changes** skill. On the preview, ask the editor to confirm the form shows the right fund/designation before publishing.
