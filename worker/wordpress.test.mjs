import assert from 'node:assert/strict';
import { test } from 'node:test';
import { wordpressRedirect } from './wordpress.ts';

test('WordPress post and page shortlinks go straight to their migrated URLs', () => {
  for (const [query, target] of [
    ['p=13547', '/stories/life-change-in-southeast-asia/'],
    ['page_id=14801', '/give/givingtuesday/'],
    ['post_type=prayer-request&p=14933&utm_source=bulletin', '/prayer-request/pray-for-new-believers/?utm_source=bulletin'],
  ]) {
    const origin = 'https://example.org';
    const response = wordpressRedirect(new URL(`/?${query}`, origin));
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), origin + target);
  }
});

test('ordinary pages and unknown IDs continue to static asset routing', () => {
  for (const path of ['/', '/?utm_source=email', '/?p=unknown', '/give/?p=13547']) {
    assert.equal(wordpressRedirect(new URL(path, 'https://example.org')), undefined);
  }
});
