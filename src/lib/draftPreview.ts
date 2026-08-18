const MINIMUM_PREVIEW_KEY_LENGTH = 16;
const GENERATED_PREVIEW_KEY_LENGTH = 24;
const PREVIEW_KEY_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
const URL_SAFE_PREVIEW_KEY = /^[A-Za-z0-9_-]+$/;

type RandomValues = (bytes: Uint8Array) => Uint8Array;

export function generatePreviewKey(
  randomValues: RandomValues = (bytes) => crypto.getRandomValues(bytes)
): string {
  const bytes = randomValues(new Uint8Array(GENERATED_PREVIEW_KEY_LENGTH));

  return Array.from(
    bytes,
    (byte) => PREVIEW_KEY_ALPHABET[byte & 63]
  ).join('');
}

interface DraftPreviewInput {
  slug: string;
  draft: boolean | undefined;
  previewKey: string | undefined;
}

export function getDraftPreviewPath({
  slug,
  draft,
  previewKey,
}: DraftPreviewInput): string | undefined {
  const key = previewKey?.trim();

  if (
    draft !== true ||
    !key ||
    key.length < MINIMUM_PREVIEW_KEY_LENGTH ||
    !URL_SAFE_PREVIEW_KEY.test(key)
  ) {
    return undefined;
  }

  return `/preview/blog/${key}/${slug}`;
}
