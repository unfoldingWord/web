# unfoldingword.org

The public website of unfoldingWord, a nonprofit that equips the global church to translate the Bible. Static Astro site on Cloudflare Workers; content is Markdown/YAML files in `src/content/`. Most people working here are **editors, not developers**: they describe a change in plain words and you make it.

## How a change reaches the site

Always through a branch, a pull request and a preview the editor has looked at — the **publish-changes** skill. `main` is what is live; nothing is pushed to `main` directly.

## Common requests and their skills

- new giving page / campaign page → **new-giving-page**
- story from the field → **publish-story**
- prayer request → **publish-prayer-request**
- change or add a page → **edit-page**
- old or short link, a 404 → **add-redirect**
- A/B test → **ab-test**
- leadership/team change → **update-person**
- a page in another language → **translate-page**

## Rules that are easy to get wrong

- **The repository is public and git keeps history.** Names, photos and places in stories and prayer requests get a security review with the editor *before* they are written to any file (publish-story, step 1). When in doubt, leave it out.
- Content follows `docs/content-guide.md` (blocks, fields, writing rules — **unfoldingWord** is camelCase; no ampersands in prose; local churches are the heroes). Read the part you need before writing content.
- Every image has alt text written from looking at the image.
- A page that moves keeps its old URL working (`redirectFrom`); no old URL may 404 (`npm run check:redirects`).
- The look of the site lives in `src/styles/global.css` (tokens) and `src/components/`; pages never carry one-off styling.
- Virtuous form ids come from the editor or Virtuous, never from memory or another page.

## Checks

`npm run build` validates every content file against `src/content.config.ts` and every redirect. `npm run check` runs the rest (interface strings, old URLs, internal links, A/B wiring); CI runs all of it on every pull request.

## Where to read more

- `README.md` — how the site is built, deployed and previewed
- `docs/content-guide.md` — every block and field
- `docs/ab-testing.md`, `docs/analytics.md` — tests and GA4
- `docs/cutover.md` — the January launch runbook (DNS, Search Console)
- `docs/plans/` — the migration plan and its open decisions
