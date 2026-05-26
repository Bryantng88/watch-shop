"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type ListSelectOption = {
    value: string;
    label: string;
};

export function ListFilterForm({
    children,
    onSubmit,
    className,
}: {
    children: React.ReactNode;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
}) {
    return (
        <form onSubmit={onSubmit} className={cn("w-full", className)}>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(150px,190px))_auto_auto] lg:items-center">
                {children}
            </div>
        </form>
    );
}

export function ListSearchInput({
    className,
    wrapperClassName,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    wrapperClassName?: string;
}) {
    return (
        <label className={cn("relative block min-w-0", wrapperClassName)}>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
                {...props}
                className={cn(
                    "h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400",
                    className,
                )}
            />
        </label>
    );
}

export function ListSelect({
    options,
    className,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: ListSelectOption[] }) {
    return (
        <select
            {...props}
            className={cn(
                "h-11 min-w-0 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400",
                className,
            )}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export function ListFilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={props.type ?? "submit"}
            className={cn(
                "inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
                props.className,
            )}
        />
    );
}

export function ListClearButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={props.type ?? "button"}
            className={cn(
                "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800",
                props.className,
            )}
        />
    );
}
