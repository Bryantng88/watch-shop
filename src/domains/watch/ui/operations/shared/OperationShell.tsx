"use client";

import type { ReactNode } from "react";
import { cx } from "@/domains/watch/client/workbench/workbench-utils";

export function OperationShell({
    id,
    number,
    title,
    description,
    icon,
    actions,
    children,
    className,
}: {
    id: string;
    number?: string;
    title: string;
    description?: string;
    icon: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            id={id}
            className={cx(
                "scroll-mt-24 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_14px_34px_rgba(30,41,59,0.055)] ring-1 ring-white/70",
                className,
            )}
        >
            <div className="flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-white to-violet-50/40 px-4 py-4">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-sm font-semibold text-violet-700 ring-1 ring-violet-100">
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-[18px] font-semibold leading-6 text-slate-950">
                            {number ? `${number}. ` : null}
                            {title}
                        </h2>
                        {description ? (
                            <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
                        ) : null}
                    </div>
                </div>
                {actions ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div> : null}
            </div>
            <div className="p-4 md:p-5">{children}</div>
        </section>
    );
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase text-slate-500">{label}</span>
            {children}
        </label>
    );
}

export const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400";

export const textareaClass =
    "min-h-[86px] w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

export function operationButtonClass({
    variant = "secondary",
    size = "sm",
    className,
}: {
    variant?: "primary" | "secondary" | "softBlue" | "softAmber" | "softEmerald" | "softViolet" | "ghost" | "subtle";
    size?: "xs" | "sm" | "md";
    className?: string;
} = {}) {
    const sizes = {
        xs: "h-8 gap-1.5 rounded-md px-3 text-xs",
        sm: "h-9 gap-1.5 rounded-md px-3 text-sm",
        md: "h-11 gap-2 rounded-md px-4 text-sm",
    };
    const variants = {
        primary: "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-300 disabled:bg-slate-300",
        secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400",
        softBlue: "border border-blue-200 bg-white text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/70 focus-visible:ring-blue-100 disabled:bg-blue-50 disabled:text-blue-300",
        softAmber: "border border-amber-200 bg-white text-amber-700 shadow-sm hover:border-amber-300 hover:bg-amber-50/70 focus-visible:ring-amber-100 disabled:bg-amber-50 disabled:text-amber-300",
        softEmerald: "border border-emerald-200 bg-white text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/70 focus-visible:ring-emerald-100 disabled:bg-emerald-50 disabled:text-emerald-300",
        softViolet: "border border-violet-200 bg-white text-violet-700 shadow-sm hover:border-violet-300 hover:bg-violet-50/70 focus-visible:ring-violet-100 disabled:bg-violet-50 disabled:text-violet-300",
        ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200 disabled:text-slate-300",
        subtle: "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 focus-visible:ring-slate-200 disabled:text-slate-300",
    };

    return cx(
        "inline-flex shrink-0 items-center justify-center font-medium outline-none transition active:translate-y-px focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:active:translate-y-0",
        sizes[size],
        variants[variant],
        className,
    );
}

export function Pill({
    children,
    tone = "slate",
}: {
    children: ReactNode;
    tone?: "slate" | "blue" | "green" | "amber" | "red";
}) {
    const tones = {
        slate: "border-slate-200 bg-slate-50 text-slate-700",
        blue: "border-blue-200 bg-blue-50 text-blue-700",
        green: "border-emerald-200 bg-emerald-50 text-emerald-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        red: "border-rose-200 bg-rose-50 text-rose-700",
    };

    return (
        <span className={cx("inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold", tones[tone])}>
            {children}
        </span>
    );
}
