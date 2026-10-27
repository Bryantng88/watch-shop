export type StorefrontLocale = "vi" | "en";

const USD_PRICE_ADJUSTMENT_VND = 1_000_000;
const USD_PRICE_ROUNDING_STEP = 10;

export function convertWatchPriceVndToUsd(amountVnd: number, vndPerUsd: number) {
  if (!Number.isFinite(vndPerUsd) || vndPerUsd <= 0) return 0;
  const adjustedUsd = (amountVnd + USD_PRICE_ADJUSTMENT_VND) / vndPerUsd;
  return Math.ceil(adjustedUsd / USD_PRICE_ROUNDING_STEP) * USD_PRICE_ROUNDING_STEP;
}

export function formatStorefrontMoney(amountVnd: number, locale: StorefrontLocale, vndPerUsd: number) {
  if (locale === "en") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(convertWatchPriceVndToUsd(amountVnd, vndPerUsd));
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
    }).format(convertWatchPriceVndToUsd(amountVnd, vndPerUsd));
  }
  return formatStorefrontMoney(amountVnd, locale, vndPerUsd);
}
