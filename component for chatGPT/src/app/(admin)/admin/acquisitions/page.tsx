import { getAdminAcquisitionList } from "./_server/core/acquisition.service";
import AcquisitionListClient from "./_client/ListAcq";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

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
