import type { WatchItemInput } from "./acquisition.dto";

export function toDraftItem(input: WatchItemInput) {
    const quantity = Math.trunc(Number(input.quantity ?? 1));
    return {
        id: input.id,
        audienceSegment: input.audienceSegment,
        title: input.title,
        productTitle: input.productTitle ?? input.title ?? "",
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        unitCost: Number(input.unitCost ?? input.unitPrice ?? 0),
        unitPrice: Number(input.unitPrice ?? input.unitCost ?? 0),
        quickSpec: input.quickSpec,
        aiMeta: input.aiMeta,
        pricing: input.salePrice == null ? undefined : { proposedSalePrice: input.salePrice },
        sourceOrderItemId: input.sourceOrderItemId ?? null,
        productId: input.productId ?? null,
        variantId: input.variantId ?? null,
        productType: input.productType,
        strapSpec: input.strapSpec,
        claspSpec: input.claspSpec,
    };
}
