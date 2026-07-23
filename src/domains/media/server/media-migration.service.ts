// src/domains/media/server/media-migration.service.ts

import type { StoredMediaListItem } from "@/domains/media/storage";
import { mediaStorage } from "@/domains/media/storage";
import { prisma } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/product-image-storage";

import {
    moveMediaFile,
    type NasMediaFile,
} from "./nas-media.service";

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

const ACTIVE_EDIT_ROOT = "products/edit/active";
const EDIT_CHOSEN_ROOT = "products/edit/chosen";
const INLINE_CHOSEN_ROOT = "products/inline/chosen";

const ORGANIZED_CHOSEN_RE =
    /^products\/(edit|inline)\/chosen\/watch\/[^/]+\/(gallery|inline|cover|thumb)\//;

function nameFromKey(key: string) {
    const normalized = normalizeKey(key);
    const parts = normalized.split("/");

    return parts[parts.length - 1] || "";
}

function parentPrefixFromKey(key: string) {
    const clean = normalizeKey(key);
    const parts = clean.split("/");
    parts.pop();

    return parts.join("/");
}

function toIsoDate(date: Date | null | undefined) {
    const value =
        date instanceof Date && !Number.isNaN(date.getTime())
            ? date
            : new Date();

    return value.toISOString().slice(0, 10);
}

function getExtFromName(fileName: string) {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() ?? null : null;
}

function toNasFile(item: StoredMediaListItem): NasMediaFile | null {
    const key = normalizeKey(item.key);

    if (!key) return null;
    if (!IMAGE_EXT_RE.test(key)) return null;

    const lastModifiedDate = item.lastModified;

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

function getBatchPrefix(file: NasMediaFile) {
    const date = toIsoDate(file.lastModifiedDate ?? new Date());
    return `${ACTIVE_EDIT_ROOT}/${date}/batch-001`;
}

function getChosenRoot(role?: string | null) {
    if (role === "INLINE") {
        return INLINE_CHOSEN_ROOT;
    }

    return EDIT_CHOSEN_ROOT;
}

function roleFolderFromRole(role?: string | null) {
    if (role === "INLINE") return "inline";
    if (role === "COVER") return "cover";
    if (role === "THUMB") return "thumb";

    return "gallery";
}

function isFlatChosenImage(key: string) {
    const normalized = normalizeKey(key);
    const parentPrefix = parentPrefixFromKey(normalized);

    const isFlatEditChosen = parentPrefix === EDIT_CHOSEN_ROOT;
    const isFlatInlineChosen = parentPrefix === INLINE_CHOSEN_ROOT;

    return (
        (isFlatEditChosen || isFlatInlineChosen) &&
        IMAGE_EXT_RE.test(normalized) &&
        !ORGANIZED_CHOSEN_RE.test(normalized)
    );
}

async function listAllRootActiveFiles() {
    const files: NasMediaFile[] = [];
    let continuationToken: string | undefined;

    do {
        const result = await mediaStorage.list({
            prefix: `${ACTIVE_EDIT_ROOT}/`,
            delimiter: "/",
            maxKeys: 1000,
            cursor: continuationToken,
        });

        for (const item of result.items) {
            const file = toNasFile(item);
            if (!file) continue;

            // Chỉ gom ảnh nằm trực tiếp trong products/edit/active.
            if (parentPrefixFromKey(file.key) !== ACTIVE_EDIT_ROOT) continue;

            files.push(file);
        }

        continuationToken = result.nextCursor ?? undefined;
    } while (continuationToken);

    return files;
}

async function listAllFlatChosenFiles() {
    const files: NasMediaFile[] = [];
    const roots = [EDIT_CHOSEN_ROOT, INLINE_CHOSEN_ROOT];

    for (const root of roots) {
        let continuationToken: string | undefined;

        do {
            const result = await mediaStorage.list({
                prefix: `${root}/`,
                delimiter: "/",
                maxKeys: 1000,
                cursor: continuationToken,
            });

            for (const item of result.items) {
                const file = toNasFile(item);
                if (!file) continue;
                if (!isFlatChosenImage(file.key)) continue;

                files.push(file);
            }

            continuationToken = result.nextCursor ?? undefined;
        } while (continuationToken);
    }

    return files;
}

export async function organizeActiveMedia() {
    const looseFiles = await listAllRootActiveFiles();

    const attachedKeys = new Set(
        (
            await prisma.productImage.findMany({
                where: {
                    fileKey: {
                        in: looseFiles.map((file) => file.key),
                    },
                },
                select: {
                    fileKey: true,
                },
            })
        ).map((item) => item.fileKey)
    );

    let moved = 0;
    let skipped = 0;
    const errors: Array<{ key: string; message: string }> = [];

    for (const file of looseFiles) {
        const batchPrefix = getBatchPrefix(file);
        const toKey = `${batchPrefix}/${file.name}`;

        if (!file.key || file.key === toKey) {
            skipped += 1;
            continue;
        }

        // Không move ảnh đang được ProductImage trỏ tới, tránh vỡ detail/list.
        if (attachedKeys.has(file.key)) {
            skipped += 1;
            continue;
        }

        try {
            await moveMediaFile({
                fromKey: file.key,
                toKey,
            });

            await prisma.mediaAsset.upsert({
                where: {
                    key: toKey,
                },
                create: {
                    key: toKey,
                    parentPrefix: batchPrefix,
                    fileName: file.name,
                    ext: getExtFromName(file.name),
                    sizeBytes: file.sizeBytes,
                    etag: file.etag ?? null,
                    lastModified: file.lastModifiedDate ?? null,
                    profile: "edit",
                    status: "ACTIVE",
                    isMissing: false,
                    missingAt: null,
                    lastSeenAt: new Date(),
                    movedFromKey: file.key,
                },
                update: {
                    parentPrefix: batchPrefix,
                    fileName: file.name,
                    ext: getExtFromName(file.name),
                    sizeBytes: file.sizeBytes,
                    etag: file.etag ?? null,
                    lastModified: file.lastModifiedDate ?? null,
                    profile: "edit",
                    status: "ACTIVE",
                    isMissing: false,
                    missingAt: null,
                    lastSeenAt: new Date(),
                    movedFromKey: file.key,
                },
            });

            await prisma.mediaAsset.updateMany({
                where: {
                    key: file.key,
                },
                data: {
                    status: "MISSING",
                    isMissing: true,
                    missingAt: new Date(),
                },
            });

            moved += 1;
        } catch (error) {
            errors.push({
                key: file.key,
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể move file.",
            });
        }
    }

    return {
        scanned: looseFiles.length,
        moved,
        skipped,
        errorCount: errors.length,
        errors,
    };
}
export async function moveMediaToWatchPool(input: {
    fromKey: string;
    productId: string;
}) {
    const fromKey = normalizeKey(input.fromKey);
    const fileName = nameFromKey(fromKey);

    const targetPrefix = `products/edit/chosen/watch/${input.productId}/pool`;
    const toKey = `${targetPrefix}/${fileName}`;

    if (fromKey === toKey) {
        return {
            key: toKey,
            fileKey: toKey,
            name: fileName,
            url: `/api/media/sign?key=${encodeURIComponent(toKey)}`,
        };
    }

    await moveMediaFile({
        fromKey,
        toKey,
    });

    await prisma.mediaAsset.upsert({
        where: { key: toKey },
        create: {
            key: toKey,
            parentPrefix: targetPrefix,
            fileName,
            ext: getExtFromName(fileName),
            profile: "edit",
            status: "CHOSEN",
            productId: input.productId,
            role: "GALLERY",
            isMissing: false,
            missingAt: null,
            lastSeenAt: new Date(),
            movedFromKey: fromKey,
        },
        update: {
            parentPrefix: targetPrefix,
            fileName,
            ext: getExtFromName(fileName),
            profile: "edit",
            status: "CHOSEN",
            productId: input.productId,
            role: "GALLERY",
            isMissing: false,
            missingAt: null,
            lastSeenAt: new Date(),
            movedFromKey: fromKey,
        },
    });

    await prisma.mediaAsset.updateMany({
        where: { key: fromKey },
        data: {
            status: "MISSING",
            isMissing: true,
            missingAt: new Date(),
        },
    });

    return {
        key: toKey,
        fileKey: toKey,
        name: fileName,
        url: `/api/media/sign?key=${encodeURIComponent(toKey)}`,
    };
}
export async function moveMediaToChosen(input: {
    fromKey: string;
    productId?: string | null;
    role?: string | null;
}) {
    const fromKey = normalizeKey(input.fromKey);
    const fileName = nameFromKey(fromKey);
    const chosenRoot = getChosenRoot(input.role);
    const roleFolder = roleFolderFromRole(input.role);

    const targetPrefix = input.productId
        ? `${chosenRoot}/watch/${input.productId}/${roleFolder}`
        : `${chosenRoot}/unassigned`;

    const toKey = `${targetPrefix}/${fileName}`;

    await moveMediaFile({
        fromKey,
        toKey,
    });

    await prisma.mediaAsset.upsert({
        where: {
            key: toKey,
        },
        create: {
            key: toKey,
            parentPrefix: targetPrefix,
            fileName,
            ext: getExtFromName(fileName),
            profile: input.role === "INLINE" ? "inline" : "edit",
            status: "CHOSEN",
            productId: input.productId ?? null,
            role: input.role === "INLINE" ? "INLINE" : "GALLERY",
            isMissing: false,
            missingAt: null,
            lastSeenAt: new Date(),
            movedFromKey: fromKey,
        },
        update: {
            parentPrefix: targetPrefix,
            fileName,
            ext: getExtFromName(fileName),
            profile: input.role === "INLINE" ? "inline" : "edit",
            status: "CHOSEN",
            productId: input.productId ?? null,
            role: input.role === "INLINE" ? "INLINE" : "GALLERY",
            isMissing: false,
            missingAt: null,
            lastSeenAt: new Date(),
            movedFromKey: fromKey,
        },
    });

    await prisma.mediaAsset.updateMany({
        where: {
            key: fromKey,
        },
        data: {
            status: "MISSING",
            isMissing: true,
            missingAt: new Date(),
        },
    });

    return {
        key: toKey,
        fileKey: toKey,
        name: fileName,
        url: `/api/media/sign?key=${encodeURIComponent(toKey)}`,
    };
}

export async function migrateChosenMedia(input?: {
    dryRun?: boolean;
}) {
    const dryRun = Boolean(input?.dryRun);

    const productImages = await prisma.productImage.findMany({
        where: {
            OR: [
                {
                    fileKey: {
                        startsWith: "products/edit/chosen/",
                    },
                },
                {
                    fileKey: {
                        startsWith: "products/inline/chosen/",
                    },
                },
            ],
            NOT: {
                OR: [
                    {
                        fileKey: {
                            startsWith: "products/edit/chosen/watch/",
                        },
                    },
                    {
                        fileKey: {
                            startsWith: "products/inline/chosen/watch/",
                        },
                    },
                ],
            },
        },
        select: {
            id: true,
            productId: true,
            fileKey: true,
            role: true,
            sortOrder: true,
        },
    });

    let moved = 0;
    let skipped = 0;

    const errors: Array<{ key: string; message: string }> = [];
    const items: Array<{
        id: string;
        fromKey: string;
        toKey: string;
        productId: string;
        role: string | null;
        dryRun: boolean;
    }> = [];

    for (const image of productImages) {
        const fromKey = normalizeKey(image.fileKey);
        const fileName = nameFromKey(fromKey);

        if (!fromKey || !fileName || !image.productId) {
            skipped += 1;
            continue;
        }

        const chosenRoot = getChosenRoot(image.role);
        const roleFolder = roleFolderFromRole(image.role);
        const targetPrefix = `${chosenRoot}/watch/${image.productId}/${roleFolder}`;
        const toKey = `${targetPrefix}/${fileName}`;

        if (fromKey === toKey) {
            skipped += 1;
            continue;
        }

        items.push({
            id: image.id,
            fromKey,
            toKey,
            productId: image.productId,
            role: image.role,
            dryRun,
        });

        if (dryRun) continue;

        try {
            await moveMediaFile({
                fromKey,
                toKey,
            });

            await prisma.productImage.update({
                where: {
                    id: image.id,
                },
                data: {
                    fileKey: toKey,
                    updatedAt: new Date(),
                },
            });

            await prisma.mediaAsset.upsert({
                where: {
                    key: toKey,
                },
                create: {
                    key: toKey,
                    parentPrefix: targetPrefix,
                    fileName,
                    ext: getExtFromName(fileName),
                    sizeBytes: null,
                    etag: null,
                    lastModified: null,
                    profile: image.role === "INLINE" ? "inline" : "edit",
                    status: "CHOSEN",
                    productId: image.productId,
                    role: image.role,
                    sortOrder: image.sortOrder ?? 0,
                    isMissing: false,
                    missingAt: null,
                    lastSeenAt: new Date(),
                    movedFromKey: fromKey,
                },
                update: {
                    parentPrefix: targetPrefix,
                    fileName,
                    ext: getExtFromName(fileName),
                    profile: image.role === "INLINE" ? "inline" : "edit",
                    status: "CHOSEN",
                    productId: image.productId,
                    role: image.role,
                    sortOrder: image.sortOrder ?? 0,
                    isMissing: false,
                    missingAt: null,
                    lastSeenAt: new Date(),
                    movedFromKey: fromKey,
                },
            });

            await prisma.mediaAsset.updateMany({
                where: {
                    key: fromKey,
                },
                data: {
                    status: "MISSING",
                    isMissing: true,
                    missingAt: new Date(),
                },
            });

            moved += 1;
        } catch (error) {
            errors.push({
                key: fromKey,
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể migrate chosen file.",
            });
        }
    }

    return {
        dryRun,
        scanned: productImages.length,
        matchedProductImages: productImages.length,
        moved,
        skipped,
        unassigned: 0,
        errorCount: errors.length,
        errors,
        items,
    };
}

export async function repairInlineChosenRoot(input?: { dryRun?: boolean }) {
    const dryRun = Boolean(input?.dryRun);

    const images = await prisma.productImage.findMany({
        where: {
            role: "INLINE",
            fileKey: {
                startsWith: "products/edit/chosen/watch/",
            },
        },
        select: {
            id: true,
            productId: true,
            fileKey: true,
            role: true,
            sortOrder: true,
        },
    });

    let repaired = 0;
    let skipped = 0;

    const errors: Array<{
        id: string;
        fromKey: string;
        toKey: string;
        message: string;
    }> = [];

    const items = images.map((image) => {
        const toKey = image.fileKey.replace(
            "products/edit/chosen/watch/",
            "products/inline/chosen/watch/"
        );

        return {
            id: image.id,
            productId: image.productId,
            fromKey: image.fileKey,
            toKey,
            dryRun,
        };
    });

    for (const item of items) {
        if (item.fromKey === item.toKey) {
            skipped += 1;
            continue;
        }

        if (dryRun) continue;

        try {
            await moveMediaFile({
                fromKey: item.fromKey,
                toKey: item.toKey,
            });

            const parentPrefix = parentPrefixFromKey(item.toKey);
            const fileName = nameFromKey(item.toKey);

            await prisma.productImage.update({
                where: {
                    id: item.id,
                },
                data: {
                    fileKey: item.toKey,
                    updatedAt: new Date(),
                },
            });

            await prisma.mediaAsset.upsert({
                where: {
                    key: item.toKey,
                },
                create: {
                    key: item.toKey,
                    parentPrefix,
                    fileName,
                    ext: getExtFromName(fileName),
                    profile: "inline",
                    status: "CHOSEN",
                    productId: item.productId,
                    role: "INLINE",
                    isMissing: false,
                    missingAt: null,
                    lastSeenAt: new Date(),
                    movedFromKey: item.fromKey,
                },
                update: {
                    parentPrefix,
                    fileName,
                    ext: getExtFromName(fileName),
                    profile: "inline",
                    status: "CHOSEN",
                    productId: item.productId,
                    role: "INLINE",
                    isMissing: false,
                    missingAt: null,
                    lastSeenAt: new Date(),
                    movedFromKey: item.fromKey,
                },
            });

            await prisma.mediaAsset.updateMany({
                where: {
                    key: item.fromKey,
                },
                data: {
                    status: "MISSING",
                    isMissing: true,
                    missingAt: new Date(),
                },
            });

            repaired += 1;
        } catch (error) {
            errors.push({
                id: item.id,
                fromKey: item.fromKey,
                toKey: item.toKey,
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể move inline image.",
            });
        }
    }

    return {
        dryRun,
        scanned: images.length,
        willRepair: items.length,
        repaired,
        skipped,
        errorCount: errors.length,
        errors,
        items,
    };
}
