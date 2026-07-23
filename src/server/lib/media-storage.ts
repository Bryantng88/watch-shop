import { mediaStorage } from "@/domains/media/storage";
import { executeMediaMove } from "@/domains/media/application";
import { normalizeKey } from "@/server/lib/storage-key";

export type MoveMediaInput = {
    fromKey: string;
    toPrefix: string;
    deleteSource?: boolean;
    overwrite?: boolean;
};

export type MoveMediaResult = {
    key: string;
    fromKey: string;
    copied: boolean;
    deleted: boolean;
};

export function sanitizeMediaPrefix(input: string) {
    return normalizeKey(input).replace(/^\/+|\/+$/g, "");
}

export function getMediaBasename(key: string) {
    const normalized = normalizeKey(key);
    const parts = normalized.split("/").filter(Boolean);
    return parts[parts.length - 1] || "file";
}

export function splitMediaFilename(filename: string) {
    const idx = filename.lastIndexOf(".");
    if (idx <= 0) return { stem: filename, ext: "" };
    return {
        stem: filename.slice(0, idx),
        ext: filename.slice(idx),
    };
}

export async function mediaObjectExists(key: string) {
    return mediaStorage.exists(normalizeKey(key));
}

export async function buildAvailableMediaKey(baseKey: string) {
    const normalizedBaseKey = normalizeKey(baseKey);
    if (!(await mediaObjectExists(normalizedBaseKey))) return normalizedBaseKey;

    const filename = getMediaBasename(normalizedBaseKey);
    const parent = normalizedBaseKey.split("/").slice(0, -1).join("/");
    const { stem, ext } = splitMediaFilename(filename);

    for (let i = 1; i <= 9999; i += 1) {
        const nextKey = normalizeKey(`${parent}/${stem}-${i}${ext}`);
        if (!(await mediaObjectExists(nextKey))) return nextKey;
    }

    throw new Error("Không thể tạo tên file đích khả dụng.");
}

export async function moveMediaObject(input: MoveMediaInput): Promise<MoveMediaResult> {
    const sourceKey = normalizeKey(input.fromKey);
    const targetPrefix = sanitizeMediaPrefix(input.toPrefix);

    if (!sourceKey) throw new Error("Thiếu fromKey.");
    if (!targetPrefix) throw new Error("Thiếu toPrefix.");

    const baseName = getMediaBasename(sourceKey);
    const targetKeyBase = normalizeKey(`${targetPrefix}/${baseName}`);
    const targetKey = input.overwrite ? targetKeyBase : await buildAvailableMediaKey(targetKeyBase);

    if (sourceKey === targetKey) {
        return {
            key: targetKey,
            fromKey: sourceKey,
            copied: false,
            deleted: false,
        };
    }

    const shouldDeleteSource = input.deleteSource !== false;
    await executeMediaMove({
        idempotencyKey: `legacy-move:${sourceKey}:${targetKey}`,
        sourceKey,
        destinationKey: targetKey,
        deleteSource: shouldDeleteSource,
    });

    return {
        key: targetKey,
        fromKey: sourceKey,
        copied: sourceKey !== targetKey,
        deleted: shouldDeleteSource && sourceKey !== targetKey,
    };
}
