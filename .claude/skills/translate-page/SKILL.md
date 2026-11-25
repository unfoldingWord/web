---
name: translate-page
description: Translate a page, story or the interface into one of the site's 16 languages, or update a translation.
---

# Translate

Languages and codes: `src/i18n/locales.mjs`. A translation is a copy of the English file at the same path under the language's folder: `src/content/pages/en/give/index.md` → `src/content/pages/es/give/index.md`.

1. **Copy** the English file to the locale folder.
2. **Translate the values people read**: `title`, `description`, `heading`, and in `sections` every `title`, `eyebrow`, `lead`, `body`, `intro`, `label`, `quote`, `q`, `a`, `caption`, `imageAlt`, `alt`, and the Markdown body. Leave everything else exactly as it is: keys, `type`, `variant`, `href`, image paths, `formId`, `id`, numbers, `redirectFrom` (delete `redirectFrom` in the translation — redirects belong to the English file).
3. Keep "unfoldingWord" as is in every language. Use the register a church leader in that language would expect: warm, formal, clear.
4. Set `translationStatus: draft`.
5. **Native review.** Tell the editor the translation needs a native speaker's review before it counts as published-quality; after review, set `translationStatus: reviewed`. Donor-facing and doctrinal pages (giving pages, statement of faith) should not be published as drafts unless the editor decides to.

Interface strings (menus, buttons, footer) are `src/i18n/ui/<code>.json`: same keys as `en.json`, keep every `{placeholder}`. `npm run check:locales` lists missing keys and catches broken placeholders.

Done when `npm run build` and `npm run check:locales` pass. Publish with **publish-changes**.
