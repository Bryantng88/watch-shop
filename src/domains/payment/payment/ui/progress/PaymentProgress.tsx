"use client";

import { CheckCircle2, CircleDollarSign, Landmark } from "lucide-react";

import { cn } from "@/lib/utils";

type PaymentProgressProps = {
    status?: string | null;
    remainingAmount?: number | string | null;
    collectedAmount?: number | string | null;
    compact?: boolean;
};

const STAGES = [
    { key: "CREATED", label: "Cần thu", icon: CircleDollarSign },
    { key: "PARTIAL", label: "Đã thu một phần", icon: Landmark },
    { key: "PAID", label: "Hoàn tất", icon: CheckCircle2 },
] as const;

function toNumber(value: number | string | null | undefined) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function normalizePaymentStatus(status?: string | null) {
    return String(status ?? "").toUpperCase();
}

function resolveIndex({
    status,
    remainingAmount,
    collectedAmount,
}: PaymentProgressProps) {
    const key = normalizePaymentStatus(status);
    const remaining = toNumber(remainingAmount);
    const collected = toNumber(collectedAmount);

    if (key === "PAID" || key === "FULL_PAID" || remaining <= 0) return 2;
    if (key === "PARTIAL_PAID" || key === "PARTIAL" || collected > 0) return 1;
    return 0;
}

export default function PaymentProgress(props: PaymentProgressProps) {
    const currentIndex = resolveIndex(props);

    return (
        <div className={cn("mt-2 w-full", props.compact ? "max-w-[120px]" : "max-w-[180px]")}>
            <div className="flex items-center">
                {STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    const done = index < currentIndex;
                    const active = index === currentIndex;
                    const reached = index <= currentIndex;

                    return (
                        <div key={stage.key} className="flex flex-1 items-center last:flex-none">
                            <div
                                title={stage.label}
                                className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full ring-1 transition",
                                    done && "bg-emerald-50 text-emerald-600 ring-emerald-100",
                                    active && "bg-amber-50 text-amber-600 ring-amber-100",
                                    currentIndex === 2 && reached && "bg-emerald-50 text-emerald-600 ring-emerald-100",
                                    !reached && "bg-slate-50 text-slate-300 ring-slate-200"
                                )}
                            >
                                <Icon className="h-3 w-3" />
                            </div>

                            {index < STAGES.length - 1 ? (
                                <div
                                    className={cn(
                                        "mx-1 h-px flex-1",
                                        index < currentIndex ? "bg-emerald-200" : "bg-slate-200"
                                    )}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}