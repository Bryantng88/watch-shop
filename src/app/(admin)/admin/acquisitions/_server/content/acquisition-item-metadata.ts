export type QuickWatchSpec = {
    sourceText?: string | null;
    normalizedText?: string | null;

    brand?: string | null;
    brandLabel?: string | null;

    movement?: string | null;
    movementLabel?: string | null;

    caseShape?: string | null;
    caseShapeLabel?: string | null;

    dialColor?: string | null;
    dialColorLabel?: string | null;

    strapType?: string | null;
    strapTypeLabel?: string | null;

    boxIncluded?: boolean | null;
    bookletIncluded?: boolean | null;
    cardIncluded?: boolean | null;

    fullSetStatus?: string | null;
    fullSetStatusLabel?: string | null;

    caseMaterial?: string | null;
    caseMaterialLabel?: string | null;

    styleCategory?: string | null;
    styleCategoryLabel?: string | null;

    hourMarkerStyle?: string | null;
    hourMarkerStyleLabel?: string | null;

    approxSizeMm?: number | null;
    caliber?: string | null;
    reference?: string | null;
    model?: string | null;
};

export type WatchFlagsInput = {
    hasStrap?: boolean | null;
    hasClasp?: boolean | null;
    needService?: boolean | null;
};

export type StrapSpecInput = {
    material?: string | null;
    lugWidthMM?: number | null;
    buckleWidthMM?: number | null;
    color?: string | null;
    quickRelease?: boolean | null;
    sellPrice?: number | null;
};

export type AcquisitionAiMeta = {
    images?: Array<{ key?: string | null; url?: string | null }>;
    aiHint?: string | null;
    ai?: {
        extractedSpec?: any;
        generatedDraft?: any | null;
        meta?: any;
    } | null;
};

export type AcquisitionItemMeta = {
    kind?: "watch" | "strap";
    watchFlags?: WatchFlagsInput;
    strapSpec?: StrapSpecInput;
    quickSpec?: QuickWatchSpec;
    aiMeta?: AcquisitionAiMeta;
};

function normalizeBool(value: unknown, fallback?: boolean) {
    if (value == null) return fallback;
    return Boolean(value);
}

function normalizeNumber(value: unknown): number | undefined {
    if (value == null || value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}

export function parseAcquisitionItemMeta(description?: string | null): AcquisitionItemMeta {
    if (!description) return {};
    try {
        return JSON.parse(description) as AcquisitionItemMeta;
    } catch {
        return {};
    }
}

export function stringifyAcquisitionItemMeta(input: {
    watchFlags?: WatchFlagsInput | null;
    strapSpec?: StrapSpecInput | null;
    quickSpec?: QuickWatchSpec | null;
    aiMeta?: AcquisitionAiMeta | null;
}) {
    const watchFlags = input.watchFlags
        ? {
            hasStrap: normalizeBool(input.watchFlags.hasStrap),
            hasClasp: normalizeBool(input.watchFlags.hasClasp),
            needService: normalizeBool(input.watchFlags.needService, true),
        }
        : undefined;

    const strapSpec = input.strapSpec
        ? {
            material: input.strapSpec.material ?? null,
            lugWidthMM: normalizeNumber(input.strapSpec.lugWidthMM),
            buckleWidthMM: normalizeNumber(input.strapSpec.buckleWidthMM),
            color: input.strapSpec.color ?? null,
            quickRelease:
                input.strapSpec.quickRelease == null ? undefined : Boolean(input.strapSpec.quickRelease),
            sellPrice: normalizeNumber(input.strapSpec.sellPrice),
        }
        : undefined;

    const quickSpec = input.quickSpec
        ? {
            sourceText: input.quickSpec.sourceText ?? null,
            normalizedText: input.quickSpec.normalizedText ?? null,

            brand: input.quickSpec.brand ?? null,
            brandLabel: input.quickSpec.brandLabel ?? null,

            movement: input.quickSpec.movement ?? null,
            movementLabel: input.quickSpec.movementLabel ?? null,

            caseShape: input.quickSpec.caseShape ?? null,
            caseShapeLabel: input.quickSpec.caseShapeLabel ?? null,

            dialColor: input.quickSpec.dialColor ?? null,
            dialColorLabel: input.quickSpec.dialColorLabel ?? null,

            strapType: input.quickSpec.strapType ?? null,
            strapTypeLabel: input.quickSpec.strapTypeLabel ?? null,

            boxIncluded:
                input.quickSpec.boxIncluded == null ? null : Boolean(input.quickSpec.boxIncluded),
            bookletIncluded:
                input.quickSpec.bookletIncluded == null ? null : Boolean(input.quickSpec.bookletIncluded),
            cardIncluded:
                input.quickSpec.cardIncluded == null ? null : Boolean(input.quickSpec.cardIncluded),

            fullSetStatus: input.quickSpec.fullSetStatus ?? null,
            fullSetStatusLabel: input.quickSpec.fullSetStatusLabel ?? null,

            caseMaterial: input.quickSpec.caseMaterial ?? null,
            caseMaterialLabel: input.quickSpec.caseMaterialLabel ?? null,

            styleCategory: input.quickSpec.styleCategory ?? null,
            styleCategoryLabel: input.quickSpec.styleCategoryLabel ?? null,

            hourMarkerStyle: input.quickSpec.hourMarkerStyle ?? null,
            hourMarkerStyleLabel: input.quickSpec.hourMarkerStyleLabel ?? null,

            approxSizeMm:
                input.quickSpec.approxSizeMm == null
                    ? null
                    : Number(input.quickSpec.approxSizeMm),

            caliber: input.quickSpec.caliber ?? null,
            reference: input.quickSpec.reference ?? null,
            model: input.quickSpec.model ?? null,
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

export function getAiMetaFromDescription(description?: string | null) {
    return parseAcquisitionItemMeta(description)?.aiMeta ?? {};
}

export function getWatchFlagsFromDescription(description?: string | null) {
    return parseAcquisitionItemMeta(description)?.watchFlags ?? null;
}

export function getStrapSpecFromDescription(description?: string | null) {
    return parseAcquisitionItemMeta(description)?.strapSpec ?? null;
}

export function getQuickSpecFromDescription(description?: string | null) {
    return parseAcquisitionItemMeta(description)?.quickSpec ?? null;
}