"use client";

import * as React from "react";
import { cx } from "./utils"
import { HealthStatus } from "./types";

export function Field({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="space-y-2">
            <div>
                <div className="text-sm font-medium text-slate-700">{label}</div>
                {hint ? <div className="mt-0.5 text-xs text-slate-500">{hint}</div> : null}
            </div>
            {children}
        </div>
    );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500",
                props.className
            )}
        />
    );
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500",
                props.className
            )}
        />
    );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cx(
                "min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500",
                props.className
            )}
        />
    );
}

export function Button({
    children,
    variant = "primary",
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "ghost";
}) {
    const styles = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
        outline: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
    };

    return (
        <button
            {...props}
            className={cx(
                "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                styles[variant],
                className
            )}
        >
            {children}
        </button>
    );
}

export function SectionCard({
    title,
    subtitle,
    icon,
    badge,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>
                    <div>
                        <div className="text-base font-semibold text-slate-900">{title}</div>
                        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
                    </div>
                </div>
                {badge}
            </div>
            <div className="space-y-5 p-5">{children}</div>
        </section>
    );
}

export function ScorePill({ score }: { score: number }) {
    const tone =
        score >= 90
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : score >= 75
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-red-200 bg-red-50 text-red-700";

    return (
        <span className={cx("inline-flex rounded-full border px-3 py-1 text-sm font-semibold", tone)}>
            {score}/100
        </span>
    );
}

export function StaticStatusPill({
    value,
    goodText,
    issueText,
}: {
    value: HealthStatus;
    goodText: string;
    issueText: string;
}) {
    return (
        <span
            className={cx(
                "inline-flex rounded-full border px-3 py-1.5 text-sm font-medium",
                value === "GOOD"
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
            )}
        >
            {value === "GOOD" ? goodText : issueText}
        </span>
    );
}

export function StatusToggle({
    value,
    onChange,
    goodText,
    issueText,
    disabled = false,
}: {
    value: HealthStatus;
    onChange: (value: HealthStatus) => void;
    goodText: string;
    issueText: string;
    disabled?: boolean;
}) {
    if (disabled) {
        return <StaticStatusPill value={value} goodText={goodText} issueText={issueText} />;
    }

    return (
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
                type="button"
                onClick={() => onChange("GOOD")}
                className={cx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    value === "GOOD"
                        ? "border border-slate-300 bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                )}
            >
                {goodText}
            </button>
            <button
                type="button"
                onClick={() => onChange("ISSUE")}
                className={cx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition",
                    value === "ISSUE"
                        ? "border border-amber-200 bg-amber-50 text-amber-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                )}
            >
                {issueText}
            </button>
        </div>
    );
}