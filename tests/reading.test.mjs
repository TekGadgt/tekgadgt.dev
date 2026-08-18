import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateReadingProgress, estimateReadingTime } from '../src/lib/reading.ts';

test('estimates reading time at 225 words per minute', () => {
  assert.equal(estimateReadingTime(225), 1);
  assert.equal(estimateReadingTime(450), 2);
});

test('rounds reading time to the nearest minute with a one-minute minimum', () => {
  assert.equal(estimateReadingTime(0), 1);
  assert.equal(estimateReadingTime(300), 1);
  assert.equal(estimateReadingTime(340), 2);
});

test('reports zero progress before the article reaches the sticky header', () => {
  assert.equal(calculateReadingProgress({
    scrollY: 200,
    articleTop: 500,
    articleHeight: 2000,
    viewportHeight: 800,
    headerHeight: 64,
  }), 0);
});

test('reports bounded progress through the readable article range', () => {
  const dimensions = {
    articleTop: 500,
    articleHeight: 2000,
    viewportHeight: 800,
    headerHeight: 64,
  };
  const start = dimensions.articleTop - dimensions.headerHeight;
  const end = dimensions.articleTop + dimensions.articleHeight - dimensions.viewportHeight;
  const midpoint = start + ((end - start) / 2);

  assert.equal(calculateReadingProgress({ scrollY: midpoint, ...dimensions }), 50);
  assert.equal(calculateReadingProgress({ scrollY: end + 500, ...dimensions }), 100);
});

test('handles an article shorter than the viewport', () => {
  const dimensions = {
    articleTop: 500,
    articleHeight: 300,
    viewportHeight: 800,
    headerHeight: 64,
  };

  assert.equal(calculateReadingProgress({ scrollY: 400, ...dimensions }), 0);
  assert.equal(calculateReadingProgress({ scrollY: 500, ...dimensions }), 100);
});
