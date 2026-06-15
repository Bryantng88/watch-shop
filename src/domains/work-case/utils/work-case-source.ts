// domains/work-case/utils/work-case-source.ts

import type { RaiseWorkCaseSourceContext } from "../ui/RaiseWorkCaseModal";

function n(value: unknown) {
    return value == null ? null : String(value);
}

export function buildWatchWorkCaseSource(row: {
    watchId?: string | null;
    id?: string | null;
    title?: string | null;
    sku?: string | null;
    imageUrl?: string | null;
}): RaiseWorkCaseSourceContext {
    return {
        type: "WATCH",
        id: n(row.watchId || row.id) || "",
        title: n(row.title),
        sku: n(row.sku),
        imageUrl: n(row.imageUrl),
    };
}

export function buildOrderWorkCaseSource(row: {
    id: string;
    refNo?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    itemsCount?: number | null;
}): RaiseWorkCaseSourceContext {
    return {
        type: "ORDER",
        id: row.id,
        refNo: n(row.refNo),
        title: n(row.refNo || row.id),
        subtitle: n(row.customerName || row.customerPhone || "-"),
        imageUrl: null,
        itemsCount: row.itemsCount ?? null,
        extraCount: Math.max(0, (row.itemsCount ?? 0) - 1),
    };
}

export function buildShipmentWorkCaseSource(row: {
    id: string;
    refNo?: string | null;
    trackingCode?: string | null;
    customerName?: string | null;
    orderRefNo?: string | null;
    itemsCount?: number | null;
    imageUrl?: string | null;
}): RaiseWorkCaseSourceContext {
    return {
        type: "SHIPMENT",
        id: row.id,
        refNo: n(row.refNo || row.trackingCode),
        title: n(row.refNo || row.trackingCode || row.id),
        subtitle: n(row.orderRefNo || row.customerName || "-"),
        imageUrl: n(row.imageUrl),
        itemsCount: row.itemsCount ?? null,
        extraCount: Math.max(0, (row.itemsCount ?? 0) - 1),
    };
}