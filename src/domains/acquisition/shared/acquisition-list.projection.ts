export type AcquisitionListProjectionItem = {
    id: string;
    index: number;
    title: string;
    subtitle: string;
    imageUrl: string | null;
    linkedWatchProductId: string | null;
    linkedWatchTitle: string | null;
    linkedWatchSku: string | null;
    totalAmount: number | null;
    quantity: number | null;
};

export type AcquisitionListProjectionRow = {
    id: string;
    refNo: string;
    approvalStatus: string;
    approvalStatusLabel: string;
    paymentStatus: "UNPAID" | "PARTIAL_PAID" | "PAID" | string;
    vendorId: string | null;
    vendorName: string;
    acquisitionType: string;
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
    detailItems: AcquisitionListProjectionItem[];
    paymentPaidAmount: number;
    paymentPendingAmount: number;
    paymentActiveAmount: number;
    paymentRemainingAmount: number;
    paymentIsFullyPaid: boolean;
};

export type AcquisitionListProjectionResult = {
    items: AcquisitionListProjectionRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};
