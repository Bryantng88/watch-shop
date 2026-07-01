import type {
    TimelineEntryIcon,
    TimelineEntryTone,
    TimelineEntryViewModel,
} from "./timeline-renderer.types";

export type TimelineActivityKind =
    | "BUSINESS_EVENT"
    | "USER_COMMENT"
    | "BUSINESS_FEEDBACK"
    | "WORKFLOW_ACTION"
    | "NOTIFICATION"
    | "SYSTEM"
    | "TIMELINE_ENTRY";

export type TimelineActivityChildKind =
    | "FEEDBACK"
    | "REPLY"
    | "WORKFLOW"
    | "NOTIFICATION"
    | "ENTRY";

export type TimelineActivityChildViewModel = {
    id: string;
    kind: TimelineActivityChildKind;
    sourceType: string;
    title: string;
    body?: string | null;
    actorLabel?: string | null;
    occurredAt: TimelineEntryViewModel["occurredAt"];
    createdAt?: TimelineEntryViewModel["createdAt"];
    tone: TimelineEntryTone;
    icon: TimelineEntryIcon;
    eventKey?: string | null;
    businessEventLogId?: string | null;
    activityId?: string | null;
    metadataJson?: unknown;
};

export type TimelineActivityViewModel = {
    id: string;
    kind: TimelineActivityKind;
    sourceType: string;
    title: string;
    body?: string | null;
    actorLabel?: string | null;
    occurredAt: TimelineEntryViewModel["occurredAt"];
    createdAt?: TimelineEntryViewModel["createdAt"];
    tone: TimelineEntryTone;
    icon: TimelineEntryIcon;
    eventKey?: string | null;
    businessEventLogId?: string | null;
    activityId?: string | null;
    metadataJson?: unknown;
    children: TimelineActivityChildViewModel[];
    replies: TimelineActivityChildViewModel[];
    feedback: TimelineActivityChildViewModel[];
    workflow: TimelineActivityChildViewModel[];
    notifications: TimelineActivityChildViewModel[];
};
