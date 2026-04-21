//import { getAdminAcquisitionList } from "./_server/core/acquisition.service";
import { getAdminAcquisitionList } from "@/domains/acquisition/server/core/list/acquisition-list.service";
//import AcquisitionListClient from "./_client/ListAcq";
import AcquisitionListClient from "@/domains/acquisition/client/AcquisitionListClient";




import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { parseAcquisitionListSearchParams } from "@/domains/acquisition/server/shared/search-params";
import { getListVendors } from "../vendors/_server/vendor.repo";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function AcquisitionListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);

    const resolvedSearchParams = await searchParams;

    const input = parseAcquisitionListSearchParams({
        view: firstValue(resolvedSearchParams.view),
        q: firstValue(resolvedSearchParams.q),
        vendorId: firstValue(resolvedSearchParams.vendorId),
        type: firstValue(resolvedSearchParams.type),
        status: firstValue(resolvedSearchParams.status),
        sort: firstValue(resolvedSearchParams.sort),
        page: firstValue(resolvedSearchParams.page),
        pageSize: firstValue(resolvedSearchParams.pageSize),
    });

    const [result, vendors] = await Promise.all([
        getAdminAcquisitionList(input),
        getListVendors(),
    ]);

    const vendorOptions = (vendors ?? []).map((vendor: any) => ({
        id: String(vendor.id),
        name: String(vendor.name ?? "-"),
    }));

    return (
        <AcquisitionListClient
            {...serialize(result)}
            vendors={serialize(vendorOptions)}
        />
    );
}

/**function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function AcquisitionListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const resolvedSearchParams = await searchParams;

    const sp = new URLSearchParams(
        Object.entries(resolvedSearchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const raw = Object.fromEntries(sp.entries());

    const { items, total, counts, page, pageSize } = await getAdminAcquisitionList(raw);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <AcquisitionListClient
            items={serialize(items)}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={resolvedSearchParams}
        />
    );
}

*/