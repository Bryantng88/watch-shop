import type {
    TimelineActivityBlock,
    TimelineEntryIcon,
    TimelineEntryTone,
    TimelineEntryViewModel,
} from "./timeline-renderer.types";

type TimelineRenderPreset = {
    title: string;
    tone: TimelineEntryTone;
    icon: TimelineEntryIcon;
};

const SOURCE_PRESETS: Record<string, TimelineRenderPreset> = {
    BUSINESS_FEEDBACK: {
        title: "Feedback",
        tone: "amber",
        icon: "feedback",
    },
    USER_COMMENT: {
        title: "Bình luận",
        tone: "slate",
        icon: "message",
    },
    BUSINESS_EVENT: {
        title: "Sự kiện nghiệp vụ",
        tone: "blue",
        icon: "event",
    },
    WORKFLOW_ACTION: {
        title: "Workflow",
        tone: "green",
        icon: "workflow",
    },
    NOTIFICATION: {
        title: "Thông báo",
        tone: "blue",
        icon: "notification",
    },
    SYSTEM: {
        title: "Hệ thống",
        tone: "slate",
        icon: "system",
    },
};

const DEFAULT_PRESET: TimelineRenderPreset = {
    title: "Sự kiện",
    tone: "slate",
    icon: "event",
};

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function nullableClean(value: unknown) {
    const text = clean(value);
    return text || null;
}

export function mapTimelineEntryToViewModel(
    entry: Record<string, unknown>,
): TimelineEntryViewModel {
    const sourceType = clean(entry?.sourceType);
    const preset = SOURCE_PRESETS[sourceType] ?? DEFAULT_PRESET;

    return {
        id: clean(entry?.id),
        sourceType,
        title: nullableClean(entry?.title) ?? preset.title,
        subtitle: nullableClean(entry?.subtitle),
        body: nullableClean(entry?.bodySnapshot),
        actorLabel: nullableClean(entry?.actorLabel),
        occurredAt: entry?.occurredAt ?? null,
        createdAt: entry?.createdAt ?? null,
        tone: preset.tone,
        icon: preset.icon,
        metadataJson: entry?.metadataJson,
    };
}

export function mapTimelineEntriesToViewModels(
    entries: Record<string, unknown>[],
): TimelineEntryViewModel[] {
    return (Array.isArray(entries) ? entries : []).map(mapTimelineEntryToViewModel);
}

function metadataRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as Record<string, unknown>;
}

function metadataText(entry: TimelineEntryViewModel, key: string) {
    const value = metadataRecord(entry.metadataJson)[key];
    const text = clean(value);
    return text || null;
}

function occurredTime(entry: TimelineEntryViewModel) {
    const date = entry.occurredAt ? new Date(entry.occurredAt) : null;
    const time = date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
    return time;
}

function createdTime(entry: TimelineEntryViewModel) {
    const date = entry.createdAt ? new Date(entry.createdAt) : null;
    return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
}

function activityTime(entry: TimelineEntryViewModel) {
    if (entry.sourceType === "BUSINESS_FEEDBACK") {
        return createdTime(entry) || occurredTime(entry);
    }

    return occurredTime(entry);
}

function compareTimelineEntries(
    a: TimelineEntryViewModel,
    b: TimelineEntryViewModel,
) {
    const timeDiff = activityTime(a) - activityTime(b);
    if (timeDiff !== 0) return timeDiff;
    return a.id.localeCompare(b.id);
}

function nextBusinessEventTime(
    eventEntries: TimelineEntryViewModel[],
    event: TimelineEntryViewModel,
) {
    const currentTime = activityTime(event);
    const nextEvent = eventEntries.find(
        (candidate) =>
            candidate.id !== event.id && activityTime(candidate) > currentTime,
    );

    return nextEvent ? activityTime(nextEvent) : null;
}

function blockKind(entry: TimelineEntryViewModel): TimelineActivityBlock["kind"] {
    if (entry.sourceType === "BUSINESS_EVENT") return "BUSINESS_EVENT";
    if (entry.sourceType === "USER_COMMENT") return "USER_COMMENT";
    return "TIMELINE_ENTRY";
}

function makeActivityBlock(
    entry: TimelineEntryViewModel,
    feedbackEntries: TimelineEntryViewModel[] = [],
): TimelineActivityBlock {
    return {
        id: entry.id,
        kind: blockKind(entry),
        entry,
        feedbackEntries: [...feedbackEntries].sort(compareTimelineEntries),
        eventKey: metadataText(entry, "eventKey"),
        businessEventLogId: metadataText(entry, "businessEventLogId"),
    };
}

export function groupTimelineEntriesToActivityBlocks(
    entries: TimelineEntryViewModel[],
): TimelineActivityBlock[] {
    const sortedEntries = [...(Array.isArray(entries) ? entries : [])].sort(
        compareTimelineEntries,
    );
    const eventEntries = sortedEntries.filter(
        (entry) => entry.sourceType === "BUSINESS_EVENT",
    );
    const eventByBusinessLogId = new Map<string, TimelineEntryViewModel>();

    for (const entry of eventEntries) {
        const businessEventLogId = metadataText(entry, "businessEventLogId");
        if (businessEventLogId) eventByBusinessLogId.set(businessEventLogId, entry);
    }

    const feedbackByEventId = new Map<string, TimelineEntryViewModel[]>();
    const groupedFeedbackIds = new Set<string>();

    for (const entry of sortedEntries) {
        if (entry.sourceType !== "BUSINESS_FEEDBACK") continue;

        const businessEventLogId = metadataText(entry, "businessEventLogId");
        const eventEntry = businessEventLogId
            ? eventByBusinessLogId.get(businessEventLogId)
            : null;

        if (!businessEventLogId || !eventEntry) {
            continue;
        }

        const nextEventTime = nextBusinessEventTime(eventEntries, eventEntry);
        if (nextEventTime && activityTime(entry) > nextEventTime) {
            continue;
        }

        const group = feedbackByEventId.get(businessEventLogId) ?? [];
        group.push(entry);
        feedbackByEventId.set(businessEventLogId, group);
        groupedFeedbackIds.add(entry.id);
    }

    return sortedEntries
        .filter((entry) => !groupedFeedbackIds.has(entry.id))
        .map((entry) => {
            if (entry.sourceType !== "BUSINESS_EVENT") return makeActivityBlock(entry);

            const businessEventLogId = metadataText(entry, "businessEventLogId");
            const feedbackEntries = businessEventLogId
                ? feedbackByEventId.get(businessEventLogId) ?? []
                : [];

            return makeActivityBlock(entry, feedbackEntries);
        });
}

export type {
    TimelineActivityBlock,
    TimelineEntryViewModel,
} from "./timeline-renderer.types";
