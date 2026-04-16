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
};

export type WatchRow = {
    id: string;
    productId: string;
    title?: string | null;
    sku?: string | null;
    brand?: string | null;
    primaryImageUrl?: string | null;
    status?: string | null;
    saleState?: string | null;
    serviceState?: string | null;
    listPrice?: number | string | null;
    salePrice?: number | string | null;
    costPrice?: number | string | null;
    minPrice?: number | string | null;
    imagesCount?: number | null;
    publishMissing?: string[];
    isReadyToPublish?: boolean;
    spec?: {
        model?: string | null;
        referenceNumber?: string | null;
    } | null;
    computed?: {
        hasContent: boolean;
        hasImages: boolean;
        hasSellPrice: boolean;
    };
};

export type WatchListPageProps = {
    items: WatchRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    vendors: Array<{ id: string; name: string }>;
    canViewCost: boolean;
    canEditPrice: boolean;
};