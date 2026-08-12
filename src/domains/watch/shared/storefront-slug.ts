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
