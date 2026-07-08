import type { WatchListFilters, WatchListResult } from "@/domains/watch/ui/list/types";

export type WatchInventoryQuickFilter =
  | "missingPrice"
  | "missingImage"
  | "missingContent"
  | "photoshoot"
  | "mediaProcessing"
  | "readyToPublish"
  | "readyToSell"
  | "hasIssue";

export type WatchInventoryPriceStatus = "MISSING" | "HAS_PRICE";

export type WatchInventoryPricePreset =
  | "UNDER_3M"
  | "UNDER_5M"
  | "FIVE_TO_TEN"
  | "TEN_TO_TWENTY"
  | "OVER_TWENTY";

export type WatchInventoryPriceFilter = {
  status?: WatchInventoryPriceStatus;
  preset?: WatchInventoryPricePreset;
  min?: number;
  max?: number;
};

export type WatchInventoryOperationFilter = {
  mediaStatuses?: string[];
  serviceStatuses?: string[];
  saleStatuses?: string[];
};

export type WatchInventoryQueryInput = Omit<
  WatchListFilters,
  "brandId" | "vendorId" | "mediaStatus" | "serviceStatus" | "saleStatus" | "priceStatus" | "pricePreset" | "priceMin" | "priceMax" | "quickFilter"
> & {
  text?: string;
  brandIds?: string[];
  vendorIds?: string[];
  operation?: WatchInventoryOperationFilter;
  price?: WatchInventoryPriceFilter;
  quickFilter?: WatchInventoryQuickFilter | "";
};

export type WatchInventoryProjectionQueryInput = WatchListFilters;

export type WatchInventoryQueryResult = WatchListResult & {
  projection?: {
    source: "projection" | "source";
    fallbackReason?: string;
  };
};
