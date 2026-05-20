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

    const ringClass =
        state === "PAID"
            ? "text-emerald-500"
            : state === "PARTIAL"
                ? "text-amber-500"
                : "text-slate-200";

    const dash =
        state === "PAID"
            ? "88 88"
            : state === "PARTIAL"
                ? "48 88"
                : "0 88";

    return (
        <span
            title={title}
            className={cn(
                "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
                state === "PAID" && "bg-emerald-50",
                state === "PARTIAL" && "bg-white",
                state === "UNPAID" && "bg-slate-50"
            )}
        >
            <svg
                className="absolute inset-0 h-8 w-8 -rotate-90"
                viewBox="0 0 32 32"
            >
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
                    strokeDasharray={dash}
                    strokeLinecap="round"
                    className={ringClass}
                />
            </svg>

            {state === "PAID" ? (
                <Check className="relative z-10 h-4 w-4 text-emerald-600 stroke-[2.5]" />
            ) : (
                <DollarSign
                    className={cn(
                        "relative z-10 h-4 w-4 stroke-[2.2]",
                        state === "PARTIAL"
                            ? "text-amber-600"
                            : "text-slate-300"
                    )}
                />
            )}
        </span>
    );
}