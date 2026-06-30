export type TimelineEntryTone = "slate" | "blue" | "green" | "amber" | "rose";

export type TimelineEntryIcon =
    | "message"
    | "event"
    | "feedback"
    | "workflow"
    | "notification"
    | "system";

export type TimelineEntryViewModel = {
    id: string;
    sourceType: string;
    title: string;
    subtitle?: string | null;
    body?: string | null;
    actorLabel?: string | null;
    occurredAt: Date | string | null;
    createdAt?: Date | string | null;
    tone: TimelineEntryTone;
    icon: TimelineEntryIcon;
    metadataJson?: unknown;
};

export type TimelineActivityBlock = {
    id: string;
    kind: "BUSINESS_EVENT" | "USER_COMMENT" | "TIMELINE_ENTRY";
    entry: TimelineEntryViewModel;
    feedbackEntries: TimelineEntryViewModel[];
    eventKey?: string | null;
    businessEventLogId?: string | null;
};
