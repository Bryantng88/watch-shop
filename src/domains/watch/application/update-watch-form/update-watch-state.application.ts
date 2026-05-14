import { transitionWatchState } from "../../server/state";
import type { WatchStateAction } from "../../server/state";

export async function transitionWatchStateApplication(input: {
    productId: string;
    action: WatchStateAction;
}) {
    const productId = String(input.productId ?? "").trim();

    if (!productId) {
        throw new Error("Thiếu productId.");
    }

    return transitionWatchState(productId, input.action);
}
