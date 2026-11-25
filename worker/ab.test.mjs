// node --test worker/ab.test.mjs  (Node 22.18+ strips the TypeScript types)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assign, experimentFor, pickVariant, readCookie } from './ab.ts';

const exp = {
  id: 'give-hero',
  status: 'running',
  path: '/give/',
  start: '2026-12-01',
  end: '2026-12-31',
  variants: [
    { id: 'a', weight: 50, page: '/give/' },
    { id: 'b', weight: 50, page: '/_variants/give-hero-b/' },
  ],
};

test('experimentFor matches the path with or without trailing slash, inside the dates', () => {
  const d = new Date('2026-12-10T12:00:00Z');
  assert.equal(experimentFor('/give/', [exp], d, false)?.id, 'give-hero');
  assert.equal(experimentFor('/give', [exp], d, false)?.id, 'give-hero');
  assert.equal(experimentFor('/give/monthly/', [exp], d, false), undefined);
});

test('experimentFor ignores tests before start or after end unless forced', () => {
  assert.equal(experimentFor('/give/', [exp], new Date('2026-11-30T12:00:00Z'), false), undefined);
  assert.equal(experimentFor('/give/', [exp], new Date('2027-01-01T00:00:01Z'), false), undefined);
  assert.equal(experimentFor('/give/', [exp], new Date('2027-01-01T00:00:01Z'), true)?.id, 'give-hero');
});

test('draft tests run only when forced', () => {
  const draft = { ...exp, status: 'draft' };
  const d = new Date('2026-12-10T12:00:00Z');
  assert.equal(experimentFor('/give/', [draft], d, false), undefined);
  assert.equal(experimentFor('/give/', [draft], d, true)?.id, 'give-hero');
});

test('pickVariant respects weights', () => {
  const v = [{ id: 'a', weight: 90, page: '' }, { id: 'b', weight: 10, page: '' }];
  assert.equal(pickVariant(v, 0.0).id, 'a');
  assert.equal(pickVariant(v, 0.899).id, 'a');
  assert.equal(pickVariant(v, 0.9).id, 'b');
  assert.equal(pickVariant(v, 0.999).id, 'b');
});

test('assign keeps an existing cookie and honours a forced variant and a winner', () => {
  const cookie = 'foo=1; uwab_give-hero=b; bar=2';
  assert.deepEqual(assign(exp, { cookieHeader: cookie, random: 0 }), { variant: exp.variants[1], fresh: false });
  assert.equal(assign(exp, { cookieHeader: cookie, forced: 'a', random: 0.9 }).variant.id, 'a');
  assert.equal(assign({ ...exp, winner: 'a' }, { cookieHeader: cookie, random: 0.9 }).variant.id, 'a');
  const fresh = assign(exp, { cookieHeader: null, random: 0.75 });
  assert.equal(fresh.variant.id, 'b');
  assert.equal(fresh.fresh, true);
});

test('readCookie', () => {
  assert.equal(readCookie('a=1; b=two%20words', 'b'), 'two words');
  assert.equal(readCookie(null, 'b'), undefined);
});
