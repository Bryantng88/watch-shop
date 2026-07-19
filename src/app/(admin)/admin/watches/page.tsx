import { getAdminWatchList } from "@/domains/watch/server";
import WatchListClient from "@/domains/watch/client/WatchListClient";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getListVendors } from "../vendors/_server/vendor.repo";
import { unstable_cache } from "next/cache";

type SearchParams = { [key: string]: string | string[] | undefined };

function serialize(obj: unknown) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        }),
    );
}

function firstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

function toPositiveInt(value: string | undefined, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function recordValue(value: unknown, key: string) {
    return value && typeof value === "object"
        ? (value as Record<string, unknown>)[key]
        : undefined;
}

function hasRole(user: unknown, roleName: string) {
    const roles = Array.isArray(recordValue(user, "roles"))
        ? recordValue(user, "roles") as unknown[]
        : [];

    return roles.some((r) => {
        if (typeof r === "string") return r === roleName;
        if (recordValue(r, "name") === roleName) return true;
        if (recordValue(r, "code") === roleName) return true;
        return false;
    });
}

function hasPermission(user: unknown, permission: string) {
    const permissions = Array.isArray(recordValue(user, "permissions"))
        ? recordValue(user, "permissions") as unknown[]
        : [];

    return permissions.some((p) => {
        if (typeof p === "string") return p === permission;
        if (recordValue(p, "name") === permission) return true;
        if (recordValue(p, "code") === permission) return true;
        if (recordValue(p, "key") === permission) return true;
        return false;
    });
}

function buildInitialWatchListInput(searchParams: SearchParams) {
    const view = "all" as
        | "draft"
        | "processing"
        | "ready"
        | "hold"
        | "sold"
        | "all";
    return {
        view,

        subFilter: "",

        q: firstValue(searchParams.q),
        sku: firstValue(searchParams.sku),
        brandId: firstValue(searchParams.brandId),
        vendorId: firstValue(searchParams.vendorId),

        hasContent: "" as "" | "yes" | "no",
        hasImages: "" as "" | "yes" | "no",

        saleStage: "",
        opsStage: "",
        mediaStatus: firstValue(searchParams.mediaStatus),
        serviceStatus: firstValue(searchParams.serviceStatus),
        saleStatus: firstValue(searchParams.saleStatus),
        priceStatus: firstValue(searchParams.priceStatus),
        pricePreset: firstValue(searchParams.pricePreset),
        priceMin: firstValue(searchParams.priceMin),
        priceMax: firstValue(searchParams.priceMax),
        duplicateScope: firstValue(searchParams.duplicates) === "1" ? "DUPLICATE" as const : "ACTIVE" as const,

        sort: firstValue(searchParams.sort) || "updatedDesc",

        page: toPositiveInt(firstValue(searchParams.page), 1),
        pageSize: toPositiveInt(firstValue(searchParams.pageSize), 20),
        withTotal: true,
        meta: "lite",
    };
}

const getCachedListVendors = unstable_cache(
    () => getListVendors(),
    ["watch-list-vendor-options"],
    { revalidate: 300 },
);

export default async function WatchesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const user = await requirePermission(PERMISSIONS.PRODUCT_VIEW);

    const resolvedSearchParams = await searchParams;

    const isAdmin = hasRole(user, "ADMIN");
    const canViewCost =
        isAdmin || hasPermission(user, PERMISSIONS.PRODUCT_COST_VIEW);

    const input = buildInitialWatchListInput(resolvedSearchParams);

    const [initialResult, vendors] = await Promise.all([
        getAdminWatchList(input),
        getCachedListVendors(),
    ]);

    return (
        <WatchListClient
            initialResult={serialize(initialResult)}
            vendors={serialize(vendors)}
            canViewCost={canViewCost}
        />
    );
}
