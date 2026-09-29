import type { MediaPostThemeWatchCandidate } from "./media-post-theme.types";

export function toggleMediaPostWatchSelection(
  current: Record<string, string>,
  watch: MediaPostThemeWatchCandidate,
) {
  if (current[watch.watchId]) {
    const next = { ...current };
    delete next[watch.watchId];
    return next;
  }
  const firstGallery = watch.gallery[0]?.key;
  return firstGallery ? { ...current, [watch.watchId]: firstGallery } : current;
}

export function selectMediaPostGalleryImage(
  current: Record<string, string>,
  watchId: string,
  key: string,
) {
  return { ...current, [watchId]: key };
}
