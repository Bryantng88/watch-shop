export type ViewKey =
    | "draft"
    | "processing"
    | "ready"
    | "hold"
    | "sold"
    | "all";

export type WatchListView = ViewKey;

export type WatchListCounts = {
    draft: number;
    processing: number;
    ready: number;
    hold: number;
    sold: number;
    all: number;
};

export type WatchListSummary = {
    items: number;
    hasContent: number;
    hasImages: number;
};

export type WatchRow = {
    id: string;
    productId: string;
    sku: string;
    title: string;
    slug?: string | null;

    brandName?: string | null;
    vendorName?: string | null;

    imageUrl?: string | null;
    imagesCount: number;
    hasImages: boolean;
    hasContent: boolean;

    serviceState?: string | null;
    stockState?: string | null;
    saleState?: string | null;
    conditionGrade?: string | null;

    serviceLabel?: string | null;
    statusLabel?: string | null;

    salePrice?: number | null;
    listPrice?: number | null;
    costPrice?: number | null;
    minPrice?: number | null;

    updatedAt?: string | null;

    contentReady: boolean;
    imageReady: boolean;
    serviceReady: boolean;
};

export type WatchListResult = {
    items: WatchRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    counts: WatchListCounts;
    summary: WatchListSummary;
};

export type WatchListFilters = {
    view?: WatchListView;
    q?: string;
    sku?: string;
    brandId?: string;
    vendorId?: string;
    hasContent?: "" | "yes" | "no";
    hasImages?: "" | "yes" | "no";
    saleStage?: string;
    opsStage?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
};

export type WatchListOption = {
    id: string;
    name: string;
};

export type WatchListPageProps = {
    items: WatchRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    counts: WatchListCounts;
    summary?: WatchListSummary;
    canViewCost?: boolean;
    brands?: WatchListOption[];
    vendors?: WatchListOption[];
};