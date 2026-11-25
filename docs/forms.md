# Forms

| Form | Old site | New site | Status |
|---|---|---|---|
| Donations | Virtuous embed (`cdn.virtuousraise.org/embed/embed.js`, org 41649) | Same embed, same form ids (Giving block) | Done — verify a test gift per page before cutover |
| Contact | Contact Form 7 on `/contact-us/` (name, email, message) | `contactForm` block + `/api/contact` in the Worker, with Cloudflare Turnstile | **Off** — waiting on where messages should go |
| Others | Contact Form 7 scripts load site-wide; Jetpack Forms installed | — | **Inventory needed**: which other forms exist (the `/forms/` page links to some) |

## Turning on the contact form

Needs, in this order:

1. **Destination.** The address(es) Contact Form 7 currently sends to — WordPress admin → Contact → the form → Mail tab.
2. **DNS on Cloudflare** (part of cutover) — Cloudflare Email Service sends from `@unfoldingword.org`, which needs the domain's SPF/DKIM there.
3. **Turnstile** widget for unfoldingword.org (Cloudflare dashboard → Turnstile), giving a site key and a secret.
4. Configure:
   - `wrangler secret put TURNSTILE_SECRET` and `wrangler secret put CONTACT_TO`
   - a `send_email` binding named `SEND_EMAIL` in `wrangler.jsonc`
   - build variables `PUBLIC_CONTACT_FORM=1` and `PUBLIC_TURNSTILE_SITE_KEY=<site key>` (Workers Builds → Settings → Build variables)
5. Test from a preview: a message arrives; an empty or bot submission is refused.

Until then the contact page shows the postal address and phone number (as the old page also did), without a form.
