---
name: add-redirect
description: Make an old, short or printed web address forward to a page on the site (redirects, short links, vanity URLs, fixing a 404).
---

# Add a redirect

Two places, depending on what the redirect is for:

- **A page moved or was renamed** → add the old URL to that page's `redirectFrom` list in its content file. The redirect then lives with the page and moves with it.
- **Anything else** (a short link for print like `/easter`, a retired page, an outside link with a typo) → add a line to `redirects/legacy.txt`: `<from> <to>` (e.g. `/easter /give/easter-2027/`). A `302` at the end makes it temporary (for a campaign link you will point somewhere else later); the default is permanent (`301`).

Rules the build enforces (`scripts/postbuild.mjs` — it fails with the reason):
- the target must be a page that exists (or a full `https://` URL),
- the `from` must not also be a real page,
- no chains: point straight at the final page,
- each `from` once.

Then add the old URL to `redirects/old-urls.txt` so `npm run check:redirects` keeps checking it forever.

Done when `npm run build` and `npm run check:redirects` pass. Publish with the **publish-changes** skill. After it is live, test it: `curl -sI https://unfoldingword.org<from>` shows `301` (or `302`) and the right `location`.
