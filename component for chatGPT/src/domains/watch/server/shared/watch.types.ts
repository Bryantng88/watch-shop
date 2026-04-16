import type { ProductType, ProductStatus, ContentStatus } from "@prisma/client";

export type WatchCatalogType = Extract<ProductType, "WATCH"> | "WATCH";

export type WatchListViewKey =
  | "draft"
  | "processing"
  | "ready"
  | "hold"
  | "sold"
  | "all";

export type WatchListFilters = {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: string;
  type?: string[];
  brandIds?: string[];
  categoryIds?: string[];
  hasImages?: "yes" | "no";
  vendorId?: string;
  sku?: string;
  saleStage?: string;
  opsStage?: string;
  missing?: "images" | "content" | "price";
  updatedFrom?: Date;
  updatedTo?: Date;
  view?: WatchListViewKey;
};

export type WatchListComputedItem = {
  id: string;
  title: string | null;
  type: WatchCatalogType;
  status: ProductStatus | string;
  contentStatus?: ContentStatus | string | null;
  imagesCount?: number | null;
  isReadyToPublish?: boolean;
  publishMissing?: string[];
};
