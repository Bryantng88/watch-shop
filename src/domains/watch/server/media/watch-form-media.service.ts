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

const MEDIA_SELECTION_CONCURRENCY = 6;

async function mapWithConcurrency<T, R>(
    items: T[],
    worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
    const results = new Array<R>(items.length);
    let nextIndex = 0;

    async function runWorker() {
        while (nextIndex < items.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await worker(items[index], index);
        }
    }

    await Promise.all(
        Array.from(
            { length: Math.min(MEDIA_SELECTION_CONCURRENCY, items.length) },
            () => runWorker(),
        ),
    );

    return results;
}

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
    const selectedItems = await mapWithConcurrency<WatchFormMediaItem, WatchFormMediaItem | null>(normalized, async (item, index) => {
        const key = mediaKey(item);
        if (!key) return null;

        const selected = await selectExistingMediaForWatch({
            storageKey: key,
            productId,
            role: MediaRole.GALLERY,
            sortOrder: index,
        });

        return {
            ...item,
            key: selected.key,
            fileKey: selected.fileKey,
            url: selected.url ?? item.url ?? null,
            name: selected.name ?? item.name ?? fileNameFromKey(selected.key),
        };
    });

    return selectedItems.filter((item): item is WatchFormMediaItem => item !== null);
}
export async function selectWatchGalleryImages(
    items: WatchFormMediaItem[],
) {
    const normalized = dedupeMediaItems(items);
    const selectedItems = await mapWithConcurrency<WatchFormMediaItem, WatchFormMediaItem | null>(normalized, async (item) => {
        const key = mediaKey(item);
        if (!key) return null;

        const selected = await ingestExistingMediaForWatch({
            storageKey: key,
        });

        return {
            ...item,
            key: selected.key,
            fileKey: selected.fileKey,
            url: selected.url ?? item.url ?? null,
            name: selected.name ?? item.name ?? fileNameFromKey(selected.key),
        };
    });

    return selectedItems.filter((item): item is WatchFormMediaItem => item !== null);
}
