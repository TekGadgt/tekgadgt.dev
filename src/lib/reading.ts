const WORDS_PER_MINUTE = 225;

export function estimateReadingTime(wordCount: number): number {
  const safeWordCount = typeof wordCount === 'number' && isFinite(wordCount) ? Math.max(0, wordCount) : 0;
  return Math.max(1, Math.round(safeWordCount / WORDS_PER_MINUTE));
}

interface ReadingProgressInput {
  scrollY: number;
  articleTop: number;
  articleHeight: number;
  viewportHeight: number;
  headerHeight: number;
}

export function calculateReadingProgress({
  scrollY,
  articleTop,
  articleHeight,
  viewportHeight,
  headerHeight,
}: ReadingProgressInput): number {
  const start = articleTop - headerHeight;
  const end = articleTop + articleHeight - viewportHeight;

  if (end <= start) {
    return scrollY >= articleTop ? 100 : 0;
  }

  const progress = ((scrollY - start) / (end - start)) * 100;
  return Math.round(Math.min(100, Math.max(0, progress)));
}
