import type { WatchItemInput } from "./acquisition.dto";

export function toDraftItem(input: WatchItemInput) {
    return {
        id: input.id,
        title: input.title,
        productTitle: input.productTitle ?? input.title ?? "",
        quantity: 1,
        unitCost: Number(input.unitCost ?? input.unitPrice ?? 0),
        unitPrice: Number(input.unitPrice ?? input.unitCost ?? 0),
        watchFlags: input.watchFlags,
        quickSpec: input.quickSpec,
        aiMeta: input.aiMeta,
    };
}