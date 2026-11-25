// WordPress shortlinks for published entries use the numeric post ID at /.
// Static asset redirects only match paths. Keep campaign parameters when
// redirecting from a shortlink to its final migrated page.
import paths from '../redirects/wordpress-ids.json' with { type: 'json' };

const byId = new Map(Object.entries(paths));

export function wordpressRedirect(url: URL): Response | undefined {
  if (url.pathname !== '/') return;
  const id = url.searchParams.get('p') ?? url.searchParams.get('page_id');
  const path = id && byId.get(id);
  if (!path) return;

  const target = new URL(url);
  target.pathname = path;
  for (const key of ['p', 'page_id', 'post_type']) target.searchParams.delete(key);
  return Response.redirect(target.href, 301);
}
