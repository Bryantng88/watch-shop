// app/(admin)/admin/shipments/page.tsx
import ShipmentsClient from "./_client/ListShipment";
import { getAdminShipmentList } from "./_server/shipment.service";

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

function toStr(v: string | string[] | undefined) {
    if (Array.isArray(v)) return v[0] ?? "";
    return v ?? "";
}

function toInt(v: string | string[] | undefined, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export default async function ShipmentListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const page = toInt(searchParams.page, 1);
    const pageSize = toInt(searchParams.pageSize, 20);
    const q = toStr(searchParams.q) || undefined;

    const viewRaw = toStr(searchParams.view).toLowerCase();
    const view =
        viewRaw === "all" ||
            viewRaw === "draft" ||
            viewRaw === "ready" ||
            viewRaw === "shipped" ||
            viewRaw === "delivered" ||
            viewRaw === "cancelled"
            ? viewRaw
            : "all";

    const { items, total, counts } = await getAdminShipmentList({
        page,
        pageSize,
        q,
        view: view as any,
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedItems = serialize(items);

    return (
        <ShipmentsClient
            items={normalizedItems}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}