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
    href?: string | null;
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

export type BusinessEntityPreviewNote = {
    label: string;
    body: string;
    tone?: "neutral" | "info" | "warning";
};

export type BusinessEntityPreviewActivity = {
    taskItemId: string;
    discussionEnabled: boolean;
    items: TaskItemActivityViewModel[];
    viewerUserId?: string | null;
    mentionableUsers?: Array<{
        id: string;
        label: string;
        avatarUrl?: string | null;
    }>;
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
    notes?: BusinessEntityPreviewNote[];
    activity?: BusinessEntityPreviewActivity;
    sections?: BusinessEntityPreviewSection[];
    actions?: BusinessEntityPreviewAction[];
    edit?: {
        kind: "TECHNICAL_ISSUE";
        values: {
            summary: string;
            note: string;
            area: string;
            actionMode: string;
            vendorId: string;
            estimatedCost: string;
            expectedWorkingDays: string;
        };
        vendorOptions: Array<{ id: string; name: string }>;
    };
};
import type { TaskItemActivityViewModel } from "@/domains/task/server/activity";
