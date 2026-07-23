export type AcquisitionPreparedImage = {
    key: string;
    url: string;
    fromKey?: string;
};

export type AcquisitionWatchLine = {
    id: string;
    audienceSegment: "MEN" | "WOMEN";
    quickInput: string;
    aiHint: string;
    cost: number | "";
    salePrice: number | "";
    imageKey: string | null;
    imageUrl: string | null;
};

export type AcquisitionFormVendor = {
    id: string;
    name: string;
    phone?: string | null;
};

export type AcquisitionInlineSubmitPayload = {
    /** Default for the whole receipt; each item persists its own resolved segment. */
    audienceSegment: "MEN" | "WOMEN";
    vendorId: string;
    createdAt: string;
    currency: string;
    type: string;
    notes?: string | null;
    items: AcquisitionWatchLine[];
};
