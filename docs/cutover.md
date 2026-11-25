# Cutover runbook (January 2027)

Everything here happens in January. Until then the site lives on its preview addresses and WordPress keeps serving unfoldingword.org.

## State today (2026-11-24)

- The `unfoldingword.org` zone already exists in the unfoldingWord Cloudflare account, **status: pending** — Cloudflare has assigned nameservers (`junade.ns.cloudflare.com`, `mariah.ns.cloudflare.com`) but the domain still points at AWS Route 53 (`ns-*.awsdns-*`). Nothing changes for visitors until the nameservers are switched at the registrar.
- DNS records in that zone have not been reviewed (the session's token cannot read them).
- Worker `unfoldingword-web` and R2 bucket `unfoldingword-media` exist in the same account.

## Week −2: DNS records

1. Export every record from Route 53 (hosted zone `unfoldingword.org`).
2. Compare with the records in the Cloudflare zone; add whatever is missing. Pay special attention to:
   - MX, SPF (`TXT v=spf1`), DKIM (`*._domainkey`), DMARC (`_dmarc`) — mail
   - `give.unfoldingword.org` → CNAME to Virtuous (`virtuousgivingprod.azurewebsites.net` today) — **DNS only (grey cloud)**
   - Google Search Console verification `TXT google-site-verification=…` — keep it, or Search Console loses verification
   - every other subdomain (list them; each one is a service someone depends on)
3. Set every record that is not this website to **DNS only** at first, so nothing changes behaviour when Cloudflare takes over.
4. Lower the TTLs in Route 53 to 300 seconds a few days ahead.

## Week −1: move the nameservers (the site does not change yet)

1. At the registrar, replace the four AWS nameservers with the two Cloudflare ones.
2. Keep `unfoldingword.org` and `www` pointing at WordPress.com (as DNS-only records copied from Route 53).
3. Watch for 48 hours: mail flows, `give.` works, every subdomain resolves. Cloudflare shows the zone **Active**.

Keeping the nameserver move and the site switch a week apart means a mail or subdomain problem is never confused with a website problem.

## Cutover day (a weekday morning, not the week of a campaign)

1. **Freeze WordPress**: no edits from here on. Give WordPress a fallback address (WordPress.com → Domains, e.g. `unfoldingword.wordpress.com`) for 30 days of rollback.
2. **Media domain**: R2 → `unfoldingword-media` → Settings → Custom domains → add `media.unfoldingword.org`. Change `src/data/media.json` `base` to `https://media.unfoldingword.org`, and in `scripts/postbuild.mjs` change the uploads redirect from 302 to 301. Merge.
3. **Site domain**: Worker `unfoldingword-web` → Settings → Domains & Routes → add custom domains `unfoldingword.org` and `www.unfoldingword.org` (this replaces the WordPress records). Add a redirect `www` → apex (a `_redirects` host rule or a Cloudflare redirect rule).
4. Check, in this order:
   - `npm run check:redirects` against production: every old URL resolves (`scripts/check-redirects.mjs` reads dist; also spot-check 20 old URLs with `curl -sI`)
   - a test gift on `/give/` and two other giving pages, and that it appears in Virtuous
   - GA4 Realtime shows visits; GTM Preview shows tags firing
   - the GEO audit: `uvx --from geo-optimizer-skill geo audit --url https://unfoldingword.org` ≥ 90
   - phone check of home, give, a story, a CCBT page
5. **Search Console**:
   - Settings → confirm the property is still verified (DNS TXT record carried over)
   - Sitemaps → remove `sitemap_index.xml` (old Rank Math); submit `https://unfoldingword.org/sitemap-index.xml`
   - URL Inspection → request indexing for the home page and the top 20 pages from the pre-cutover baseline
   - No "Change of address": the domain is not changing
6. **Bing Webmaster Tools**: same sitemap swap.

## Aftercare (30 days)

- Daily for two weeks, then weekly: Search Console → Pages → "Not found (404)" and "Page with redirect". Every real old URL that 404s gets a redirect (**add-redirect** skill) and a line in `redirects/old-urls.txt`.
- Compare GA4 users and donation conversions week over week against the same period before cutover.
- After 30 days with no rollback needed: cancel the WordPress.com plan (export a full backup first: WordPress admin → Tools → Export, plus the media library).

## Rollback

Worker → Domains: remove the custom domains and restore the WordPress `A`/`CNAME` records for `unfoldingword.org` and `www` in the Cloudflare zone. Visitors are back on WordPress within minutes (DNS is already on Cloudflare, so no nameserver change is needed).
