import {
    CopyObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";

export type MediaPurpose = "inline" | "edit" | "sold";

const INLINE_PREFIX = trimSlashes(process.env.PRODUCT_INLINE_PREFIX || "products/inline/active");
const EDIT_PREFIX = trimSlashes(process.env.PRODUCT_EDIT_PREFIX || "products/edit/active");
const SOLD_PREFIX = trimSlashes(process.env.PRODUCT_SOLD_PREFIX || "products/sold");
const DELETE_SOURCE_ON_ARCHIVE = String(process.env.PRODUCT_IMAGE_ARCHIVE_DELETE_SOURCE || "false").toLowerCase() === "true";

function trimSlashes(value: string) {
    return String(value || "").replace(/^\/+|\/+$/g, "");
}

function stripLeadingSlashes(value: string) {
    return String(value || "").replace(/^\/+/, "");
}

function normalizeKey(key?: string | null) {
    return stripLeadingSlashes(String(key || "")).replace(/\/+/g, "/");
}

function startsWithPrefix(key: string, prefix: string) {
    return key === prefix || key.startsWith(`${prefix}/`);
}

function relativeToPrefix(key: string, prefix: string) {
    if (!startsWithPrefix(key, prefix)) return key;
    return key.slice(prefix.length).replace(/^\/+/, "");
}

function joinKey(prefix: string, relative: string) {
    const cleanRelative = trimSlashes(relative);
    return cleanRelative ? `${trimSlashes(prefix)}/${cleanRelative}` : trimSlashes(prefix);
}

function currentYearMonth(date = new Date()) {
    return {
        year: String(date.getFullYear()),
        month: String(date.getMonth() + 1).padStart(2, "0"),
    };
}

function ensureRelativeForArchive(key: string) {
    if (startsWithPrefix(key, EDIT_PREFIX)) return relativeToPrefix(key, EDIT_PREFIX);
    if (startsWithPrefix(key, INLINE_PREFIX)) return relativeToPrefix(key, INLINE_PREFIX);
    if (startsWithPrefix(key, SOLD_PREFIX)) return relativeToPrefix(key, SOLD_PREFIX);
    return key;
}

export function getProductImageRoots() {
    return {
        inline: INLINE_PREFIX,
        edit: EDIT_PREFIX,
        sold: SOLD_PREFIX,
    } as const;
}

export function getBrowsePrefixForPurpose(purpose?: string | null, requestedPrefix?: string | null) {
    const resolvedPurpose = resolvePurpose(purpose);
    const roots = getProductImageRoots();
    const root = roots[resolvedPurpose];
    const cleanRequested = trimSlashes(String(requestedPrefix || ""));

    if (!cleanRequested) return root;
    if (!startsWithPrefix(cleanRequested, root)) return root;
    return cleanRequested;
}

export function resolvePurpose(purpose?: string | null): MediaPurpose {
    const raw = String(purpose || "edit").toLowerCase();
    if (raw === "inline" || raw === "sold") return raw;
    return "edit";
}

export function toStoredProductImageKey(inputKey?: string | null) {
    const key = normalizeKey(inputKey);
    if (!key) return "";
    if (startsWithPrefix(key, SOLD_PREFIX)) return key;
    if (startsWithPrefix(key, INLINE_PREFIX)) {
        return joinKey(EDIT_PREFIX, relativeToPrefix(key, INLINE_PREFIX));
    }
    return key;
}

export function toInlinePreviewKey(inputKey?: string | null) {
    const key = normalizeKey(inputKey);
    if (!key) return "";
    if (startsWithPrefix(key, SOLD_PREFIX)) return key;
    if (startsWithPrefix(key, EDIT_PREFIX)) {
        return joinKey(INLINE_PREFIX, relativeToPrefix(key, EDIT_PREFIX));
    }
    return key;
}

export function resolveKeyForPurpose(inputKey?: string | null, purpose?: string | null) {
    const resolved = resolvePurpose(purpose);
    if (resolved === "inline") return toInlinePreviewKey(inputKey);
    return normalizeKey(inputKey);
}

export function toSoldArchiveKey(inputKey: string, at = new Date()) {
    const key = normalizeKey(inputKey);
    if (!key) return "";
    if (startsWithPrefix(key, SOLD_PREFIX)) return key;
    const { year, month } = currentYearMonth(at);
    return joinKey(`${SOLD_PREFIX}/${year}/${month}`, ensureRelativeForArchive(key));
}

async function copyObject(fromKey: string, toKey: string) {
    if (!fromKey || !toKey || fromKey === toKey) return;

    const head = await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: fromKey }));
    await s3.send(
        new CopyObjectCommand({
            Bucket: S3_BUCKET,
            CopySource: `${S3_BUCKET}/${fromKey}`,
            Key: toKey,
            MetadataDirective: "REPLACE",
            ContentType: head.ContentType,
            CacheControl: head.CacheControl || "public, max-age=31536000, immutable",
            Metadata: head.Metadata,
        })
    );
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: toKey }));
}

async function deleteObject(key: string) {
    if (!key) return;
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
}

export async function archiveProductImagesForSold(
    productId: string,
    opts?: { deleteSource?: boolean; archivedAt?: Date }
) {
    const archivedAt = opts?.archivedAt || new Date();
    const deleteSource = opts?.deleteSource ?? DELETE_SOURCE_ON_ARCHIVE;

    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            status: true,
            primaryImageUrl: true,
            images: {
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                select: {
                    id: true,
                    fileKey: true,
                },
            },
        },
    });

    if (!product?.id) {
        throw new Error("Không tìm thấy sản phẩm để archive ảnh.");
    }

    const rows = (product.images || []).filter((img) => !!img.fileKey);
    if (!rows.length) {
        return {
            ok: true,
            productId,
            moved: 0,
            deleted: 0,
            primaryImageUrl: product.primaryImageUrl,
            files: [],
        };
    }

    const planned = rows.map((img) => {
        const sourceKey = toStoredProductImageKey(img.fileKey);
        const soldKey = toSoldArchiveKey(sourceKey, archivedAt);
        return {
            id: img.id,
            sourceKey,
            soldKey,
        };
    });

    for (const file of planned) {
        if (file.sourceKey !== file.soldKey) {
            await copyObject(file.sourceKey, file.soldKey);
        }
    }

    const currentPrimary = toStoredProductImageKey(product.primaryImageUrl);
    const primaryMatch = planned.find((file) => file.sourceKey === currentPrimary);
    const nextPrimary = primaryMatch?.soldKey || planned[0]?.soldKey || null;

    await prisma.$transaction(async (tx) => {
        for (const file of planned) {
            await tx.productImage.update({
                where: { id: file.id },
                data: { fileKey: file.soldKey },
            });
        }

        await tx.product.update({
            where: { id: productId },
            data: { primaryImageUrl: nextPrimary },
        });
    });

    if (deleteSource) {
        for (const file of planned) {
            if (file.sourceKey !== file.soldKey) {
                await deleteObject(file.sourceKey);
            }
        }
    }

    return {
        ok: true,
        productId,
        moved: planned.filter((file) => file.sourceKey !== file.soldKey).length,
        deleted: deleteSource ? planned.filter((file) => file.sourceKey !== file.soldKey).length : 0,
        primaryImageUrl: nextPrimary,
        files: planned,
    };
}
