"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function toneClass(status?: string) {
    const s = String(status ?? "").toUpperCase();
    if (["AVAILABLE", "READY", "ACTIVE", "IN_STOCK"].includes(s)) {
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }
    if (["DRAFT", "PENDING", "IN_SERVICE", "PROCESSING", "HOLD"].includes(s)) {
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
    if (["SOLD", "ARCHIVED", "CANCELLED", "CANCELED"].includes(s)) {
        return "bg-slate-100 text-slate-700 ring-slate-200";
    }
    return "bg-blue-50 text-blue-700 ring-blue-200";
}

export function Badge({ label }: { label: string }) {
    return (
        <span
            className={cx(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                toneClass(label)
            )}
        >
            {label || "-"}
        </span>
    );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            {children}
        </label>
    );
}

export function Input(
    props: React.InputHTMLAttributes<HTMLInputElement>
) {
    return (
        <input
            {...props}
            className={cx(
                "block h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100",
                props.className
            )}
        />
    );
}

export function Textarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
    return (
        <textarea
            {...props}
            className={cx(
                "block min-h-[108px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100",
                props.className
            )}
        />
    );
}

export function Select(
    props: React.SelectHTMLAttributes<HTMLSelectElement> & {
        options: Array<{ value: string; label: string }>;
        placeholder?: string;
    }
) {
    const { options, placeholder, ...rest } = props;
    return (
        <select
            {...rest}
            className={cx(
                "block h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100",
                rest.className
            )}
        >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}

export function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cx(
                "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm shadow-sm",
                checked
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700"
            )}
        >
            <span
                className={cx(
                    "h-2.5 w-2.5 rounded-full",
                    checked ? "bg-white" : "bg-slate-300"
                )}
            />
            {label}
        </button>
    );
}

export function SectionCard({
    icon,
    title,
    subtitle,
    children,
    defaultOpen = true,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>
                    <div>
                        <div className="text-base font-semibold text-slate-900">{title}</div>
                        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
                    </div>
                </div>

                <ChevronDown
                    className={cx(
                        "h-5 w-5 text-slate-400 transition-transform",
                        open && "rotate-180"
                    )}
                />
            </button>

            {open ? <div className="p-5">{children}</div> : null}
        </section>
    );
}

export function SidebarStat({
    label,
    value,
    emphasize = false,
}: {
    label: string;
    value: React.ReactNode;
    emphasize?: boolean;
}) {
    return (
        <div
            className={cx(
                "rounded-2xl border px-4 py-3",
                emphasize
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-slate-50"
            )}
        >
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {label}
            </div>
            <div
                className={cx(
                    "mt-1",
                    emphasize
                        ? "text-lg font-semibold text-orange-700"
                        : "text-sm font-medium text-slate-900"
                )}
            >
                {value}
            </div>
        </div>
    );
}

export function moneyPreview(v?: string) {
    if (!v) return "-";
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(n)) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(n)} VND`;
}