// app/(admin)/admin/orders/page.tsx

import OrderListClient from "@/domains/order/client/OrderListClient";
import { getAdminOrderList } from "@/domains/order/server";
import { parseOrderSearchParams } from "@/domains/order/shared/search-params";
import { serializeForClient } from "@/shared/utils/serialize-for-client";

type SearchParams = {
    [key: string]: string | string[] | undefined;
};

export const dynamic = "force-dynamic";

export default async function OrderListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map((item) => [key, item]);
            }

            return [[key, value ?? ""]];
        })
    );

    const input = parseOrderSearchParams(sp);

    const result = await getAdminOrderList(input);

    const totalPages = Math.max(
        1,
        Math.ceil(result.total / result.pageSize)
    );

    return (
        <OrderListClient
            items={serializeForClient(result.items)}
            total={result.total}
            counts={result.counts}
            page={result.page}
            pageSize={result.pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}