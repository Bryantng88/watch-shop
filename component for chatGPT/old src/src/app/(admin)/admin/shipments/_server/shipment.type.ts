// shipment.type.ts
export type ShipmentViewKey = "all" | "draft" | "ready" | "shipped" | "delivered" | "cancelled";

export type ShipmentSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
    status?: string;
    view?: ShipmentViewKey;
};