import {
    moveMediaAssetToWatchChosen,
    moveMediaToWatchPool,
    releaseMediaAssetsToActive,
} from "@/domains/media/server";
import { prisma } from "@/server/db/client";

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


export async function releaseRemovedWatchPoolImagesToActive(input: {
    productId: string;
    keepItems: WatchFormMediaItem[];
}) {
    const keepKeys = new Set(
        dedupeMediaItems(input.keepItems)
            .map(mediaKey)
            .filter(Boolean),
    );

    const poolPrefix = `products/edit/chosen/watch/${input.productId}/pool/`;

    const currentPoolAssets = await prisma.mediaAsset.findMany({
        where: {
            productId: input.productId,
            status: "CHOSEN" as any,

            // Chỉ release ảnh pool tạm.
            // Tuyệt đối không đụng INLINE/GALLERY.
            key: {
                startsWith: poolPrefix,
            },
        },
        select: {
            key: true,
            movedFromKey: true,
        },
    });

    const removedKeys = currentPoolAssets
        .filter((asset) => {
            const key = String(asset.key ?? "").trim();
            const movedFromKey = String(asset.movedFromKey ?? "").trim();

            if (!key) return false;

            if (keepKeys.has(key)) return false;
            if (movedFromKey && keepKeys.has(movedFromKey)) return false;

            return true;
        })
        .map((asset) => asset.key);

    if (removedKeys.length === 0) {
        return [];
    }

    return releaseMediaAssetsToActive({
        keys: removedKeys,
        productId: input.productId,
    });
}