export type PickedMediaItem = {
    key: string;
    url?: string | null;
    name?: string | null;
    role?: string | null;
    sortOrder?: number | null;
};

export type WatchFormValues = {
    watchId: string;
    productId: string;
    saveIntent?: "NORMAL" | "SUBMIT_CONTENT" | "SUBMIT_IMAGE" | "MEDIA_WORKSPACE";
    specStatus?: "PENDING" | "PARTIAL" | "READY" | "FAILED" | string | null;
    contentReviewStatus?: string | null;
    contentReviewNote?: string | null;
    imageReviewStatus?: string | null;
    imageReviewNote?: string | null;
    header: {
        sku: string;
        status: string;
        serviceState: string;
    };

    basic: {
        title: string;
        slug: string;
        brandId: string;
        vendorId: string;
        categoryId: string;
        gender: string;
        siteChannel: string;
        stockState: string;
        saleState: string;
        serviceState: string;
        conditionGrade: string;
        movementType: string;
        movementCalibre: string;
        serialNumber: string;
        yearText: string;
        style: string;
        postTargetIds: string[];
    };

    spec: {
        specBrand: string;
        model: string;
        referenceNumber: string;
        nickname: string;
        caseShape: string;
        caseSizeMM: string;
        lugToLugMM: string;
        thicknessMM: string;
        crystal: string;
        dialColor: string;
        calibre: string;
        materialProfile: string;
        primaryCaseMaterial: string;
        secondaryCaseMaterial: string;
        strapSetType: string;
        strapComponentSource: string;
        goldTreatment: string;
        goldColors: string[];
        goldKarat: string;
        braceletType: string;
        strapMaterialText: string;
        waterResistance: string;
        powerReserve: string;
        dialFinish: string;
        buckleType: string;
        materialNote: string;
    };

    content: {
        titleOverride: string;
        hookText: string;
        body: string;
        bulletSpecs: string[];
        hashTags: string;
    };

    pricing: {
        salePrice: string;
        listPrice: string;
        minPrice: string;
        costPrice: string;
        serviceCost: string;
        landedCost: string;
        pricingNote: string;
    };

    media: {
        inlineImage: PickedMediaItem | null;
        poolImages: PickedMediaItem[];
        galleryImages: PickedMediaItem[];
        imageCount: number;
        hasBox: boolean;
        hasPapers: boolean;
        bookletIncluded: boolean;
        cardIncluded: boolean;
    };
};
