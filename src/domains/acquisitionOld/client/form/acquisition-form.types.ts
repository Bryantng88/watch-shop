export type AcquisitionPreparedImage = {
    key: string;
    url: string;
    fromKey?: string;
};

export type AcquisitionWatchLine = {
    id: string;
    quickInput: string;
    aiHint: string;
    cost: number | "";
    receiveService: boolean;
    imageKey: string | null;
    imageUrl: string | null;
};

export type AcquisitionFormVendor = {
    id: string;
    name: string;
};

export type AcquisitionInlineSubmitPayload = {
    vendorId: string;
    createdAt: string;
    currency: string;
    type: string;
    notes?: string | null;
    items: AcquisitionWatchLine[];
};