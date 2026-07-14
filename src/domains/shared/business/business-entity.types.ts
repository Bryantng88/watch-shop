export type BusinessEntityType =
    | "WATCH"
    | "ORDER"
    | "SHIPMENT"
    | "SERVICE"
    | "TECHNICAL_ISSUE"
    | "PAYMENT"
    | "ACQUISITION";

export type BusinessEntityFact = {
    label: string;
    value: string | number | null;
};

export type BusinessEntityPreviewAction = {
    label: string;
    href: string;
};

export type BusinessEntityPreviewItem = {
    id?: string | null;
    title: string;
    subtitle?: string | null;
    status?: string | null;
    href?: string | null;
    facts?: BusinessEntityFact[];
};

export type BusinessEntityPreviewSection = {
    title: string;
    subtitle?: string | null;
    items: BusinessEntityPreviewItem[];
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
    sections?: BusinessEntityPreviewSection[];
    actions?: BusinessEntityPreviewAction[];
};
