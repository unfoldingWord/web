# A/B testing

Show half of a page's visitors a different version, and measure in Google Analytics 4 which version leads to more of what you want (usually completed gifts). Works on any page; built with giving pages in mind. To run one, ask Claude — the **ab-test** skill has the steps.

## How it works

```
visitor ──► unfoldingword.org/give/
              │  path is in wrangler.jsonc run_worker_first
              ▼
          Worker (worker/index.ts)
              │  cookie uwab_<test>? keep it : pick a/b by weight, set cookie (90 days)
              ├─ a → serves /give/                     (the normal page)
              └─ b → serves /_variants/<test>-b/        (built from src/content/pages/en/_experiments/)
                       at the SAME URL; adds data-experiment / data-variant to <html>
              ▼
          page pushes experiment_id + experiment_variant to the dataLayer → GTM → GA4
```

- **Same URL, no flicker.** The choice is made at the edge before any HTML is sent, so there is no flash of the other version and no redirect. Search engines see one URL; variant pages are `noindex` and canonical to the real page.
- **Sticky.** A visitor keeps their version for 90 days (cookie `uwab_<test-id>`), so returning donors are not confused.
- **Worker routing.** Test pages, the homepage (for old WordPress shortlinks) and the contact API run through the Worker. Other pages are served as static files. That is why each test path must be listed in `run_worker_first` (`npm run check:experiments` enforces it).
- **Preview any version** with `?ab=a` or `?ab=b` on the URL — this also works for tests still in `draft`.
- **End instantly** by setting `"winner"` in `src/data/experiments.json`: everyone gets the winner from the next deploy.

Files: `src/data/experiments.json` (the registry), `src/content/pages/en/_experiments/` (variant pages), `worker/ab.ts` (assignment logic, unit-tested in `worker/ab.test.mjs`), `src/components/site/Analytics.astro` (dataLayer).

## What GA4 receives

On every page view of a page under test, before GTM loads:

```js
dataLayer.push({ experiment_id: 'give-hero-photo-2027', experiment_variant: 'b', page_locale: 'en', page_type: 'giving' })
dataLayer.push({ event: 'experiment_impression', experiment_id: '…', experiment_variant: '…' })
```

### One-time GTM/GA4 setup (not done yet — needs GTM access)

1. In GTM (container GTM-KS32FPTM) create two Data Layer Variables: `experiment_id`, `experiment_variant` (also useful: `page_type`, `page_locale`).
2. Add them as event parameters on the GA4 Configuration/Google tag (so every event carries them), and create a GA4 Event tag for `experiment_impression` sending both.
3. In GA4 → Admin → Custom definitions, register `experiment_id` and `experiment_variant` as **event-scoped custom dimensions** (and `page_type`, `page_locale`).
4. Define the conversion: a completed gift. The WordPress site has a `/donation-confirmation/` page (kept at the same URL on the new site). **To verify:** whether the Virtuous forms send donors there after giving. If they do, mark a `page_view` of `/donation-confirmation/` as the `donation_complete` key event. If they do not, the site records a generic `virtuous_message` when a frame embedded in a giving form (the Giving block, the Donate form of a country page's project banner, or a campaign's Donate button) sends a message. It omits the payload. Use a test gift to identify a documented completion signal before configuring a conversion.

## Reading results

GA4 → Explore → Free-form: rows `experiment_variant`, filter `experiment_id` = the test, values Active users and Key events (`donation_complete`). Save it as "A/B — <test-id>". Conversion rate per variant = gifts ÷ users. Before calling a winner, test the difference (the **ab-test** skill does the arithmetic): with typical giving-page conversion rates of 1–5%, detecting a 20% relative lift needs thousands of visitors per variant. Low-traffic pages need long tests, or bigger differences between versions.

Consent: no cookie banner exists on the current site or this one; the A/B cookie stores only the variant letter. Whether a consent banner is needed is an open decision (migration plan, section 9).

## Past tests

_None yet. After each test, one line: what was tested, the result, what we learned._
