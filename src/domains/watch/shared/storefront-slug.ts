import slugify from "slugify";

export function buildWatchStorefrontSlug(title: string | null | undefined, productId: string) {
  const slugBase = slugify(String(title ?? "watch"), {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  }).slice(0, 80) || "watch";
  const slugSuffix = productId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toLowerCase();
  return `${slugBase}-${slugSuffix || "item"}`;
}

export function resolveWatchStorefrontSlug(input: {
  title: string | null | undefined;
  productId: string;
  currentSlug?: string | null;
  publishedAt?: Date | string | null;
}) {
  const currentSlug = String(input.currentSlug ?? "").trim();
  if (input.publishedAt && currentSlug) return currentSlug;
  return buildWatchStorefrontSlug(input.title, input.productId);
}

export function syncStorefrontProductUrl(text: string | null | undefined, slug: string) {
  const value = String(text ?? "");
  if (!value) return value;
  const url = `https://vinticwatches.vn/products/${encodeURIComponent(slug)}`;
  return value.replace(/https:\/\/vinticwatches\.vn\/products\/[^\s]+/g, url);
}
