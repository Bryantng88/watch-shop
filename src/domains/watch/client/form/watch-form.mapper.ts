import type { WatchFormValues, PickedMediaItem } from "./watch-form.types";

function s(v: unknown) {
    return v == null ? "" : String(v);
}

function toPickedMediaItem(img: any): PickedMediaItem | null {
    const key = String(img?.fileKey ?? "").trim();
    if (!key) return null;

    return {
        key,
        url: img?.url ?? `/api/media/sign?key=${encodeURIComponent(key)}`,
        name: key.split("/").pop() ?? key,
    };
}

export function mapWatchDetailToFormValues(detail: any): WatchFormValues {
    const images = Array.isArray(detail?.images) ? detail.images : [];

    const selectedImages = images
        .filter((img: any) => String(img?.role ?? "").toUpperCase() === "GALLERY")
        .map(toPickedMediaItem)
        .filter(Boolean) as PickedMediaItem[];

    return {
        productId: s(detail?.productId),

        header: {
            sku: s(detail?.sku),
            status: s(detail?.status || "DRAFT"),
            serviceState: s(detail?.watch?.serviceState || "DRAFT"),
        },

        basic: {
            title: s(detail?.title),
            slug: s(detail?.slug),
            brandId: s(detail?.brand?.id),
            vendorId: s(detail?.vendor?.id),
            categoryId: s(detail?.category?.id),
            gender: s(detail?.watch?.gender || "MEN"),
            siteChannel: s(detail?.watch?.siteChannel || "AFFORDABLE"),
            stockState: s(detail?.watch?.stockState),
            saleState: s(detail?.watch?.saleState),
            conditionGrade: s(detail?.watch?.conditionGrade),
            movementType: s(detail?.watch?.movementType),
            movementCalibre: s(detail?.watch?.movementCalibre),
            serialNumber: s(detail?.watch?.serialNumber),
            yearText: s(detail?.watch?.yearText),
        },

        spec: {
            specBrand: s(detail?.spec?.brand || detail?.brand?.name),
            model: s(detail?.spec?.model),
            referenceNumber: s(detail?.spec?.referenceNumber),
            nickname: s(detail?.spec?.nickname),
            caseShape: s(detail?.spec?.caseShape),
            caseSizeMM: s(detail?.spec?.caseSizeMM),
            lugToLugMM: s(detail?.spec?.lugToLugMM),
            thicknessMM: s(detail?.spec?.thicknessMM),
            crystal: s(detail?.spec?.crystal),
            dialColor: s(detail?.spec?.dialColor),
            calibre: s(detail?.spec?.calibre),
            materialProfile: s(detail?.spec?.materialProfile || "SINGLE_MATERIAL"),
            primaryCaseMaterial: s(detail?.spec?.primaryCaseMaterial),
            secondaryCaseMaterial: s(detail?.spec?.secondaryCaseMaterial),
            goldTreatment: s(detail?.spec?.goldTreatment),
            goldColors: Array.isArray(detail?.spec?.goldColors)
                ? detail.spec.goldColors.map((x: any) => String(x))
                : [],
            goldKarat: s(detail?.spec?.goldKarat),
            braceletType: s(detail?.spec?.braceletType),
            strapMaterialText: s(detail?.spec?.strapMaterialText),
            waterResistance: s(detail?.spec?.waterResistance),
            powerReserve: s(detail?.spec?.powerReserve),
            dialFinish: s(detail?.spec?.dialFinish),
            buckleType: s(detail?.spec?.buckleType),
            materialNote: s(detail?.spec?.materialNote),
        },

        content: {
            hookText: s(detail?.content?.hookText),
            body: s(detail?.content?.body),
            bulletSpecs: Array.isArray(detail?.content?.bulletSpecs)
                ? detail.content.bulletSpecs.map((x: any) => String(x))
                : [],
        },

        pricing: {
            salePrice: s(detail?.price?.salePrice),
            listPrice: s(detail?.price?.listPrice),
            minPrice: s(detail?.price?.minPrice),
            costPrice: s(detail?.price?.costPrice),
            serviceCost: s(detail?.price?.serviceCost),
            landedCost: s(detail?.price?.landedCost),
            pricingNote: s(detail?.price?.pricingNote),
        },

        media: {
            chosenImages: selectedImages,
            selectedImages,
            imageCount: selectedImages.length,
            hasBox: Boolean(detail?.watch?.hasBox ?? detail?.spec?.boxIncluded),
            hasPapers: Boolean(detail?.watch?.hasPapers),
            bookletIncluded: Boolean(detail?.spec?.bookletIncluded),
            cardIncluded: Boolean(detail?.spec?.cardIncluded),
        },
    };
}