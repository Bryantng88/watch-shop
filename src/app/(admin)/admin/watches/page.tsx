import { getAdminWatchList } from "@/domains/watch/server";
import WatchListClient from "@/domains/watch/client/WatchListClient";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getListVendors } from "../vendors/_server/vendor.repo";

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

function hasRole(user: any, roleName: string) {
    const roles = user?.roles ?? [];

    return roles.some((r: any) => {
        if (typeof r === "string") return r === roleName;
        if (typeof r?.name === "string") return r.name === roleName;
        if (typeof r?.code === "string") return r.code === roleName;
        return false;
    });
}

function hasPermission(user: any, permission: string) {
    const permissions = user?.permissions ?? [];

    return permissions.some((p: any) => {
        if (typeof p === "string") return p === permission;
        if (typeof p?.name === "string") return p.name === permission;
        if (typeof p?.code === "string") return p.code === permission;
        if (typeof p?.key === "string") return p.key === permission;
        return false;
    });
}

function buildInitialWatchListInput(searchParams: SearchParams) {
    const view = (firstValue(searchParams.view) || "draft") as
        | "draft"
        | "processing"
        | "ready"
        | "hold"
        | "sold"
        | "all";
    return {
        view,

        subFilter: firstValue(searchParams.subFilter) as any,

        q: firstValue(searchParams.q),
        sku: firstValue(searchParams.sku),
        brandId: firstValue(searchParams.brandId),
        vendorId: firstValue(searchParams.vendorId),

        hasContent: firstValue(searchParams.hasContent) as "" | "yes" | "no",
        hasImages: firstValue(searchParams.hasImages) as "" | "yes" | "no",

        saleStage: firstValue(searchParams.saleStage),
        opsStage: firstValue(searchParams.opsStage),

        sort: firstValue(searchParams.sort) || "updatedDesc",

        page: toPositiveInt(firstValue(searchParams.page), 1),
        pageSize: toPositiveInt(firstValue(searchParams.pageSize), 20),
    };
}

export default async function WatchesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);

    const resolvedSearchParams = await searchParams;
    const user = await getCurrentUser();

    const isAdmin = hasRole(user, "ADMIN");
    const canViewCost =
        isAdmin || hasPermission(user, PERMISSIONS.PRODUCT_COST_VIEW);

    const input = buildInitialWatchListInput(resolvedSearchParams);

    const [initialResult, vendors] = await Promise.all([
        getAdminWatchList(input),
        getListVendors(),
    ]);

    return (
        <WatchListClient
            initialResult={serialize(initialResult)}
            vendors={serialize(vendors)}
            canViewCost={canViewCost}
        />
    );
}
