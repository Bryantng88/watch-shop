"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
            {children}
        </label>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-slate-400 focus:ring-0",
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
                "block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-0",
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

export function Textarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
    return (
        <textarea
            {...props}
            className={cx(
                "block min-h-[100px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition",
                "focus:border-slate-300 focus:ring-2 focus:ring-slate-100",
                props.className
            )}
        />
    );
}
export function Button({
    variant = "default",
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost";
}) {
    return (
        <button
            {...props}
            className={cx(
                "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                variant === "default" &&
                "bg-slate-950 text-white hover:bg-slate-800",
                variant === "outline" &&
                "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                variant === "ghost" &&
                "bg-transparent text-slate-600 hover:bg-slate-100",
                className
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
    onChange: (next: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cx(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                checked
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                        <div className="text-base font-semibold text-slate-900">
                            {title}
                        </div>
                        {subtitle ? (
                            <div className="text-sm text-slate-500">
                                {subtitle}
                            </div>
                        ) : null}
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

export function Dialog({
    open,
    title,
    description,
    children,
    onClose,
    maxWidthClass = "max-w-5xl",
}: {
    open: boolean;
    title: string;
    description?: string;
    children: React.ReactNode;
    onClose: () => void;
    maxWidthClass?: string;
}) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <button
                type="button"
                aria-label="Close overlay"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            />

            <div className="absolute inset-0 overflow-y-auto p-4 md:p-6">
                <div
                    className={cx(
                        "mx-auto overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl",
                        maxWidthClass
                    )}
                >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                        <div>
                            <div className="text-xl font-semibold text-slate-950">
                                {title}
                            </div>
                            {description ? (
                                <div className="mt-1 text-sm text-slate-500">
                                    {description}
                                </div>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-6 py-5">{children}</div>
                </div>
            </div>
        </div>
    );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
            {children}
        </div>
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
                "rounded-2xl px-4 py-3 ring-1 ring-inset",
                emphasize
                    ? "bg-orange-50 ring-orange-200"
                    : "bg-slate-50 ring-slate-200"
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