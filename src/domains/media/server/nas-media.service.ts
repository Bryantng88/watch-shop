// src/domains/media/server/nas-media.service.ts

import type { StoredMediaListItem } from "@/domains/media/storage";
import { mediaStorage } from "@/domains/media/storage";
import { executeMediaMove } from "@/domains/media/application";
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

    const folders: NasMediaFolder[] = result.prefixes
        .map((item) => normalizeKey(item))
        .filter(Boolean)
        .filter((item) => item !== prefix)
        .filter((item) => !shouldHideName(nameFromKey(item)))
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
