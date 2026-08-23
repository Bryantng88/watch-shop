export type StorefrontLocale = "vi" | "en";

export function formatStorefrontMoney(amountVnd: number, locale: StorefrontLocale, vndPerUsd: number) {
  if (locale === "en") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amountVnd / vndPerUsd);
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amountVnd);
}

export function formatStorefrontWatchMoney(
  amountVnd: number,
  locale: StorefrontLocale,
  vndPerUsd: number,
  isCollectible = false,
) {
  if (isCollectible) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amountVnd / vndPerUsd);
  }
  return formatStorefrontMoney(amountVnd, locale, vndPerUsd);
}
