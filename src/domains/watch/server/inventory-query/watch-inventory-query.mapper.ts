import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import type {
  WatchInventoryPriceFilter,
  WatchInventoryPricePreset,
  WatchInventoryPriceStatus,
  WatchInventoryProjectionQueryInput,
  WatchInventoryQueryInput,
  WatchInventoryQuickFilter,
} from "./watch-inventory-query.types";

const QUICK_FILTERS = new Set<WatchInventoryQuickFilter>([
  "missingPrice",
  "missingImage",
  "missingContent",
  "photoshoot",
  "mediaProcessing",
  "readyToPublish",
  "readyToSell",
  "hasIssue",
]);

const PRICE_STATUSES = new Set<WatchInventoryPriceStatus>([
  "MISSING",
  "HAS_PRICE",
]);

const PRICE_PRESETS = new Set<WatchInventoryPricePreset>([
  "UNDER_3M",
  "UNDER_5M",
  "FIVE_TO_TEN",
  "TEN_TO_TWENTY",
  "OVER_TWENTY",
]);

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function cleanArray(value: unknown) {
  const text = clean(value);
  return text ? [text] : [];
}

function normalizeQuickFilter(value: unknown): WatchInventoryQuickFilter | "" {
  const text = clean(value) as WatchInventoryQuickFilter;
  return QUICK_FILTERS.has(text) ? text : "";
}

function normalizePriceStatus(value: unknown): WatchInventoryPriceStatus | undefined {
  const text = clean(value).toUpperCase() as WatchInventoryPriceStatus;
  return PRICE_STATUSES.has(text) ? text : undefined;
}

function normalizePricePreset(value: unknown): WatchInventoryPricePreset | undefined {
  const text = clean(value).toUpperCase() as WatchInventoryPricePreset;
  return PRICE_PRESETS.has(text) ? text : undefined;
}

function numberOrUndefined(value: unknown) {
  const text = clean(value);
  if (!text) return undefined;

  const number = Number(text);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function rangeForPreset(preset: WatchInventoryPricePreset): Pick<WatchInventoryPriceFilter, "min" | "max"> {
  switch (preset) {
    case "UNDER_3M":
      return { max: 3_000_000 };
    case "UNDER_5M":
      return { max: 5_000_000 };
    case "FIVE_TO_TEN":
      return { min: 5_000_000, max: 10_000_000 };
    case "TEN_TO_TWENTY":
      return { min: 10_000_000, max: 20_000_000 };
    case "OVER_TWENTY":
      return { min: 20_000_000 };
  }
}

function normalizePrice(input: WatchListFilters): WatchInventoryPriceFilter | undefined {
  const status = normalizePriceStatus(input.priceStatus);
  const preset = normalizePricePreset(input.pricePreset);
  const customMin = numberOrUndefined(input.priceMin);
  const customMax = numberOrUndefined(input.priceMax);

  if (status === "MISSING") return { status };

  if (preset) {
    return {
      status: "HAS_PRICE",
      preset,
      ...rangeForPreset(preset),
    };
  }

  if (customMin !== undefined || customMax !== undefined) {
    return {
      status: "HAS_PRICE",
      min: customMin,
      max: customMax,
    };
  }

  return status ? { status } : undefined;
}

export function toWatchInventoryQueryInput(
  input: WatchListFilters,
): WatchInventoryQueryInput {
  return {
    view: input.view,
    subFilter: input.subFilter,
    text: clean(input.q),
    q: clean(input.q),
    sku: clean(input.sku),
    brandIds: cleanArray(input.brandId),
    vendorIds: cleanArray(input.vendorId),
    hasContent: input.hasContent,
    hasImages: input.hasImages,
    saleStage: input.saleStage,
    opsStage: input.opsStage,
    operation: {
      mediaStatuses: cleanArray(input.mediaStatus),
      serviceStatuses: cleanArray(input.serviceStatus),
      saleStatuses: cleanArray(input.saleStatus),
    },
    price: normalizePrice(input),
    quickFilter: normalizeQuickFilter(input.quickFilter),
    sort: input.sort,
    page: input.page,
    pageSize: input.pageSize,
    withTotal: input.withTotal,
    meta: input.meta,
  };
}

export function toWatchListFilters(
  input: WatchInventoryQueryInput,
): WatchInventoryProjectionQueryInput {
  const price = input.price;

  return {
    view: input.view,
    subFilter: input.subFilter,
    q: input.text ?? input.q,
    sku: input.sku,
    brandId: input.brandIds?.[0] ?? "",
    vendorId: input.vendorIds?.[0] ?? "",
    hasContent: input.hasContent,
    hasImages: input.hasImages,
    saleStage: input.saleStage,
    opsStage: input.opsStage,
    mediaStatus: input.operation?.mediaStatuses?.[0] ?? "",
    serviceStatus: input.operation?.serviceStatuses?.[0] ?? "",
    saleStatus: input.operation?.saleStatuses?.[0] ?? "",
    priceStatus: price?.status ?? "",
    pricePreset: price?.preset ?? "",
    priceMin: price?.min,
    priceMax: price?.max,
    quickFilter: input.quickFilter,
    sort: input.sort,
    page: input.page,
    pageSize: input.pageSize,
    withTotal: input.withTotal,
    meta: input.meta,
  };
}
