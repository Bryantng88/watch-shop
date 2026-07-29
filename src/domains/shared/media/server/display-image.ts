export type ProductDisplayImageSource = {
  primaryImageUrl?: string | null;
  storefrontImageKey?: string | null;
  productImage?: Array<{ fileKey?: string | null }> | null;
};

export function mediaDisplayUrl(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }

  return `/api/media/sign?key=${encodeURIComponent(raw)}`;
}

/**
 * Current Product media is authoritative; historical snapshots are fallback only.
 */
export function resolveProductDisplayImage(
  product?: ProductDisplayImageSource | null,
  snapshot?: string | null,
) {
  const currentKey =
    product?.productImage?.[0]?.fileKey ??
    product?.primaryImageUrl ??
    product?.storefrontImageKey ??
    null;

  return mediaDisplayUrl(currentKey) ?? mediaDisplayUrl(snapshot);
}
