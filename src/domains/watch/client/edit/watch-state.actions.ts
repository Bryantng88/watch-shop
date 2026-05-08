"use server";

import { revalidatePath } from "next/cache";

import { transitionWatchState } from "../../server/core/state";
import type { WatchStateAction } from "../../server/core/state";

export async function transitionWatchStateAction(input: {
    productId: string;
    action: WatchStateAction;
}) {
    const productId = String(input.productId ?? "").trim();

    if (!productId) {
        throw new Error("Thiếu productId.");
    }

    const result = await transitionWatchState(productId, input.action);

    revalidatePath("/admin/watches");
    revalidatePath(`/admin/watches/${productId}`);
    revalidatePath(`/admin/watches/${productId}/edit`);

    return {
        productId: result.productId,
        saleState: result.saleState,
        serviceState: result.serviceState,
        stockState: result.stockState,
        productStatus: result.product.status,
        previous: {
            saleState: result.previous.saleState,
            serviceState: result.previous.serviceState,
            stockState: result.previous.stockState,
            productStatus: result.previous.product.status,
        },
    };
}
