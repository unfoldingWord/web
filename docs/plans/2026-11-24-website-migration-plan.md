# unfoldingword.org migration plan: WordPress to Astro on Cloudflare

Status: **in progress — see section 10** (revision 3) · 24 November 2026 · build complete by end of December 2026 · cutover January 2027

This is a plan, not a build. Nothing has been scaffolded, configured or changed anywhere. Section 2 is what I measured on the live site today; everything marked **(assumption)** or **(to verify)** has not been checked yet.

**Decided in review (24 Nov):** the same 16 languages as openbiblestories.org · Cloudflare Workers, not Pages · all Sweet Publishing images move to R2 and are served by us · every phase finishes in December except cutover · URLs are cleaned up, with no old URL allowed to 404 · the repo stays public · A/B results in GA4 only · every existing page is built; retiring pages is a later decision.

---

## 1. What we are doing and why

Move unfoldingword.org off WordPress (Elementor) onto a static Astro site served by Cloudflare, the same shape as openbiblestories.org, so that:

- the site is fast and first-class on a phone,
- it can be localized,
- it scores above 90 on the GEO audit (today: **75**),
- non-technical staff can add giving pages, stories and prayer requests by asking Claude, preview the change, and publish it,
- giving pages (and later any page) can be A/B tested with results we can read,
- nothing that works today breaks: redirects, Google Analytics, Search Console, donations.

**Not in scope:** rewriting the site's message, redesigning the brand, or changing the giving platform (Virtuous stays).

**What would make this a failure even if it "works":** a drop in donations or search traffic after cutover, old links 404ing, or a site that only a developer can update.

---

## 2. What I found on the live site (evidence)

Measured 24 Nov 2026 by crawling all URLs in the site's sitemaps and checking every link on them.

| Fact | Evidence |
|---|---|
| Hosting is WordPress.com (Atomic), not self-hosted | response header `host-header: WordPress.com` |
| DNS is on **AWS Route 53**, not Cloudflare | `dig NS unfoldingword.org` returns `awsdns` servers |
| Theme: Hello Elementor + Elementor Pro + PowerPack | asset paths in page source |
| 135 indexable URLs: 63 pages, 36 stories (posts), 31 "sweet-publishing" pages, 5 prayer requests | Rank Math sitemaps |
| 959 media library items; images are served via Jetpack's CDN (`i0.wp.com`) | WP REST API `X-WP-Total`; crawl |
| The 31 Sweet Publishing pages show **2,998 distinct images** (corrected 25 Nov: the first count included each image's thumbnail), all JPEGs hosted on `filedn.com` (pCloud) and passed through Jetpack's CDN. Largest pages: Acts 782, Luke 764, Genesis 740. | crawl of all 31 pages |
| The originals total **4.01 GB** | every file downloaded and measured on 25 Nov |
| Analytics load through **Google Tag Manager `GTM-KS32FPTM`**, not a direct GA tag. The GA4 ID is inside the container, not in the page. | page source |
| The GTM container also appears to fire ad tags (Adform, The Trade Desk, Masterworks "epiphany") | hostnames referenced on story pages; **inference**, needs a look inside GTM |
| Redirects live in the **Redirection** plugin (and possibly Rank Math's redirect module) | `redirection/v1` and `rankmath/v1` REST namespaces; the list itself needs a login (API returned 401) |
| Giving uses Virtuous: embedded form scripts on the site, plus `give.unfoldingword.org` pointing at Virtuous | page source; DNS CNAME |
| Forms: Contact Form 7 is loaded on every page; Jetpack Forms is also installed | page source; REST API |
| The site is English only. No `hreflang` anywhere. | page source |
| SEO plugin: Rank Math Pro (schema, sitemaps, meta) | page source |
| Baseline GEO score: **75/100** | `geo audit` run today |

Where the GEO audit loses points (its own list): no `/llms.txt`; the WordPress.com CDN blocks AI crawlers (GPTBot, ClaudeBot, PerplexityBot and others); Organization schema lacks `sameAs`, address and contact; no FAQ schema; inconsistent brand name across title/H1/schema; no descriptive image alt text; video without a transcript; content sections too short for retrieval (average 42 words); no `/.well-known/ai.txt` or `/ai/*.json`. All of these are things we control on the new site.

---

## 3. Things that are broken or unclear today

You asked for this list. Each item has what I saw; fixes are proposed in the migration, not applied.

### Navigation and structure
1. **`/contact/` vs `/contact-us/`** — not actually two pages: `/contact/` 301s to `/contact-us/`. But the main menu links to `/contact` (no slash), which redirects twice-removed. Pick one URL; I propose `/contact/`.
2. **`/about-2/`** is the real About page (WordPress's "duplicate slug" suffix). `/about` redirects to it. Propose `/about/`.
3. **`/obs/` and `/open-bible-stories/`** are two separate live pages with nearly the same content (687 vs 683 words, different titles). One should redirect to the other.
4. **The site-wide menu links to 5 URLs that redirect** (`/ccbt`, `/about`, `/give`, `/contact`, `/overview`), on 122 of 135 pages. Harmless to visitors, wasteful for crawlers.
5. **Three "people" pages with confusing names:** `/our-team/`, `/leadership/`, and `/staff/` — the last one is titled "Support Staff" and is a giving page, not a staff list.
6. **13 giving pages with no naming pattern:** `/give/`, `/give-monthly/`, `/give-initiative/`, `/givetech/`, `/givewbwn/`, `/givegnt/`, `/givecc/`, `/givebenin/`, `/givebt/`, `/giveslr/`, `/kb/` ("Kingdom Business"), `/give-now-reach-the-unreached/`, `/givingtuesday/`. Propose `/give/<name>/` going forward, with every old URL redirected (they are in emails and print).
7. **Story URLs use category slugs that leak internal naming:** `/uncategorized/…` (3 stories), `/southasia/` and `/southasia1/`, `/menapak/`, `/persian/` alongside `/eurasia/`. There are also 9 empty categories, several left over from a theme demo (`fashion`, `travel`, `science`, `inspiration`, `branding`). Propose `/stories/<slug>/` with redirects.
8. **`/forms/`, `/kb/`, `/for-translators/`** are in the sitemap but I did not find them in the main menu. **Decided:** all are built on the new site; retiring any of them is a later decision.
9. Homepage title is literally "Homepage - unfoldingWord".

### Broken links
10. Four internal links 404: `/publications/audio-engineering`, `/publications/ccbt-getting-started` (linked from `/publications/` and `/ccbt/how-churches-translate/`), `/publications/free-translate` (linked from `/forms/`).
11. Typo'd links only working because a redirect catches them: five to `/cbbt/…` (should be `/ccbt/`), plus `/ccbt/[equipping-servants` and `/ccbt/[[glossary`.
12. Links to the old `www.unfoldingword.org` structure that take several hops: `/stories/escape-from-kharkiv1`, `/projects/eurasia/russian`, `/join-us/pray`, `/d/iran`, `/publications/the-christian-commons`. Final destinations not yet verified.
13. External: the ECFA member-profile link on `/financial-information/` returns 404; a `hiphil.org` link on `/publications/` fails its security certificate; `/give-monthly/` has a malformed font URL.

### Search and accessibility quality
14. 40 of 135 pages have no meta description.
15. Many pages have no `<h1>` and the homepage has two (by my pattern match — Elementor may be styling `<h2>`s as titles; **to verify** per page during migration).
16. Almost no image has descriptive alt text (my crawl: 3 of 7,149 `<img>` tags site-wide, counting repeats across pages; the GEO audit: 0 of 71 on the homepage).
17. `robots.txt` declares a `/news-sitemap.xml` and the sitemap index includes `/locations.kml` — leftovers.
18. AI crawlers are blocked at the host level (GEO audit finding), which we cannot fix on WordPress.com but will be fixed by moving.

A fuller list comes from two sources I do not have yet: Search Console's "Not found" and "Page with redirect" reports, and the Redirection plugin's 404 log.

---

## 4. Approach

### Recommended
**Astro (static output) + Tailwind CSS v4 with a token-based design system, deployed on Cloudflare Workers (static assets) from GitHub, content as Markdown files in the repo, large image sets in R2.**

- **Astro, static**: same as openbiblestories.org. Pages are plain HTML; no client framework.
- **Design system**: one tokens file (colors, type scale, spacing, radii) expressed as CSS variables and consumed by Tailwind; a small library of Astro components built on those tokens (Header, Footer, Hero, Section, Card, Button, StoryCard, GivingForm, PrayerCard, FAQ, Stat, PullQuote, Gallery). Changing the look later means editing tokens, not pages. A `/styleguide/` page (not indexed) shows every component so design changes can be reviewed in one place.
- **Starting point for the look**: the current site's layouts, rebuilt on the brand palette (Inspire `#31ADE3`, Ocean `#014263`, Tech `#231F20`, Cultivate `#70C9CC`, Kindle `#E59D33`) and the brand guide's typefaces, self-hosted.
- **Content in the repo**: Astro content collections with validated fields, so a story with a missing date or image fails the build with a readable message instead of publishing broken.
- **Cloudflare Workers with static assets**: the built site is uploaded as static files; a small Worker script sits in front only for what needs logic (A/B tests, form handling). Workers supports the same `_redirects` and `_headers` files the OBS site uses (checked in Cloudflare's docs today). Workers Builds connects the GitHub repo: pushes to `main` deploy production, other branches get a Preview with its own URL and a comment on the pull request (checked in docs; exact setup confirmed when the project is created).
- **R2** for the Sweet Publishing image library (section 5.3a).

### Alternatives considered
| Option | Why not |
|---|---|
| Plain hand-written CSS, as on the OBS site | Works for a 12-page site; for ~135 pages edited by non-developers via Claude, named components and tokens keep pages consistent. You also asked for a UI framework. |
| A component kit (daisyUI, Starwind, shadcn-style) | Faster start, but the look is theirs, and restyling later means fighting the kit. Tokens + our own ~15 components is a small cost for a site this size. |
| Cloudflare Pages, as on the OBS site | Known to the team, but Workers is where Cloudflare now directs new projects, and you chose it. The site code is the same either way; only the deploy config differs. |
| A headless CMS (Sanity, Decap, etc.) | Adds a system to run and pay for. You said updates will go through Claude; Markdown in git with previews already gives drafts, review and history. |

---

## 5. The pieces

### 5.1 Layouts and templates (Phase 1, built first)
`Base` (head, SEO, analytics, header, footer) → page templates:
- **Standard page** (about, values, statement of faith, CCBT articles)
- **Landing page** (home, WBWN, tools & technology — hero + stacked sections)
- **Giving page** (hero image, short copy, Virtuous form, trust badges, disclosure link)
- **Story** and **story index** (filter by region)
- **Prayer request** and **prayer index**
- **People** (leadership, team)
- **Publications / resource list**
- **Sweet Publishing image set**
- **FAQ / glossary**
- **404**

Mobile first: every template is designed at phone width and widened, not the reverse. Targets, checked in CI on every preview: Lighthouse mobile performance ≥ 90, no horizontal scroll at 360px, tap targets ≥ 44px, responsive images (`astro:assets`, AVIF/WebP with sizes).

### 5.2 Localization
Same model as openbiblestories.org: English at `/`, other languages at `/{lang}/`, strings in JSON per locale with automatic fallback to English, right-to-left support, self-hosted fonts per script, `hreflang` on every page, a language switcher in the header. Long-form content (stories, articles) is one Markdown file per language; a page with no translation yet is simply not listed in that language.

**Languages (decided):** the same 16 as openbiblestories.org — English, Spanish, French, Hindi, Russian, Arabic, Simplified Chinese, Swahili, Portuguese, Indonesian, Vietnamese, Bengali, Urdu, Persian, Burmese, Dutch. Arabic, Urdu and Persian render right-to-left. The locale list, font packs and the checks that guard them (`check:locales`, `check:scripts`) are carried over from the OBS repo rather than rewritten.

**Scale:** 135 URLs × 16 languages is about 2,160 pages. Proposed scope for launch **(my proposal, your call — section 9)**:
- All 16 languages: navigation, footer, shared strings, and every standing page (the 63 pages, including giving pages).
- Stories, prayer requests and Sweet Publishing pages: site chrome in all 16; the body text translated where a reviewed translation exists, otherwise shown in English with a note. These grow over time, so they should not block launch.
- Legal pages (privacy, terms, charitable solicitation disclosures) stay English only, as on the OBS site, since the English text is the binding one.

**Translation process:** Claude drafts each locale from the English source; a native reader reviews before that locale's page is marked reviewed (the OBS repo's `docs/native-review.md` process). Unreviewed drafts of donor-facing and doctrinal pages (give, statement of faith) are held back until reviewed. **Open:** who the reviewers are. The Virtuous donation form itself is assumed to stay English **(to verify)**.

### 5.3 Content migration (Phase 2, separate track)
A script pulls every page, post, custom post type and media file from the WordPress REST API (which is open for reading) into Markdown + local images. Elementor's markup does not convert cleanly, so each page is then rebuilt onto a template and compared against the live page. Order: giving pages → home and top-level pages → CCBT section → stories → prayer requests → sweet-publishing → the rest. A parity checklist tracks every one of the 135 URLs: built at the same URL, or built at a new URL with a redirect. Nothing is retired in this migration.

Media: all 959 items are downloaded; `/wp-content/uploads/…` paths that are linked from outside (PDFs especially) keep working via redirects.

### 5.3a Sweet Publishing images on R2
Today these 2,998 images are loaded from a pCloud public folder (`filedn.com`) through Jetpack's image CDN, which disappears with WordPress. Plan:

1. Create an R2 bucket and copy every image from `filedn.com`, keeping the same folder and file names (`sweet_images/jpg/01/01_Ge_01_01_RG.jpg`) so nothing needs renaming. A manifest records each file's size and checksum; the copy is verified against it.
2. Generate smaller web versions at upload time (a thumbnail and a screen-size WebP for each). The originals are about 1.5 MB each and some pages show more than 700 of them; a phone must never download the originals just to browse. Originals stay available for download.
3. Serve the bucket from our own hostname (proposed: `media.unfoldingword.org`) with long cache lifetimes. An R2 custom domain needs the domain's DNS on Cloudflare, so until the DNS move the staging site uses the bucket's `r2.dev` address, which Cloudflare labels non-production.
4. The gallery template pages by chapter and lazy-loads, so Acts does not put 782 images on one screen.
5. The `filedn.com` folder is left untouched — other things may link to it **(to verify with you)**.

Cost: 4.0 GB of originals plus about 0.8 GB of web and thumbnail sizes, under R2's 10 GB free storage allowance. R2 does not charge for downloads.

Licence: the image attribution and licence wording shown on the current pages is carried over unchanged.

### 5.4 Redirects
1. Export the full list from the Redirection plugin (and Rank Math, if used) — needs WP admin access.
2. Add the redirects WordPress does implicitly that would silently vanish: no-trailing-slash → slash, old-slug redirects, `?p=123` links, `/feed/`, category archives, `www` → apex, `http` → `https`.
3. Add new ones for every URL this migration changes (section 3).
4. Flatten chains so each old URL reaches its destination in one hop.
5. **No old URL may 404.** The "old URL list" is the union of: every URL in today's sitemaps, every redirect source in the WordPress export, every internal link found in the crawl, every media file path, and Search Console's top linked pages. A test in CI reads that list and fails the build if any entry does not end, in one hop, at a page that exists. The same test runs against the live site right after cutover.
6. The four links that are already broken today (section 3, item 10) get a destination chosen for each rather than being carried over broken.

Limit: a `_redirects` file on Workers holds 2,000 static and 100 wildcard rules (Cloudflare docs, checked today). If the export is larger, the overflow goes to Cloudflare Bulk Redirects, which the docs name as the route past that limit.

### 5.5 Analytics
Keep the existing GTM container `GTM-KS32FPTM` in the new `Base` layout. Because GA4 is configured inside GTM, the same property keeps collecting without a break. Before cutover: audit the container for triggers tied to WordPress markup (Contact Form 7 submit events, Elementor click classes, Virtuous donation events) and re-point them; load analytics on production only so previews do not pollute the data; confirm with GTM preview mode and GA4 real-time on the staging site. Jetpack/WordPress.com stats end with WordPress.

Decision needed on whether the ad tags in the container should carry over as-is and whether a cookie consent banner is wanted (there does not appear to be one today — **to verify**).

### 5.6 Search Console and cutover
The domain does not change, so no "change of address" is needed. Steps:
- Before: export Search Console's top pages, top linked pages and coverage reports as the baseline; make sure the Search Console verification survives the DNS move (if it is a DNS TXT record, it must be copied).
- At cutover: submit the new sitemap; inspect the top 20 URLs.
- After: watch "Not found" and "Page with redirect" daily for two weeks, weekly for two months; add redirects for anything real. Same for Bing Webmaster Tools.

**DNS:** the zone is on Route 53. A Workers custom domain requires "an active Cloudflare zone" (Cloudflare docs, checked today), so the domain's nameservers must move to Cloudflare. That means carrying over every record — mail (MX, SPF, DKIM, DMARC), `give.unfoldingword.org` → Virtuous, and any other subdomains — and is the riskiest single step. Plan: inventory records in Phase 0, import to Cloudflare early with proxying off, switch nameservers a week before the site cutover so the two changes are not on the same day. The nameserver switch is part of cutover and also waits for January: it touches mail and `give.unfoldingword.org`, and should not happen during year-end giving.

**Timing:** everything is built, migrated and tested on a staging address by the end of December. Only cutover (nameservers, then the site) happens in January. WordPress stays up at a fallback hostname for 30 days as a rollback.

### 5.7 GEO score above 90
Built into `Base` and checked in CI, following what took the OBS site from 69 to 92:
`/llms.txt` and `/llms-full.txt` generated from content; `robots.txt` that explicitly allows AI crawlers, and no Cloudflare bot rule blocking them; Organization JSON-LD with `sameAs` (LinkedIn, Facebook, YouTube, Candid, ECFA, MinistryWatch), address and contact point; `FAQPage` schema from the CCBT FAQ; `Article` schema on stories with real dates and authors; one consistent brand name; descriptive alt text required by the content schema (build fails without it); video transcripts; definition-style opening paragraphs and 100–150-word sections on key pages (an editing task during migration); `/.well-known/ai.txt` and `/ai/summary.json`, `/ai/faq.json`.

The audit only scores production fairly (previews send `noindex`, costing about 7 points on the OBS site), so the 90+ check is a launch-week gate, with the preview score tracked before then.

### 5.8 Forms
Contact Form 7 and Jetpack Forms do not come along. Need an inventory of every form and where its submissions go today. Likely replacement **(assumption)**: a small Cloudflare function with Turnstile spam protection that emails the same recipients, or Virtuous forms where the submission should land in the CRM.

### 5.9 Updating the site with Claude
The repo carries a `CLAUDE.md` (brand voice, editorial rules, how the site is organized) and a set of skills, each a guided recipe:

| Skill | What the person provides | What happens |
|---|---|---|
| New giving page | Virtuous form ID, headline, copy, 1–3 images, URL name | Page created from the giving template, images optimized, alt text written, added to sitemap |
| Publish a story | Text, photo, region, date | Story file created; checked against security rules for sensitive regions; appears on index and home |
| Publish a prayer request | Text, optional photo | Same pattern |
| Add or change a redirect | Old URL, new URL | Rule added; chain check runs |
| Update a person | Name, title, bio, photo | People pages updated |
| Start / stop an A/B test | Page, what differs, goal | Variant created and registered; ending a test promotes the winner |
| Preview and publish | — | Opens a pull request, returns the preview link, publishes on approval |

Workflow for a non-technical editor: open Claude Code on the web pointed at this repo → describe the change → Claude makes it on a branch and returns the preview link Cloudflare posts on the pull request → they look at it on their phone → say "publish" → it merges and is live in about a minute. `main` is protected: nothing publishes without the checks passing (build, links, redirects, schema, accessibility).

### 5.10 A/B testing
The site's Worker script, running only on pages that have a test registered (every other page is served as a plain static file):
- A test is a file in the repo: page, variants (B is a second version of the page's content), traffic split, start/end dates.
- First visit: the function picks a variant, sets a cookie so the visitor keeps seeing the same one, and serves that version at the same URL (no flicker, no redirect, no SEO duplicate).
- The page reports `experiment` and `variant` to GTM → GA4 as an event parameter, so any GA4 report or exploration can be split by variant.
- Conversion for giving pages = a completed donation. This depends on the Virtuous embed reporting completion to the page **(to verify — the key unknown for this feature)**.
- Results **(decided: GA4 only)**: `experiment` and `variant` are registered as GA4 custom dimensions, and each test gets a saved GA4 exploration comparing visitors, form starts and completed gifts per variant. GA4 does not calculate statistical significance, so the "stop a test" skill does that sum from the exported numbers and says plainly when there is not enough traffic to call a winner.

---

## 6. Is it OK for the repo to be public?

**Decided: the repo stays public.** The two conditions below become working rules, written into `CLAUDE.md` and the story skill.

The GitHub repo `unfoldingWord/web` is **already public** (and empty). My assessment: **yes for the code, with two conditions on content.**

Fine to be public: site code, templates, published page content, the GTM/GA IDs and Virtuous form IDs (they are already in every visitor's page source). Secrets (Cloudflare tokens, deploy hooks, form-handler keys) never go in the repo; they live in Cloudflare and GitHub secret stores, and secret scanning + push protection get turned on.

The two conditions:
1. **Unpublished and withdrawn content is public too.** In a public repo, a draft story on a branch is visible before it is approved, and anything ever committed stays in history after it is removed from the site. For stories from Iran, Sudan, Chad and similar places, a name or photo that should not have been published cannot be fully taken back. Mitigation: a security check in the story skill before anything is committed, and a rule that sensitive drafts are reviewed outside the repo first. If that is not enough comfort, make the repo private — it costs nothing functionally (the OBS rebuild started in a private repo).
2. **Image licences.** Photos licensed for use on the website (stock, partner photos) are not necessarily licensed for redistribution in a public repository. Needs a check of where the current images came from.

This is a judgment about risk, not a legal opinion; condition 2 in particular is worth a look by whoever holds the image licences.

---

## 7. Phases

| Phase | When | Outcome |
| --- | --- | --- |
| **0. Access and inventory** | 24 Nov – 1 Dec | Redirect export, GTM container audit, forms inventory, DNS record inventory, Search Console baseline, Cloudflare Worker project and R2 bucket created, remaining items in section 9 settled |
| **1. Framework** | 24 Nov – 8 Dec (starts now, alongside Phase 0) | Design system, all templates, 16-language localization, SEO/GEO plumbing, analytics, redirect engine, branch previews, CI checks. Home + one of each template built with real content as proof. |
| **2a. Sweet Publishing images to R2** | 1 – 8 Dec (independent of the rest) | All 2,998 images copied and verified, web versions generated, gallery template reading from R2 |
| **2b. Content migration** | 1 – 18 Dec | All 135 URLs built in English; cleaned-up URLs redirected; parity checklist complete |
| **2c. Translation** | 8 – 22 Dec, review continuing after | Drafts of the standing pages in 15 languages; native review as reviewers are available |
| **3. Editor workflow and A/B** | 15 – 22 Dec | Skills written and tried by a non-technical person; one A/B test run end to end on staging |
| **4. Pre-launch QA** | 22 – 31 Dec | Every old URL resolves on staging; GA4 verified; a test donation completes on every giving page; mobile pass; GEO preview score; stakeholder review. **Site is launch-ready on a staging address by 31 Dec.** |
| **5. Cutover** | January, week to be chosen | Nameservers moved to Cloudflare, then a week later the site switched; sitemap submitted, monitoring on |
| **6. Aftercare** | 30 days after cutover | Daily then weekly Search Console checks, GEO audit ≥ 90 confirmed on production, WordPress retired after 30 days |

The December dates are tight for a site with 16 languages. What protects the 31 December date: the English site and the redirects are the launch gate; translation review is the part allowed to continue past it (an unreviewed locale page falls back to English rather than holding up launch).

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Donations break at cutover | Giving pages migrated first, test donation on each before and after, cutover after year-end, 30-day rollback |
| Mail or `give.` subdomain breaks in the DNS move | Full record inventory; nameserver move separated from site cutover by a week |
| Search traffic drops | Complete redirect coverage tested in CI; same URLs wherever possible; Search Console monitoring |
| GA data gap or broken conversion tracking | Same GTM container; container audit; verified on staging |
| Elementor pages take longer to rebuild than expected | Templates first; start with the highest-value pages; the long tail (31 sweet-publishing pages) shares one template |
| A sensitive story draft is exposed in the public repo | Section 6 |
| A cleaned-up URL leaves an old link dead | The CI test in 5.4 blocks any deploy where an old URL does not resolve; re-run on production at cutover |
| A mistranslation on a donor-facing or doctrinal page | Native review before those pages go live in a language; English fallback until then |
| The R2 copy misses or corrupts images | Manifest with checksums; counts compared per book against today's pages; `filedn.com` left in place |
| December runs out | English site + redirects are the gate; translation review and nice-to-haves are sequenced last |

---

## 9. Decisions and access I need from you

**Settled on 24 Nov:** languages (16, as OBS) · Workers · Sweet images to R2 · URL cleanup with no 404s · public repo · GA4-only A/B results · build every page · everything but cutover done in December.

**Still open**
1. **Translation scope and reviewers** — is the proposal in 5.2 right (standing pages in all 16; stories and prayer requests in English until a reviewed translation exists), and who reviews each language?
2. **`/obs/` vs `/open-bible-stories/`** — both get built. Which one is the main URL, or do they stay as two distinct pages?
3. **Is anything else still using the `filedn.com` image folder** (apps, partners)? It decides whether that folder can ever be switched off.
4. **Ad tags and consent banner** (5.5).
5. **Cutover week** in January.

**The WordPress connection.** You said I can connect to the current site by MCP. The site does expose an MCP endpoint (`/wp-json/mcp` answers), and a WordPress.com connector exists in the Claude connector directory, but it is **not connected in this session**, so nothing in this plan was validated through it — everything in section 2 came from the public site and its public API. Once the connector is added and signed in, it should replace most of the WordPress admin clicking below (redirect list, forms, Rank Math settings); I have not confirmed which of those it can read.

**Access (I can do the clicking in your browser, with your OK at each step)**
- WordPress: connector as above, or admin access, to export Redirection rules and 404 log, forms list, Rank Math settings
- Google Tag Manager and GA4: container audit
- Google Search Console: baseline exports
- Cloudflare: create the Worker project and the R2 bucket, connect GitHub (Workers Builds)
- AWS Route 53: read-only view of the DNS records
- Virtuous: how the embed reports a completed gift

---

## 10. Status — 25 November 2026

Built on `main` (pushed to `unfoldingWord/web`), Phases 0–3 except the items marked as waiting.

**Done**
- Framework: Astro 7 static site, design tokens and ~21 blocks (`/styleguide/` shows them), templates for pages, stories, prayer requests and Sweet Publishing, 16 locales with English fallback, JSON-LD, sitemaps with hreflang, `robots.txt`, `llms.txt`, `llms-full.txt`, `/ai/*.json`, `/.well-known/ai.txt`, story RSS.
- Content: all 64 pages, 36 stories, 8 prayer requests and 31 Sweet Publishing books migrated (2,259 pages built including language fallbacks). Cleaned-up URLs redirect from the old ones; all 214 old URLs found by the crawl resolve (`npm run check:redirects`), internal links and anchors are checked (`npm run check:links`).
- Sweet Publishing: 2,998 originals plus web and thumbnail sizes in R2 bucket `unfoldingword-media`, served from its r2.dev address until cutover.
- Interface strings drafted in all 15 other languages (marked draft; native review needed). Page translations: not started — waiting on decision 1 below.
- Analytics: GTM `GTM-KS32FPTM` on the production host only; page type, locale and A/B variant pushed to the dataLayer.
- A/B testing: Worker serves variants at the same URL with a sticky cookie; unit-tested; demo experiment in draft.
- Cloudflare: Worker `unfoldingword-web` deployed (staging: https://unfoldingword-web.unfoldingword.workers.dev, noindex), connected to the GitHub repo with Workers Builds — `main` deploys, other branches get Preview URLs.
- CI (GitHub Actions), `CLAUDE.md`, nine editor skills, docs for content, A/B testing, analytics, forms and the cutover runbook.

**Waiting on information or access**
1. Translation scope and reviewers (section 9, decision 1).
2. `/obs/` vs `/open-bible-stories/` — both built at their current URLs.
3. The Redirection plugin's rule list and 404 log (WordPress admin) — 37 rules recovered by probing and from the old pages' own links so far.
4. GTM container audit and GA4 custom dimensions (GTM/GA4 access) — `docs/analytics.md`.
5. Virtuous: register the preview domain(s) so giving forms render on previews (`*.unfoldingword.workers.dev`); confirm what a completed gift reports (A/B conversion).
6. Contact form destination (Contact Form 7 settings) — `docs/forms.md`.
7. Phone number: the site shows both 407-604-0883 and 407-900-3005.
8. Content decisions the migration surfaced — listed in the hand-off notes.
