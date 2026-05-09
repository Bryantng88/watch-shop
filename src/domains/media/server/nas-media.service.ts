// src/domains/media/server/nas-media.service.ts

import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3, S3_BUCKET } from "@/server/s3";

import {
    type MediaProfile,
    getProfileRoot,
    normalizeKey,
    sanitizeBrowsePrefix,
} from "@/server/lib/product-image-storage";

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

export function resolveMediaProfile(
    value?: string | null
): MediaProfile {
    if (value === "edit") return "edit";
    if (value === "sold") return "sold";
    if (value === "storefront-active")
        return "storefront-active";
    if (value === "storefront-chosen")
        return "storefront-chosen";

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

export async function browseMediaFolder(input: {
    profile?: MediaProfile | string | null;
    prefix?: string | null;
    maxKeys?: number;
}) {
    const profile = resolveMediaProfile(
        String(input.profile ?? "inline")
    );

    const root = normalizeKey(getProfileRoot(profile));

    const prefix =
        sanitizeBrowsePrefix(input.prefix ?? null, profile) ||
        root;

    const maxKeys = Math.min(
        Math.max(Number(input.maxKeys ?? 1000), 1),
        1000
    );

    const result = await s3.send(
        new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            Prefix: prefix ? `${prefix}/` : undefined,
            Delimiter: "/",
            MaxKeys: maxKeys,
        })
    );

    const folders = (result.CommonPrefixes || [])
        .map((item) => normalizeKey(item.Prefix))
        .filter(Boolean)
        .filter((item) => item !== prefix)
        .filter(
            (item) => !shouldHideName(nameFromKey(item))
        )
        .map((item) => ({
            prefix: item,
            name: nameFromKey(item),
        }))
        .sort((a, b) =>
            a.prefix.localeCompare(b.prefix)
        );

    const dedup = new Set<string>();

    const files = (result.Contents || [])
        .map((item) => ({
            key: normalizeKey(item.Key),
            sizeBytes:
                typeof item.Size === "number"
                    ? item.Size
                    : null,
            lastModified:
                item.LastModified?.getTime() ?? 0,
        }))
        .filter(
            (item) =>
                item.key &&
                item.key !== prefix &&
                item.key !== `${prefix}/`
        )
        .filter(
            (item) =>
                !shouldHideName(nameFromKey(item.key))
        )
        .filter((item) =>
            IMAGE_EXT_RE.test(item.key)
        )
        .filter((item) => {
            if (dedup.has(item.key)) return false;

            dedup.add(item.key);

            return true;
        })
        .sort(
            (a, b) =>
                b.lastModified - a.lastModified
        )
        .map((item) => ({
            key: item.key,
            fileKey: item.key,
            name: nameFromKey(item.key),
            sizeBytes: item.sizeBytes,
            lastModified: item.lastModified,
            url: `/api/media/sign?key=${encodeURIComponent(
                item.key
            )}`,
        }));

    return {
        success: true,
        profile,
        root,
        prefix,
        folders,
        files,
        total: files.length,
    };
}

export async function signMediaUrl(input: {
    key: string;
    expiresIn?: number;
}) {
    const key = normalizeKey(input.key);

    const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
        }),
        {
            expiresIn: input.expiresIn ?? 60 * 10,
        }
    );

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

    await s3.send(
        new CopyObjectCommand({
            Bucket: S3_BUCKET,
            CopySource: `${S3_BUCKET}/${fromKey}`,
            Key: toKey,
        })
    );

    await s3.send(
        new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: fromKey,
        })
    );

    return {
        success: true,
        fromKey,
        toKey,
    };
}