import ProductListClient from "./_client/ListProducts";
import { getAdminProductList } from "./_server/product.service";

import { parseProductListSearchParams } from "./helpers/search-params";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { PERMISSIONS } from "@/constants/permissions";
import { listVendor } from "@/features/vendors/server/vendor.repo";

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

export default async function ProductListPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
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
        getAdminProductList(input, { canViewCost }),
        listVendor(),
    ]);

    const {
        items,
        total,
        counts,
        page,
        pageSize,
        brands,
        productTypes,
    } = result;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <ProductListClient
            items={serialize(items)}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={resolvedSearchParams}
            brands={serialize(brands)}
            vendors={serialize(vendors)}
            productTypes={serialize(productTypes)}
            canViewCost={canViewCost}
            canEditPrice={canEditPrice}
        />
    );
}
