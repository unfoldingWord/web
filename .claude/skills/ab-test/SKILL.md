---
name: ab-test
description: Start, check on or end an A/B test (split test) of a page — for example two versions of a giving page.
---

# A/B tests

How it works is in `docs/ab-testing.md` — read it before the first test you run. In short: variant A is the real page; variant B is a second file; a small Worker shows each visitor one version at the same URL and remembers it; Google Analytics 4 records which version each visitor saw and whether they gave.

## Start a test

1. **Agree the test with the editor**, in one message: which page, what differs in B (one thing — a headline, the photo, the suggested amounts text — so the result means something), the goal (for giving pages: completed gifts), the split (normally 50/50) and the end date. Tests on low-traffic pages need weeks; say so if the page gets little traffic.
2. **Write variant B**: copy the page's file to `src/content/pages/en/_experiments/<test-id>-b.md`, add `experiment: <test-id>` and `variantOf: <page path>` to its frontmatter, then make the one change. `<test-id>`: lowercase-hyphen, e.g. `give-hero-photo-2027`.
3. **Register it** in `src/data/experiments.json`:

```json
{
  "id": "give-hero-photo-2027",
  "status": "running",
  "path": "/give/",
  "description": "Hero photo: church gathering (A) vs translator at work (B)",
  "goal": "donation_complete",
  "start": "2027-02-01",
  "end": "2027-03-15",
  "variants": [
    { "id": "a", "weight": 50, "page": "/give/" },
    { "id": "b", "weight": 50, "page": "/_variants/give-hero-photo-2027-b/" }
  ]
}
```

4. **Route it through the Worker**: add the page path (`"/give/"`) to `assets.run_worker_first` in `wrangler.jsonc`.
5. Done when `npm run build` and `npm run check:experiments` pass. Publish with the **publish-changes** skill. On the preview, open `<page>?ab=a` and `<page>?ab=b` to see each version; tell the editor both links.

## Check on a test

Results are in GA4 (see `docs/ab-testing.md`, "Reading results"). Ask the editor for the numbers from the saved exploration, or for an export, and report per variant: visitors, gifts, conversion rate. Then compute whether the difference is real with a two-proportion z-test, and say it plainly: "B is ahead, but with this many visitors we cannot yet tell it apart from chance" is the usual early answer. Do not call a winner below 95% confidence or before the planned end date unless the editor decides to.

## End a test

1. Set `"status": "stopped"` and `"winner": "a"` or `"b"` in `experiments.json` (with a winner, every visitor gets that version immediately).
2. If B won, copy B's content into the real page file, then delete the `_experiments` file, the experiment entry and its `run_worker_first` line. If A won, delete the `_experiments` file, the entry and the line.
3. Write one line of what was learned into `docs/ab-testing.md` under "Past tests", so the next test builds on it.

Done when the build and `check:experiments` pass. Publish with **publish-changes**.
