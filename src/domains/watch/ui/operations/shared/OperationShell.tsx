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
                "scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.055)]",
                className,
            )}
        >
            <div className="flex min-h-[74px] items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/80 px-4 py-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-600">
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg font-black text-slate-950">
                            {number ? `${number}. ` : null}
                            {title}
                        </h2>
                        {description ? (
                            <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                        ) : null}
                    </div>
                </div>
                {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
            </div>
            <div className="p-4">{children}</div>
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
            <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">{label}</span>
            {children}
        </label>
    );
}

export const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400";

export const textareaClass =
    "min-h-[86px] w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

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
        <span className={cx("inline-flex h-7 items-center rounded-full border px-3 text-xs font-bold", tones[tone])}>
            {children}
        </span>
    );
}
