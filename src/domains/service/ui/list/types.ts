export type ServiceReqItem = {
    id: string;
    refNo: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    scope: string | null;
    source?: string | null;
    sourceType?: string | null;
    customerItemNote: string | null;
    orderId?: string | null;
    orderRefNo: string | null;
    productId?: string | null;
    productTitle: string | null;
    primaryImageUrl: string | null;
    skuSnapshot: string | null;
    vendorName: string | null;
    technicianName: string | null;
    maintenanceCount: number;
    issueCount?: number;
    openIssueCount?: number;
    product?: {
        id: string;
        title?: string | null;
        primaryImageUrl?: string | null;
        sku?: string | null;
        watchSpec?: {
            movement?: string | null;
        } | null;
    } | null;
};

export type ServiceRequestViewKey = "all" | "draft" | "in_progress" | "done" | "canceled";

export type ServiceRequestCounts = Record<ServiceRequestViewKey, number>;

export type ServiceRequestListPageProps = {
    items: ServiceReqItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    counts?: Partial<ServiceRequestCounts>;
};

export type ServiceRequestFiltersValue = {
    q: string;
    sort: string;
};
