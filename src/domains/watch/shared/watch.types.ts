


import {
    Gender,
    ProductStatus,
    WatchCaseMaterialFamily,
    WatchGoldColorV2,
    WatchGoldTreatment,
    WatchMaterialProfile,
    WatchSiteChannel,
    WatchStyle,
    WatchStrapSetType,
    WatchStrapComponentSource,
    WatchSpecStatus,
} from "@prisma/client";

import {
    WatchBrandModel,
    WatchVendorModel,
    WatchCategoryModel,
    WatchDetailImageItem,
} from "../server";


export type WatchReviewSnapshot = {
    status: string;
    reviewNote?: string | null;
    submittedAt?: Date | string | null;
    submittedById?: string | null;
    reviewedAt?: Date | string | null;
    reviewedById?: string | null;
};
export type WatchDetailReviewSnapshot = {
    content: WatchReviewSnapshot;
    image: WatchReviewSnapshot;
    readyForPublish: boolean;
};

export type WatchDetailModel = {
    id: string;
    productId: string;
    watchId: string;

    title: string | null;
    slug?: string | null;
    status: ProductStatus | string;

    sku?: string | null;
    primaryImageUrl?: string | null;
    storefrontImageKey?: string | null;

    seoTitle?: string | null;
    seoDescription?: string | null;

    brand?: WatchBrandModel | null;
    vendor?: WatchVendorModel | null;
    category?: WatchCategoryModel | null;

    watch: {
        id: string;

        gender?: Gender | null;
        style?: WatchStyle | null; // ✅ thêm

        siteChannel?: WatchSiteChannel | null;
        stockState?: string | null;
        saleState?: string | null;
        serviceState?: string | null;
        specStatus?: WatchSpecStatus | null;
        movementType?: string | null;
        movementCalibre?: string | null;

        yearText?: string | null;

        hasBox?: boolean | null;
        hasPapers?: boolean | null;

        notes?: string | null;
        conditionGrade?: string | null;
        serialNumber?: string | null;
    };

    spec?: {
        id?: string;

        brand?: string | null;
        model?: string | null;
        referenceNumber?: string | null;
        nickname?: string | null;

        caseShape?: string | null;
        caseSizeMM?: string | null;
        lugToLugMM?: string | null;
        lugWidthMM?: string | null;
        thicknessMM?: string | null;

        materialProfile?: WatchMaterialProfile | null;
        primaryCaseMaterial?: WatchCaseMaterialFamily | null;
        secondaryCaseMaterial?: WatchCaseMaterialFamily | null;

        goldTreatment?: WatchGoldTreatment | null;
        goldColors?: WatchGoldColorV2[];
        goldKarat?: number | null;

        dialColor?: string | null;
        dialFinish?: string | null; // ✅ thêm

        crystal?: string | null;

        calibre?: string | null;
        powerReserve?: string | null; // ✅ thêm
        waterResistance?: string | null; // ✅ thêm

        braceletType?: string | null;
        strapMaterialText?: string | null;

        // ✅ NEW LOGIC STRAP
        strapSetType?: WatchStrapSetType | null;
        strapComponentSource?: WatchStrapComponentSource | null;

        buckleType?: string | null;
        materialNote?: string | null;

        boxIncluded?: boolean | null;
        bookletIncluded?: boolean | null;
        cardIncluded?: boolean | null;
    } | null;

    price?: {
        costPrice?: string | null;
        serviceCost?: string | null;
        landedCost?: string | null;
        listPrice?: string | null;
        salePrice?: string | null;
        minPrice?: string | null;
        pricingNote?: string | null;
    } | null;

    content?: {
        titleOverride?: string | null;
        summary?: string | null;
        hookText?: string | null;
        body?: string | null;
        bulletSpecs?: string[];
        hashtags?: string | null; seoTitle?: string | null;
        seoDescription?: string | null;
        contentStatus?: string | null;
        reviewNote?: string | null;
        submittedAt?: Date | string | null;
        reviewedAt?: Date | string | null;
        publishedAt?: Date | string | null;
    } | null;
    review: WatchDetailReviewSnapshot;
    images?: WatchDetailImageItem[];
    updatedAt?: Date | string | null;
};