import { TimelineContainerType } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { listTimelineEntryRecords } from "./timeline.repo";
import {
    mapTimelineEntryToViewModel,
    type TimelineEntryViewModel,
} from "./timeline-renderer.service";
import type {
    TimelineActivityChildKind,
    TimelineActivityChildViewModel,
    TimelineActivityKind,
    TimelineActivityViewModel,
} from "./timeline-activity.types";

type TimelineActivityInput = TimelineEntryViewModel | Record<string, unknown>;

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function metadataRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as Record<string, unknown>;
}

function metadataText(entry: TimelineEntryViewModel, key: string) {
    const text = clean(metadataRecord(entry.metadataJson)[key]);
    return text || null;
}

function isTimelineEntryViewModel(
    entry: TimelineActivityInput,
): entry is TimelineEntryViewModel {
    return (
        typeof entry === "object" &&
        entry !== null &&
        "body" in entry &&
        "tone" in entry &&
        "icon" in entry
    );
}

function toViewModel(entry: TimelineActivityInput): TimelineEntryViewModel {
    return isTimelineEntryViewModel(entry)
        ? entry
        : mapTimelineEntryToViewModel(entry);
}

function toTime(value?: Date | string | null) {
    if (!value) return 0;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function activityTime(entry: TimelineEntryViewModel) {
    if (entry.sourceType === "BUSINESS_FEEDBACK") {
        return toTime(entry.createdAt) || toTime(entry.occurredAt);
    }

    return toTime(entry.occurredAt);
}

function compareEntries(
    a: TimelineEntryViewModel,
    b: TimelineEntryViewModel,
) {
    const timeDiff = activityTime(a) - activityTime(b);
    if (timeDiff !== 0) return timeDiff;
    return a.id.localeCompare(b.id);
}

function activityKind(sourceType: string): TimelineActivityKind {
    if (sourceType === "BUSINESS_EVENT") return "BUSINESS_EVENT";
    if (sourceType === "USER_COMMENT") return "USER_COMMENT";
    if (sourceType === "BUSINESS_FEEDBACK") return "BUSINESS_FEEDBACK";
    if (sourceType === "WORKFLOW_ACTION") return "WORKFLOW_ACTION";
    if (sourceType === "NOTIFICATION") return "NOTIFICATION";
    if (sourceType === "SYSTEM") return "SYSTEM";
    return "TIMELINE_ENTRY";
}

function childKind(sourceType: string): TimelineActivityChildKind {
    if (sourceType === "BUSINESS_FEEDBACK") return "FEEDBACK";
    if (sourceType === "USER_COMMENT") return "REPLY";
    if (sourceType === "WORKFLOW_ACTION") return "WORKFLOW";
    if (sourceType === "NOTIFICATION") return "NOTIFICATION";
    return "ENTRY";
}

function businessEventLogId(entry: TimelineEntryViewModel) {
    return metadataText(entry, "businessEventLogId");
}

function activityId(entry: TimelineEntryViewModel) {
    return metadataText(entry, "activityId");
}

function eventKey(entry: TimelineEntryViewModel) {
    return metadataText(entry, "eventKey");
}

function toChild(entry: TimelineEntryViewModel): TimelineActivityChildViewModel {
    return {
        id: entry.id,
        kind: childKind(entry.sourceType),
        sourceType: entry.sourceType,
        title: entry.title,
        body: entry.body,
        actorLabel: entry.actorLabel,
        occurredAt: entry.occurredAt,
        createdAt: entry.createdAt,
        tone: entry.tone,
        icon: entry.icon,
        eventKey: eventKey(entry),
        businessEventLogId: businessEventLogId(entry),
        activityId: activityId(entry),
        metadataJson: entry.metadataJson,
    };
}

function toActivity(entry: TimelineEntryViewModel): TimelineActivityViewModel {
    return {
        id: entry.id,
        kind: activityKind(entry.sourceType),
        sourceType: entry.sourceType,
        title: entry.title,
        body: entry.body,
        actorLabel: entry.actorLabel,
        occurredAt: entry.occurredAt,
        createdAt: entry.createdAt,
        tone: entry.tone,
        icon: entry.icon,
        eventKey: eventKey(entry),
        businessEventLogId: businessEventLogId(entry),
        activityId: activityId(entry),
        metadataJson: entry.metadataJson,
        children: [],
        replies: [],
        feedback: [],
        workflow: [],
        notifications: [],
    };
}

function attachChild(
    activity: TimelineActivityViewModel,
    entry: TimelineEntryViewModel,
) {
    const child = toChild(entry);
    activity.children.push(child);

    if (child.kind === "FEEDBACK") {
        activity.feedback.push(child);
    } else if (child.kind === "REPLY") {
        activity.replies.push(child);
    } else if (child.kind === "WORKFLOW") {
        activity.workflow.push(child);
    } else if (child.kind === "NOTIFICATION") {
        activity.notifications.push(child);
    }
}

function sortActivityChildren(activity: TimelineActivityViewModel) {
    const byTime = (
        a: TimelineActivityChildViewModel,
        b: TimelineActivityChildViewModel,
    ) => {
        const diff = toTime(a.occurredAt) - toTime(b.occurredAt);
        if (diff !== 0) return diff;
        return a.id.localeCompare(b.id);
    };

    activity.children.sort(byTime);
    activity.replies.sort(byTime);
    activity.feedback.sort(byTime);
    activity.workflow.sort(byTime);
    activity.notifications.sort(byTime);
}

function canAttachBySourceType(entry: TimelineEntryViewModel) {
    return (
        entry.sourceType === "BUSINESS_FEEDBACK" ||
        entry.sourceType === "WORKFLOW_ACTION" ||
        entry.sourceType === "NOTIFICATION" ||
        entry.sourceType === "USER_COMMENT"
    );
}

export function buildTimelineActivities(
    entries: TimelineActivityInput[],
): TimelineActivityViewModel[] {
    const viewModels = (Array.isArray(entries) ? entries : [])
        .map(toViewModel)
        .sort(compareEntries);

    const activities: TimelineActivityViewModel[] = [];
    const activityById = new Map<string, TimelineActivityViewModel>();
    const activityByBusinessLogId = new Map<string, TimelineActivityViewModel>();

    for (const entry of viewModels) {
        if (entry.sourceType !== "BUSINESS_EVENT") continue;

        const activity = toActivity(entry);
        activities.push(activity);
        activityById.set(activity.id, activity);

        const logId = businessEventLogId(entry);
        if (logId) activityByBusinessLogId.set(logId, activity);
    }

    const groupedEntryIds = new Set<string>();

    for (const entry of viewModels) {
        if (entry.sourceType === "BUSINESS_EVENT" || !canAttachBySourceType(entry)) {
            continue;
        }

        const explicitActivityId = activityId(entry);
        const logId = businessEventLogId(entry);
        const activity =
            (explicitActivityId ? activityById.get(explicitActivityId) : null) ??
            (logId ? activityByBusinessLogId.get(logId) : null);

        if (!activity) continue;

        attachChild(activity, entry);
        groupedEntryIds.add(entry.id);
    }

    for (const entry of viewModels) {
        if (entry.sourceType === "BUSINESS_EVENT" || groupedEntryIds.has(entry.id)) {
            continue;
        }

        const activity = toActivity(entry);
        activities.push(activity);
        activityById.set(activity.id, activity);

        const logId = businessEventLogId(entry);
        if (logId && !activityByBusinessLogId.has(logId)) {
            activityByBusinessLogId.set(logId, activity);
        }
    }

    activities.sort((a, b) => {
        const timeDiff = toTime(a.occurredAt) - toTime(b.occurredAt);
        if (timeDiff !== 0) return timeDiff;
        return a.id.localeCompare(b.id);
    });
    activities.forEach(sortActivityChildren);

    return activities;
}

export async function buildTaskItemActivities(
    taskItemId: string,
    limit?: number,
    db: DB = prisma,
) {
    const entries = await listTimelineEntryRecords(db, {
        containerType: TimelineContainerType.TASK_ITEM,
        containerId: taskItemId,
        limit,
    });

    return buildTimelineActivities(entries);
}
