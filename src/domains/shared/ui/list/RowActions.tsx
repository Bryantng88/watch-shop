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
    const [menuPosition, setMenuPosition] = useState<{
        top: number;
        left?: number;
        right?: number;
    } | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const visibleActions = actions.filter(
        (item): item is RowAction<T> => Boolean(item && !item.hidden),
    );

    useEffect(() => {
        if (!open) return;

        const updateMenuPosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;

            setMenuPosition({
                top: rect.bottom + 6,
                ...(align === "right"
                    ? { right: window.innerWidth - rect.right }
                    : { left: rect.left }),
            });
        };

        updateMenuPosition();

        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                !rootRef.current?.contains(target) &&
                !menuRef.current?.contains(target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", updateMenuPosition, true);
        window.addEventListener("resize", updateMenuPosition);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", updateMenuPosition, true);
            window.removeEventListener("resize", updateMenuPosition);
        };
    }, [align, open]);

    if (visibleActions.length === 0) return null;

    return (
        <div ref={rootRef} className="relative flex justify-end">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>

            {open && menuPosition ? (
                <div
                    ref={menuRef}
                    style={menuPosition}
                    className={cn(
                        "fixed z-[80] min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl",
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
