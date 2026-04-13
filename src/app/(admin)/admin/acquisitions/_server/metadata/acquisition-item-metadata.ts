type WatchFlagsInput = {
    hasStrap?: boolean | null;
    hasClasp?: boolean | null;
    needService?: boolean | null;
};

type StrapSpecInput = {
    material?: string | null;
    lugWidthMM?: number | null;
    buckleWidthMM?: number | null;
    color?: string | null;
    quickRelease?: boolean | null;
    sellPrice?: number | null;
};

type QuickWatchSpecInput = {
    movement?: string | null;
    caseMaterial?: string | null;
    dialColor?: string | null;
    approxSizeMm?: number | null;
};

type StringifyAcquisitionItemMetaInput = {
    watchFlags?: WatchFlagsInput | null;
    strapSpec?: StrapSpecInput | null;
    quickSpec?: QuickWatchSpecInput | null;
    aiMeta?: any;
};

function normalizeBool(value: unknown, fallback?: boolean) {
    if (value == null) return fallback;
    return Boolean(value);
}

function normalizeNumber(value: unknown) {
    if (value == null || value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}

function safeJsonParse<T = any>(value?: string | null): T | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

export function stringifyAcquisitionItemMeta(input: StringifyAcquisitionItemMetaInput) {
    const watchFlags = input.watchFlags
        ? {
            hasStrap: normalizeBool(input.watchFlags.hasStrap),
            hasClasp: normalizeBool(input.watchFlags.hasClasp),
            needService: normalizeBool(input.watchFlags.needService, true),
        }
        : undefined;

    const strapSpec = input.strapSpec
        ? {
            material: input.strapSpec.material,
            lugWidthMM: normalizeNumber(input.strapSpec.lugWidthMM),
            buckleWidthMM: normalizeNumber(input.strapSpec.buckleWidthMM),
            color: input.strapSpec.color,
            quickRelease:
                input.strapSpec.quickRelease == null ? undefined : Boolean(input.strapSpec.quickRelease),
            sellPrice: normalizeNumber(input.strapSpec.sellPrice),
        }
        : undefined;

    const quickSpec = input.quickSpec
        ? {
            movement: input.quickSpec.movement,
            caseMaterial: input.quickSpec.caseMaterial,
            dialColor: input.quickSpec.dialColor,
            approxSizeMm: normalizeNumber(input.quickSpec.approxSizeMm),
        }
        : undefined;

    return JSON.stringify({
        kind: strapSpec ? "strap" : "watch",
        ...(watchFlags ? { watchFlags } : {}),
        ...(strapSpec ? { strapSpec } : {}),
        ...(quickSpec ? { quickSpec } : {}),
        ...(input.aiMeta ? { aiMeta: input.aiMeta } : {}),
    });
}

export function parseAcquisitionItemMeta(description?: string | null) {
    return safeJsonParse<Record<string, any>>(description) ?? {};
}

export function getAiMetaFromDescription(description?: string | null) {
    const parsed = parseAcquisitionItemMeta(description);
    return parsed?.aiMeta ?? {};
}

export function getWatchFlagsFromDescription(description?: string | null) {
    const parsed = parseAcquisitionItemMeta(description);
    return parsed?.watchFlags ?? null;
}

export function getStrapSpecFromDescription(description?: string | null) {
    const parsed = parseAcquisitionItemMeta(description);
    return parsed?.strapSpec ?? null;
}

export function getQuickSpecFromDescription(description?: string | null) {
    const parsed = parseAcquisitionItemMeta(description);
    return parsed?.quickSpec ?? null;
}