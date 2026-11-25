---
name: publish-prayer-request
description: Publish a prayer request on the website's prayer page.
---

# Publish a prayer request

A prayer request is one file, `src/content/prayer/en/<slug>.md`, shown at `/prayer-request/<slug>/` and on `/pray/` (newest first).

1. **Security review first.** The repository is public and keeps history. List for the editor every name, place and identifying detail in the request and ask them to confirm each is cleared for public use (see the publish-story skill, step 1, for what counts). Done when each item is confirmed, changed or removed.
2. **Gather** the title, the text, the date to show, optionally a region and one photo (with what is in it).
3. **Write** the file:

```yaml
---
title: <title>
description: 120–160 characters: what to pray for, for search results.
date: 2026-12-01
region: middle-east        # optional
image: prayer/<slug>.jpg   # optional; save with scripts/migrate/fetch-image.mjs
imageAlt: <what is in the photo>
---
<the request in Markdown; end with the specific things to pray for as a list>
```

Done when `npm run build` passes and the request appears on `/pray/`.

4. **Publish** with the **publish-changes** skill.

To take a request down when it is no longer current, delete the file and add its URL to `redirects/legacy.txt` pointing at `/pray/`, so links to it keep working.
