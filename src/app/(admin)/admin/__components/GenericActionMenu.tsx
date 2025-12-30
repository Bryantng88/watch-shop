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

export default function GenericActionMenu({
    id,
    actions,
}: {
    id: string;
    actions: ActionItem[];
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

    // đóng khi click ra ngoài
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
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setOpen((v) => !v)}
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
                        {actions
                            .filter((a) => !a.hidden)
                            .map((a, i) => (
                                <button
                                    key={i}
                                    onClick={async () => {
                                        await a.onClick();
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${a.danger ? "text-red-600" : "text-gray-800"
                                        }`}
                                >
                                    {a.label}
                                </button>
                            ))}
                    </div>,
                    document.body
                )
            }
        </>
    );
}
