"use client";

import * as React from "react";
import Link from "next/link";
import {
    MoreHorizontal,
    Eye,
    PencilLine,
    Trash2,
    Wrench,
    Copy,
    ExternalLink,
    Archive,
    Package,
    ArrowRightLeft,
} from "lucide-react";

export type RowActionIconKey =
    | "view"
    | "edit"
    | "delete"
    | "service"
    | "copy"
    | "open"
    | "archive"
    | "product"
    | "move"
    | "custom";

export type RowActionItem = {
    key: string;
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: RowActionIconKey | React.ReactNode;
    disabled?: boolean;
    danger?: boolean;
    hidden?: boolean;
};

type Props = {
    actions: RowActionItem[];
    align?: "left" | "right";
    buttonClassName?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function getBuiltinIcon(icon?: RowActionIconKey | React.ReactNode) {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;

    const cls = "h-4 w-4";

    switch (icon) {
        case "view":
            return <Eye className={cls} />;
        case "edit":
            return <PencilLine className={cls} />;
        case "delete":
            return <Trash2 className={cls} />;
        case "service":
            return <Wrench className={cls} />;
        case "copy":
            return <Copy className={cls} />;
        case "open":
            return <ExternalLink className={cls} />;
        case "archive":
            return <Archive className={cls} />;
        case "product":
            return <Package className={cls} />;
        case "move":
            return <ArrowRightLeft className={cls} />;
        default:
            return null;
    }
}

export default function RowActionsMenu({
    actions,
    align = "right",
    buttonClassName,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const wrapRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        function handlePointerDown(e: MouseEvent) {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const visibleActions = actions.filter((item) => !item.hidden);

    if (!visibleActions.length) {
        return (
            <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-300"
                disabled
            >
                <MoreHorizontal className="h-4.5 w-4.5" />
            </button>
        );
    }

    return (
        <div ref={wrapRef} className="relative inline-flex">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={cx(
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700",
                    open && "bg-slate-100 text-slate-700",
                    buttonClassName
                )}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <MoreHorizontal className="h-4.5 w-4.5" />
            </button>

            {open ? (
                <div
                    className={cx(
                        "absolute top-11 z-[60] min-w-[210px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]",
                        align === "right" ? "right-0" : "left-0"
                    )}
                    role="menu"
                >
                    {visibleActions.map((item, index) => {
                        const iconNode = getBuiltinIcon(item.icon);

                        const content = (
                            <div
                                className={cx(
                                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                                    item.disabled
                                        ? "cursor-not-allowed text-slate-300"
                                        : item.danger
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <span
                                    className={cx(
                                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                        item.disabled
                                            ? "bg-slate-50 text-slate-300"
                                            : item.danger
                                                ? "bg-red-50 text-red-500"
                                                : "bg-slate-50 text-slate-500"
                                    )}
                                >
                                    {iconNode}
                                </span>

                                <span className="flex-1 text-left">{item.label}</span>
                            </div>
                        );

                        const key = `${item.key}-${index}`;

                        if (item.href && !item.disabled) {
                            return (
                                <Link
                                    key={key}
                                    href={item.href}
                                    className="block"
                                    onClick={() => setOpen(false)}
                                    role="menuitem"
                                >
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={key}
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