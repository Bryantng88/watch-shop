// shipment.type.ts
export type ShipmentSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
    status?: string;
};
