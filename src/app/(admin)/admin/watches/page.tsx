import { getAdminWatchList } from "@/domains/watch/server";
import WatchListClient from "@/domains/watch/client/WatchListClient";
import { parseProductListSearchParams } from "@/app/(admin)/admin/products/helpers/search-params";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getListVendors } from "../vendors/_server/vendor.repo";

type SearchParams = { [key: string]: string | string[] | undefined };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
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

export default async function WatchesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);

    const resolvedSearchParams = await searchParams;

    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(resolvedSearchParams)) {
        if (Array.isArray(v)) {
            for (const x of v) {
                if (x != null && x !== "") sp.append(k, String(x));
            }
        } else if (v != null && v !== "") {
            sp.append(k, String(v));
        }
    }

    const input = parseProductListSearchParams(sp);
    const user = await getCurrentUser();

    const isAdmin = hasRole(user, "ADMIN");
    const canViewCost =
        isAdmin || hasPermission(user, PERMISSIONS.PRODUCT_COST_VIEW);
    const canEditPrice =
        isAdmin || hasPermission(user, PERMISSIONS.PRODUCT_UPDATE);

    const [result, vendors] = await Promise.all([
        getAdminWatchList(input as any),
        getListVendors(),
    ]);

    const { items, total, page, pageSize, totalPages } = result;

    return (
        <WatchListClient
            items={serialize(items)}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={resolvedSearchParams}
            vendors={serialize(vendors)}
            canViewCost={canViewCost}
            canEditPrice={canEditPrice}
        />
    );
}