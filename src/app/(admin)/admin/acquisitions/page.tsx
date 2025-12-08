// app/(admin)/admin/orders/page.tsx
import { parseOrderSearchParams } from "./utils/search-params";
import { getAdminOrderList } from "./_server/order.service";
import OrderListClient from "./_client/ListOrder";

type SearchParams = { [key: string]: string | string[] | undefined };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function OrderListPage({ searchParams }: { searchParams: SearchParams }) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const input = parseOrderSearchParams(sp);

    const { items, total, page, pageSize } = await getAdminOrderList(input);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const normalizedItems = serialize(items);

    return (
        <OrderListClient
            items={normalizedItems}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}
