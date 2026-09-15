import {
    ingestExistingMediaForWatch,
    selectExistingMediaForWatch,
} from "@/domains/media/application";
import { MediaRole } from "@prisma/client";

import {
    dedupeMediaItems,
    fileNameFromKey,
    mediaKey,
    normalizeImageKeys,
    sameJson,
    type WatchFormMediaItem,
} from "../shared/watch-form-value";

export function watchMediaSelectionChanges(input: {
    beforePool: WatchFormMediaItem[];
    beforeGallery: WatchFormMediaItem[];
    requestedPool: WatchFormMediaItem[];
    requestedGallery: WatchFormMediaItem[];
}) {
    const pool = mergeWatchMediaPoolItems(input.requestedPool, input.requestedGallery);
    return {
        pool,
        poolChanged: !sameJson(normalizeImageKeys(input.beforePool), normalizeImageKeys(pool)),
        galleryChanged: !sameJson(
            normalizeImageKeys(input.beforeGallery),
            normalizeImageKeys(input.requestedGallery),
        ),
    };
}

export function mergeWatchMediaPoolItems(
    poolItems: WatchFormMediaItem[],
    galleryItems: WatchFormMediaItem[],
) {
    return dedupeMediaItems([...poolItems, ...galleryItems]);
}

export async function selectWatchPoolImages(
    items: WatchFormMediaItem[],
    productId: string,
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (const item of normalized) {
        const key = mediaKey(item);
        if (!key) continue;

        const selected = await selectExistingMediaForWatch({
            storageKey: key,
            productId,
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
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (let index = 0; index < normalized.length; index += 1) {
        const item = normalized[index];
        const key = mediaKey(item);
        if (!key) continue;

        const selected = await ingestExistingMediaForWatch({
            storageKey: key,
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
