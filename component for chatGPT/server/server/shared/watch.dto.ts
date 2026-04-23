import type {
    Gender,
    MovementType,
    ProductStatus,
    WatchCaseMaterialFamily,
    WatchGoldColorV2,
    WatchGoldTreatment,
    WatchMaterialProfile,
    WatchSiteChannel,
    CaseType,
    Glass,
    Strap,
} from "@prisma/client";

export type CreateWatchDraftInput = {
    title: string;
    brandId?: string | null;
    vendorId?: string | null;
    categoryId?: string | null;
    sku?: string | null;
    status?: ProductStatus;
    gender?: Gender;
    siteChannel?: WatchSiteChannel;
};

export type UpdateWatchCoreInput = {
    title?: string;
    slug?: string | null;
    sku?: string | null;
    status?: ProductStatus;
    brandId?: string | null;
    vendorId?: string | null;
    categoryId?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    primaryImageUrl?: string | null;
    storefrontImageKey?: string | null;

    gender?: Gender;
    siteChannel?: WatchSiteChannel;
    stockState?: string | null;
    saleState?: string | null;
    serviceState?: string | null;
    conditionGrade?: string | null;
    movementType?: MovementType | null;
    movementCalibre?: string | null;
    serialNumber?: string | null;
    yearText?: string | null;
    hasBox?: boolean;
    hasPapers?: boolean;
    attachedStrapId?: string | null;
    notes?: string | null;
};

export type UpsertWatchSpecInput = {
    productId: string;
    brand?: string | null;
    model?: string | null;
    referenceNumber?: string | null;
    nickname?: string | null;

    caseShape?: CaseType | null;
    caseSizeMM?: number | string | null;
    lugToLugMM?: number | string | null;
    lugWidthMM?: number | string | null;
    thicknessMM?: number | string | null;

    materialProfile?: WatchMaterialProfile;
    primaryCaseMaterial?: WatchCaseMaterialFamily;
    secondaryCaseMaterial?: WatchCaseMaterialFamily | null;
    goldTreatment?: WatchGoldTreatment | null;
    goldColors?: WatchGoldColorV2[];
    goldKarat?: number | null;
    materialNote?: string | null;

    dialColor?: string | null;
    dialFinish?: string | null;
    crystal?: Glass | null;
    movementType?: MovementType | null;
    calibre?: string | null;
    powerReserve?: string | null;
    waterResistance?: string | null;
    braceletType?: Strap | null;
    strapMaterialText?: string | null;
    buckleType?: string | null;

    boxIncluded?: boolean;
    bookletIncluded?: boolean;
    cardIncluded?: boolean;

    featuresJson?: unknown;
    rawSpecJson?: unknown;
};

export type UpdateWatchPricingInput = {
    productId: string;
    costPrice?: number | string | null;
    serviceCost?: number | string | null;
    landedCost?: number | string | null;
    listPrice?: number | string | null;
    salePrice?: number | string | null;
    minPrice?: number | string | null;
    pricingNote?: string | null;
};

export type SaveWatchContentInput = {
    productId: string;
    titleOverride?: string | null;
    summary?: string | null;
    hookText?: string | null;
    body?: string | null;
    bulletSpecs?: string[];
    seoTitle?: string | null;
    seoDescription?: string | null;
    aiMetaJson?: unknown;
};

export type WatchMediaItemInput = {
    id?: string | null;
    legacyProductImageId?: string | null;
    key?: string | null;
    url?: string | null;
    type?: string | null;
    role?: string | null;
    sortOrder?: number | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
    mime?: string | null;
    sizeBytes?: number | null;
    dominantHex?: string | null;
    contentHash?: string | null;
};

export type ReplaceWatchImagesInput = {
    productId: string;
    images: WatchMediaItemInput[];
};

export type SetWatchStorefrontImageInput = {
    productId: string;
    imageId: string | null;
};

export type ReorderWatchImagesInput = {
    productId: string;
    imageIds: string[];
};

export type QuickOrderWatchInput = {
    productId: string;
    customerName: string;
    customerId?: string | null;
    listPrice?: number | null;
    unitPriceAgreed?: number | null;
    notes?: string | null;
};

export type BuyBackFromWatchInput = {
    productId: string;
    unitCost: number;
    notes?: string | null;
    customerId?: string | null;
    needService?: boolean;
};

export type ConsignWatchInput = {
    productId: string;
    vendorId: string;
    notes?: string | null;
};