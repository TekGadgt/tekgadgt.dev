import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import keystaticConfig from '../keystatic.config.ts';

const postContentField = keystaticConfig.collections.posts.schema.content;
const htmlDayPostPath = new URL(
  '../src/content/posts/html-day-2026/index.mdoc',
  import.meta.url
);

test('stores WYSIWYG blog images in Astro public assets', () => {
  assert.deepEqual(postContentField.directories, ['public/images/posts']);
});

test('references an existing public asset for an inline blog image', () => {
  const source = readFileSync(htmlDayPostPath, 'utf8');
  const imagePath = '/images/posts/html-day-2026/htmlday20.jpg';
  const publicAsset = new URL(`../public${imagePath}`, import.meta.url);

  assert.match(source, /!\[.*?\]\(\/images\/posts\/html-day-2026\/htmlday20\.jpg\)/);
  assert.equal(existsSync(publicAsset), true);
});
