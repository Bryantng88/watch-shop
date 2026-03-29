import type { QuickWatchSpec } from "../_shared/quick-watch-rule";

export type WatchFlagsInput = {
    hasStrap?: boolean;
    isServiced?: boolean;
    hasClasp?: boolean;
    isSpa?: boolean;
};

export type StrapSpecInput = {
    material?: string;
    lugWidthMM?: number;
    buckleWidthMM?: number;
    color?: string;
    quickRelease?: boolean;
    sellPrice?: number;
};

export type AcquisitionItemMeta = {
    kind?: "watch" | "strap";
    watchFlags?: WatchFlagsInput;
    strapSpec?: StrapSpecInput;
    quickSpec?: QuickWatchSpec;
};

const normalizeBool = (value: unknown, fallback = false) =>
    value == null ? fallback : Boolean(value);

function normalizeNullableBool(value: unknown): boolean | null {
    return value == null ? null : Boolean(value);
}

function normalizeQuickSpec(value: unknown): QuickWatchSpec | undefined {
    if (!value || typeof value !== "object") return undefined;
    const obj = value as Record<string, any>;

    return {
        sourceText: obj.sourceText != null ? String(obj.sourceText) : undefined,
        normalizedText: obj.normalizedText != null ? String(obj.normalizedText) : "",
        brand: obj.brand != null ? String(obj.brand) : null,
        brandLabel: obj.brandLabel != null ? String(obj.brandLabel) : null,
        movement: obj.movement != null ? String(obj.movement) : null,
        movementLabel: obj.movementLabel != null ? String(obj.movementLabel) : null,
        caseShape: obj.caseShape != null ? String(obj.caseShape) : null,
        caseShapeLabel: obj.caseShapeLabel != null ? String(obj.caseShapeLabel) : null,
        dialColor: obj.dialColor != null ? String(obj.dialColor) : null,
        dialColorLabel: obj.dialColorLabel != null ? String(obj.dialColorLabel) : null,
        strapType: obj.strapType != null ? String(obj.strapType) : null,
        strapTypeLabel: obj.strapTypeLabel != null ? String(obj.strapTypeLabel) : null,
        boxIncluded: normalizeNullableBool(obj.boxIncluded),
        bookletIncluded: normalizeNullableBool(obj.bookletIncluded),
        cardIncluded: normalizeNullableBool(obj.cardIncluded),
        fullSetStatus: obj.fullSetStatus != null ? String(obj.fullSetStatus) : null,
        fullSetStatusLabel: obj.fullSetStatusLabel != null ? String(obj.fullSetStatusLabel) : null,
        caseMaterial: obj.caseMaterial != null ? String(obj.caseMaterial) : null,
        caseMaterialLabel: obj.caseMaterialLabel != null ? String(obj.caseMaterialLabel) : null,
        styleCategory: obj.styleCategory != null ? String(obj.styleCategory) : null,
        styleCategoryLabel: obj.styleCategoryLabel != null ? String(obj.styleCategoryLabel) : null,
        hourMarkerStyle: obj.hourMarkerStyle != null ? String(obj.hourMarkerStyle) : null,
        hourMarkerStyleLabel: obj.hourMarkerStyleLabel != null ? String(obj.hourMarkerStyleLabel) : null,

    };
}

export function getDefaultWatchFlags(): Required<WatchFlagsInput> {
    return {
        hasStrap: false,
        isServiced: false,
        hasClasp: false,
        isSpa: false,
    };
}

export function parseAcquisitionItemMeta(description?: string | null): AcquisitionItemMeta {
    if (!description) return {};

    try {
        const parsed = JSON.parse(description);
        if (!parsed || typeof parsed !== "object") return {};

        const obj = parsed as Record<string, any>;

        if (obj.watchFlags || obj.strapSpec || obj.kind || obj.quickSpec) {
            return {
                kind: obj.kind === "strap" ? "strap" : obj.kind === "watch" ? "watch" : undefined,
                watchFlags: obj.watchFlags
                    ? {
                        hasStrap: normalizeBool(obj.watchFlags.hasStrap),
                        isServiced: normalizeBool(obj.watchFlags.isServiced),
                        hasClasp: normalizeBool(obj.watchFlags.hasClasp),
                        isSpa: normalizeBool(obj.watchFlags.isSpa),
                    }
                    : undefined,
                strapSpec: obj.strapSpec
                    ? {
                        material: obj.strapSpec.material,
                        lugWidthMM: obj.strapSpec.lugWidthMM != null ? Number(obj.strapSpec.lugWidthMM) : undefined,
                        buckleWidthMM: obj.strapSpec.buckleWidthMM != null ? Number(obj.strapSpec.buckleWidthMM) : undefined,
                        color: obj.strapSpec.color,
                        quickRelease: obj.strapSpec.quickRelease == null ? undefined : Boolean(obj.strapSpec.quickRelease),
                        sellPrice: obj.strapSpec.sellPrice != null ? Number(obj.strapSpec.sellPrice) : undefined,
                    }
                    : undefined,
                quickSpec: normalizeQuickSpec(obj.quickSpec),
            };
        }

        const looksLikeLegacyStrapSpec =
            "material" in obj ||
            "lugWidthMM" in obj ||
            "buckleWidthMM" in obj ||
            "color" in obj ||
            "quickRelease" in obj ||
            "sellPrice" in obj;

        if (looksLikeLegacyStrapSpec) {
            return {
                kind: "strap",
                strapSpec: {
                    material: obj.material,
                    lugWidthMM: obj.lugWidthMM != null ? Number(obj.lugWidthMM) : undefined,
                    buckleWidthMM: obj.buckleWidthMM != null ? Number(obj.buckleWidthMM) : undefined,
                    color: obj.color,
                    quickRelease: obj.quickRelease == null ? undefined : Boolean(obj.quickRelease),
                    sellPrice: obj.sellPrice != null ? Number(obj.sellPrice) : undefined,
                },
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
        hasStrap: normalizeBool(flags?.hasStrap),
        isServiced: normalizeBool(flags?.isServiced),
        hasClasp: normalizeBool(flags?.hasClasp),
        isSpa: normalizeBool(flags?.isSpa),
    };
}

export function getStrapSpecFromDescription(description?: string | null): StrapSpecInput | null {
    return parseAcquisitionItemMeta(description).strapSpec ?? null;
}

export function getQuickSpecFromDescription(description?: string | null): QuickWatchSpec | null {
    return parseAcquisitionItemMeta(description).quickSpec ?? null;
}

export function stringifyAcquisitionItemMeta(input: {
    watchFlags?: WatchFlagsInput | null;
    strapSpec?: StrapSpecInput | null;
    quickSpec?: QuickWatchSpec | null;

}) {
    const watchFlags = input.watchFlags
        ? {
            hasStrap: normalizeBool(input.watchFlags.hasStrap),
            isServiced: normalizeBool(input.watchFlags.isServiced),
            hasClasp: normalizeBool(input.watchFlags.hasClasp),
            isSpa: normalizeBool(input.watchFlags.isSpa),
        }
        : undefined;

    const strapSpec = input.strapSpec
        ? {
            material: input.strapSpec.material,
            lugWidthMM: input.strapSpec.lugWidthMM != null ? Number(input.strapSpec.lugWidthMM) : undefined,
            buckleWidthMM: input.strapSpec.buckleWidthMM != null ? Number(input.strapSpec.buckleWidthMM) : undefined,
            color: input.strapSpec.color,
            quickRelease: input.strapSpec.quickRelease == null ? undefined : Boolean(input.strapSpec.quickRelease),
            sellPrice: input.strapSpec.sellPrice != null ? Number(input.strapSpec.sellPrice) : undefined,
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

    if (!watchFlags && !strapSpec && !quickSpec) return null;

    return JSON.stringify({
        kind: strapSpec ? "strap" : "watch",
        ...(watchFlags ? { watchFlags } : {}),
        ...(strapSpec ? { strapSpec } : {}),
        ...(quickSpec ? { quickSpec } : {}),
    });
}