import {
    ingestExistingMediaForWatch,
} from "@/domains/media/application";

import {
    dedupeMediaItems,
    fileNameFromKey,
    mediaKey,
    type WatchFormMediaItem,
} from "../shared/watch-form-value";

export function mergeWatchMediaPoolItems(
    poolItems: WatchFormMediaItem[],
    galleryItems: WatchFormMediaItem[],
) {
    return dedupeMediaItems([...poolItems, ...galleryItems]);
}

export async function selectWatchPoolImages(
    items: WatchFormMediaItem[],
) {
    const normalized = dedupeMediaItems(items);
    const result: WatchFormMediaItem[] = [];

    for (const item of normalized) {
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
