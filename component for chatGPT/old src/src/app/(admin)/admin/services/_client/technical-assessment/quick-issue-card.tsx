"use client";

import { Wrench } from "lucide-react";

type QuickIssueCardProps = {
    title: string;
    description?: string | null;
    isOpen?: boolean;
    disabled?: boolean;
    onToggle: () => void;
    className?: string;
};

export default function QuickIssueCard({
    title,
    description,
    isOpen = false,
    disabled = false,
    onToggle,
    className = "",
}: QuickIssueCardProps) {
    return (
        <div
            className={[
                "rounded-[20px] border p-4 transition",
                isOpen
                    ? "border-slate-300 bg-slate-100/90"
                    : "border-slate-200 bg-slate-50/80",
                className,
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <Wrench className="h-4 w-4 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{title}</div>
                        <div className="mt-1 text-sm text-slate-500">
                            {description?.trim()
                                ? description
                                : "Không phát sinh issue ở hạng mục này."}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onToggle}
                    disabled={disabled}
                    className={[
                        "inline-flex h-10 shrink-0 items-center rounded-xl border px-4 text-sm font-medium transition",
                        isOpen
                            ? "border-slate-300 bg-white text-slate-900"
                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                        disabled ? "cursor-not-allowed opacity-60" : "",
                    ].join(" ")}
                >
                    {isOpen ? "Đóng issue" : "Mở issue"}
                </button>
            </div>
        </div>
    );
}