# Open questions from the migration

Things only someone at unfoldingWord can decide or supply. Each is safe to leave until answered: the site builds and every old URL resolves either way. Collected 25 November 2026 from the migration agents' notes and the page-by-page review against the live site.

## Needs access (blocks a feature)

| What | Why | Where it goes |
|---|---|---|
| WordPress **Redirection plugin** rule list and 404 log | Only 37 rules could be recovered by probing; the rest are invisible from outside | `redirects/legacy.txt`, `redirects/old-urls.txt` |
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
