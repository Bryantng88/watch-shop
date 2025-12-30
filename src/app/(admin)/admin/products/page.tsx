//import AdminProductPage from "@/features/products/_admin/admin-product-page";
//export default AdminProductPage;

// features/products/_admin/page.tsx
import { getAdminProductList } from "./_server/product.service";
import { parseProductSearchParams } from "./ultis/search-params";

import AdminProductList from "./_client/AdminProductList";
import { listBrands } from "@/features/catalog/server/brands.repo";
import { PRODUCT_TYPES } from "@/features/meta/server/enum";

type SearchParams = { [key: string]: string | string[] | undefined };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (k, v) => {
            if (v instanceof Date) return v.toISOString();
            if (typeof v === "object" && v?._isDecimal) return Number(v);
            return v;
        })
    );
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

    const input = parseProductSearchParams(sp);
    const { items, total, page, pageSize } = await getAdminProductList(input);

    const brands = await listBrands();
    const productTypes = Object.values(PRODUCT_TYPES).map((v) => ({
        label: v,
        value: v,
    }));

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <AdminProductList
            items={serialize(items)}
            brands={brands}
            productTypes={productTypes}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}

