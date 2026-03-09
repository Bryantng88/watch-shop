import { parseServiceRequestSearchParams } from "./_helper/SearchParams";
import { getAdminServiceRequestList } from "./_server/service_request.service";
import ServiceRequestsClient from "./_client/ServiceRequestList";

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

    const input = parseServiceRequestSearchParams(sp);
    const { items, total, counts, page, pageSize } = await getAdminServiceRequestList(input);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <ServiceRequestsClient
            items={serialize(items)}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}