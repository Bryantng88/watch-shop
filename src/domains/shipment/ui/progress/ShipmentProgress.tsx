"use client";

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
    | "RETURNING"
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

const NORMAL_STAGES = [
    { key: "READY", label: "Chờ giao" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "DELIVERED", label: "Đã giao" },
] as const;

const RETURN_STAGES = [
    { key: "READY", label: "Chờ giao" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "RETURNING", label: "Đang hoàn" },
    { key: "RETURNED", label: "Đã hoàn" },
] as const;

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

export default function ShipmentProgress({ status, compact = false }: Props) {
    const current = normalizeStatus(status);

    if (current === "CANCELLED") {
        return <ShipmentStateSignalIcon status="CANCELLED" />;
    }

    const stages = current === "RETURNING" || current === "RETURNED" ? RETURN_STAGES : NORMAL_STAGES;
    const currentIndex = Math.max(0, stages.findIndex((stage) => stage.key === current));
    const widthClass = stages.length > 3 ? (compact ? "max-w-[230px]" : "max-w-[280px]") : (compact ? "max-w-[180px]" : "max-w-[230px]");

    return (
        <div className={cn("w-full", widthClass)}>
            <div className="flex items-center">
                {stages.map((stage, index) => {
                    const active = index === currentIndex;
                    const nextStage = stages[index + 1]?.key as keyof typeof shipmentSignalLineClass | undefined;

                    return (
                        <div key={stage.key} className="flex flex-1 items-center last:flex-none">
                            <ShipmentStateSignalIcon
                                status={stage.key}
                                className={active ? undefined : inactiveShipmentSignalClass}
                            />

                            {index < stages.length - 1 ? (
                                <div
                                    className={cn(
                                        "mx-1 h-px flex-1 transition",
                                        currentIndex > index && nextStage
                                            ? shipmentSignalLineClass[nextStage] ?? "bg-slate-200"
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
                    {stages[currentIndex]?.label || "Chờ giao"}
                </div>
            ) : null}
        </div>
    );
}
