# Open questions from the migration

Things only someone at unfoldingWord can decide or supply. Each is safe to leave until answered: the site builds and every old URL resolves either way. Collected 25 November 2026 from the migration agents' notes and the page-by-page review against the live site.

## Needs access (blocks a feature)

| What | Why | Where it goes |
|---|---|---|
| **GTM** container audit, GA4 custom dimensions | Triggers built for Elementor/Contact Form 7 markup will stop firing | `docs/analytics.md` |
| **Virtuous**: register the staging/preview domains | Giving forms refuse unregistered domains, so previews show "not embedded on a registered domain" | Virtuous → Page & Form Settings |
| **Virtuous**: what does a completed gift report? | The A/B goal "completed gift" needs a signal (`/donation-confirmation/` page view, or a message from the form) | `docs/ab-testing.md` |
| **Contact form** destination (Contact Form 7 → Mail tab) | The new form stays off until it has somewhere to send | `docs/forms.md` |
| **Search Console** baseline export | Before/after comparison at cutover | `docs/cutover.md` |

## Decisions

1. **Translation scope and reviewers.** Interface strings exist as drafts in all 15 languages (reviewer notes on terminology are in the migration result: Gateway languages, Catalyzation, Whole Bible | Whole Nation, Great Commission). No page bodies are translated yet.
2. **`/obs/` vs `/open-bible-stories/`** — both built at their current URLs; which is canonical?
3. **Phone number** — contact page and footer: 407-604-0883; careers and privacy pages: 407-900-3005. Which is current? (`src/lib/site.ts` and the two pages.)
4. **Email** — `info@unfoldingword.org` is on careers, privacy and now contact. Should it be in the footer and schema (`SITE.email`)?
5. **Ad tags and a consent banner** — the GTM container appears to load Adform, The Trade Desk and Masterworks tags. Keep them? If so, is a consent banner needed?
6. **Home page** — the old hero "Did you know?" form (Virtuous `18871070-…`) was a site-wide popup, not migrated; the home page uses the main giving form. Confirm. The partner list replaced logos with names, introduced by a sentence the agent inferred ("Through illumiNations, unfoldingWord works alongside…") — confirm, and check "United Bible Societies" and "Seed Company" were the intended names. The six hand-picked stories include "The Angry Imam" to make an even grid of six (the old carousel had five).
7. **Training page video** — a self-hosted WordPress video (`videos.files.wordpress.com/…2179261573.mp4`) was not migrated. Upload to YouTube/Vimeo, or drop?
8. **WBWN figures** that disagree on the live pages (kept as published): Islands-Asia 786 vs 234 unreached people groups; Benin's "63 unreached" vs "63 people groups, 20% unreached"; 2.6 million vs 2,499,000 people impacted.
9. **Story details** to confirm: "The Gospel in Five More Languages" mentions "the Chadian church" in a Benin story; "Renounce Christ or Die" names a convert and her step-brother in full (already public on the old site — keep?); regions for Islands-Asia stories (`pacific`).
10. **Staff giving** — Jeff Bell's and Seth Stoll's links use `projectCodePreselect=general`; do they have personal project codes?
11. **Legal text** kept verbatim but likely stale: the privacy policy names `www.unfoldingword.com` and Flash cookies; the terms list a DMCA agent at "Envisage Law" with an @michaelbest.com address and mention a copyright form that does not exist.
12. **Careers** says "Explore our current job openings below" but lists none.
13. **Charitable solicitation disclosures** — "Last updated: August 2026"; confirm still current.
14. **Dropbox-hosted files** (Christian Commons PDF/EPUB/MOBI, Free Translate license PDF) — move into the media bucket?
15. **Low-resolution story images** — `critical-tools-for-courageous-translators` (265×159) and `making-gods-word-accessible` (420×283) look soft; better originals?
16. **Knowledge graph** — unfoldingWord has no Wikidata item or Wikipedia article. Creating a Wikidata item (an outside publication, so a team decision) would strengthen search/AI entity recognition and the GEO score.
17. **The `filedn.com` image folder** — still used by anything else? It can be retired once nothing points at it.

## Redirects (from the Redirection plugin export, 25 November)

All 446 plugin rules and the real addresses in its 404 log are in `redirects/legacy.txt`. About 80 rules already led to a 404 on the old site (their WordPress targets were deleted); they now go somewhere sensible. These need a person:

18. **Short links with no destination**, all pointing at deleted `/sa/…` pages and still in use: `/box2` (23,020 uses, plus 333 direct hits on `/sa/box2`), `/dsm-landingpage` (4,664), `/gcn`, `/gcnn`, `/eten`. Where should each go? They 404 today and on the new site until answered.
19. **`/praylive`** sends people to a Zoom meeting whose link includes its passcode. The repository is public, so it was left out. Options: put the link in the redirect anyway (it is already public to anyone who visits the short link), use a Zoom link without the passcode, or point it at `/pray/`.
20. **`/welcome`** has about 570 hits in the 404 log and has never existed on the site. Does an app or printed piece link to it?
21. **Guessed destinations** (marked `(?)` in `redirects/legacy.txt`): `/license` (1,102 uses) and `/about/license` → the open-license page; `/disclosures-credits` → charitable disclosures; `/strategic-overview` → the CCBT strategic overview (the old site sent it to the staff giving page); `/gateway/how-to-open` → gateway languages; "His Light" / Global Forum 2025 links → global and regional forums; the deleted catalyst story → `/catalyzation/`.
22. **Monthly prayer calendar** — `/prayer-calendar` points at the November 2026 PDF; someone must update it each month (as in WordPress).
23. **`/d/iran`** — the plugin sent it to a Donorbox campaign; the new site sends it to `/wbwn/iran/` (decided earlier). Confirm.
