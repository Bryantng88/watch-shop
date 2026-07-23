"use client";

import { SlidersHorizontal } from "lucide-react";

type DashboardCustomizeButtonProps = {
    onClick?: () => void;
};

export default function DashboardCustomizeButton({
    onClick,
}: DashboardCustomizeButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            Tùy chỉnh dashboard
        </button>
    );
}
