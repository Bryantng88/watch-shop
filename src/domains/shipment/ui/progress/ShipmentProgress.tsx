"use client";

import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    inactiveShipmentSignalClass,
    ShipmentStateSignalIcon,
    shipmentSignalLineClass,
} from "@/domains/shared/ui/icons";

type ShipmentProgressStatus =
    | "PENDING"
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
    status?: ShipmentProgressStatus;
    compact?: boolean;
};

const STAGES = [
    { key: "READY", label: "Chờ giao" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "DELIVERED", label: "Đã giao" },
] as const;

function normalizeStatus(status: ShipmentProgressStatus) {
    const key = String(status ?? "").toUpperCase();

    if (key === "PENDING" || key === "DRAFT") return "READY";
    if (key === "READY") return "READY";
    if (key === "SHIPPED") return "SHIPPED";
    if (key === "DELIVERED") return "DELIVERED";
    if (key === "RETURNED") return "RETURNED";
    if (key === "CANCELLED") return "CANCELLED";

    return "READY";
}

function activeIndex(status: string) {
    if (status === "DELIVERED") return 2;
    if (status === "SHIPPED") return 1;
    return 0;
}

export default function ShipmentProgress({ status, compact = false }: Props) {
    const current = normalizeStatus(status);
    const currentIndex = activeIndex(current);

    if (current === "RETURNED") {
        return (
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                <RotateCcw className="h-3.5 w-3.5" />
                Hoàn trả
            </div>
        );
    }

    if (current === "CANCELLED") {
        return (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                Đã huỷ
            </div>
        );
    }

    return (
        <div className={cn("w-full", compact ? "max-w-[180px]" : "max-w-[230px]")}>
            <div className="flex items-center">
                {STAGES.map((stage, index) => {
                    const active = index === currentIndex;

                    return (
                        <div key={stage.key} className="flex flex-1 items-center last:flex-none">
                            <ShipmentStateSignalIcon
                                status={stage.key}
                                className={active ? undefined : inactiveShipmentSignalClass}
                            />

                            {index < STAGES.length - 1 ? (
                                <div
                                    className={cn(
                                        "mx-1 h-px flex-1 transition",
                                        currentIndex > index
                                            ? shipmentSignalLineClass[STAGES[index + 1].key]
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
                    {STAGES[currentIndex]?.label || "Chờ giao"}
                </div>
            ) : null}
        </div>
    );
}

export { ShipmentProgress };