import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";
import {
    type MediaProfile,
    getProfileRoot,
    normalizeKey,
} from "@/server/lib/product-image-storage";

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

function fileNameOf(key: string) {
    return normalizeKey(key).split("/").pop() || key;
}

function extOf(fileName: string) {
    return fileName.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? null;
}

function parentPrefixOf(key: string) {
    const parts = normalizeKey(key).split("/");
    parts.pop();
    return parts.join("/");
}

function isImageKey(key: string) {
    return IMAGE_EXT_RE.test(key);
}

function isHiddenOrThumbKey(key: string) {
    return normalizeKey(key)
        .split("/")
        .some((part) => {
            const name = part.trim().toLowerCase();

            return (
                !name ||
                name.startsWith(".") ||
                name.startsWith("@") ||
                name.includes("thumb") ||
                name === "thumbs.db" ||
                name === "@eadir"
            );
        });
}



export async function upsertMediaAsset(input: {
    key: string;
    sizeBytes?: number | null;
    etag?: string | null;
    lastModified?: Date | null;
}) {
    const key = normalizeKey(input.key);

    if (!key || !isImageKey(key) || isHiddenOrThumbKey(key)) return null;

    const fileName = fileNameOf(key);

    return prisma.mediaAsset.upsert({
        where: { key },
        create: {
            key,
            parentPrefix: parentPrefixOf(key),
            fileName,
            ext: extOf(fileName),
            sizeBytes: input.sizeBytes ?? null,
            etag: input.etag ?? null,
            lastModified: input.lastModified ?? null,
        },
        update: {
            parentPrefix: parentPrefixOf(key),
            fileName,
            ext: extOf(fileName),
            sizeBytes: input.sizeBytes ?? null,
            etag: input.etag ?? null,
            lastModified: input.lastModified ?? null,
        },
    });
}

export async function deleteMediaAsset(key: string) {
    return prisma.mediaAsset.deleteMany({
        where: { key: normalizeKey(key) },
    });
}

export async function syncMediaIndexByPrefix(prefix: string) {
    const root = normalizeKey(prefix);
    let continuationToken: string | undefined;
    let count = 0;

    do {
        const result = await mediaStorage.list({
            prefix: `${root}/`,
            maxKeys: 1000,
            cursor: continuationToken,
        });

        for (const item of result.items) {
            const key = normalizeKey(item.key);

            if (!key || !isImageKey(key) || isHiddenOrThumbKey(key)) continue;

            await upsertMediaAsset({
                key,
                sizeBytes: item.sizeBytes,
                etag: item.etag,
                lastModified: item.lastModified,
            });

            count += 1;
        }

        continuationToken = result.nextCursor ?? undefined;
    } while (continuationToken);

    return { root, count };
}

export async function syncMediaIndexByProfile(profile: MediaProfile) {
    return syncMediaIndexByPrefix(getProfileRoot(profile));
}
function parseCursor(cursor?: string | null) {
    if (!cursor) return null;

    const [lastModifiedRaw, id] = cursor.split("|");
    const lastModified = lastModifiedRaw ? new Date(lastModifiedRaw) : null;

    if (!lastModified || Number.isNaN(lastModified.getTime()) || !id) {
        return null;
    }

    return { lastModified, id };
}

export async function browseMediaIndex(input: {
    prefix: string;
    limit: number;
    cursor?: string | null;
}) {
    const prefix = normalizeKey(input.prefix);
    const limit = Math.min(Math.max(input.limit, 12), 96);
    const parsedCursor = parseCursor(input.cursor);
    const totalCount = await prisma.mediaAsset.count({
        where: {
            parentPrefix: prefix,
        },
    });
    const cursorWhere = parsedCursor
        ? {
            OR: [
                {
                    lastModified: {
                        lt: parsedCursor.lastModified,
                    },
                },
                {
                    lastModified: parsedCursor.lastModified,
                    id: {
                        lt: parsedCursor.id,
                    },
                },
            ],
        }
        : {};

    const files = await prisma.mediaAsset.findMany({
        where: {
            parentPrefix: prefix,
            ...cursorWhere,
        },
        orderBy: [
            { lastModified: "desc" },
            { id: "desc" },
        ],
        take: limit + 1,
    });

    const rows = files.slice(0, limit);
    const nextRow = files.length > limit ? files[limit] : null;

    return {
        folders: [], // giữ nguyên logic cũ của bạn nếu có
        totalCount,
        files: rows.map((item) => ({
            key: item.key,
            url: `/api/media/sign?key=${encodeURIComponent(item.key)}`,
            lastModified: item.lastModified,
        })),
        nextCursor: nextRow
            ? `${nextRow.lastModified?.toISOString()}|${nextRow.id}`
            : null,
        hasMore: Boolean(nextRow),
    };
}

export async function moveMediaAssetIndex(input: {
    fromKey: string;
    toKey: string;
    deleteSource?: boolean;
}) {
    const fromKey = normalizeKey(input.fromKey);
    const toKey = normalizeKey(input.toKey);

    const existing = await prisma.mediaAsset.findUnique({
        where: { key: fromKey },
    });

    await upsertMediaAsset({
        key: toKey,
        sizeBytes: existing?.sizeBytes ?? null,
        etag: existing?.etag ?? null,
        lastModified: new Date(),
    });

    if (input.deleteSource) {
        await deleteMediaAsset(fromKey);
    }
}
