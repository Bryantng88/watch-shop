"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type RowAction<T> = {
    key: string;
    label: string;
    icon?: React.ReactNode;
    tone?: "default" | "danger";
    hidden?: boolean;
    disabled?: boolean;
    separatorBefore?: boolean;
    onClick: (row: T) => void;
};

type Props<T> = {
    row: T;
    actions: Array<RowAction<T> | null | false | undefined>;
    align?: "left" | "right";
};

export default function RowActions<T>({
    row,
    actions,
    align = "right",
}: Props<T>) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const visibleActions = actions.filter(
        (item): item is RowAction<T> => Boolean(item && !item.hidden),
    );

    useEffect(() => {
        if (!open) return;

        const handleClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    if (visibleActions.length === 0) return null;

    return (
        <div ref={rootRef} className="relative flex justify-end">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>

            {open ? (
                <div
                    className={cn(
                        "absolute z-30 mt-10 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl",
                        align === "right" ? "right-0" : "left-0",
                    )}
                >
                    {visibleActions.map((action) => (
                        <div key={action.key}>
                            {action.separatorBefore ? (
                                <div className="my-1 border-t border-slate-100" />
                            ) : null}

                            <button
                                type="button"
                                disabled={action.disabled}
                                onClick={() => {
                                    setOpen(false);
                                    action.onClick(row);
                                }}
                                className={cn(
                                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
                                    "disabled:pointer-events-none disabled:opacity-50",
                                    action.tone === "danger"
                                        ? "text-rose-600 hover:bg-rose-50"
                                        : "text-slate-700 hover:bg-slate-50",
                                )}
                            >
                                {action.icon ? (
                                    <span className="shrink-0">{action.icon}</span>
                                ) : null}

                                <span>{action.label}</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}