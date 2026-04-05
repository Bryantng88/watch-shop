"use client";

import Link from "next/link";
import { ChevronRight, Save } from "lucide-react";

export function ui(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function AdminCard({
    title,
    desc,
    right,
    children,
}: {
    title: string;
    desc?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                    {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
                </div>
                {right}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function AdminField({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-1.5 text-sm font-medium text-slate-700">{label}</div>
            {children}
            {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
    );
}

export function AdminHeader({
    sectionLabel,
    title,
    subtitle,
    backHref,
    backLabel,
    badge,
    rightStats,
}: {
    sectionLabel: string;
    title: string;
    subtitle?: string;
    backHref: string;
    backLabel: string;
    badge?: React.ReactNode;
    rightStats?: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href={backHref} className="hover:text-slate-700">
                            {sectionLabel}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span>{title}</span>
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                            {badge}
                        </div>
                        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
                    </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 lg:items-end">
                    {rightStats}
                    <Link
                        href={backHref}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                        {backLabel}
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function StatPill({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
        </div>
    );
}

export function ToneBadge({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "gray" | "blue" | "green" | "red" | "amber";
}) {
    const toneCls =
        tone === "blue"
            ? "border-sky-200 bg-sky-50 text-sky-700"
            : tone === "green"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : tone === "red"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : tone === "amber"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-slate-50 text-slate-700";

    return (
        <span className={ui("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneCls)}>
            {children}
        </span>
    );
}

export function AdminStickySubmit({
    total,
    saving,
    submitLabel,
    left,
    onCancelHref,
}: {
    total?: React.ReactNode;
    saving?: boolean;
    submitLabel: string;
    left?: React.ReactNode;
    onCancelHref?: string;
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {left}
                    {onCancelHref ? (
                        <Link
                            href={onCancelHref}
                            className={ui(
                                "inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50",
                                saving && "pointer-events-none opacity-60"
                            )}
                        >
                            Hủy
                        </Link>
                    ) : null}
                </div>

                <div className="flex items-center gap-3">
                    {total ? <div className="hidden text-right sm:block">{total}</div> : null}

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Đang lưu..." : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}