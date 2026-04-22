export type AcquisitionListView = "all" | "draft" | "posted" | "canceled";

export type AcquisitionVendorOption = {
    id: string;
    name: string;
};

export type AcquisitionListItemDetail = {
    id: string;
    index: number;
    title: string;
    subtitle: string;
    linkedWatchProductId: string | null;
    linkedWatchTitle: string | null;
    linkedWatchSku: string | null;
    cost: number | null;
    quantity: number | null;
};

export type AcquisitionListItem = {
    id: string;
    refNo: string;
    status: string;
    statusLabel: string;
    vendorName: string;
    type: string;
    currency: string;
    itemCount: number;
    linkedWatchCount: number;
    totalAmount: number | null;
    notes: string;
    hasInvoice: boolean;
    acquiredAt: string;
    createdAt: string;
    updatedAt: string;
    previewTitles: string[];
    remainingCount: number;
    detailItems: AcquisitionListItemDetail[];
};

export type AcquisitionListCounts = {
    all: number;
    draft: number;
    posted: number;
    canceled: number;
};

export type AcquisitionListClientProps = {
    items: AcquisitionListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    counts: AcquisitionListCounts;
    vendors: AcquisitionVendorOption[];
    selectedIds?: string[];
    onSelectedIdsChange?: React.Dispatch<React.SetStateAction<string[]>>;

};
