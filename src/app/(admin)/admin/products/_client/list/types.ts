import type { BrandLite, ProductListItem } from "@/features/products/types";
export type OpsStage =
  | "NORMAL"
  | "IN_SERVICE"
  | "BLOCKED"
  | "SOLD";

export type SaleStage =
  | "NOT_READY"
  | "READY_TO_POST"
  | "LIVE"
  | "HOLD"
  | "SOLD";

export type SaleMissingKey =
  | "images"
  | "content"
  | "price";

export type OpsFlag =
  | "OPEN_SERVICE"
  | "NEED_SERVICE"
  | "URGENT_ORDER"
  | "MISSING_TECH_INFO";

export type PriorityLevel =
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export type ViewKey =
  | "all"
  | "not_ready"
  | "ready_to_post"
  | "live"
  | "in_service"
  | "sold";

export type CatalogKey = "product" | "strap";

export type MissingKey =
  | "images"
  | "content"
  | "price";

export type Counts = {
  all: number;
  not_ready: number;
  ready_to_post: number;
  live: number;
  in_service: number;
  sold: number;
};

export type ProductRow = ProductListItem & {
  sku?: string;
  slug?: string;
  brand?: string | null;
  type?: string | null;
  vendorName?: string | null;
  material?: string | null;
  variantsCount?: number;
  imagesCount?: number;
  ordersCount?: number;
  serviceRequests?: number;
  reservations?: number;
  primaryImageUrl?: string | null;
  brandId?: string | null;
  category?: string | { id?: string | null; name?: string | null; code?: string | null; slug?: string | null } | null;
  variantSnapshot?: {
    price?: number | null;
    availabilityStatus?: string | null;
    stockQty?: number | null;
    sku?: string | null;
  } | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  status?: string | null;
  contentStatus?: string | null;
  title?: string | null;
  minPrice?: number | null;
  purchasePrice?: number | null;
  salePrice?: number | null;
  stockQty?: number | null;
  strapSpec?: {
    lugWidthMM?: number | null;
    buckleWidthMM?: number | null;
    color?: string | null;
    material?: string | null;
    quickRelease?: boolean | null;
  } | null;
  computed?: {
    opsStage: OpsStage;
    saleStage: SaleStage;
    saleMissing: SaleMissingKey[];
    opsFlags: OpsFlag[];
    priorityLevel: PriorityLevel;
    isReadyForSale: boolean;
    isBlockedForSale: boolean;
    canPostNow: boolean;
  };
  isVariantInfoComplete?: boolean;
  isWatchSpecComplete?: boolean;
  isInfoComplete?: boolean;
  missingVariantFields?: string[];
  missingWatchSpecFields?: string[];
  hasOpenService?: boolean;
  openServiceStatus?: string | null;
  latestServiceStatus?: string | null;
  acquisitionId?: string | null;
  acquisitionRefNo?: string | null;
  isReadyToPublish?: boolean;
  publishMissing?: string[];
  storefrontImageKey?: string | null;
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
