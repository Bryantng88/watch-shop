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

type Props = {
    status?: ShipmentProgressStatus;
    events?: ShipmentProgressEvent[];
    compact?: boolean;
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
    if (key === "CANCELLED") return "CANCELLED";

    return "READY";
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

    return source.map((event, index) => {
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
export default function ShipmentProgress({ status, events, compact = false }: Props) {
    const timeline = normalizeEvents(events, status);
    const current = timeline[timeline.length - 1];

    if (!timeline.length) return null;

    if (timeline.length === 1 && current?.status === "CANCELLED") {
        return <ShipmentStateSignalIcon status="CANCELLED" />;
    }

    const widthClass =
        timeline.length >= 5
            ? compact
                ? "max-w-[260px]"
                : "max-w-[340px]"
            : timeline.length >= 4
                ? compact
                    ? "max-w-[230px]"
                    : "max-w-[300px]"
                : compact
                    ? "max-w-[180px]"
                    : "max-w-[230px]";

    return (
        <div className={cn("w-full", widthClass)}>
            <div className="flex items-center">
                {timeline.map((event, index) => {
                    const isPast = index < timeline.length - 1;
                    const nextStatus = timeline[index + 1]?.status as
                        | keyof typeof shipmentSignalLineClass
                        | undefined;

                    return (
                        <div key={event.key} className="flex flex-1 items-center last:flex-none">
                            <div
                                className={cn("transition duration-200", isPast && "opacity-35 grayscale")}
                                title={[event.label, formatEventTime(event.at)].filter(Boolean).join(" · ")}
                            >
                                <ShipmentStateSignalIcon status={event.status} />
                            </div>

                            {index < timeline.length - 1 ? (
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
                </div>
            ) : null}
        </div>
    );
}