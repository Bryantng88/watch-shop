import type {
  ContentStatus,
  Gender,
  ProductStatus,
  ProductType,
  WatchCaseMaterialFamily,
  WatchGoldColorV2,
  WatchGoldTreatment,
  WatchMaterialProfile,
  WatchSiteChannel,
} from "@prisma/client";

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
  brandIds?: string[];
  vendorId?: string;
  sku?: string;
  saleStage?: string;
  opsStage?: string;
  updatedFrom?: Date;
  updatedTo?: Date;
  gender?: Gender | "";
  siteChannel?: WatchSiteChannel | "";
  materialFamily?: WatchCaseMaterialFamily | "";
  hasImages?: "yes" | "no";
  hasContent?: "yes" | "no";
  view?: WatchListViewKey;
};

export type WatchListComputedItem = {
  id: string;
  productId: string;
  watchId: string;
  title: string | null;
  type: WatchCatalogType;
  status: ProductStatus | string;
  contentStatus?: ContentStatus | string | null;
  imagesCount?: number | null;
  isReadyToPublish?: boolean;
  publishMissing?: string[];
  sku?: string | null;
  brand?: string | null;
  salePrice?: string | null;
  listPrice?: string | null;
  costPrice?: string | null;
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
};

export type WatchDetailModel = {
  id: string;
  productId: string;
  watchId: string;
  title: string;
  slug: string | null;
  status: ProductStatus;
  sku: string | null;
  primaryImageUrl: string | null;
  storefrontImageKey: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  watch: {
    id: string;
    gender: Gender;
    siteChannel: WatchSiteChannel;
    stockState: string | null;
    saleState: string | null;
    serviceState: string | null;
    movementType: string | null;
    movementCalibre: string | null;
    yearText: string | null;
    hasBox: boolean;
    hasPapers: boolean;
    notes: string | null;
  };
  spec: {
    id: string;
    brand: string | null;
    model: string | null;
    referenceNumber: string | null;
    nickname: string | null;
    caseShape: string | null;
    caseSizeMM: string | null;
    lugToLugMM: string | null;
    lugWidthMM: string | null;
    thicknessMM: string | null;
    materialProfile: WatchMaterialProfile;
    primaryCaseMaterial: WatchCaseMaterialFamily;
    secondaryCaseMaterial: WatchCaseMaterialFamily | null;
    goldTreatment: WatchGoldTreatment | null;
    goldColors: WatchGoldColorV2[];
    goldKarat: number | null;
    dialColor: string | null;
    crystal: string | null;
    calibre: string | null;
    braceletType: string | null;
    boxIncluded: boolean;
    bookletIncluded: boolean;
    cardIncluded: boolean;
  } | null;
  price: {
    id: string;
    costPrice: string | null;
    serviceCost: string | null;
    landedCost: string | null;
    listPrice: string | null;
    salePrice: string | null;
    minPrice: string | null;
    pricingNote: string | null;
  } | null;
  content: {
    id: string;
    titleOverride: string | null;
    summary: string | null;
    hookText: string | null;
    body: string | null;
    bulletSpecs: string[];
    seoTitle: string | null;
    seoDescription: string | null;
  } | null;
  images: Array<{
    id: string;
    key: string | null;
    url: string | null;
    role: string | null;
    sortOrder: number;
    alt: string | null;
    width: number | null;
    height: number | null;
  }>;
};