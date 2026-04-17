import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function cn(...items: Array<string | false | null | undefined>) {
    return items.filter(Boolean).join(" ");
}

export function formatMoneyPreview(value?: string | number | null) {
    if (value == null || value === "") return "-";
    const n = Number(value);
    if (!Number.isFinite(n)) return String(value);
    return new Intl.NumberFormat("vi-VN").format(n) + " VND";
}

export function statusTone(status?: string | null) {
    const s = String(status ?? "").toUpperCase();
    if (["AVAILABLE", "ACTIVE", "READY", "PUBLISHED"].includes(s)) {
        return "emerald";
    }
    if (["HOLD", "PENDING", "PROCESSING", "IN_SERVICE", "DRAFT"].includes(s)) {
        return "amber";
    }
    if (["SOLD", "ARCHIVED", "CANCELLED", "CANCELED"].includes(s)) {
        return "slate";
    }
    return "blue";
}

export function Badge({
    label,
    tone = "slate",
}: {
    label: string;
    tone?: "emerald" | "amber" | "slate" | "blue";
}) {
    const toneClass =
        tone === "emerald"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : tone === "amber"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : tone === "blue"
                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                    : "bg-slate-100 text-slate-700 ring-slate-200";

    const dotClass =
        tone === "emerald"
            ? "bg-emerald-500"
            : tone === "amber"
                ? "bg-amber-500"
                : tone === "blue"
                    ? "bg-blue-500"
                    : "bg-slate-400";

    return (
        <span className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", toneClass)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
            {label}
        </span>
    );
}

export function Section({
    title,
    desc,
    icon,
    right,
    children,
    defaultOpen = true,
}: {
    title: string;
    desc?: string;
    icon?: ReactNode;
    right?: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
}) {
    return (
        <details className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" open={defaultOpen}>
            <summary className="flex list-none items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    {icon ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                            {icon}
                        </div>
                    ) : null}
                    <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-slate-900">{title}</div>
                        {desc ? <div className="mt-1 text-sm text-slate-500">{desc}</div> : null}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {right}
                    <ChevronDown className="h-5 w-5 text-slate-400 group-open:block hidden" />
                    <ChevronRight className="h-5 w-5 text-slate-400 group-open:hidden block" />
                </div>
            </summary>
            <div className="p-5">{children}</div>
        </details>
    );
}

export function Field({
    label,
    children,
    span = 1,
}: {
    label: string;
    children: ReactNode;
    span?: 1 | 2 | 3 | 4;
}) {
    return (
        <div className={cn(span === 2 && "md:col-span-2", span === 3 && "md:col-span-3", span === 4 && "md:col-span-4")}>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {label}
            </label>
            {children}
        </div>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cn(
                "block h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
                props.className
            )}
        />
    );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={cn(
                "block h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
                props.className
            )}
        />
    );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cn(
                "block min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
                props.className
            )}
        />
    );
}

export function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                "flex items-center justify-between rounded-2xl border px-3 py-2.5 text-sm transition",
                checked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
        >
            <span>{label}</span>
            <span className={cn("h-2.5 w-2.5 rounded-full", checked ? "bg-white" : "bg-slate-300")} />
        </button>
    );
}

export function SideStat({
    label,
    value,
    emphasize = false,
    hint,
}: {
    label: string;
    value: ReactNode;
    emphasize?: boolean;
    hint?: ReactNode;
}) {
    return (
        <div className={cn("rounded-2xl border px-4 py-3", emphasize ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-slate-50")}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div>
            <div className={cn("mt-1 font-semibold", emphasize ? "text-lg text-orange-700" : "text-sm text-slate-900")}>{value}</div>
            {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
    );
}
