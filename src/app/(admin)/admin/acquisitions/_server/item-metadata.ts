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
};

const normalizeBool = (value: unknown, fallback = false) =>
    value == null ? fallback : Boolean(value);

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

        if (obj.watchFlags || obj.strapSpec || obj.kind) {
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

export function stringifyAcquisitionItemMeta(input: {
    watchFlags?: WatchFlagsInput | null;
    strapSpec?: StrapSpecInput | null;
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

    if (!watchFlags && !strapSpec) return null;

    return JSON.stringify({
        kind: strapSpec ? "strap" : "watch",
        ...(watchFlags ? { watchFlags } : {}),
        ...(strapSpec ? { strapSpec } : {}),
    });
}
