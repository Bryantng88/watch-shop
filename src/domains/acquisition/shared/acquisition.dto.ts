import type { AcquisitionType } from "@prisma/client";

export type WatchItemInput = {
    id: string;
    title?: string;
    productTitle?: string;
    quantity?: number;
    unitCost?: number;
    unitPrice?: number;
    salePrice?: number | null;
    quickSpec?: Record<string, unknown> | null;
    aiMeta?: {
        images?: Array<{
            key?: string | null;
            url?: string | null;
        }>;
        aiHint?: string | null;
    };
};

export type CreateAcquisitionInput = {
    vendorId?: string;
    quickVendorName?: string;
    currency?: string;
    type?: AcquisitionType;
    createdAt?: string;
    notes?: string | null;
    items: WatchItemInput[];
};
