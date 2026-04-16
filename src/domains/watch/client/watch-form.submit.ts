import type {
    SaveWatchContentInput,
    UpdateWatchCoreInput,
    UpdateWatchPricingInput,
    UpsertWatchSpecInput,
} from "../server";
import type { WatchFormValues } from "./watch-form.types";

function nullable(v: string) {
    const t = v.trim();
    return t ? t : null;
}

function numberish(v: string) {
    const t = v.trim();
    return t ? t : null;
}

export function buildWatchSubmitPayload(values: WatchFormValues): {
    core: UpdateWatchCoreInput;
    spec: UpsertWatchSpecInput;
    pricing: UpdateWatchPricingInput;
    content: SaveWatchContentInput;
} {
    return {
        core: {
            title: values.core.title.trim(),
            slug: nullable(values.core.slug),
            sku: nullable(values.core.sku),
            status: values.core.status as any,

            brandId: nullable(values.core.brandId),
            vendorId: nullable(values.core.vendorId),
            categoryId: nullable(values.core.categoryId),

            seoTitle: nullable(values.core.seoTitle),
            seoDescription: nullable(values.core.seoDescription),
            primaryImageUrl: nullable(values.core.primaryImageUrl),
            storefrontImageKey: nullable(values.core.storefrontImageKey),

            gender: values.core.gender as any,
            siteChannel: values.core.siteChannel as any,

            stockState: nullable(values.core.stockState),
            saleState: nullable(values.core.saleState),
            serviceState: nullable(values.core.serviceState),

            conditionGrade: nullable(values.core.conditionGrade),
            movementType: nullable(values.core.movementType) as any,
            movementCalibre: nullable(values.core.movementCalibre),
            serialNumber: nullable(values.core.serialNumber),
            yearText: nullable(values.core.yearText),

            hasBox: values.core.hasBox,
            hasPapers: values.core.hasPapers,
            attachedStrapId: nullable(values.core.attachedStrapId),
            notes: nullable(values.core.notes),
        },

        spec: {
            productId: values.productId,
            brand: nullable(values.spec.brand),
            model: nullable(values.spec.model),
            referenceNumber: nullable(values.spec.referenceNumber),
            nickname: nullable(values.spec.nickname),

            caseShape: nullable(values.spec.caseShape) as any,
            caseSizeMM: numberish(values.spec.caseSizeMM),
            lugToLugMM: numberish(values.spec.lugToLugMM),
            lugWidthMM: numberish(values.spec.lugWidthMM),
            thicknessMM: numberish(values.spec.thicknessMM),

            materialProfile: values.spec.materialProfile as any,
            primaryCaseMaterial: values.spec.primaryCaseMaterial as any,
            secondaryCaseMaterial: nullable(values.spec.secondaryCaseMaterial) as any,
            goldTreatment: nullable(values.spec.goldTreatment) as any,
            goldColors: values.spec.goldColors as any,
            goldKarat: values.spec.goldKarat ? Number(values.spec.goldKarat) : null,
            materialNote: nullable(values.spec.materialNote),

            dialColor: nullable(values.spec.dialColor),
            dialFinish: nullable(values.spec.dialFinish),
            crystal: nullable(values.spec.crystal) as any,
            calibre: nullable(values.spec.calibre),
            powerReserve: nullable(values.spec.powerReserve),
            waterResistance: nullable(values.spec.waterResistance),
            braceletType: nullable(values.spec.braceletType) as any,
            strapMaterialText: nullable(values.spec.strapMaterialText),
            buckleType: nullable(values.spec.buckleType),

            boxIncluded: values.spec.boxIncluded,
            bookletIncluded: values.spec.bookletIncluded,
            cardIncluded: values.spec.cardIncluded,
        },

        pricing: {
            productId: values.productId,
            costPrice: numberish(values.pricing.costPrice),
            serviceCost: numberish(values.pricing.serviceCost),
            landedCost: numberish(values.pricing.landedCost),
            listPrice: numberish(values.pricing.listPrice),
            salePrice: numberish(values.pricing.salePrice),
            minPrice: numberish(values.pricing.minPrice),
            pricingNote: nullable(values.pricing.pricingNote),
        },

        content: {
            productId: values.productId,
            titleOverride: nullable(values.content.titleOverride),
            summary: nullable(values.content.summary),
            hookText: nullable(values.content.hookText),
            body: nullable(values.content.body),
            bulletSpecs: values.content.bulletSpecsText
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
            seoTitle: nullable(values.content.seoTitle),
            seoDescription: nullable(values.content.seoDescription),
        },
    };
}