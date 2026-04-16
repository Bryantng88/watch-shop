export type WatchFormValues = {
    productId: string;

    core: {
        title: string;
        slug: string;
        sku: string;
        status: string;

        brandId: string;
        vendorId: string;
        categoryId: string;

        seoTitle: string;
        seoDescription: string;
        primaryImageUrl: string;
        storefrontImageKey: string;

        gender: "MEN" | "WOMEN" | "UNISEX";
        siteChannel: "AFFORDABLE" | "LUXURY";

        stockState: string;
        saleState: string;
        serviceState: string;

        conditionGrade: string;
        movementType: string;
        movementCalibre: string;
        serialNumber: string;
        yearText: string;

        hasBox: boolean;
        hasPapers: boolean;
        attachedStrapId: string;
        notes: string;
    };

    spec: {
        brand: string;
        model: string;
        referenceNumber: string;
        nickname: string;

        caseShape: string;
        caseSizeMM: string;
        lugToLugMM: string;
        lugWidthMM: string;
        thicknessMM: string;

        materialProfile: "SINGLE_MATERIAL" | "BIMETAL" | "COATED" | "OTHER";
        primaryCaseMaterial:
        | "STAINLESS_STEEL"
        | "TITANIUM"
        | "CERAMIC"
        | "CARBON"
        | "GOLD"
        | "PLATINUM"
        | "SILVER"
        | "BRASS"
        | "OTHER";
        secondaryCaseMaterial:
        | ""
        | "STAINLESS_STEEL"
        | "TITANIUM"
        | "CERAMIC"
        | "CARBON"
        | "GOLD"
        | "PLATINUM"
        | "SILVER"
        | "BRASS"
        | "OTHER";

        goldTreatment:
        | ""
        | "SOLID_GOLD"
        | "CAPPED_GOLD"
        | "GOLD_PLATED"
        | "GOLD_VERMEIL"
        | "GOLD_FILLED";

        goldColors: Array<"YELLOW" | "WHITE" | "ROSE" | "MIXED">;
        goldKarat: "" | "10" | "14" | "18";
        materialNote: string;

        dialColor: string;
        dialFinish: string;
        crystal: string;
        calibre: string;
        powerReserve: string;
        waterResistance: string;
        braceletType: string;
        strapMaterialText: string;
        buckleType: string;

        boxIncluded: boolean;
        bookletIncluded: boolean;
        cardIncluded: boolean;
    };

    pricing: {
        costPrice: string;
        serviceCost: string;
        landedCost: string;
        listPrice: string;
        salePrice: string;
        minPrice: string;
        pricingNote: string;
    };

    content: {
        titleOverride: string;
        summary: string;
        hookText: string;
        body: string;
        bulletSpecsText: string;
        seoTitle: string;
        seoDescription: string;
    };
};