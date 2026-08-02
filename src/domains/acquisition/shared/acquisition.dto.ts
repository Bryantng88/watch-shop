import type { AcquisitionType, AudienceSegment, ProductType } from "@prisma/client";

export type WatchItemInput = {
    id: string;
    audienceSegment?: AudienceSegment;
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
    sourceOrderItemId?: string | null;
    productType?: ProductType;
    strapSpec?: Record<string, unknown> | null;
    claspSpec?: Record<string, unknown> | null;
};

export type CreateAcquisitionInput = {
    vendorId?: string;
    quickVendorName?: string;
    currency?: string;
    type?: AcquisitionType;
    createdAt?: string;
    notes?: string | null;
    audienceSegment?: AudienceSegment;
    sourceOrderId?: string | null;
    items: WatchItemInput[];
};
