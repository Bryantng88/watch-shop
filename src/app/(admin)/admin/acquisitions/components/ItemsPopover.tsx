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
    status, // ✅ truyền status để biết có được sửa hay không
}: {
    acqId: string;
    count: number;
    currency?: string | null;
    status: string; // "DRAFT" | "POSTED" | ...
}) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);

    const { data: items, loading, cached } = useAcqItems(acqId, open);

    const [editItems, setEditItems] = useState<any[]>([]);
    const isDraft = status === "DRAFT";

    useEffect(() => {
        if (items?.length) setEditItems(items);
    }, [items]);

    const measure = () => {
        const el = btnRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({
            top: r.bottom + 8,
            left: Math.max(8, Math.min(r.left, window.innerWidth - 400 - 8)),
            width: r.width,
            height: r.height,
        });
    };

    useLayoutEffect(() => {
        if (open) measure();
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onResize = () => measure();
        const onScroll = () => measure();
        const onDown = (e: MouseEvent) => {
            const pop = document.getElementById(`acq-pop-${acqId}`);
            if (
                pop &&
                (pop.contains(e.target as Node) ||
                    btnRef.current?.contains(e.target as Node))
            )
                return;
            setOpen(false);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);
        document.addEventListener("mousedown", onDown);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
            document.removeEventListener("mousedown", onDown);
        };
    }, [open, acqId]);

    const fmt = (n: number) =>
        new Intl.NumberFormat("vi-VN").format(n) + (currency ? ` ${currency}` : "");

    const total = editItems.reduce(
        (sum, it) =>
            sum +
            (Number(it?.quantity ?? 0) || 0) * (Number(it?.unitCost ?? 0) || 0),
        0
    );

    // ✅ thêm dòng mới (chỉ dùng cho DRAFT)
    const handleAddRow = () => {
        if (!isDraft) return;
        setEditItems((prev) => [
            ...prev,
            {
                id: `tmp-${Date.now()}-${Math.random()}`, // id tạm, backend xử lý sau
                title: "",
                quantity: 1,
                unitCost: 0,
            },
        ]);
    };

    async function handleSave() {
        const res = await fetch(`/api/admin/acquisitions/${acqId}/update-items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: editItems }),
        });

        if (!res.ok) {
            alert("Cập nhật thất bại");
            return;
        }

        alert("Đã lưu thay đổi");
        setOpen(false);
    }

    if (isAcqItemsCached(acqId)) {
        console.log("✅ Item đã được cache");
    }

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
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
                            left: rect.left,
                            zIndex: 10000,
                            width: 400,
                        }}
                        className="rounded-lg border bg-white shadow-xl"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between p-2 text-xs text-gray-600 border-b">
                            <span>Dòng sản phẩm</span>

                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    + Thêm dòng
                                </button>
                            )}
                        </div>

                        {/* BODY */}
                        <div className="max-h-64 overflow-auto">
                            {loading ? (
                                <div className="text-center text-gray-500 text-sm py-6">
                                    Đang tải...
                                </div>
                            ) : !editItems?.length ? (
                                <div className="text-center text-gray-400 text-sm py-6">
                                    Chưa có dòng nào
                                </div>
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
                                        {editItems.map((it, idx) => (
                                            <tr key={it.id} className="border-t">
                                                <td className="px-2 py-1">
                                                    {isDraft ? (
                                                        <input
                                                            className="w-full border rounded px-1 py-0.5"
                                                            value={it.title ?? ""}
                                                            onChange={(e) => {
                                                                const arr = [...editItems];
                                                                arr[idx].title = e.target.value;
                                                                setEditItems(arr);
                                                            }}
                                                        />
                                                    ) : (
                                                        it.title
                                                    )}
                                                </td>

                                                <td className="px-2 py-1 text-right">
                                                    {isDraft ? (
                                                        <input
                                                            type="number"
                                                            className="w-12 border rounded px-1 py-0.5 text-right"
                                                            value={it.quantity ?? 0}
                                                            onChange={(e) => {
                                                                const arr = [...editItems];
                                                                arr[idx].quantity = Number(e.target.value);
                                                                setEditItems(arr);
                                                            }}
                                                        />
                                                    ) : (
                                                        it.quantity
                                                    )}
                                                </td>

                                                <td className="px-2 py-1 text-right">
                                                    {isDraft ? (
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-1 py-0.5 text-right"
                                                            value={it.unitCost ?? 0}
                                                            onChange={(e) => {
                                                                const arr = [...editItems];
                                                                arr[idx].unitCost = Number(e.target.value);
                                                                setEditItems(arr);
                                                            }}
                                                        />
                                                    ) : (
                                                        fmt(it.unitCost)
                                                    )}
                                                </td>

                                                <td className="px-2 py-1 text-right">
                                                    {fmt((it.quantity ?? 0) * (it.unitCost ?? 0))}
                                                </td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td colSpan={4} className="px-2 py-1 text-right text-gray-400">
                                                {cached ? "Đã cache" : ""}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* FOOTER: Tổng tiền + Lưu */}
                        <div className="border-t px-2 py-2 bg-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                                Tổng tiền:&nbsp;
                                <span className="font-semibold">{fmt(total)}</span>
                            </span>

                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                    Lưu thay đổi
                                </button>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
