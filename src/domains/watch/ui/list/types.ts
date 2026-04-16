export type ViewKey =
    | "draft"
    | "processing"
    | "ready"
    | "hold"
    | "sold"
    | "all";

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

export type WatchServiceState =
    | "DONE"
    | "IN_PROGRESS"
    | "PENDING"
    | "NOT_REQUIRED";

export type WatchReadinessStage =
    | "DRAFT"
    | "PROCESSING"
    | "READY"
    | "HOLD"
    | "SOLD";

export type WatchPricingState = "READY_PRICE" | "MISSING_PRICE";

export type WatchRow = {
    id: string;
    watchId?: string;
    productId: string;

    title?: string | null;
    sku?: string | null;
    slug?: string | null;
    brand?: string | null;
    vendorName?: string | null;
    primaryImageUrl?: string | null;
    storefrontImageKey?: string | null;

    status?: string | null;
    contentStatus?: string | null;
    saleState?: string | null;
    serviceState?: string | null;

    listPrice?: number | string | null;
    salePrice?: number | string | null;
    costPrice?: number | string | null;
    purchasePrice?: number | string | null;
    minPrice?: number | string | null;

    createdAt?: string | null;
    updatedAt?: string | null;

    imagesCount?: number | null;
    publishMissing?: string[];
    isReadyToPublish?: boolean;
    hasContent?: boolean;
    hasImages?: boolean;
    hasSellPrice?: boolean;

    spec?: {
        model?: string | null;
        referenceNumber?: string | null;
    } | null;

    computed?: {
        hasContent: boolean;
        hasImages: boolean;
        hasSellPrice: boolean;
        serviceState: WatchServiceState;
        readinessStage: WatchReadinessStage;
        pricingState: WatchPricingState;
    };
};

export type WatchListPageProps = {
    items: WatchRow[];
    total: number;
    counts?: Partial<Counts>;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    brands?: Array<{ id: string; name: string }>;
    vendors: Array<{ id: string; name: string }>;
    canViewCost: boolean;
    canEditPrice: boolean;
};
