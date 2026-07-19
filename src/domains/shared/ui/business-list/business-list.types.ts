export type BusinessListDashboardTone =
    | "slate"
    | "violet"
    | "blue"
    | "emerald"
    | "amber"
    | "rose";

export type BusinessListMetric = {
    key: string;
    label: string;
    value: number | string;
    helper?: string;
    helperSuffix?: string;
    helperTone?: "positive" | "negative" | "neutral";
    tone?: BusinessListDashboardTone;
};

export type BusinessListBreakdownItem = {
    key: string;
    label: string;
    value: number;
    helper?: string;
    tone?: BusinessListDashboardTone;
};

export type BusinessListActivityItem = {
    id: string;
    title: string;
    description?: string;
    occurredAt?: string | null;
    href?: string;
    tone?: BusinessListDashboardTone;
    kind?:
        | "created"
        | "updated"
        | "submitted"
        | "approved"
        | "rejected"
        | "media"
        | "downloaded";
};

export type BusinessListDashboardData = {
    generatedAt?: string;
    periodLabel?: string;
    metrics: BusinessListMetric[];
    inventoryValue?: {
        label: string;
        value: number;
        currency?: string;
        helper?: string;
        trend?: number[];
        change?: string;
        changeTone?: "positive" | "negative" | "neutral";
        changeSuffix?: string;
    };
    breakdown?: {
        label: string;
        total: number;
        items: BusinessListBreakdownItem[];
    };
    breakdowns?: Record<string, {
        label: string;
        total: number;
        items: BusinessListBreakdownItem[];
    }>;
    activities?: {
        label: string;
        items: BusinessListActivityItem[];
    };
};

export type BusinessListDashboardView = {
    key: string;
    label: string;
};

export type BusinessListDashboardWidgetKey =
    | "overview"
    | "value-trend"
    | "status-breakdown"
    | "recent-activity"
    | "watch-media"
    | "watch-service"
    | "watch-readiness"
    | "watch-aging";
