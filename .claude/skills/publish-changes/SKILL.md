---
name: publish-changes
description: Preview and publish website changes. Use after any edit to the site's content, or when someone asks for a preview link, to publish, or to go live.
---

# Publish changes

Every change reaches unfoldingword.org the same way: branch → pull request → preview link → the editor says "publish" → merge. Nothing goes to `main` without the editor seeing the preview and saying so.

## Steps

1. **Branch.** If you are on `main`, create a branch named for the change: `git switch -c content/<short-name>` (e.g. `content/give-easter-2027`). Done when `git branch --show-current` is not `main`.
2. **Check locally.** Run `npm run build`. It fails with a message naming the file and field when content is wrong (missing alt text, a bad image path, a description that is too short, a redirect to a page that does not exist). Fix and re-run until it passes. Then run `npm run check:links`. Done when both pass.
3. **Commit and push.** Commit only the files for this change, with a message an editor would understand ("Add Easter giving page"). `git push -u origin HEAD`.
4. **Open the pull request.** `gh pr create --fill --body "<what changed, in plain words, and the page URLs>"`.
5. **Get the preview link.** Cloudflare builds the branch and posts a comment on the pull request with the Preview URL (a `workers.dev` address), usually within three minutes. Read it with `gh pr view --comments`. Also wait for the CI checks (`gh pr checks --watch`). Done when you have the preview URL and the checks are green. If a check fails, read its log (`gh run view --log-failed`), fix, push, and repeat this step.
6. **Show the editor.** Give them the preview URL for each changed page (the preview URL + the page path), and suggest they open it on their phone. Say what to look at.
7. **Publish only on their word.** When the editor says to publish, `gh pr merge --squash --delete-branch`. Cloudflare deploys `main` to unfoldingword.org within a few minutes. Tell them it is live and give the live URL. If they want changes instead, make them on the same branch and go back to step 2.

## Notes

- The preview is a real copy of the site but is hidden from search engines and does not send visits to Google Analytics (that only happens on unfoldingword.org).
- Giving forms on a preview are the real Virtuous forms: a test gift on a preview is a real gift.
- A person who is not sure whether a change is right should ask a colleague to open the preview link too. Nothing is published until the merge.
