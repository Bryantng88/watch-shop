// features/acquisitions/client/AcqItemsPopover.tsx
"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAcqItems } from "../hooks/useAcgItems";
import { isAcqItemsCached } from "../_server/acqItems.cache";
type Rect = { top: number; left: number; width: number; height: number };

export default function AcqItemsPopover({

    acqId,
    count,
    currency = "VND",

}: {
    acqId: string;
    count: number;
    currency?: string | null;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);
    const { data: items, loading, cached } = useAcqItems(acqId, open);

    // đo lại vị trí khi mở, resize, scroll
    const measure = () => {
        const el = btnRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({ top: r.bottom + 8, left: r.left, width: r.width, height: r.height });
    };

    useLayoutEffect(() => {
        if (open) measure();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onResize = () => measure();
        const onScroll = () => measure();
        const onDown = (e: MouseEvent) => {
            // click ngoài thì đóng
            if (!btnRef.current) return;
            const pop = document.getElementById(`acq-pop-${acqId}`);
            if (pop && (pop.contains(e.target as Node) || btnRef.current.contains(e.target as Node))) return;
            setOpen(false);
        };
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true); // listen bubbling
        document.addEventListener("mousedown", onDown);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
            document.removeEventListener("mousedown", onDown);
        };
    }, [open, acqId]);

    const fmt = (n: number) =>
        new Intl.NumberFormat("vi-VN").format(n) + (currency ? ` ${currency}` : "");
    if (isAcqItemsCached(acqId)) {
        console.log("✅ Item đã được cache");
    } else {
        console.log("⏳ Sẽ fetch mới");
    }
    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-1 rounded border bg-gray-50 hover:bg-gray-100 px-2 py-1 text-xs"
                title="Xem các dòng trong phiếu"
            >
                {count}
            </button>

            {open && rect &&
                createPortal(
                    <div
                        id={`acq-pop-${acqId}`}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: Math.max(8, Math.min(rect.left, window.innerWidth - 400 - 8)),
                            zIndex: 10000,
                            width: 400,
                        }}
                        className="rounded-lg border bg-white shadow-xl"
                    >
                        <div className="flex items-center justify-between p-2 text-xs text-gray-600 border-b">
                            <span>Dòng sản phẩm</span>
                            <a
                                href={`/admin/acquisitions/${acqId}`}
                                className="text-blue-600 hover:underline"
                            >
                                Xem chi tiết
                            </a>
                        </div>
                        <div className="max-h-64 overflow-auto">
                            {loading ? (
                                <div className="text-center text-gray-500 text-sm py-6">Đang tải...</div>
                            ) : !items?.length ? (
                                <div className="text-center text-gray-400 text-sm py-6">Chưa có dòng nào</div>
                            ) : (
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-2 py-1 text-left">Sản phẩm</th>
                                            <th className="px-2 py-1 text-right">SL</th>
                                            <th className="px-2 py-1 text-right">Đơn giá</th>
                                            <th className="px-2 py-1 text-right">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((it: any) => (
                                            <tr key={it.id} className="border-t">
                                                <td className="px-2 py-1">{it.title}</td>
                                                <td className="px-2 py-1 text-right">{it.quantity}</td>
                                                <td className="px-2 py-1 text-right">{fmt(it.unitCost)}</td>
                                                <td className="px-2 py-1 text-right">
                                                    {fmt(it.quantity * it.unitCost)}
                                                </td>
                                            </tr>
                                        ))}
                                        <div className="text-xs text-gray-400 text-right pr-2">
                                            {cached ? "Đã cache" : loading ? "Đang tải..." : ""}
                                        </div>
                                    </tbody>
                                </table>
                            )}
                        </div>

                    </div>,
                    document.body
                )}
        </>
    );
}
