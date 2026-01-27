// app/(admin)/admin/service-requests/page.tsx

import { parseListSearchParams } from "../__helpers/SearchParams";
import { getServiceCatalogList } from "./_server/service_request.service";
import ServiceRequestsClient from "./_client/ServiceRequestList";

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

export default async function ServiceRequestListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const input = parseListSearchParams(sp);

    const { items, total, page, pageSize } = await getServiceCatalogList(input);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedItems = serialize(items);

    return (
        <ServiceRequestsClient
            items={normalizedItems}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}
