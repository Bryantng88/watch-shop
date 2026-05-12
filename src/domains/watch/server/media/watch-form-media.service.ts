import {
    moveMediaAssetToWatchChosen,
    moveMediaToWatchPool,
} from "@/domains/media/server";

import {
    dedupeMediaItems,
    fileNameFromKey,
    mediaKey,
    type WatchFormMediaItem,
} from "../shared/watch-form-value";

export async function moveWatchPoolImagesToChosenPool(
    items: WatchFormMediaItem[],
    input: { productId: string }
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (const item of normalized) {
        const key = mediaKey(item);
        if (!key) continue;

        const moved = await moveMediaToWatchPool({
            fromKey: key,
            productId: input.productId,
        });

        result.push({
            ...item,
            key: moved.key,
            fileKey: moved.key,
            url: moved.url ?? item.url ?? null,
            name: moved.name ?? item.name ?? fileNameFromKey(moved.key),
        });
    }

    return result;
}

export async function moveWatchGalleryImagesToChosen(
    items: WatchFormMediaItem[],
    input: { productId: string; acquisitionId?: string | null }
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (let index = 0; index < normalized.length; index += 1) {
        const item = normalized[index];
        const key = mediaKey(item);
        if (!key) continue;

        const moved = await moveMediaAssetToWatchChosen({
            key,
            productId: input.productId,
            acquisitionId: input.acquisitionId ?? null,
            sortOrder: index,
        });

        result.push({
            ...item,
            key: moved.key,
            fileKey: moved.key,
            url: moved.url ?? item.url ?? null,
            name: moved.name ?? item.name ?? fileNameFromKey(moved.key),
        });
    }

    return result;
}
