export type BusinessEntityType =
    | "WATCH"
    | "ORDER"
    | "SHIPMENT"
    | "SERVICE"
    | "PAYMENT"
    | "ACQUISITION";

export type BusinessEntityFact = {
    label: string;
    value: string | number | null;
};

export type BusinessEntityPreview = {
    type: BusinessEntityType;
    id: string;
    refNo?: string | null;
    title: string;
    subtitle?: string | null;
    status?: string | null;
    imageUrl?: string | null;
    href?: string | null;
    facts?: BusinessEntityFact[];
};