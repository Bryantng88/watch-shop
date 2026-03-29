
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ImageRole } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";

export type MediaProfile = "inline" | "edit" | "sold";

type ArchiveProductImagesForSoldOptions = {
    deleteSource?: boolean;
};

function trimSlashes(input: string) {
    return String(input ?? "").replace(/^\/+|\/+$/g, "").trim();
}

function getBooleanEnv(value: string | undefined, fallback = false) {
    if (value == null) return fallback;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return fallback;
    return ["1", "true", "yes", "y", "on"].includes(normalized);
}

function getFileExtension(key: string) {
    const normalized = normalizeKey(key);
    const extMatch = normalized.match(/\.[A-Za-z0-9]+$/);
    return extMatch?.[0]?.toLowerCase() || ".webp";
}

function encodeCopySource(key: string) {
    return `${S3_BUCKET}/${normalizeKey(key)
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/")}`;
}

function buildSoldObjectKey(productId: string, sourceKey: string, index: number, role?: string | null, now = new Date()) {
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const ext = getFileExtension(sourceKey);
    const rolePart = String(role ?? "image")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "image";

    return `${PRODUCT_SOLD_PREFIX}/${year}/${month}/${productId}-${String(index).padStart(2, "0")}-${rolePart}${ext}`;
}

export function normalizeKey(input: string | null | undefined) {
    return String(input ?? "").replace(/^\/+/, "").trim();
}

export function normalizePrefix(input: string | null | undefined, fallback: string) {
    const trimmed = trimSlashes(input);
    return trimmed || trimSlashes(fallback);
}

export const PRODUCT_INLINE_PREFIX = normalizePrefix(
    process.env.PRODUCT_INLINE_PREFIX,
    "products/inline/active"
);

export const PRODUCT_INLINE_CHOSEN_PREFIX = normalizePrefix(
    process.env.PRODUCT_INLINE_CHOSEN_PREFIX,
    PRODUCT_INLINE_PREFIX.replace(/\/active$/i, "/chosen")
);

export const PRODUCT_EDIT_PREFIX = normalizePrefix(
    process.env.PRODUCT_EDIT_PREFIX,
    "products/edit/active"
);

export const PRODUCT_SOLD_PREFIX = normalizePrefix(
    process.env.PRODUCT_SOLD_PREFIX,
    "products/sold"
);

export const S3_BROWSE_ROOT = normalizePrefix(
    process.env.S3_BROWSE_ROOT,
    "products"
);

export function getProfileRoot(profile: MediaProfile) {
    switch (profile) {
        case "inline":
            return PRODUCT_INLINE_PREFIX;
        case "edit":
            return PRODUCT_EDIT_PREFIX;
        case "sold":
            return PRODUCT_SOLD_PREFIX;
        default:
            return S3_BROWSE_ROOT;
    }
}

export function isWithinPrefix(key: string, prefix: string) {
    const normalizedKey = normalizeKey(key);
    const normalizedPrefix = trimSlashes(prefix);
    if (!normalizedKey || !normalizedPrefix) return false;
    return normalizedKey === normalizedPrefix || normalizedKey.startsWith(`${normalizedPrefix}/`);
}

export function sanitizeBrowsePrefix(requestedPrefix: string | null | undefined, profile: MediaProfile) {
    const root = getProfileRoot(profile);
    const requested = normalizeKey(requestedPrefix);
    if (!requested) return root;
    return isWithinPrefix(requested, root) ? requested : root;
}

function getFileNameFromKey(key: string) {
    const normalized = normalizeKey(key);
    const parts = normalized.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
}

export function buildInlineChosenKey(productId: string, sourceKey: string) {
    const normalizedSource = normalizeKey(sourceKey);
    const fileName = getFileNameFromKey(normalizedSource);
    const fallbackExtMatch = normalizedSource.match(/\.[A-Za-z0-9]+$/);
    const fallbackExt = fallbackExtMatch?.[0]?.toLowerCase() || ".webp";
    const storedName = fileName || `${productId}${fallbackExt}`;
    return `${PRODUCT_INLINE_CHOSEN_PREFIX}/${productId}__${storedName}`;
}

export function buildInlineActiveKeyFromChosen(chosenKey: string) {
    const normalized = normalizeKey(chosenKey);
    const fileName = getFileNameFromKey(normalized);
    const delimiterIndex = fileName.indexOf("__");
    const restoredFileName = delimiterIndex >= 0 ? fileName.slice(delimiterIndex + 2) : fileName;
    return `${PRODUCT_INLINE_PREFIX}/${restoredFileName || fileName}`;
}

export async function moveMediaObject(sourceKey: string, destinationKey: string) {
    const fromKey = normalizeKey(sourceKey);
    const toKey = normalizeKey(destinationKey);

    if (!fromKey || !toKey || fromKey === toKey) {
        return { ok: true, fromKey, toKey, skipped: true };
    }

    await s3.send(
        new CopyObjectCommand({
            Bucket: S3_BUCKET,
            CopySource: encodeCopySource(fromKey),
            Key: toKey,
        })
    );

    await s3.send(
        new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: fromKey,
        })
    );

    return { ok: true, fromKey, toKey, skipped: false };
}

export function toStoredProductImageKey(input: string | null | undefined) {
    return normalizeKey(input);
}

export async function archiveProductImagesForSold(
    productId: string,
    options: ArchiveProductImagesForSoldOptions = {}
) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            primaryImageUrl: true,
            image: {
                select: {
                    id: true,
                    fileKey: true,
                    role: true,
                    sortOrder: true,
                    createdAt: true,
                },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
        },
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const deleteSource = options.deleteSource ?? getBooleanEnv(process.env.PRODUCT_IMAGE_ARCHIVE_DELETE_SOURCE, false);

    const targets = [
        ...(product.primaryImageUrl
            ? [
                {
                    kind: "primaryImageUrl" as const,
                    sourceKey: normalizeKey(product.primaryImageUrl),
                    role: ImageRole.PRIMARY,
                    order: -1,
                },
            ]
            : []),
        ...product.image
            .map((img) => ({
                kind: "productImage" as const,
                id: img.id,
                sourceKey: normalizeKey(img.fileKey),
                role: img.role,
                order: img.sortOrder ?? 0,
            }))
            .filter((img) => !!img.sourceKey),
    ];

    const uniqueTargets: Array<{ sourceKey: string; role: string; order: number }> = [];
    const seen = new Set<string>();

    for (const target of targets) {
        if (!target.sourceKey || seen.has(target.sourceKey)) continue;
        seen.add(target.sourceKey);
        uniqueTargets.push({
            sourceKey: target.sourceKey,
            role: String(target.role ?? ImageRole.GALLERY),
            order: target.order,
        });
    }

    const now = new Date();
    const keyMap = new Map<string, string>();
    const copied: Array<{ from: string; to: string; role: string }> = [];
    const skipped: string[] = [];
    let soldIndex = 1;

    for (const target of uniqueTargets) {
        if (isWithinPrefix(target.sourceKey, PRODUCT_SOLD_PREFIX)) {
            keyMap.set(target.sourceKey, target.sourceKey);
            skipped.push(target.sourceKey);
            continue;
        }

        const destinationKey = buildSoldObjectKey(productId, target.sourceKey, soldIndex, target.role, now);
        soldIndex += 1;

        await s3.send(
            new CopyObjectCommand({
                Bucket: S3_BUCKET,
                CopySource: encodeCopySource(target.sourceKey),
                Key: destinationKey,
            })
        );

        if (deleteSource && destinationKey !== target.sourceKey) {
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: target.sourceKey,
                })
            );
        }

        keyMap.set(target.sourceKey, destinationKey);
        copied.push({
            from: target.sourceKey,
            to: destinationKey,
            role: target.role,
        });
    }

    const currentPrimaryImageUrl = normalizeKey(product.primaryImageUrl);
    const nextPrimaryImageUrl = currentPrimaryImageUrl
        ? keyMap.get(currentPrimaryImageUrl) ?? currentPrimaryImageUrl
        : null;

    await prisma.$transaction(async (tx) => {
        if (product.primaryImageUrl !== undefined && nextPrimaryImageUrl !== currentPrimaryImageUrl) {
            await tx.product.update({
                where: { id: productId },
                data: { primaryImageUrl: nextPrimaryImageUrl },
            });
        }

        for (const img of product.image) {
            const sourceKey = normalizeKey(img.fileKey);
            const nextKey = keyMap.get(sourceKey) ?? sourceKey;
            if (!nextKey || nextKey === sourceKey) continue;

            await tx.productImage.update({
                where: { id: img.id },
                data: { fileKey: nextKey },
            });
        }
    });

    return {
        ok: true,
        productId,
        deleteSource,
        copiedCount: copied.length,
        skippedCount: skipped.length,
        primaryImageUrl: nextPrimaryImageUrl,
        copied,
        skipped,
    };
}
