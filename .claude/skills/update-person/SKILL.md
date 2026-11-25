---
name: update-person
description: Add, update or remove a person on the leadership, board or team pages.
---

# Update a person

Each person is one file, `src/content/people/en/<first-last>.md`. The leadership and team pages show everyone whose `groups` include that page's group (see the `people` blocks in `src/content/pages/en/leadership.md` and `our-team.md`).

- **Add**: create the file (fields below). Ask for name, role, which group(s), a photo and a bio of 50–150 words. Save the photo as `src/assets/images/people/<first-last>.jpg` (square crops look best).
- **Update**: edit the fields asked about.
- **Remove**: delete the file and the photo.

```yaml
---
name: Jane Doe
role: Director of Partnerships
groups: [staff]            # the groups used on the pages: check the people blocks for the exact names
order: 40                  # lower numbers come first
photo: people/jane-doe.jpg
photoAlt: Jane Doe
bio: |-
  Bio in Markdown.
---
```

Confirm with the editor that the person agreed to their name, photo and bio being public; staff in sensitive countries often should not be listed.

Done when `npm run build` passes and the person shows on the right page. Publish with **publish-changes**.
