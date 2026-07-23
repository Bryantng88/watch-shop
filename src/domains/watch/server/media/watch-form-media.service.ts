import { MediaRole } from "@prisma/client";
import {
    releaseWatchMediaNotIn,
    selectExistingMediaForWatch,
} from "@/domains/media/application";

import {
    dedupeMediaItems,
    fileNameFromKey,
    mediaKey,
    type WatchFormMediaItem,
} from "../shared/watch-form-value";

export async function selectWatchPoolImages(
    items: WatchFormMediaItem[],
    input: { productId: string },
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (const item of normalized) {
        const key = mediaKey(item);
        if (!key) continue;

        const selected = await selectExistingMediaForWatch({
            storageKey: key,
            productId: input.productId,
            role: MediaRole.GALLERY,
            sortOrder: result.length,
        });

        result.push({
            ...item,
            key: selected.key,
            fileKey: selected.fileKey,
            url: selected.url ?? item.url ?? null,
            name: selected.name ?? item.name ?? fileNameFromKey(selected.key),
        });
    }

    return result;
}

export async function selectWatchGalleryImages(
    items: WatchFormMediaItem[],
    input: { productId: string; acquisitionId?: string | null },
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (let index = 0; index < normalized.length; index += 1) {
        const item = normalized[index];
        const key = mediaKey(item);
        if (!key) continue;

        const selected = await selectExistingMediaForWatch({
            storageKey: key,
            productId: input.productId,
            role: MediaRole.GALLERY,
            sortOrder: index,
        });

        result.push({
            ...item,
            key: selected.key,
            fileKey: selected.fileKey,
            url: selected.url ?? item.url ?? null,
            name: selected.name ?? item.name ?? fileNameFromKey(selected.key),
        });
    }

    return result;
}

export async function releaseRemovedWatchPoolImagesToActive(input: {
    productId: string;
    keepItems: WatchFormMediaItem[];
}) {
    const keepStorageKeys = dedupeMediaItems(input.keepItems)
        .map(mediaKey)
        .filter(Boolean);

    return releaseWatchMediaNotIn({
        productId: input.productId,
        role: MediaRole.GALLERY,
        keepStorageKeys,
    });
}
