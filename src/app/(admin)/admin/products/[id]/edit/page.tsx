import ProductListClient from "./_client/ListProducts";
import { getAdminProductList } from "./_server/product.service";

import { parseProductListSearchParams } from "./helpers/search-params";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { PERMISSIONS } from "@/constants/permissions";

type SearchParams = { [key: string]: string | string[] | undefined };


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
    searchParams: SearchParams;
}) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const input = parseProductListSearchParams(sp);

    const [user, productList] = await Promise.all([
        getCurrentUser(),
        getAdminProductList(input),
    ]);

    const isAdmin = hasRole(user, "ADMIN");

    const canViewCost =
        isAdmin || hasPermission(user, PERMISSIONS.PRODUCT_COST_VIEW);

    const canEditPrice =
        isAdmin || hasPermission(user, PERMISSIONS.PRODUCT_UPDATE);

    const {
        items,
        total,
        counts,
        page,
        pageSize,
        brands,
        productTypes,
    } = productList;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <ProductListClient
            items={items}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
            brands={brands}
            productTypes={productTypes}
            canViewCost={canViewCost}
            canEditPrice={canEditPrice}
        />
    );
}