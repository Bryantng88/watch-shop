"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";

export type RowActionItem = {
    key: string;
    label: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    danger?: boolean;
    hidden?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function RowActionsMenu({
    actions,
    align = "right",
}: {
    actions: RowActionItem[];
    align?: "left" | "right";
}) {
    const [open, setOpen] = React.useState(false);
    const wrapRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const visibleActions = actions.filter((item) => !item.hidden);

    if (!visibleActions.length) return null;

    return (
        <div ref={wrapRef} className="relative inline-flex">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {open ? (
                <div
                    className={cx(
                        "absolute top-10 z-50 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl",
                        align === "right" ? "right-0" : "left-0"
                    )}
                    role="menu"
                >
                    {visibleActions.map((item) => {
                        const content = (
                            <span
                                className={cx(
                                    "block w-full rounded-xl px-3 py-2 text-left text-sm transition",
                                    item.disabled
                                        ? "cursor-not-allowed text-slate-300"
                                        : item.danger
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                {item.label}
                            </span>
                        );

                        if (item.href && !item.disabled) {
                            return (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    className="block"
                                    onClick={() => setOpen(false)}
                                    role="menuitem"
                                >
                                    {content}
                                </a>
                            );
                        }

                        return (
                            <button
                                key={item.key}
                                type="button"
                                disabled={item.disabled}
                                className="block w-full text-left"
                                onClick={() => {
                                    if (item.disabled) return;
                                    setOpen(false);
                                    item.onClick?.();
                                }}
                                role="menuitem"
                            >
                                {content}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}