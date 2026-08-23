import "server-only";

import { cookies } from "next/headers";
import { getPublicWatchBySlug } from "./public-catalog.service";
import type { StorefrontCartItem } from "../ui/StorefrontCart";

export const STOREFRONT_CART_COOKIE = "watch-shop-storefront-request";

export function parseStorefrontCartCookie(value?: string | null) {
  if (!value) return [];
  try {
    let decoded = value;
    for (let attempt = 0; attempt < 2 && !decoded.trim().startsWith("["); attempt += 1) {
      decoded = decodeURIComponent(decoded);
    }
    const parsed = JSON.parse(decoded);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean).slice(0, 20)
      : [];
  } catch {
    return [];
  }
}

export async function loadStorefrontCartItems(extraSlug?: string | null): Promise<StorefrontCartItem[]> {
  const cookieStore = await cookies();
  const slugs = parseStorefrontCartCookie(cookieStore.get(STOREFRONT_CART_COOKIE)?.value);
  const extra = String(extraSlug ?? "").trim();
  if (extra && !slugs.includes(extra)) slugs.unshift(extra);
  const watches = await Promise.all(slugs.slice(0, 20).map((slug) => getPublicWatchBySlug(slug).catch(() => null)));
  return watches.filter((watch): watch is NonNullable<typeof watch> => watch !== null && watch.orderable).map((watch) => ({
    productId: watch.productId,
    slug: watch.slug,
    title: watch.title,
    imageUrl: watch.image.url,
    priceAmount: watch.price.amount ?? 0,
    priceMode: watch.price.mode,
    currency: watch.price.currency,
    isCollectible: watch.isCollectible,
  }));
}
