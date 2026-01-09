// app/(admin)/admin/shipments/page.tsx
import ShipmentsClient from "./_client/ListShipment";
import { getAdminShipmentList } from "./_server/shipment.service"; // chỉnh lại path đúng của bạn

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

export default async function ShipmentListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    // mặc định
    const page = Number(sp.get("page") ?? "1");
    const pageSize = Number(sp.get("pageSize") ?? "20");
    const q = sp.get("q") ?? undefined;

    // service của bạn hiện trả { items, total }
    const { items, total } = await getAdminShipmentList({
        page,
        pageSize,
        q,
    });


    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedItems = serialize(items);
    // normalize theo format client cần: rows
    const data = {
        page,
        pageSize,
        total,
        totalPages,
        items: serialize(items), // truyền items y như Order đang làm
        rawSearchParams: searchParams,
    };

    return <ShipmentsClient
        items={normalizedItems}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        rawSearchParams={searchParams}

    />;
}
