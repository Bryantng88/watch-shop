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
  brandId?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  status?: string | null;
  contentStatus?: string | null;
  title?: string | null;
  minPrice?: number | null;
  purchasePrice?: number | null;
  salePrice?: number | null;
  postContent?: string | null;

  hasOpenService?: boolean;
  openServiceStatus?: string | null;
  latestServiceStatus?: string | null;

  variantSnapshot?: {
    id?: string | null;
    sku?: string | null;
    price?: number | null;
    salePrice?: number | null;
    stockQty?: number | null;
    availabilityStatus?: string | null;
  } | null;

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
  canEditPrice: boolean;
};