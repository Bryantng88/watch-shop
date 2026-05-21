"use client";

import { cn } from "@/lib/utils";

type ShipmentStatus =
    | "DRAFT"
    | "READY"
    | "SHIPPED"
    | "DELIVERED"
    | "RETURNED"
    | "CANCELLED"
    | string
    | null
    | undefined;

type Props = {
    status?: ShipmentStatus;
};

function normalize(status: ShipmentStatus) {
    return String(status ?? "").toUpperCase();
}

const statusMap = {
    READY: {
        label: "Chờ giao",
        className:
            "bg-amber-50 text-amber-700 ring-amber-200",
    },

    SHIPPED: {
        label: "Đang giao",
        className:
            "bg-blue-50 text-blue-700 ring-blue-200",
    },

    DELIVERED: {
        label: "Đã giao",
        className:
            "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },

    RETURNED: {
        label: "Hoàn trả",
        className:
            "bg-rose-50 text-rose-700 ring-rose-200",
    },

    CANCELLED: {
        label: "Đã huỷ",
        className:
            "bg-slate-100 text-slate-500 ring-slate-200",
    },
} as const;

export default function ShipmentStatusBadge({
    status,
}: Props) {
    const key = normalize(status);

    const config =
        statusMap[key as keyof typeof statusMap] ??
        statusMap.READY;

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
                config.className
            )}
        >
            {config.label}
        </div>
    );
}