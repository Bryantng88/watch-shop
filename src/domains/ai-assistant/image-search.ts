export const MAX_BEN_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_BEN_IMAGE_BASE64 = Math.ceil(MAX_BEN_IMAGE_BYTES / 3) * 4;
export const MAX_BEN_NORMALIZED_IMAGE_BYTES = 512 * 1024;
export const BEN_IMAGE_LOOKUPS = ['watches.search', 'watches.detail', 'watches.images'] as const;
