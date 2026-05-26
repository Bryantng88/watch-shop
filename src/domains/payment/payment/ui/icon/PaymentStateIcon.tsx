"use client";

import { Check, DollarSign } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
    status?: string | null;
    totalAmount?: number | string | null;
    remainingAmount?: number | string | null;
    collectedAmount?: number | string | null;
};

function toNumber(value: number | string | null | undefined) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function resolveState({
    status,
    totalAmount,
    remainingAmount,
    collectedAmount,
}: Props) {
    const key = String(status ?? "").toUpperCase();
    const total = toNumber(totalAmount);
    const remaining = toNumber(remainingAmount);
    const collected = toNumber(collectedAmount);

    if (
        key === "PAID" ||
        key === "FULL_PAID" ||
        (total > 0 && remaining <= 0)
    ) {
        return "PAID";
    }

    if (
        key === "PARTIAL_PAID" ||
        key === "PARTIAL" ||
        collected > 0 ||
        (total > 0 && remaining > 0 && remaining < total)
    ) {
        return "PARTIAL";
    }

    return "UNPAID";
}

export default function PaymentStateIcon(props: Props) {
    const state = resolveState(props);

    const title =
        state === "PAID"
            ? "Đã thanh toán đủ"
            : state === "PARTIAL"
                ? "Đã thanh toán một phần"
                : "Chưa thanh toán";

    return (
        <span
            title={title}
            className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center"
        >
            <span
                className={cn(
                    "relative inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition",
                    state === "PAID" && "bg-emerald-50 text-emerald-600 ring-emerald-100",
                    state === "PARTIAL" && "bg-white text-amber-600 ring-amber-100",
                    state === "UNPAID" && "bg-slate-50 text-slate-300 ring-slate-200"
                )}
            >
                {state === "PARTIAL" ? (
                    <svg className="absolute inset-0 h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-200"
                        />
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="48 88"
                            strokeLinecap="round"
                            className="text-amber-500"
                        />
                    </svg>
                ) : null}

                {state === "PAID" ? (
                    <Check className="relative z-10 h-4 w-4 stroke-[2.8]" />
                ) : (
                    <DollarSign className="relative z-10 h-4 w-4 stroke-[2.2]" />
                )}
            </span>
        </span>
    );
}