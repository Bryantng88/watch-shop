// app/(admin)/admin/acquisitions/page.tsx
import { getAdminAcquisitionList } from "./_server/acquisition.service";
import { parseAcqSearchParams } from "./ultils/search-params";
import AcquisitionListClient from "./_client/ListAcq";

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
export default async function AcquisitionListPage({ searchParams }: { searchParams: SearchParams }) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const input = parseAcqSearchParams(sp);
    const { items, total, page, pageSize } = await getAdminAcquisitionList(input);

    console.log('in ra note : ' + JSON.stringify(items))
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedItems = serialize(items);
    return (
        <AcquisitionListClient
            items={normalizedItems}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}
