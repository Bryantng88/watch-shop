import type { QuickWatchSpec } from "../_shared/quick-watch-rule";

export type WatchFlagsInput = {
    needService?: boolean;
};

export type StrapSpecInput = {
    material?: string;
    lugWidthMM?: number;
    buckleWidthMM?: number;
    color?: string;
    quickRelease?: boolean;
    sellPrice?: number;
};

export type AcquisitionAiMeta = {
    images?: Array<{ key?: string | null; url?: string | null }>;
    aiHint?: string | null;
    ai?: {
        extractedSpec?: any;
        generatedDraft?: any;
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

const normalizeBool = (value: unknown, fallback = false) =>
    value == null ? fallback : Boolean(value);

function normalizeNullableBool(value: unknown): boolean | null {
    return value == null ? null : Boolean(value);
}

function normalizeString(value: unknown): string | null {
    return value == null ? null : String(value);
}

function normalizeNumber(value: unknown): number | undefined {
    return value == null ? undefined : Number(value);
}

function normalizeQuickSpec(value: unknown): QuickWatchSpec | undefined {
    if (!value || typeof value !== "object") return undefined;
    const obj = value as Record<string, any>;

    return {
        sourceText: obj.sourceText != null ? String(obj.sourceText) : undefined,
        normalizedText: obj.normalizedText != null ? String(obj.normalizedText) : "",
        brand: normalizeString(obj.brand),
        brandLabel: normalizeString(obj.brandLabel),
        movement: normalizeString(obj.movement),
        movementLabel: normalizeString(obj.movementLabel),
        caseShape: normalizeString(obj.caseShape),
        caseShapeLabel: normalizeString(obj.caseShapeLabel),
        dialColor: normalizeString(obj.dialColor),
        dialColorLabel: normalizeString(obj.dialColorLabel),
        strapType: normalizeString(obj.strapType),
        strapTypeLabel: normalizeString(obj.strapTypeLabel),
        boxIncluded: normalizeNullableBool(obj.boxIncluded),
        bookletIncluded: normalizeNullableBool(obj.bookletIncluded),
        cardIncluded: normalizeNullableBool(obj.cardIncluded),
        fullSetStatus: normalizeString(obj.fullSetStatus),
        fullSetStatusLabel: normalizeString(obj.fullSetStatusLabel),
        caseMaterial: normalizeString(obj.caseMaterial),
        caseMaterialLabel: normalizeString(obj.caseMaterialLabel),
        styleCategory: normalizeString(obj.styleCategory),
        styleCategoryLabel: normalizeString(obj.styleCategoryLabel),
        hourMarkerStyle: normalizeString(obj.hourMarkerStyle),
        hourMarkerStyleLabel: normalizeString(obj.hourMarkerStyleLabel),
    };
}

function normalizeWatchFlags(value: unknown): WatchFlagsInput | undefined {
    if (!value || typeof value !== "object") return undefined;

    const obj = value as Record<string, any>;

    return {
        needService: normalizeBool(
            obj.needService ?? obj.needsService ?? obj.service ?? obj.isServiced,
            true
        ),
    };
}

function normalizeStrapSpec(value: unknown): StrapSpecInput | undefined {
    if (!value || typeof value !== "object") return undefined;

    const obj = value as Record<string, any>;

    return {
        material: obj.material != null ? String(obj.material) : undefined,
        lugWidthMM: normalizeNumber(obj.lugWidthMM),
        buckleWidthMM: normalizeNumber(obj.buckleWidthMM),
        color: obj.color != null ? String(obj.color) : undefined,
        quickRelease: obj.quickRelease == null ? undefined : Boolean(obj.quickRelease),
        sellPrice: normalizeNumber(obj.sellPrice),
    };
}

function normalizeAiMeta(value: unknown): AcquisitionAiMeta | undefined {
    if (!value || typeof value !== "object") return undefined;

    const obj = value as Record<string, any>;
    const rawImages = Array.isArray(obj.images) ? obj.images : [];
    const images = rawImages
        .map((entry) => {
            if (!entry || typeof entry !== "object") return null;
            const image = entry as Record<string, any>;
            const key = image.key == null ? null : String(image.key);
            const url = image.url == null ? null : String(image.url);
            if (!key && !url) return null;
            return { key, url };
        })
        .filter(Boolean) as Array<{ key?: string | null; url?: string | null }>;

    return {
        images,
        aiHint: obj.aiHint == null ? null : String(obj.aiHint),
        ai:
            obj.ai && typeof obj.ai === "object"
                ? {
                    extractedSpec: (obj.ai as any).extractedSpec ?? null,
                    generatedDraft: (obj.ai as any).generatedDraft ?? null,
                    meta: (obj.ai as any).meta ?? null,
                }
                : null,
    };
}

function isLegacyStrapSpecObject(obj: Record<string, any>) {
    return (
        "material" in obj ||
        "lugWidthMM" in obj ||
        "buckleWidthMM" in obj ||
        "color" in obj ||
        "quickRelease" in obj ||
        "sellPrice" in obj
    );
}

export function getDefaultWatchFlags(): Required<WatchFlagsInput> {
    return {
        needService: true,
    };
}

export function parseAcquisitionItemMeta(description?: string | null): AcquisitionItemMeta {
    if (!description) return {};

    try {
        const parsed = JSON.parse(description);
        if (!parsed || typeof parsed !== "object") return {};

        const obj = parsed as Record<string, any>;

        if (obj.watchFlags || obj.strapSpec || obj.kind || obj.quickSpec || obj.aiMeta) {
            return {
                kind:
                    obj.kind === "strap"
                        ? "strap"
                        : obj.kind === "watch"
                            ? "watch"
                            : undefined,
                watchFlags: normalizeWatchFlags(obj.watchFlags),
                strapSpec: normalizeStrapSpec(obj.strapSpec),
                quickSpec: normalizeQuickSpec(obj.quickSpec),
                aiMeta: normalizeAiMeta(obj.aiMeta),
            };
        }

        if (isLegacyStrapSpecObject(obj)) {
            return {
                kind: "strap",
                strapSpec: normalizeStrapSpec(obj),
            };
        }
    } catch {
        return {};
    }

    return {};
}

export function getWatchFlagsFromDescription(description?: string | null): Required<WatchFlagsInput> {
    const flags = parseAcquisitionItemMeta(description).watchFlags;

    return {
        needService: normalizeBool(flags?.needService, true),
    };
}

export function getStrapSpecFromDescription(description?: string | null): StrapSpecInput | null {
    return parseAcquisitionItemMeta(description).strapSpec ?? null;
}

export function getQuickSpecFromDescription(description?: string | null): QuickWatchSpec | null {
    return parseAcquisitionItemMeta(description).quickSpec ?? null;
}

export function getAiMetaFromDescription(description?: string | null): AcquisitionAiMeta | null {
    return parseAcquisitionItemMeta(description).aiMeta ?? null;
}

export function stringifyAcquisitionItemMeta(input: {
    watchFlags?: WatchFlagsInput | null;
    strapSpec?: StrapSpecInput | null;
    quickSpec?: QuickWatchSpec | null;
    aiMeta?: AcquisitionAiMeta | null;
}) {
    const watchFlags = input.watchFlags
        ? {
            needService: normalizeBool(input.watchFlags.needService, true),
        }
        : undefined;

    const quickSpec = input.quickSpec
        ? {
            sourceText: input.quickSpec.sourceText,
            normalizedText: input.quickSpec.normalizedText,
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
            boxIncluded: input.quickSpec.boxIncluded ?? null,
            bookletIncluded: input.quickSpec.bookletIncluded ?? null,
            cardIncluded: input.quickSpec.cardIncluded ?? null,
            fullSetStatus: input.quickSpec.fullSetStatus ?? null,
            fullSetStatusLabel: input.quickSpec.fullSetStatusLabel ?? null,
            caseMaterial: input.quickSpec.caseMaterial ?? null,
            caseMaterialLabel: input.quickSpec.caseMaterialLabel ?? null,
            styleCategory: input.quickSpec.styleCategory ?? null,
            styleCategoryLabel: input.quickSpec.styleCategoryLabel ?? null,
            hourMarkerStyle: input.quickSpec.hourMarkerStyle ?? null,
            hourMarkerStyleLabel: input.quickSpec.hourMarkerStyleLabel ?? null,
        }
        : undefined;

    const aiMeta = normalizeAiMeta(input.aiMeta);

    if (!watchFlags && !input.strapSpec && !quickSpec && !aiMeta) return null;

    return JSON.stringify({
        kind: input.strapSpec ? "strap" : "watch",
        ...(watchFlags ? { watchFlags } : {}),
        ...(input.strapSpec ? { strapSpec: input.strapSpec } : {}),
        ...(quickSpec ? { quickSpec } : {}),
        ...(aiMeta ? { aiMeta } : {}),
    });
}
