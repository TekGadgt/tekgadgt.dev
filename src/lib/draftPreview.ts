const MINIMUM_PREVIEW_KEY_LENGTH = 16;
const URL_SAFE_PREVIEW_KEY = /^[A-Za-z0-9_-]+$/;

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
