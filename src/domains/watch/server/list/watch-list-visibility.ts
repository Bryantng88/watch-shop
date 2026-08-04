import type { WatchListResult } from "@/domains/watch/ui/list/types";

export function scrubWatchListSensitivePrices(result: WatchListResult): WatchListResult {
    return {
        ...result,
        items: result.items.map((item) => ({
            ...item,
            costPrice: null,
            minPrice: null,
        })),
    };
}
