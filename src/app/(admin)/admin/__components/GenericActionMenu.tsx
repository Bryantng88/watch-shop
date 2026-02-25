"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

type Rect = { top: number; left: number; width: number; height: number };

export type ActionItem = {
    label: string;
    onClick: () => void | Promise<void>;
    danger?: boolean;
    hidden?: boolean;
};

type MaintenanceAction = {
    label?: string;        // default: "Maintenance"
    onOpen: () => void;    // ✅ mở modal
    hidden?: boolean;
};

export default function GenericActionMenu({
    id,
    actions,
    maintenance,
    maintenancePlacement = "top",
}: {
    id: string;
    actions: ActionItem[];
    maintenance?: MaintenanceAction;
    maintenancePlacement?: "top" | "bottom";
}) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);

    const measure = () => {
        const el = btnRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({
            top: r.bottom + 6,
            left: Math.min(r.left, window.innerWidth - 180),
            width: r.width,
            height: r.height,
        });
    };

    useLayoutEffect(() => {
        if (open) measure();
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onClick = (e: MouseEvent) => {
            const menu = document.getElementById(`action-${id}`);
            if (!btnRef.current) return;
            if (menu?.contains(e.target as Node) || btnRef.current.contains(e.target as Node)) return;
            setOpen(false);
        };

        const onScroll = () => measure();
        const onResize = () => measure();

        document.addEventListener("mousedown", onClick);
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);

        return () => {
            document.removeEventListener("mousedown", onClick);
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
    }, [open, id]);

    const maintenanceItem: ActionItem | null =
        maintenance && !maintenance.hidden
            ? {
                label: maintenance.label ?? "Maintenance",
                onClick: () => maintenance.onOpen(),
            }
            : null;

    const mergedActions = (() => {
        const base = actions.filter((a) => !a.hidden);
        if (!maintenanceItem) return base;
        return maintenancePlacement === "top" ? [maintenanceItem, ...base] : [...base, maintenanceItem];
    })();

    return (
        <>
            <button
                ref={btnRef}
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setOpen((v) => !v)}
                type="button"
            >
                <MoreVertical size={16} />
            </button>

            {open && rect &&
                createPortal(
                    <div
                        id={`action-${id}`}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: rect.left,
                            width: 160,
                            zIndex: 9999,
                        }}
                        className="rounded-lg border bg-white shadow-xl py-1"
                    >
                        {mergedActions.map((a, i) => (
                            <button
                                key={i}
                                onClick={async () => {
                                    await a.onClick();
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${a.danger ? "text-red-600" : "text-gray-800"
                                    }`}
                                type="button"
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
}
