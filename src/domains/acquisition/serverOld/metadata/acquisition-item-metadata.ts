type AcquisitionAiImage = {
    key?: string | null;
    url?: string | null;
};

export type AcquisitionAiMeta = {
    images?: AcquisitionAiImage[];
    aiHint?: string | null;
};

export type AcquisitionWatchFlags = {
    needService?: boolean;
};

export type AcquisitionQuickSpec = Record<string, unknown> | null | undefined;

export type AcquisitionItemMeta = {
    aiMeta?: AcquisitionAiMeta;
    watchFlags?: AcquisitionWatchFlags;
    quickSpec?: AcquisitionQuickSpec;
};

const META_PREFIX = "__ACQ_META__:";

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeAiImage(value: unknown): AcquisitionAiImage | null {
    if (!isPlainObject(value)) return null;

    const key =
        typeof value.key === "string" && value.key.trim()
            ? value.key.trim()
            : null;

    const url =
        typeof value.url === "string" && value.url.trim()
            ? value.url.trim()
            : null;

    if (!key && !url) return null;

    return { key, url };
}

function normalizeAiMeta(value: unknown): AcquisitionAiMeta | undefined {
    if (!isPlainObject(value)) return undefined;

    const rawImages = Array.isArray(value.images) ? value.images : [];
    const images = rawImages
        .map(normalizeAiImage)
        .filter((item): item is AcquisitionAiImage => Boolean(item));

    const aiHint =
        typeof value.aiHint === "string" && value.aiHint.trim()
            ? value.aiHint.trim()
            : null;

    if (!images.length && !aiHint) return undefined;

    return {
        ...(images.length ? { images } : {}),
        ...(aiHint ? { aiHint } : {}),
    };
}

function normalizeWatchFlags(value: unknown): AcquisitionWatchFlags | undefined {
    if (!isPlainObject(value)) return undefined;

    const needService =
        typeof value.needService === "boolean" ? value.needService : undefined;

    if (needService === undefined) return undefined;

    return { needService };
}

function normalizeObjectLike<T extends Record<string, unknown>>(
    value: unknown
): T | undefined {
    if (!isPlainObject(value)) return undefined;
    if (!Object.keys(value).length) return undefined;
    return value as T;
}

function normalizeMeta(input: AcquisitionItemMeta): AcquisitionItemMeta {
    const next: AcquisitionItemMeta = {};

    const aiMeta = normalizeAiMeta(input.aiMeta);
    if (aiMeta) next.aiMeta = aiMeta;

    const watchFlags = normalizeWatchFlags(input.watchFlags);
    if (watchFlags) next.watchFlags = watchFlags;

    const quickSpec = normalizeObjectLike(input.quickSpec);
    if (quickSpec) next.quickSpec = quickSpec;

    return next;
}

function extractLegacyJsonBlock(description: string): string | null {
    const trimmed = String(description ?? "").trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        return trimmed;
    }

    return null;
}

export function stringifyAcquisitionItemMeta(input: AcquisitionItemMeta): string {
    const normalized = normalizeMeta(input);

    if (!Object.keys(normalized).length) {
        return "";
    }

    return `${META_PREFIX}${JSON.stringify(normalized)}`;
}

export function parseAcquisitionItemMeta(
    description: string | null | undefined
): AcquisitionItemMeta {
    const text = String(description ?? "").trim();
    if (!text) return {};

    let rawJson = "";

    if (text.startsWith(META_PREFIX)) {
        rawJson = text.slice(META_PREFIX.length).trim();
    } else {
        const legacy = extractLegacyJsonBlock(text);
        if (!legacy) return {};
        rawJson = legacy;
    }

    try {
        const parsed = JSON.parse(rawJson);
        if (!isPlainObject(parsed)) return {};

        return normalizeMeta({
            aiMeta: parsed.aiMeta,
            watchFlags: parsed.watchFlags,
            quickSpec: parsed.quickSpec,
        });
    } catch {
        return {};
    }
}

export function getAiMetaFromDescription(
    description: string | null | undefined
): AcquisitionAiMeta | undefined {
    return parseAcquisitionItemMeta(description).aiMeta;
}

export function getWatchFlagsFromDescription(
    description: string | null | undefined
): AcquisitionWatchFlags | undefined {
    return parseAcquisitionItemMeta(description).watchFlags;
}

export function getQuickSpecFromDescription(
    description: string | null | undefined
): AcquisitionQuickSpec {
    return parseAcquisitionItemMeta(description).quickSpec;
}