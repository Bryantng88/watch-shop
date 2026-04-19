import {
  ContentStatus,
  Gender,
  ProductStatus,
  WatchCaseMaterialFamily,
  WatchGoldColorV2,
  WatchGoldTreatment,
  WatchMaterialProfile,
  WatchSiteChannel,
} from "@prisma/client";

export type WatchListImageItem = {
  id?: string;
  fileKey?: string | null;
  url?: string | null;
  role?: "INLINE" | "GALLERY" | "COVER" | "THUMB" | null;
  isForAdmin?: boolean | null;
  isForStorefront?: boolean | null;
  sortOrder?: number | null;
};

export type WatchListComputedItem = {
  id: string;
  productId: string;
  watchId: string;
  title: string | null;
  status: ProductStatus | string;
  contentStatus?: ContentStatus | string | null;

  imagesCount?: number | null;
  hasImages?: boolean;
  hasContent?: boolean;
  images?: WatchListImageItem[];

  isReadyToPublish?: boolean;
  publishMissing?: string[];

  sku?: string | null;
  brand?: string | null;
  primaryImageUrl?: string | null;

  salePrice?: string | null;
  listPrice?: string | null;
  costPrice?: string | null;
  minPrice?: string | null;

  saleState?: string | null;
  serviceState?: string | null;

  gender?: Gender | null;
  siteChannel?: WatchSiteChannel | null;

  primaryCaseMaterial?: WatchCaseMaterialFamily | null;
  secondaryCaseMaterial?: WatchCaseMaterialFamily | null;
  materialProfile?: WatchMaterialProfile | null;
  goldTreatment?: WatchGoldTreatment | null;
  goldColors?: WatchGoldColorV2[];
  goldKarat?: number | null;

  updatedAt?: Date | string | null;

  spec?: {
    model?: string | null;
    referenceNumber?: string | null;
  } | null;
};

export type WatchListFilters = {
  q?: string;
  sku?: string;
  brandIds?: string[];
  vendorId?: string;
  hasContent?: "yes" | "no" | "";
  hasImages?: "yes" | "no" | "";
  saleStage?: string;
  opsStage?: string;
  gender?: Gender;
  siteChannel?: WatchSiteChannel;
  materialFamily?: WatchCaseMaterialFamily;
  updatedFrom?: Date;
  updatedTo?: Date;
  sort?: string;
  page?: number;
  pageSize?: number;
  view?: string;
};

export type WatchBrandModel = {
  id: string;
  name: string;
  slug?: string | null;
};

export type WatchVendorModel = {
  id: string;
  name: string;
};

export type WatchCategoryModel = {
  id: string;
  name: string;
  slug?: string | null;
};

export type WatchDetailImageItem = {
  id: string;
  fileKey?: string | null;
  url?: string | null;
  role?: "INLINE" | "GALLERY" | "COVER" | "THUMB" | null;
  isForAdmin?: boolean | null;
  isForStorefront?: boolean | null;
  sortOrder?: number | null;
};

