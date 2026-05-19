import { listShipmentsApplication } from "@/domains/shipment/application";
import { ShipmentListClient } from "@/domains/shipment/client";

export const dynamic = "force-dynamic";

function firstRaw(value: string | string[] | undefined, fallback = "") {
    if (Array.isArray(value)) return String(value[0] ?? fallback);
    return String(value ?? fallback);
}

function toPositiveInt(value: string | string[] | undefined, fallback: number) {
    const n = Number(firstRaw(value, String(fallback)));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function statusFromView(view: string) {
    switch (String(view ?? "").toLowerCase()) {
        case "ready": return "READY";
        case "shipping": return "SHIPPED";
        case "delivered": return "DELIVERED";
        case "returned": return "RETURNED";
        case "cancelled": return "CANCELLED";
        default: return null;
    }
}

export default async function AdminShipmentsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const page = toPositiveInt(searchParams.page, 1);
    const pageSize = toPositiveInt(searchParams.pageSize, 20);
    const view = firstRaw(searchParams.view, "all");
    const status = firstRaw(searchParams.status) || statusFromView(view);

    const data = await listShipmentsApplication({
        page,
        pageSize,
        q: firstRaw(searchParams.q) || null,
        status,
    });

    return (
        <ShipmentListClient
            items={data.rows ?? []}
            total={data.total ?? 0}
            page={data.page ?? page}
            pageSize={data.pageSize ?? pageSize}
            totalPages={Math.max(1, data.pageCount ?? 1)}
            rawSearchParams={searchParams}
        />
    );
}
