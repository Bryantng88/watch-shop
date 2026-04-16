// app/(admin)/admin/acquisitions/components/ItemsHover.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ItemRow = { id: string; title: string; quantity: number; unitCost: number };

export default function ItemsHover({
    acqId,
    count,
    currency = "VND",
}: {
    acqId: string;
    count: number;
    currency?: string | null;
}) {
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<ItemRow[]>([]);
    const anchorRef = useRef<HTMLSpanElement | null>(null);
    const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
        top: 0,
        left: 0,
        width: 0,
    });
    const hideTimer = useRef<any>(null);

    const fmt = (n: number) =>
        new Intl.NumberFormat("vi-VN").format(Number(n)) + (currency ? ` ${currency}` : "");

    const measure = () => {
        const el = anchorRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({ top: r.bottom + 8, left: r.left, width: r.width });
    };

    const openTooltip = () => {
        clearTimeout(hideTimer.current);
        measure();
        setOpen(true);
        if (!loaded) {
            setLoading(true);
            fetch(`/admin/acquisitions/api/${acqId}/items`, { cache: "no-store" })
                .then((r) => r.json())
                .then((j) => {
                    setItems(j.items ?? []);
                    setLoaded(true);
                })
                .finally(() => setLoading(false));
        }
    };

    const closeTooltip = () => {
        hideTimer.current = setTimeout(() => setOpen(false), 120);
    };

    useEffect(() => {
        const onScrollOrResize = () => open && measure();
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
            clearTimeout(hideTimer.current);
        };
    }, [open]);

    return (
        <>
            {/* anchor trong ô “Số dòng” */}
            <span
                ref={anchorRef}
                onMouseEnter={openTooltip}
                onMouseLeave={closeTooltip}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 cursor-default"
            >
                {count}
            </span>

            {open &&
                typeof window !== "undefined" &&
                createPortal(
                    <div
                        onMouseEnter={() => clearTimeout(hideTimer.current)}
                        onMouseLeave={closeTooltip}
                        style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: Math.max(340, pos.width) }}
                        className="z-[1000] max-w-[90vw] rounded-lg border bg-white shadow-xl p-3"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-600">Dòng sản phẩm</div>
                            <a
                                href={`/admin/acquisitions/${acqId}`}
                                className="text-xs underline text-blue-600 hover:text-blue-700"
                            >
                                Xem chi tiết
                            </a>
                        </div>

                        {loading ? (
                            <div className="text-sm text-gray-500 py-6 text-center">Đang tải…</div>
                        ) : items.length === 0 ? (
                            <div className="text-sm text-gray-500 py-6 text-center">Chưa có dòng nào</div>
                        ) : (
                            <div className="max-h-64 overflow-auto">
                                <table className="w-full text-xs">
                                    <thead className="sticky top-0 bg-gray-50">
                                        <tr>
                                            <th className="px-2 py-1 text-left">Sản phẩm</th>
                                            <th className="px-2 py-1 text-right">SL</th>
                                            <th className="px-2 py-1 text-right">Đơn giá</th>
                                            <th className="px-2 py-1 text-right">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((it) => (
                                            <tr key={it.id} className="border-t">
                                                <td className="px-2 py-1">{it.title}</td>
                                                <td className="px-2 py-1 text-right">{it.quantity}</td>
                                                <td className="px-2 py-1 text-right">{fmt(it.unitCost)}</td>
                                                <td className="px-2 py-1 text-right">{fmt(it.unitCost * it.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
}
