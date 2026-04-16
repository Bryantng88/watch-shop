import {
    CopyObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";
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
    const normalized = normalizeKey(key);
    if (!normalized) return false;

    try {
        await s3.send(
            new HeadObjectCommand({
                Bucket: S3_BUCKET,
                Key: normalized,
            })
        );
        return true;
    } catch (error: any) {
        const statusCode = error?.$metadata?.httpStatusCode;
        const errorName = error?.name;

        if (statusCode === 404 || errorName === "NotFound" || errorName === "NoSuchKey") {
            return false;
        }

        throw error;
    }
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

    await s3.send(
        new CopyObjectCommand({
            Bucket: S3_BUCKET,
            Key: targetKey,
            CopySource: `${S3_BUCKET}/${sourceKey}`,
        })
    );

    const shouldDeleteSource = input.deleteSource !== false;
    if (shouldDeleteSource) {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: sourceKey,
            })
        );
    }

    return {
        key: targetKey,
        fromKey: sourceKey,
        copied: true,
        deleted: shouldDeleteSource,
    };
}
