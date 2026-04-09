import type { BrandLite, ProductListItem } from "@/features/products/types";

export type ViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";
export type CatalogKey = "product" | "strap";

export type Counts = {
  all: number;
  draft: number;
  posted: number;
  in_service: number;
  hold: number;
  sold: number;
};

export type ProductRow = ProductListItem & {
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
