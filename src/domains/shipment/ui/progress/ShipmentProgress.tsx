"use client";

import { cn } from "@/lib/utils";
import {
    ShipmentStateSignalIcon,
    shipmentSignalLineClass,
} from "@/domains/shared/ui/icons";

type ShipmentProgressStatus =
    | "PENDING"
    | "DRAFT"
    | "READY"
    | "SHIPPED"
    | "RETURNING"
    | "DELIVERED"
    | "RETURNED"
    | "CANCELLED"
    | string
    | null
    | undefined;

export type ShipmentProgressEvent = {
    key: string;
    status: ShipmentProgressStatus;
    label?: string;
    at?: string | Date | null;
};

type NormalizedShipmentProgressEvent = {
    key: string;
    status: string;
    label: string;
    at?: string | Date | null;
};

type HiddenPreviousCycleEvent = {
    key: string;
    status: "PREVIOUS_CYCLE";
    label: string;
    hiddenCount: number;
    hiddenTitle: string;
};

type VisibleShipmentProgressEvent =
    | NormalizedShipmentProgressEvent
    | HiddenPreviousCycleEvent;

type Props = {
    status?: ShipmentProgressStatus;
    events?: ShipmentProgressEvent[];
    compact?: boolean;
    maxVisibleEvents?: number;
};

const STATUS_LABEL: Record<string, string> = {
    READY: "Chờ giao",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    RETURNING: "Đang hoàn",
    RETURNED: "Đã hoàn",
    CANCELLED: "Đã huỷ",
};

function normalizeStatus(status: ShipmentProgressStatus) {
    const key = String(status ?? "").toUpperCase();

    if (key === "PENDING" || key === "DRAFT") return "READY";
    if (key === "READY") return "READY";
    if (key === "SHIPPED") return "SHIPPED";
    if (key === "RETURNING") return "RETURNING";
    if (key === "DELIVERED") return "DELIVERED";
    if (key === "RETURNED") return "RETURNED";
    if (key === "CANCELLED" || key === "CANCELED") return "CANCELLED";

    return "READY";
}

function isTerminalShipmentEvent(status: ShipmentProgressStatus) {
    const normalized = normalizeStatus(status);
    return normalized === "RETURNED" || normalized === "CANCELLED";
}

function buildFallbackEvents(status: ShipmentProgressStatus): ShipmentProgressEvent[] {
    const current = normalizeStatus(status);

    if (current === "CANCELLED") {
        return [{ key: "cancelled", status: "CANCELLED" }];
    }

    if (current === "READY") {
        return [{ key: "ready", status: "READY" }];
    }

    if (current === "SHIPPED") {
        return [
            { key: "ready", status: "READY" },
            { key: "shipped", status: "SHIPPED" },
        ];
    }

    if (current === "DELIVERED") {
        return [
            { key: "ready", status: "READY" },
            { key: "shipped", status: "SHIPPED" },
            { key: "delivered", status: "DELIVERED" },
        ];
    }

    if (current === "RETURNING") {
        return [
            { key: "ready", status: "READY" },
            { key: "shipped", status: "SHIPPED" },
            { key: "returning", status: "RETURNING" },
        ];
    }

    if (current === "RETURNED") {
        return [
            { key: "ready", status: "READY" },
            { key: "shipped", status: "SHIPPED" },
            { key: "returning", status: "RETURNING" },
            { key: "returned", status: "RETURNED" },
        ];
    }

    return [{ key: "ready", status: "READY" }];
}

function normalizeEvents(events?: ShipmentProgressEvent[], status?: ShipmentProgressStatus) {
    const source = events?.length ? events : buildFallbackEvents(status);

    return source.map((event, index): NormalizedShipmentProgressEvent => {
        const normalized = normalizeStatus(event.status);

        return {
            key: event.key || `${normalized}-${index}`,
            status: normalized,
            label: event.label || STATUS_LABEL[normalized] || STATUS_LABEL.READY,
            at: event.at,
        };
    });
}

function formatEventTime(value?: string | Date | null) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function buildHiddenTitle(events: NormalizedShipmentProgressEvent[]) {
    return events
        .map((event) => [event.label, formatEventTime(event.at)].filter(Boolean).join(" · "))
        .filter(Boolean)
        .join("\n");
}

function getCurrentCycleTimeline(
    timeline: NormalizedShipmentProgressEvent[],
    maxVisibleEvents: number,
): {
    visibleTimeline: VisibleShipmentProgressEvent[];
    hiddenCount: number;
    hiddenTitle: string;
    hiddenMode: "previous-cycle" | "overflow" | null;
} {
    const lastTerminalIndex = timeline.findLastIndex((event) =>
        isTerminalShipmentEvent(event.status),
    );

    if (lastTerminalIndex >= 0 && lastTerminalIndex < timeline.length - 1) {
        const hiddenEvents = timeline.slice(0, lastTerminalIndex + 1);
        const currentCycleEvents = timeline.slice(lastTerminalIndex + 1);

        return {
            visibleTimeline: [
                {
                    key: "previous-shipment-cycle",
                    status: "PREVIOUS_CYCLE",
                    label: "Vòng giao trước",
                    hiddenCount: hiddenEvents.length,
                    hiddenTitle: buildHiddenTitle(hiddenEvents),
                },
                ...currentCycleEvents,
            ],
            hiddenCount: hiddenEvents.length,
            hiddenTitle: buildHiddenTitle(hiddenEvents),
            hiddenMode: "previous-cycle",
        };
    }

    const hiddenCount = Math.max(0, timeline.length - maxVisibleEvents);
    const hiddenEvents = hiddenCount > 0 ? timeline.slice(0, hiddenCount) : [];

    return {
        visibleTimeline: hiddenCount > 0 ? timeline.slice(-maxVisibleEvents) : timeline,
        hiddenCount,
        hiddenTitle: buildHiddenTitle(hiddenEvents),
        hiddenMode: hiddenCount > 0 ? "overflow" : null,
    };
}

function isHiddenPreviousCycleEvent(
    event: VisibleShipmentProgressEvent,
): event is HiddenPreviousCycleEvent {
    return event.status === "PREVIOUS_CYCLE";
}

export default function ShipmentProgress({
    status,
    events,
    compact = false,
    maxVisibleEvents = compact ? 5 : 6,
}: Props) {
    const timeline = normalizeEvents(events, status);
    const current = timeline[timeline.length - 1];

    if (!timeline.length) return null;

    if (timeline.length === 1 && current?.status === "CANCELLED") {
        return <ShipmentStateSignalIcon status="CANCELLED" />;
    }

    const { visibleTimeline, hiddenCount, hiddenTitle, hiddenMode } =
        getCurrentCycleTimeline(timeline, maxVisibleEvents);

    const visibleNodeCount = visibleTimeline.filter(
        (event) => !isHiddenPreviousCycleEvent(event),
    ).length;

    const widthClass =
        visibleTimeline.length >= 5
            ? compact
                ? "max-w-[260px]"
                : "max-w-[340px]"
            : visibleTimeline.length >= 4
                ? compact
                    ? "max-w-[230px]"
                    : "max-w-[300px]"
                : visibleTimeline.length >= 3
                    ? compact
                        ? "max-w-[190px]"
                        : "max-w-[250px]"
                    : compact
                        ? "max-w-[180px]"
                        : "max-w-[230px]";

    return (
        <div className={cn("w-full", widthClass)}>
            <div className="flex items-center">
                {visibleTimeline.map((event, index) => {
                    if (isHiddenPreviousCycleEvent(event)) {
                        return (
                            <div
                                key={event.key}
                                className="flex items-center"
                                title={`Đã ẩn ${event.hiddenCount} stage của vòng giao trước${event.hiddenTitle ? `\n${event.hiddenTitle}` : ""}`}
                            >
                                <div className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-1.5 text-[10px] font-bold text-slate-400">
                                    +{event.hiddenCount}
                                </div>

                                {visibleNodeCount > 0 ? (
                                    <div className="mx-1 h-px w-5 bg-slate-200" />
                                ) : null}
                            </div>
                        );
                    }

                    const nextEvent = visibleTimeline[index + 1];
                    const isPast = index < visibleTimeline.length - 1;
                    const nextStatus = !nextEvent || isHiddenPreviousCycleEvent(nextEvent)
                        ? undefined
                        : (nextEvent.status as keyof typeof shipmentSignalLineClass);

                    return (
                        <div key={event.key} className="flex flex-1 items-center last:flex-none">
                            <div
                                className={cn("transition duration-200", isPast && "opacity-35 grayscale")}
                                title={[event.label, formatEventTime(event.at)].filter(Boolean).join(" · ")}
                            >
                                <ShipmentStateSignalIcon status={event.status} />
                            </div>

                            {index < visibleTimeline.length - 1 ? (
                                <div
                                    className={cn(
                                        "mx-1 h-px flex-1 transition",
                                        isPast
                                            ? "bg-slate-300"
                                            : nextStatus
                                                ? shipmentSignalLineClass[nextStatus] ?? "bg-slate-200"
                                                : "bg-slate-200",
                                    )}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {!compact ? (
                <div className="mt-1.5 text-xs font-semibold text-slate-600">
                    {current?.label || STATUS_LABEL.READY}
                    {hiddenCount > 0 ? (
                        <span className="ml-2 font-medium text-slate-400">
                            {hiddenMode === "previous-cycle"
                                ? `Đã ẩn ${hiddenCount} stage của vòng giao trước.`
                                : `Đã ẩn ${hiddenCount} stage cũ.`}
                            {hiddenTitle ? ` Rê chuột vào +${hiddenCount} để xem nhanh.` : ""}
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
