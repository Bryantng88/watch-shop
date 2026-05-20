"use client";

import { CheckCircle2, PackageCheck, RotateCcw, Truck } from "lucide-react";

import { cn } from "@/lib/utils";

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
    {
        key: "READY",
        label: "Chuẩn bị",
        icon: PackageCheck,
    },
    {
        key: "SHIPPED",
        label: "Đang giao",
        icon: Truck,
    },
    {
        key: "DELIVERED",
        label: "Đã giao",
        icon: CheckCircle2,
    },
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
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
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
        <div className={cn("w-full", compact ? "max-w-[170px]" : "max-w-[220px]")}>
            <div className="flex items-center">
                {STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    const active = index === currentIndex;

                    return (
                        <div key={stage.key} className="flex flex-1 items-center last:flex-none">
                            <div
                                className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-full ring-1 transition",
                                    active
                                        ? "bg-blue-50 text-blue-600 ring-blue-100"
                                        : "bg-slate-50 text-slate-300 ring-slate-200"
                                )}
                                title={stage.label}
                            >
                                <Icon className="h-3.5 w-3.5" />
                            </div>

                            {index < STAGES.length - 1 ? (
                                <div className="mx-1 h-px flex-1 bg-slate-200" />
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {!compact ? (
                <div className="mt-1.5 text-xs font-semibold text-slate-600">
                    {STAGES[currentIndex]?.label || "Chuẩn bị"}
                </div>
            ) : null}
        </div>
    );
}