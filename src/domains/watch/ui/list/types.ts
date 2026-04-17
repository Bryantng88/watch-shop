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

export type WatchRowImage = {
    id?: string;
    fileKey?: string | null;
    url?: string | null;
    role?: "INLINE" | "GALLERY" | "COVER" | "THUMB" | null;
    isForAdmin?: boolean | null;
    isForStorefront?: boolean | null;
    sortOrder?: number | null;
};

export type WatchRow = {
    id: string;
    watchId: string;
    productId: string;
    title?: string | null;
    sku?: string | null;
    brand?: string | null;
    status?: string | null;
    vendorName?: string | null;
    createdAt?: string | Date | null;
    serviceState?: string | null;

    salePrice?: string | null;
    listPrice?: string | null;
    costPrice?: string | null;
    minPrice?: string | null;

    hasImages?: boolean;
    hasContent?: boolean;
    imagesCount?: number | null;
    images?: WatchRowImage[];

    updatedAt?: string | Date | null;
    isReadyToPublish?: boolean;
};
