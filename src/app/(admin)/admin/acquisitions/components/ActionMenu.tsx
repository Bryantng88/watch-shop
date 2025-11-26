"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

type Rect = { top: number; left: number; width: number; height: number };

export default function ActionMenuPopover({
    acqId,
    status,
    vendor,
}: {
    acqId: string;
    status: string;
    vendor: string;
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
            left: r.right - 160, // căn phải giống popup số dòng
            width: r.width,
            height: r.height,
        });
    };

    useLayoutEffect(() => {
        if (open) measure();
    }, [open]);

    // click ngoài = đóng popup
    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const pop = document.getElementById(`action-pop-${acqId}`);
            if (
                pop &&
                (pop.contains(e.target as Node) ||
                    btnRef.current?.contains(e.target as Node))
            )
                return;

            setOpen(false);
        };

        const onResize = () => measure();
        const onScroll = () => measure();

        document.addEventListener("mousedown", onDown);
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);

        return () => {
            document.removeEventListener("mousedown", onDown);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
        };
    }, [open, acqId]);

    return (
        <>
            <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="px-2 text-lg hover:bg-gray-100 rounded"
            >
                ⋮
            </button>

            {open &&
                rect &&
                createPortal(
                    <div
                        id={`action-pop-${acqId}`}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: Math.max(8, Math.min(rect.left, window.innerWidth - 160 - 8)),
                            width: 160,
                            zIndex: 10000,
                        }}
                        className="rounded-lg border bg-white shadow-xl"
                    >
                        <div className="py-1">
                            {status !== "POSTED" && (
                                <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                    onClick={async () => {
                                        await fetch(`/api/admin/acquisitions/${acqId}/post`, {
                                            method: "POST",
                                        });
                                        location.reload();
                                    }}
                                >
                                    Duyệt phiếu
                                </button>
                            )}

                            <Link
                                href={`/admin/acquisitions/${acqId}/edit`}
                                className="block px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                Sửa phiếu
                            </Link>

                            <Link
                                href={`/admin/acquisitions/${acqId}/edit`}
                                className="block px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                Hủy phiếu
                            </Link>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
