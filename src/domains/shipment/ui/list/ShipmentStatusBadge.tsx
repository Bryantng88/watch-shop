"use client";

import {
    Ban,
    Package,
    PackageCheck,
    RotateCcw,
    Truck,
} from "lucide-react";

import { ShipmentStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const CONFIG = {
    [ShipmentStatus.READY]: {
        label: "Chờ giao",
        Icon: Package,
        className: "bg-slate-50 text-slate-400 ring-slate-200",
    },

    [ShipmentStatus.SHIPPED]: {
        label: "Đang giao",
        Icon: Truck,
        className: "bg-blue-50 text-blue-600 ring-blue-200",
    },

    [ShipmentStatus.DELIVERED]: {
        label: "Đã giao",
        Icon: PackageCheck,
        className: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    },

    [ShipmentStatus.RETURNED]: {
        label: "Hoàn trả",
        Icon: RotateCcw,
        className: "bg-orange-50 text-orange-600 ring-orange-200",
    },

    [ShipmentStatus.CANCELLED]: {
        label: "Đã hủy",
        Icon: Ban,
        className: "bg-slate-100 text-slate-500 ring-slate-200",
    },
};

export default function ShipmentStatusBadge({
    status,
}: {
    status?: ShipmentStatus | string | null;
}) {
    const key = String(status ?? "").toUpperCase() as ShipmentStatus;

    const config =
        CONFIG[key] ?? CONFIG[ShipmentStatus.READY];

    const Icon = config.Icon;

    return (
        <span
            title={config.label}
            className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full ring-1",
                config.className,
            )}
        >
            <Icon className="h-4 w-4" />
        </span>
    );
}