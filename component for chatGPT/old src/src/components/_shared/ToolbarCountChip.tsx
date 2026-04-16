"use client";

type ToolbarCountChipProps = {
    label: string;
    count: number;
    active?: boolean;
    onClick?: () => void;
};

export default function ToolbarCountChip({ label, count, active = false, onClick }: ToolbarCountChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                active
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
        >
            <span>{label}</span>
            <span
                className={[
                    "inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
                    active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                ].join(" ")}
            >
                {count}
            </span>
        </button>
    );
}
