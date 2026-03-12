import ProductListClient from "./_client/ListProducts";
import { getAdminProductList } from "./_server/product.service";
import { parseProductListSearchParams } from "./_helper/search-params";

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

    const {
        items,
        total,
        counts,
        page,
        pageSize,
        brands,
        productTypes,
    } = await getAdminProductList(input);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <ProductListClient
            items={serialize(items)}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
            brands={serialize(brands)}
            productTypes={serialize(productTypes)}
        />
    );
}