"use server";

import { revalidatePath } from "next/cache";

import { transitionWatchStateApplication } from "../../application";
import type { WatchStateAction } from "../../server/state";

export async function transitionWatchStateAction(input: {
    productId: string;
    action: WatchStateAction;
}) {
    const result = await transitionWatchStateApplication(input);

    revalidatePath("/admin/watches");
    revalidatePath(`/admin/watches/${result.productId}`);
    revalidatePath(`/admin/watches/${result.productId}/edit`);

    return {
        productId: result.productId,
        saleState: result.saleStage,
        serviceState: result.serviceStage,
        stockState: result.stockStage,
        productStatus: result.product.status,
        previous: {
            saleState: result.previous.saleStage,
            serviceState: result.previous.serviceStage,
            stockState: result.previous.stockStage,
            productStatus: result.previous.product.status,
        },
    };
}
