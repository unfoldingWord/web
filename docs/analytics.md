# Analytics

## What is loaded

Google Tag Manager container **GTM-KS32FPTM** — the same container the WordPress site loads — from `src/components/site/Analytics.astro`. GA4 is configured inside the container, so keeping the container keeps the same GA4 property collecting without a gap at cutover.

GTM loads **only on unfoldingword.org** (and www). Preview builds on `*.workers.dev` and local development do not send data. To test the tag on a preview, add `?gtm_debug=1` to the URL and use GTM's Preview mode.

Before GTM loads, every page pushes to the dataLayer:

| Key | Values |
|---|---|
| `page_type` | `home`, `page`, `giving`, `story`, `prayer`, `sweet-publishing`, `404` |
| `page_locale` | `en`, `es`, … |
| `experiment_id`, `experiment_variant` | only on pages in an A/B test |

Other events the site pushes: `experiment_impression` (A/B), `virtuous_message` (anything the Virtuous form iframe posts to the page — see below), `contact_form_submit` (when the contact form is enabled).

## Pre-cutover checklist (needs GTM and GA4 access)

The WordPress site was built with Elementor and Contact Form 7; triggers in the container that depend on their markup will silently stop firing on the new site.

1. **Audit the container.** List every tag and trigger. For each trigger that uses a CSS selector, an Elementor class, a `wpcf7` event or a WordPress-specific URL, decide: re-point to the new markup, or retire.
2. **Ad tags.** The live site's story pages reference Adform, The Trade Desk and Masterworks hosts — apparently from tags in this container. Decide whether they carry over (and whether a consent banner is then required).
3. **Donation conversions.** Confirm how a completed Virtuous gift is recorded today and make sure the same signal exists on the new site (see docs/ab-testing.md, step 4 of setup).
4. **Custom dimensions**: register `page_type`, `page_locale`, `experiment_id`, `experiment_variant`.
5. On a preview with `?gtm_debug=1` and GTM Preview mode: page views, giving-form events and outbound clicks fire as expected.
6. At cutover: GA4 Realtime shows traffic from the new site within minutes; compare daily users and conversions for two weeks against the same weeks before.

WordPress.com/Jetpack Stats end with WordPress; nothing replaces them (GA4 is the record).
