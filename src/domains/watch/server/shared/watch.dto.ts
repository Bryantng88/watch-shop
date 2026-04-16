export type CreateWatchDraftInput = {
    title: string;
    brandId?: string | null;
    status?: string;
};

export type UpdateWatchInput = {
    title?: string;
    status?: string;
    slug?: string | null;
};

export type UpsertWatchSpecInput = {
    variantId: string;
    data: Record<string, unknown>;
};

export type ReplaceWatchImagesInput = {
    productId: string;
    images: Array<Record<string, unknown>>;
};

export type SetWatchStorefrontImageInput = {
    productId: string;
    imageId: string | null;
};

export type SaveWatchContentInput = {
    productId: string;
    title?: string | null;
    summary?: string | null;
    body?: string | null;
    bulletSpecs?: string[] | null;
};

export type SyncWatchContentSnapshotInput = {
    productId: string;
};

export type UpdateWatchPricingInput = {
    productId: string;
    costPrice?: number | null;
    salePrice?: number | null;
    listPrice?: number | null;
};

export type BulkSetWatchSalePriceInput = {
    productIds: string[];
    salePrice: number;
};

export type QuickOrderWatchInput = {
    productId: string;
    customerId?: string | null;
};

export type BuyBackFromWatchInput = {
    productId: string;
};

export type ConsignWatchInput = {
    productId: string;
};

export type BulkPostWatchesInput = {
    productIds: string[];
};