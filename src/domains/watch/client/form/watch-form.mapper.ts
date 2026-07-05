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
        role: img?.role ?? null,
        sortOrder: img?.sortOrder ?? null,
    };
}

export function mapWatchDetailToFormValues(detail: any): WatchFormValues {
    const images = Array.isArray(detail?.images) ? detail.images : [];

    const inlineImage =
        images
            .filter((img: any) => String(img?.role ?? "").toUpperCase() === "INLINE")
            .sort(
                (a: any, b: any) =>
                    Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
            )
            .map(toPickedMediaItem)
            .filter(Boolean)[0] ?? null;

    const galleryImages = images
        .filter((img: any) => String(img?.role ?? "").toUpperCase() === "GALLERY")
        .sort(
            (a: any, b: any) =>
                Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
        )
        .map(toPickedMediaItem)
        .filter(Boolean) as PickedMediaItem[];

    const contentReviewStatus = s(detail?.review?.content?.status) || "DRAFT";
    const contentReviewNote = s(detail?.review?.content?.reviewNote);
    const imageReviewStatus = s(detail?.review?.image?.status) || "DRAFT";
    const imageReviewNote = s(detail?.review?.image?.reviewNote);
    const poolImages = Array.isArray(detail?.media?.poolImages)
        ? detail.media.poolImages
            .map(toPickedMediaItem)
            .filter(Boolean)
        : [];
    return {
        watchId: s(detail?.watchId),
        productId: s(detail?.productId),
        specStatus: s(detail?.watch?.specStatus || detail?.specStatus || "PENDING"),
        contentReviewStatus,
        contentReviewNote,
        imageReviewStatus,
        imageReviewNote,

        header: {
            sku: s(detail?.sku),
            status: s(detail?.status || "DRAFT"),
            serviceState: s(detail?.watch?.serviceState || "NOT_REQUIRED"),
        },

        basic: {
            title: s(detail?.title),
            slug: s(detail?.slug),
            brandId: s(detail?.brand?.id),
            vendorId: s(detail?.vendor?.id),
            categoryId: s(detail?.category?.id),
            gender: s(detail?.watch?.gender || "MEN"),
            siteChannel: s(detail?.watch?.siteChannel || "AFFORDABLE"),
            stockState: s(detail?.watch?.stockState || "IN_STOCK"),
            saleState: s(detail?.watch?.saleState || "DRAFT"),
            serviceState: s(detail?.watch?.serviceState || "NOT_REQUIRED"),
            conditionGrade: s(detail?.watch?.conditionGrade),
            movementType: s(detail?.watch?.movementType),
            movementCalibre: s(detail?.watch?.movementCalibre),
            serialNumber: s(detail?.watch?.serialNumber),
            yearText: s(detail?.watch?.yearText),
            style: s(detail?.watch?.style),
            postTargetIds: Array.isArray(detail?.postTargets)
                ? detail.postTargets.map((target: any) => String(target?.id ?? "")).filter(Boolean)
                : [],
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
            strapSetType: s(detail?.spec?.strapSetType),
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
            strapComponentSource: s(detail?.spec?.strapComponentSource),
            waterResistance: s(detail?.spec?.waterResistance),
            powerReserve: s(detail?.spec?.powerReserve),
            dialFinish: s(detail?.spec?.dialFinish),
            buckleType: s(detail?.spec?.buckleType),
            materialNote: s(detail?.spec?.materialNote),
        },

        content: {
            titleOverride: s(detail?.content?.titleOverride),
            hookText: s(detail?.content?.hookText),
            body: s(detail?.content?.body),
            bulletSpecs: Array.isArray(detail?.content?.bulletSpecs)
                ? detail.content.bulletSpecs.map((x: any) => String(x))
                : [],
            hashTags: s(detail?.content?.hashTags ?? detail?.content?.hashtags),
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
            inlineImage: inlineImage as PickedMediaItem | null,
            poolImages: poolImages as PickedMediaItem[],
            galleryImages,
            imageCount: galleryImages.length,
            hasBox: Boolean(detail?.watch?.hasBox ?? detail?.spec?.boxIncluded),
            hasPapers: Boolean(detail?.watch?.hasPapers),
            bookletIncluded: Boolean(detail?.spec?.bookletIncluded),
            cardIncluded: Boolean(detail?.spec?.cardIncluded),
        },
    };
}
