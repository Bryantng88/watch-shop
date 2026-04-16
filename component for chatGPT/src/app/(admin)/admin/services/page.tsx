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

function toURLSearchParams(searchParams: SearchParams) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
        if (Array.isArray(v)) {
            for (const x of v) {
                if (x != null && x !== "") sp.append(k, String(x));
            }
        } else if (v != null && v !== "") {
            sp.append(k, String(v));
        }
    }
    return sp;
}

export default async function ServiceRequestListPage({ searchParams }: { searchParams: SearchParams }) {
    const sp = toURLSearchParams(searchParams);
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
