---
name: publish-story
description: Publish a story from the field (an impact story, testimony or field report) on the website.
---

# Publish a story

A story is one file, `src/content/stories/en/<slug>.md`, shown at `/stories/<slug>/`, on the stories page, in the home page's recent stories and in the RSS feed.

## 1. Security review — before anything is written to the repository

This repository is **public**, and git keeps history: anything committed — even on a branch, even if deleted later — can be found. Many stories come from places where being named as a Christian or a Bible translator is dangerous.

Read the story and list for the editor every:
- person's name (first names included), photo of a face, or role that identifies someone,
- town, village, church, organization or partner named,
- detail that would let someone in that country identify a person (age + village + role, a specific event).

Ask the editor to confirm each one is cleared for public use, and whether the story's country is sensitive. Set `sensitive: true` for any story from a security-sensitive country (for example Iran, Afghanistan, much of the Middle East and North Africa, Sudan, Chad, closed countries in Asia).

Done when the editor has said, for each item, "keep", "change to …" or "remove". Only then write files. If they are unsure, stop: the story is not ready, and that is a fine outcome.

## 2. Gather

The story text, a title, the date it should show, the region (one of: africa, asia, eurasia, latin-america, middle-east, pacific, south-asia, worldwide), optionally the country, and one photo (with what/who/where is in it).

## 3. Write it

- Photo: save to `src/assets/images/stories/<slug>.jpg` (`node scripts/migrate/fetch-image.mjs <link-or-file> stories/<slug>.jpg`). Look at it and write alt text describing what is in it.
- File (`<slug>` = the title in lowercase with hyphens, short):

```yaml
---
title: <title>
description: 120–160 characters summarizing the story for search results.
date: 2026-12-01
region: africa
country: Chad              # optional; leave out if sensitive
image: stories/<slug>.jpg
imageAlt: <what is in the photo>
excerpt: One or two sentences for the story cards.
sensitive: false
---
<the story in Markdown — paragraphs, quotes as > blockquotes>
```

- Keep the editor's wording. Apply the writing rules in `docs/content-guide.md`; for stories the tone is reverent, human and grounded, with the people in the story at the center rather than unfoldingWord.

Done when `npm run build` passes and the story appears at `/stories/<slug>/` and on `/stories/`.

## 4. Publish

Use the **publish-changes** skill.
