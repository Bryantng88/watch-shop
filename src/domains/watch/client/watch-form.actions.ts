import {
    saveWatchContent,
    updateWatchCore,
    updateWatchPricing,
    updateWatchSpec,
} from "../server";
import { buildWatchSubmitPayload } from "./watch-form.submit";
import type { WatchFormValues } from "./watch-form.types";

export async function submitWatchForm(values: WatchFormValues) {
    const payload = buildWatchSubmitPayload(values);

    await updateWatchCore(values.productId, payload.core);
    await updateWatchSpec(payload.spec);
    await updateWatchPricing(values.productId, payload.pricing);
    await saveWatchContent(values.productId, payload.content);

    return { ok: true };
}