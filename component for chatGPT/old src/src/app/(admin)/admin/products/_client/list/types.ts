import type { BrandLite, ProductListItem } from "@/features/products/types";

export type ViewKey =
  | "draft"
  | "processing"
  | "ready"
  | "hold"
  | "sold"
  | "all";

export type CatalogKey = "product" | "strap";

export type Counts = {
  draft: number;
  processing: number;
  ready: number;
  hold: number;
  sold: number;
  all: number;
  hasContent: number;
  hasImages: number;
};

export type ProductServiceState =
  | "DONE"
  | "IN_PROGRESS"
  | "PENDING"
  | "NOT_REQUIRED";

export type ProductReadinessStage =
  | "DRAFT"
  | "PROCESSING"
  | "READY"
  | "HOLD"
  | "SOLD";

export type ProductPricingState =
  | "READY_PRICE"
  | "MISSING_PRICE";

export type ProductRow = ProductListItem & {
  sku?: string;
  slug?: string;
  brand?: string | null;
  type?: string | null;
  vendorName?: string | null;
  variantsCount?: number;
  imagesCount?: number;
  primaryImageUrl?: string | null;
  primaryImageKey?: string | null;
  storefrontImageKey?: string | null;
  brandId?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  status?: string | null;
  contentStatus?: string | null;
  title?: string | null;
  minPrice?: number | null;
  purchasePrice?: number | null;
  basePurchasePrice?: number | null;
  salePrice?: number | null;
  strapAddedCost?: number | null;
  postContent?: string | null;

  hasOpenService?: boolean;
  openServiceStatus?: string | null;
  latestServiceStatus?: string | null;

  acquisitionId?: string | null;
  acquisitionRefNo?: string | null;

  attachedStrap?: {
    productId?: string | null;
    variantId?: string | null;
    title?: string | null;
    vendorName?: string | null;
    costPrice?: number | null;
    price?: number | null;
    strapSpec?: {
      lugWidthMM?: number | null;
      buckleWidthMM?: number | null;
      color?: string | null;
      material?: string | null;
      quickRelease?: boolean | null;
    } | null;
  } | null;

  stockQty?: number;
  attachedCount?: number;
  totalSystemStockQty?: number;
  attachedProducts?: Array<{
    id: string;
    title: string | null;
    status: string | null;
  }>;
  strapSpec?: {
    lugWidthMM?: number | null;
    buckleWidthMM?: number | null;
    color?: string | null;
    material?: string | null;
    quickRelease?: boolean | null;
  } | null;

  variantSnapshot?: {
    id?: string | null;
    sku?: string | null;
    price?: number | null;
    salePrice?: number | null;
    stockQty?: number | null;
    availabilityStatus?: string | null;
  } | null;

  watchSpecSnapshot?: any;

  computed?: {
    hasContent: boolean;
    hasImages: boolean;
    hasSellPrice: boolean;
    serviceState: ProductServiceState;
    readinessStage: ProductReadinessStage;
    pricingState: ProductPricingState;
  };
};

export type ProductListPageProps = {
  items: ProductRow[];
  total: number;
  counts?: Partial<Counts>;
  page: number;
  pageSize: number;
  totalPages: number;
  rawSearchParams: Record<string, string | string[] | undefined>;
  brands: BrandLite[];
  vendors: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string; code: string; scope: string }>;
  productTypes: Array<{ label: string; value: string }>;
  canViewCost: boolean;
};