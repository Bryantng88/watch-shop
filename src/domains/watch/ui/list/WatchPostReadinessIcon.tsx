"use client";

import {
    CheckCircle2,
    CircleDashed,
    Clock3,
    FileWarning,
    Send,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
    status?: string | null;
};

function normalize(status?: string | null) {
    const key = String(status ?? "").toUpperCase();

    if (key === "DRAFT" || key === "NOT_SUBMITTED" || key === "UNSUBMITTED") {
        return "NOT_SUBMITTED";
    }

    if (key === "PENDING") return "PENDING";
    if (key === "PARTIAL" || key === "PARTIALLY_APPROVED") return "PARTIAL";
    if (key === "APPROVED") return "APPROVED";
    if (key === "POSTED" || key === "PUBLISHED") return "POSTED";

    return "NOT_SUBMITTED";
}

export default function WatchPostReadinessIcon({ status }: Props) {
    const state = normalize(status);

    const config = {
        NOT_SUBMITTED: {
            title: "Chưa gửi duyệt",
            icon: CircleDashed,
            className: "bg-slate-50 text-slate-400 ring-slate-200",
        },
        PENDING: {
            title: "Chờ duyệt",
            icon: Clock3,
            className: "bg-amber-50 text-amber-600 ring-amber-100",
        },
        PARTIAL: {
            title: "Duyệt một phần",
            icon: FileWarning,
            className: "bg-orange-50 text-orange-600 ring-orange-100",
        },
        APPROVED: {
            title: "Đã duyệt",
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        },
        POSTED: {
            title: "Đã đăng",
            icon: Send,
            className: "bg-violet-50 text-violet-600 ring-violet-100",
        },
    }[state];

    const Icon = config.icon;

    return (
        <span
            title={config.title}
            className={cn(
                "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1",
                config.className
            )}
        >
            <Icon className="h-4 w-4" />
        </span>
    );
}