import type { WatchListView } from "../../shared/watch-status";

export type ViewKey = WatchListView;
export type { WatchListView };

export type WatchListSubFilter =
    | ""
    | "MISSING_CONTENT"
    | "MISSING_IMAGE"
    | "REVIEW_DRAFT"
    | "REVIEW_SUBMITTED"
    | "PARTIAL_APPROVED"
    | "APPROVED"
    | "POSTED";

export type WatchListCounts = {
    draft: number;
    processing: number;
    ready: number;
    hold: number;
    sold: number;
    all: number;
};

export type WatchListSubCounts = {
    missingContent: number;
    missingImage: number;
    reviewDraft: number;
    reviewSubmitted: number;
    partialApproved: number;
    approved: number;
    posted: number;
};


export type WatchPostTargetPreviewItem = {
    id: string;
    name: string;
    platform?: string | null;
};

export type WatchListSummary = {
    items: number;
    hasContent: number;
    hasImages: number;
    subCounts: WatchListSubCounts;
};

export type WatchRow = {
    id: string;
    productId: string;
    sku: string;
    title: string;
    slug?: string | null;

    brandName?: string | null;
    vendorName?: string | null;
    postTargets?: WatchPostTargetPreviewItem[];
    reviewStatus?:
    | "DRAFT"
    | "SUBMITTED"
    | "PARTIAL_APPROVED"
    | "APPROVED"
    | "POSTED"
    | "PUBLISHED"
    | string
    | null;

    postReadiness?: string | null;
    imageUrl?: string | null;
    imageKey?: string | null;
    imagesCount: number;
    hasImages: boolean;
    hasContent: boolean;
    isContentDownloaded?: boolean;
    isImageDownloaded?: boolean;
    isPosted?: boolean;
    lastUpdatedBy?: {
        id: string;
        name?: string | null;
        email?: string | null;
    } | null;

    contentStatus?:
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED"
    | "ARCHIVED"
    | "PROCESSING"
    | string
    | null;

    serviceIssuesCount: number;

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

    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;

    contentReady: boolean;
    imageReady: boolean;
    serviceReady: boolean;

    specStatus?: "PENDING" | "PARTIAL" | "READY" | "FAILED" | null;

    v2Row?: {
        watchId: string;
        productId: string;
        sku: string | null;
        title: string | null;
        imageUrl: string | null;
        imageKey: string | null;
        brandName: string | null;
        vendorName: string | null;
        mediaStatus: string;
        mediaStatusLabel: string;
        serviceStatus: string;
        serviceStatusLabel: string;
        saleStatus: string;
        saleStatusLabel: string;
        salePrice: number | null;
        updatedAt: string | null;
    };
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
    subFilter?: WatchListSubFilter;
    q?: string;
    sku?: string;
    brandId?: string;
    vendorId?: string;
    hasContent?: "" | "yes" | "no";
    hasImages?: "" | "yes" | "no";
    saleStage?: string;
    opsStage?: string;
    mediaStatus?: string;
    serviceStatus?: string;
    saleStatus?: string;
    priceStatus?: string;
    pricePreset?: string;
    priceMin?: string | number;
    priceMax?: string | number;
    quickFilter?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
    withTotal?: boolean;
    meta?: "full" | "lite" | string;
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
