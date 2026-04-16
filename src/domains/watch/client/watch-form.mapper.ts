import type { WatchDetailModel } from "../server/shared/watch.types";
import type { WatchFormValues } from "./watch-form.types";

function s(v: string | null | undefined) {
    return v ?? "";
}

export function mapWatchDetailToFormValues(
    detail: WatchDetailModel
): WatchFormValues {
    return {
        productId: detail.productId,

        core: {
            title: s(detail.title),
            slug: s(detail.slug),
            sku: s(detail.sku),
            status: s(detail.status),

            brandId: s(detail.brand?.id),
            vendorId: "",
            categoryId: "",

            seoTitle: s(detail.seoTitle),
            seoDescription: s(detail.seoDescription),
            primaryImageUrl: s(detail.primaryImageUrl),
            storefrontImageKey: s(detail.storefrontImageKey),

            gender: detail.watch.gender ?? "MEN",
            siteChannel: detail.watch.siteChannel ?? "AFFORDABLE",

            stockState: s(detail.watch.stockState),
            saleState: s(detail.watch.saleState),
            serviceState: s(detail.watch.serviceState),

            conditionGrade: s(detail.watch.conditionGrade),
            movementType: s(detail.watch.movementType),
            movementCalibre: s(detail.watch.movementCalibre),
            serialNumber: s(detail.watch.serialNumber),
            yearText: s(detail.watch.yearText),

            hasBox: Boolean(detail.watch.hasBox),
            hasPapers: Boolean(detail.watch.hasPapers),
            attachedStrapId: "",
            notes: s(detail.watch.notes),
        },

        spec: {
            brand: s(detail.spec?.brand),
            model: s(detail.spec?.model),
            referenceNumber: s(detail.spec?.referenceNumber),
            nickname: s(detail.spec?.nickname),

            caseShape: s(detail.spec?.caseShape),
            caseSizeMM: s(detail.spec?.caseSizeMM),
            lugToLugMM: s(detail.spec?.lugToLugMM),
            lugWidthMM: s(detail.spec?.lugWidthMM),
            thicknessMM: s(detail.spec?.thicknessMM),

            materialProfile: detail.spec?.materialProfile ?? "SINGLE_MATERIAL",
            primaryCaseMaterial:
                detail.spec?.primaryCaseMaterial ?? "STAINLESS_STEEL",
            secondaryCaseMaterial: detail.spec?.secondaryCaseMaterial ?? "",

            goldTreatment: detail.spec?.goldTreatment ?? "",
            goldColors: detail.spec?.goldColors ?? [],
            goldKarat:
                detail.spec?.goldKarat != null
                    ? String(detail.spec.goldKarat) as "10" | "14" | "18"
                    : "",
            materialNote: "",

            dialColor: s(detail.spec?.dialColor),
            dialFinish: "",
            crystal: s(detail.spec?.crystal),
            calibre: s(detail.spec?.calibre),
            powerReserve: "",
            waterResistance: "",
            braceletType: s(detail.spec?.braceletType),
            strapMaterialText: "",
            buckleType: "",

            boxIncluded: Boolean(detail.spec?.boxIncluded),
            bookletIncluded: Boolean(detail.spec?.bookletIncluded),
            cardIncluded: Boolean(detail.spec?.cardIncluded),
        },

        pricing: {
            costPrice: s(detail.price?.costPrice),
            serviceCost: s(detail.price?.serviceCost),
            landedCost: s(detail.price?.landedCost),
            listPrice: s(detail.price?.listPrice),
            salePrice: s(detail.price?.salePrice),
            minPrice: s(detail.price?.minPrice),
            pricingNote: s(detail.price?.pricingNote),
        },

        content: {
            titleOverride: s(detail.content?.titleOverride),
            summary: s(detail.content?.summary),
            hookText: s(detail.content?.hookText),
            body: s(detail.content?.body),
            bulletSpecsText: (detail.content?.bulletSpecs ?? []).join("\n"),
            seoTitle: s(detail.content?.seoTitle),
            seoDescription: s(detail.content?.seoDescription),
        },
    };
}