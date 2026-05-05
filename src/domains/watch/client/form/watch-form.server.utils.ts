import {
    CaseType,
    Gender,
    Glass,
    MovementType,
    Strap,
    WatchCaseMaterialFamily,
    WatchGoldColorV2,
    WatchGoldTreatment,
    WatchMaterialProfile,
    WatchSiteChannel,
    WatchStyle,
    WatchStrapSetType,
    WatchStrapComponentSource
} from "@prisma/client";

export function toDecimal(value?: string | null) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;

    const normalized = raw.replace(/[^\d.-]/g, "");
    return normalized || null;
}

export function pickEnumOrNull<T extends Record<string, string>>(
    value: string | null | undefined,
    enumObj: T
): T[keyof T] | null {
    const raw = String(value ?? "").trim();
    const allowed = Object.values(enumObj);

    return allowed.includes(raw) ? (raw as T[keyof T]) : null;
}

export function pickEnumOrUndefined<T extends Record<string, string>>(
    value: string | null | undefined,
    enumObj: T
): T[keyof T] | undefined {
    const raw = String(value ?? "").trim();
    const allowed = Object.values(enumObj);

    return allowed.includes(raw) ? (raw as T[keyof T]) : undefined;
}

export function pickEnumOrDefault<T extends Record<string, string>>(
    value: string | null | undefined,
    enumObj: T,
    fallback: T[keyof T]
): T[keyof T] {
    return pickEnumOrUndefined(value, enumObj) ?? fallback;
}

export function pickGoldColors(values?: string[] | null) {
    const allowed = Object.values(WatchGoldColorV2);

    return (values ?? []).filter((x) =>
        allowed.includes(x as WatchGoldColorV2)
    ) as WatchGoldColorV2[];
}

export const WatchFormEnums = {
    Gender,
    WatchSiteChannel,
    MovementType,
    CaseType,
    Glass,
    WatchMaterialProfile,
    WatchCaseMaterialFamily,
    WatchGoldTreatment,
    Strap,
    WatchStyle,
    WatchStrapSetType,
    WatchStrapComponentSource,
};