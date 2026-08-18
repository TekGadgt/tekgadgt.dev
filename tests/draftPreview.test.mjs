import assert from 'node:assert/strict';
import test from 'node:test';

import { generatePreviewKey, getDraftPreviewPath } from '../src/lib/draftPreview.ts';

test('generates a 24-character URL-safe preview key from random bytes', () => {
  const key = generatePreviewKey((bytes) => {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = index;
    }
    return bytes;
  });

  assert.equal(key, 'ABCDEFGHIJKLMNOPQRSTUVWX');
  assert.match(key, /^[A-Za-z0-9_-]{24}$/);
});

test('builds an unlisted preview path for a keyed draft', () => {
  assert.equal(
    getDraftPreviewPath({
      slug: 'html-day-2026',
      draft: true,
      previewKey: 'Q7mK2vN9xR4pT8zW',
    }),
    '/preview/blog/Q7mK2vN9xR4pT8zW/html-day-2026'
  );
});

test('does not create a preview path for a published post', () => {
  assert.equal(
    getDraftPreviewPath({
      slug: 'html-day-2026',
      draft: false,
      previewKey: 'Q7mK2vN9xR4pT8zW',
    }),
    undefined
  );
});

test('does not create a preview path without a sufficiently long key', () => {
  assert.equal(
    getDraftPreviewPath({ slug: 'html-day-2026', draft: true, previewKey: undefined }),
    undefined
  );
  assert.equal(
    getDraftPreviewPath({ slug: 'html-day-2026', draft: true, previewKey: 'too-short' }),
    undefined
  );
});

test('rejects preview keys that are not URL-safe', () => {
  assert.equal(
    getDraftPreviewPath({
      slug: 'html-day-2026',
      draft: true,
      previewKey: 'not safe enough!!!',
    }),
    undefined
  );
});
