---
name: edit-page
description: Change the words, images or layout of an existing website page, or add a new page that is not a giving page, story or prayer request.
---

# Edit or add a page

## Find the file

The URL tells you the file: `/ccbt/faq/` → `src/content/pages/en/ccbt/faq.md`; `/give/` → `src/content/pages/en/give/index.md`; the home page → `src/content/pages/en/index.md`. A translated page is the same path under its locale (`/es/give/` → `src/content/pages/es/give/index.md`). Done when you have opened the file and found the passage the editor means; if two places could match, show both and ask.

## Make the change

- Pages are a list of `sections`, each a block (`hero`, `prose`, `cards`, `giving`, `faq` …). `docs/content-guide.md` lists every block and its fields — read the block's entry before changing its structure.
- Change only what was asked. Keep the editor's wording, applying the writing rules in `docs/content-guide.md`.
- New images: save under `src/assets/images/<area>/` and write alt text that describes what is in the image (look at it).
- A page that changes URL keeps the old one working: add the old URL to the page's `redirectFrom`.
- A new page: create the file at the path matching the URL it should have, with `title`, a 120–160 character `description`, and `sections`. Add it to the menu (`NAV` in `src/lib/site.ts`, with a label key in `src/i18n/ui/en.json` → `nav`) only if the editor asks.
- If the page has translations (`src/content/pages/<locale>/…`), tell the editor those still show the old text and ask whether to update them (the **translate-page** skill).

## Look and feel

A request to change how something *looks* everywhere (a color, the font size of headings, button shape) is a design-system change: it goes in `src/styles/global.css` (the tokens at the top), never as one-off styles in a page. Check the result on `/styleguide/` in the preview, which shows every component.

Done when `npm run build` passes. Then use the **publish-changes** skill.
