// src/domains/media/server/nas-media.service.ts

import type { StoredMediaListItem } from "@/domains/media/storage";
import { mediaStorage } from "@/domains/media/storage";
import { executeMediaMove } from "@/domains/media/application";
import { prisma } from "@/server/db/client";
import {
    type MediaProfile,
    getProfileRoot,
    normalizeKey,
    sanitizeBrowsePrefix,
} from "@/server/lib/product-image-storage";

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

export type NasMediaFile = {
    key: string;
    fileKey: string;
    name: string;
    sizeBytes: number | null;
    etag?: string | null;
    lastModified: number;
    lastModifiedDate?: Date | null;
    url: string;
};

export type NasMediaFolder = {
    prefix: string;
    name: string;
};

export function resolveMediaProfile(value?: string | null): MediaProfile {
    if (value === "edit") return "edit";
    if (value === "cover") return "cover";
    if (value === "sold") return "sold";
    if (value === "storefront-active") return "storefront-active";
    if (value === "storefront-chosen") return "storefront-chosen";

    return "inline";
}

function nameFromKey(key: string) {
    const normalized = normalizeKey(key);
    const parts = normalized.split("/");

    return parts[parts.length - 1] || "";
}

function shouldHideName(name: string) {
    return (
        !name ||
        name.startsWith("@") ||
        name.startsWith(".") ||
        name === "Thumbs.db"
    );
}

function toNasFile(item: StoredMediaListItem): NasMediaFile | null {
    const key = normalizeKey(item.key);

    if (!key) return null;
    if (!IMAGE_EXT_RE.test(key)) return null;
    if (shouldHideName(nameFromKey(key))) return null;

    const lastModifiedDate = item.lastModified ?? null;

    return {
        key,
        fileKey: key,
        name: nameFromKey(key),
        sizeBytes: item.sizeBytes,
        etag: item.etag,
        lastModified: lastModifiedDate?.getTime() ?? 0,
        lastModifiedDate,
        url: `/api/media/sign?key=${encodeURIComponent(key)}`,
    };
}

export async function browseMediaFolder(input: {
    profile?: MediaProfile | string | null;
    segment?: string | null;
    prefix?: string | null;
    maxKeys?: number;
    continuationToken?: string | null;
}) {
    const profile = resolveMediaProfile(String(input.profile ?? "inline"));
    const segment =
        input.segment === "WOMEN" || input.segment === "UNISEX"
            ? input.segment
            : input.segment === "MEN"
              ? "MEN"
              : null;
    const root = normalizeKey(getProfileRoot(profile, segment));
    const prefix = sanitizeBrowsePrefix(input.prefix ?? null, profile, segment) || root;
    const maxKeys = Math.min(Math.max(Number(input.maxKeys ?? 1000), 1), 1000);

    const result = await mediaStorage.list({
        prefix: prefix ? `${prefix}/` : undefined,
        delimiter: "/",
        maxKeys,
        cursor: input.continuationToken,
    });

    const recyclePrefix = recycleRoot(profile, segment);
    const browsingRecycle =
        prefix === recyclePrefix || prefix.startsWith(`${recyclePrefix}/`);
    const folders: NasMediaFolder[] = result.prefixes
        .map((item) => normalizeKey(item))
        .filter(Boolean)
        .filter((item) => item !== prefix)
        .filter((item) => !shouldHideName(nameFromKey(item)))
        .filter((item) => browsingRecycle || item !== recyclePrefix)
        .map((item) => ({
            prefix: item,
            name: nameFromKey(item),
        }))
        .sort((a, b) => b.prefix.localeCompare(a.prefix));

    const dedup = new Set<string>();

    const files = result.items
        .map(toNasFile)
        .filter((item): item is NasMediaFile => Boolean(item))
        .filter((item) => item.key !== prefix && item.key !== `${prefix}/`)
        .filter((item) => {
            if (dedup.has(item.key)) return false;
            dedup.add(item.key);
            return true;
        })
        .sort((a, b) => b.lastModified - a.lastModified)
        .map((item) => ({
            key: item.key,
            fileKey: item.fileKey,
            name: item.name,
            sizeBytes: item.sizeBytes,
            lastModified: item.lastModified,
            url: item.url,
        }));

    return {
        success: true,
        profile,
        root,
        prefix,
        folders,
        files,
        total: files.length,
        nextCursor: result.nextCursor,
        nextToken: result.nextCursor,
        hasMore: result.truncated,
        truncated: result.truncated,
    };
}

export async function signMediaUrl(input: {
    key: string;
    expiresIn?: number;
}) {
    const key = normalizeKey(input.key);

    if (!key) {
        throw new Error("Thiếu key.");
    }

    const url = await mediaStorage.sign(key, input.expiresIn ?? 60 * 10);

    return {
        key,
        url,
    };
}

export async function moveMediaFile(input: {
    fromKey: string;
    toKey: string;
}) {
    const fromKey = normalizeKey(input.fromKey);
    const toKey = normalizeKey(input.toKey);

    if (!fromKey) {
        throw new Error("Thiếu fromKey.");
    }

    if (!toKey) {
        throw new Error("Thiếu toKey.");
    }

    if (fromKey === toKey) {
        return {
            success: true,
            fromKey,
            toKey,
        };
    }

    await executeMediaMove({
        idempotencyKey: `legacy-move:${fromKey}:${toKey}`,
        sourceKey: fromKey,
        destinationKey: toKey,
        deleteSource: true,
    });

    return {
        success: true,
        fromKey,
        toKey,
    };
}

export async function organizeActiveLooseNasFiles(input: {
    dryRun?: boolean;
    maxFiles?: number;
} = {}) {
    void input;
    throw new Error(
        "organizeActiveLooseNasFiles is not implemented for the current NAS media service.",
    );
}

type MediaSegment = "MEN" | "WOMEN" | "UNISEX" | null;

function recycleRoot(profile: MediaProfile, segment: MediaSegment) {
    return normalizeKey(`${getProfileRoot(profile, segment)}/recycle`);
}

function assertKeyInsideRoot(key: string, root: string) {
    if (key !== root && !key.startsWith(`${root}/`)) {
        throw new Error(`Media key nằm ngoài thư mục được phép: ${key}`);
    }
}

async function assertMediaCanBeRecycled(key: string) {
    const [productImage, mediaObject] = await Promise.all([
        prisma.productImage.findFirst({
            where: { fileKey: key },
            select: { id: true },
        }),
        prisma.mediaObject.findUnique({
            where: { storageKey: key },
            select: {
                id: true,
                _count: { select: { bindings: true } },
            },
        }),
    ]);
    if (productImage) {
        throw new Error("Ảnh đang được sử dụng trong Gallery/INLINE.");
    }
    if (mediaObject?._count.bindings) {
        throw new Error("Ảnh đang có Media Core binding.");
    }
    return mediaObject?.id ?? null;
}

export async function recycleMediaFiles(input: {
    profile?: MediaProfile | string | null;
    segment?: string | null;
    keys: string[];
    commandId: string;
    requestedByUserId?: string | null;
}) {
    const profile = resolveMediaProfile(String(input.profile ?? "inline"));
    const segment =
        input.segment === "WOMEN" || input.segment === "UNISEX"
            ? input.segment
            : input.segment === "MEN"
              ? "MEN"
              : null;
    const root = normalizeKey(getProfileRoot(profile, segment));
    const targetRoot = recycleRoot(profile, segment);
    const commandId = String(input.commandId ?? "").trim();
    if (!commandId) throw new Error("Thiếu commandId.");

    const results = [];
    for (const rawKey of [...new Set(input.keys)]) {
        const sourceKey = normalizeKey(rawKey);
        try {
            assertKeyInsideRoot(sourceKey, root);
            if (sourceKey === targetRoot || sourceKey.startsWith(`${targetRoot}/`)) {
                throw new Error("Ảnh đã nằm trong Recycle.");
            }
            const mediaObjectId = await assertMediaCanBeRecycled(sourceKey);
            const relativeKey = sourceKey.slice(root.length).replace(/^\/+/, "");
            const destinationKey = normalizeKey(`${targetRoot}/${relativeKey}`);
            if (await mediaStorage.stat(destinationKey)) {
                throw new Error("Recycle đã có file cùng đường dẫn.");
            }
            await executeMediaMove({
                idempotencyKey: `manual-recycle:${commandId}:${sourceKey}`,
                mediaObjectId,
                sourceKey,
                destinationKey,
                deleteSource: true,
                requestedByUserId: input.requestedByUserId ?? null,
            });
            await prisma.mediaAsset.updateMany({
                where: { key: sourceKey },
                data: {
                    key: destinationKey,
                    parentPrefix: destinationKey.split("/").slice(0, -1).join("/"),
                    status: "ARCHIVED",
                    movedFromKey: sourceKey,
                },
            });
            results.push({ key: sourceKey, destinationKey, ok: true as const });
        } catch (error) {
            results.push({
                key: sourceKey,
                ok: false as const,
                error: error instanceof Error ? error.message : "Không thể đưa ảnh vào Recycle.",
            });
        }
    }
    return {
        results,
        moved: results.filter((item) => item.ok).length,
        failed: results.filter((item) => !item.ok).length,
    };
}

export async function restoreRecycledMediaFiles(input: {
    profile?: MediaProfile | string | null;
    segment?: string | null;
    keys: string[];
    commandId: string;
    requestedByUserId?: string | null;
}) {
    const profile = resolveMediaProfile(String(input.profile ?? "inline"));
    const segment =
        input.segment === "WOMEN" || input.segment === "UNISEX"
            ? input.segment
            : input.segment === "MEN"
              ? "MEN"
              : null;
    const root = normalizeKey(getProfileRoot(profile, segment));
    const sourceRoot = recycleRoot(profile, segment);
    const commandId = String(input.commandId ?? "").trim();
    if (!commandId) throw new Error("Thiếu commandId.");

    const results = [];
    for (const rawKey of [...new Set(input.keys)]) {
        const sourceKey = normalizeKey(rawKey);
        try {
            assertKeyInsideRoot(sourceKey, sourceRoot);
            const relativeKey = sourceKey.slice(sourceRoot.length).replace(/^\/+/, "");
            const destinationKey = normalizeKey(`${root}/${relativeKey}`);
            if (await mediaStorage.stat(destinationKey)) {
                throw new Error("Thư viện đã có file tại đường dẫn khôi phục.");
            }
            const mediaObject = await prisma.mediaObject.findUnique({
                where: { storageKey: sourceKey },
                select: { id: true },
            });
            await executeMediaMove({
                idempotencyKey: `manual-restore:${commandId}:${sourceKey}`,
                mediaObjectId: mediaObject?.id ?? null,
                sourceKey,
                destinationKey,
                deleteSource: true,
                requestedByUserId: input.requestedByUserId ?? null,
            });
            await prisma.mediaAsset.updateMany({
                where: { key: sourceKey },
                data: {
                    key: destinationKey,
                    parentPrefix: destinationKey.split("/").slice(0, -1).join("/"),
                    status: "ACTIVE",
                    movedFromKey: sourceKey,
                },
            });
            results.push({ key: sourceKey, destinationKey, ok: true as const });
        } catch (error) {
            results.push({
                key: sourceKey,
                ok: false as const,
                error: error instanceof Error ? error.message : "Không thể khôi phục ảnh.",
            });
        }
    }
    return {
        results,
        moved: results.filter((item) => item.ok).length,
        failed: results.filter((item) => !item.ok).length,
    };
}
