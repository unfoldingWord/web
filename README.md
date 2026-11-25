# unfoldingword.org

The website of [unfoldingWord](https://unfoldingword.org). A static [Astro](https://astro.build) site served by Cloudflare Workers, in 16 languages, replacing the WordPress site in January 2027 (plan: `docs/plans/2026-11-24-website-migration-plan.md`).

**Editing the site?** Ask Claude Code in this repository ("add a giving page for…", "publish this story…"). `CLAUDE.md` and the skills in `.claude/skills/` walk it through each kind of change, with a preview link before anything goes live.

## Run it

Needs Node 22.23.4+.

```bash
npm install
```

```bash
npm run dev
```

Opens at http://localhost:4321/. `npm run build` writes the site to `dist/` and generates `dist/_redirects`; `npm run preview` serves `dist/` through the real Worker (A/B tests included) at http://localhost:8787/.

```bash
npm run build && npm run check && npm test
```

## How it fits together

| Part | Where |
|---|---|
| Content (pages, stories, prayer requests, people, Sweet Publishing) | `src/content/<collection>/<locale>/` — schema in `src/content.config.ts`, guide in `docs/content-guide.md` |
| Design system (colors, type, spacing) | `src/styles/global.css`; every component on `/styleguide/` |
| Blocks and templates | `src/components/blocks/`, `src/components/templates/` |
| Every URL the site builds | `src/lib/routes.ts` (one catch-all route: `src/pages/[...path].astro`) |
| Languages | `src/i18n/locales.mjs` (16, same as openbiblestories.org); interface strings `src/i18n/ui/<code>.json` |
| Redirects | `redirects/legacy.txt` + each file's `redirectFrom` → `dist/_redirects` (`scripts/postbuild.mjs`); `redirects/old-urls.txt` must all resolve |
| SEO / AI discovery | JSON-LD (`src/lib/jsonld.ts`), sitemaps, `robots.txt`, `llms.txt`, `llms-full.txt`, `/ai/*.json`, `/.well-known/ai.txt`, `/stories/rss.xml` |
| Analytics | GTM `GTM-KS32FPTM`, production host only — `docs/analytics.md` |
| A/B tests | `src/data/experiments.json` + `worker/` — `docs/ab-testing.md` |
| Images | page images in `src/assets/images/` (optimized at build); Sweet Publishing and uploads in R2 bucket `unfoldingword-media` (`src/data/media.json`, `scripts/sweet/`) |

## Deploy

Cloudflare **Workers Builds** is connected to this repository (Worker `unfoldingword-web`, unfoldingWord account):

- push to `main` → `npm run build`, then `npx wrangler deploy` → production (until cutover that is the staging address https://unfoldingword-web.unfoldingword.workers.dev, kept out of search engines by a `_headers` rule)
- any other branch → `npx wrangler preview` → a **Preview** at `https://<branch>-unfoldingword-web.unfoldingword.workers.dev`, also posted as a comment on the pull request (`noindex`; analytics off). Preview variables come from the `previews` block in `wrangler.jsonc`.
- Build cache is on (Settings → Build → Build cache), so optimized images in `node_modules/.astro` are reused; a build with no cache takes about 11 minutes, almost all of it image encoding.
- Virtuous giving forms only render on domains registered in Virtuous (Page & Form Settings). Register `unfoldingword-web.unfoldingword.workers.dev` and the preview pattern if editors should see working forms on previews.

GitHub Actions (`.github/workflows/ci.yml`) runs the build, unit tests and all checks on every push and pull request.

Launch steps (DNS, domains, Search Console): `docs/cutover.md`.

## Checking search and AI readiness

```bash
npm run geo -- --url https://unfoldingword.org
```

The audit uses `uvx` from uv. The goal is 90+. Run it against production: previews send `X-Robots-Tag: noindex`, which costs points production does not lose.

## Repository is public

The site is public, so the code is too. Two consequences, enforced by the skills: content about people in security-sensitive places is reviewed **before** it is committed (git history is permanent), and secrets live only in Cloudflare and GitHub secret stores, never in files.
