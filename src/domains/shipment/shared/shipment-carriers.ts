// src/domains/shipment/shared/shipment-carriers.ts

export const SHIPMENT_CARRIER_OPTIONS = [
    { value: "GHN", label: "GHN" },
    { value: "GHTK", label: "GHTK" },
    { value: "VIETTEL_POST", label: "Viettel Post" },
    { value: "AHAMOVE", label: "Ahamove" },
    { value: "GRAB", label: "Grab" },
    { value: "SELF_DELIVERY", label: "Tự giao" },
    { value: "OTHER", label: "Khác" },
] as const;