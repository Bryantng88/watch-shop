export type PickedMediaItem = {
    key: string;
    url?: string | null;
    name?: string | null;
    role?: string | null;
    sortOrder?: number | null;
};

export type WatchFormValues = {
    productId: string;

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
        conditionGrade: string;
        movementType: string;
        movementCalibre: string;
        serialNumber: string;
        yearText: string;
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
        hookText: string;
        body: string;
        bulletSpecs: string[];
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
        chosenImages: PickedMediaItem[];
        galleryImages: PickedMediaItem[];
        imageCount: number;
        hasBox: boolean;
        hasPapers: boolean;
        bookletIncluded: boolean;
        cardIncluded: boolean;
    };
};