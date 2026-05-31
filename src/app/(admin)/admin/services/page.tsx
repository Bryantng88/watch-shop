import {
    getAdminServiceRequestList,
    parseServiceRequestSearchParams,
} from "@/domains/service/server/list";
import ServiceRequestsClient from "@/domains/service/client/ServiceRequestList";

type SearchParams = { [key: string]: string | string[] | undefined };

function serialize(obj: any) {
    return JSON.parse(JSON.stringify(obj, (_key, value) => {
        if (value instanceof Date) return value.toISOString();
        if (typeof value === "object" && value?._isDecimal) return Number(value);
        return value;
    }));
}

function toURLSearchParams(searchParams: SearchParams) {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
        if (Array.isArray(value)) {
            for (const item of value) if (item != null && item !== "") sp.append(key, String(item));
        } else if (value != null && value !== "") {
            sp.append(key, String(value));
        }
    }
    return sp;
}

export default async function ServiceRequestListPage({ searchParams }: { searchParams: SearchParams }) {
    const input = parseServiceRequestSearchParams(toURLSearchParams(searchParams));
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
