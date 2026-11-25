// WordPress shortlinks for published entries use the numeric post ID at /.
// Static asset redirects only match paths. Keep campaign parameters when
// redirecting from a shortlink to its final migrated page.
import paths from '../redirects/wordpress-ids.json' with { type: 'json' };

const byId = new Map(Object.entries(paths));

export function wordpressRedirect(url: URL): Response | undefined {
  if (url.pathname !== '/') return;
  // An empty or unknown `p` must not hide a valid `page_id`.
  const path = ['p', 'page_id']
    .map((key) => url.searchParams.get(key))
    .map((id) => id && byId.get(id))
    .find(Boolean);
  if (!path) return;

  const target = new URL(url);
  target.pathname = path;
  for (const key of ['p', 'page_id', 'post_type']) target.searchParams.delete(key);
  return Response.redirect(target.href, 301);
}
