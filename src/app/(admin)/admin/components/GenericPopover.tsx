"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
type Rect = { top: number; left: number; width: number; height: number };

export default function ItemPopover({
    parentId,
    type,            // "acquisition" | "invoice"
    count,
    currency = "VND",
    status,
    onUpdated,
}: {
    parentId: string;
    type: "acquisitions" | "invoices";
    count: number;
    currency?: string | null;
    status: string; // DRAFT | POSTED...
    onUpdated?: (info: {           // 👈 THÊM
        count: number;
        total: number;
    }) => void;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const isDraft = status === "DRAFT";

    // ==========================
    // FETCH ITEMS
    // ==========================
    async function fetchItems() {
        setLoading(true);
        const res = await fetch(`/api/admin/${type}/${parentId}/items`);
        const data = await res.json();
        setItems(
            data.items.map((it: any) => ({
                id: it.id,
                title: it.title ?? it.productTitle ?? "",
                quantity: Number(it.quantity ?? 1),
                unitPrice: Number(it.unitCost ?? it.unitPrice ?? 0),
                productType: it.productType
            }))
        );
        setLoading(false);
    }

    useEffect(() => {
        if (open) fetchItems();
    }, [open]);

    // ==========================
    // UI POSITIONING
    // ==========================
    const measure = () => {
        const el = btnRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({
            top: r.bottom + 8,
            left: Math.max(8, Math.min(r.left, window.innerWidth - 420)),
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
            const pop = document.getElementById(`pop-${parentId}`);
            if (pop && (pop.contains(e.target as Node) || btnRef.current?.contains(e.target as Node))) return;
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
    }, [open, parentId]);

    // ==========================
    // COMPUTE TOTAL
    // ==========================
    const total = items.reduce(
        (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
        0
    );

    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    // ==========================
    // ADD NEW ROW
    // ==========================
    const addRow = () => {
        if (!isDraft) return;
        setItems(prev => [
            ...prev,
            {
                id: `tmp-${Date.now()}-${Math.random()}`,
                title: "",
                quantity: 1,
                unitPrice: 0,
                productType: "WATCH" // 👈 DEFAULT
            }
        ]);
    };

    // ==========================
    // SAVE TO SERVER
    // ==========================
    async function handleSave() {
        const payload = items.map((it) => ({
            id: it.id ?? `tmp-${Date.now()}`, // nếu có id ⇒ update, không có id ⇒ create
            title: it.title.trim(),
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice ?? 0),
            productType: it.productType ?? "WATCH",


        }));

        const res = await fetch(`/api/admin/${type}/${parentId}/update-item`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: payload, deletedIds }),
        });

        if (!res.ok) {
            alert("Cập nhật thất bại");
            return;
        }

        const data = await res.json().catch(() => null);

        // tổng trên client (đề phòng backend không trả total)
        const localTotal = items.reduce(
            (s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
            0
        );

        // 👇 báo cho parent biết count & total mới
        onUpdated?.({
            count: items.length,
            total: Number(data?.total ?? localTotal),
        });

        alert("Đã lưu thay đổi");

        setOpen(false);

    }

    // ==========================
    // UI RENDER
    // ==========================
    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded border bg-gray-50 hover:bg-gray-100 px-2 py-1 text-xs"
            >
                {count}
            </button>

            {open && rect &&
                createPortal(
                    <div
                        id={`pop-${parentId}`}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: rect.left,
                            width: 560,
                            zIndex: 10000,
                        }}
                        className="rounded-lg border bg-white shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-2 text-xs text-gray-600 border-b">
                            <span>Dòng sản phẩm</span>

                            {isDraft && (
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="text-blue-600 hover:underline"
                                >
                                    + Thêm dòng
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="max-h-64 overflow-auto">
                            {loading ? (
                                <div className="text-center text-gray-500 text-sm py-6">Đang tải...</div>
                            ) : items.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm py-6">Không có mục nào</div>
                            ) : (
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-2 py-1 text-left w-44">Sản phẩm</th>
                                            <th className="px-2 py-1 text-left w-28">Loại SP</th>
                                            <th className="px-2 py-1 text-left w-12">SL</th>
                                            <th className="px-2 py-1 text-left w-28">Đơn giá</th>
                                            <th className="px-2 py-1 text-right w-28">Thành tiền</th>
                                            <th className="px-2 py-1 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((it, idx) => (
                                            <tr key={it.id ?? `tmp-${idx}`} className="border-t">
                                                {/* Title */}
                                                <td className="px-2 py-1 w-44">
                                                    {isDraft ? (
                                                        <input
                                                            className="w-full border rounded px-1 py-0.5"
                                                            value={it.title}
                                                            onChange={(e) => {
                                                                const clone = [...items];
                                                                clone[idx].title = e.target.value;
                                                                setItems(clone);
                                                            }}
                                                        />
                                                    ) : (
                                                        it.title
                                                    )}
                                                </td>
                                                <td className="px-2 py-1 w-28">
                                                    {isDraft ? (
                                                        <select
                                                            className="w-full border rounded px-1 py-0.5"
                                                            value={it.productType ?? "WATCH"}
                                                            onChange={(e) => {
                                                                const clone = [...items];
                                                                clone[idx].productType = e.target.value;
                                                                setItems(clone);
                                                            }}
                                                        >
                                                            <option value="WATCH">Watch</option>
                                                            <option value="WATCH_STRAP">Strap</option>
                                                            <option value="BOX">Box</option>
                                                            <option value="ACCESSORIES">Accessories</option>
                                                            <option value="PARTS">Parts</option>
                                                        </select>
                                                    ) : (
                                                        it.productType
                                                    )}
                                                </td>
                                                {/* Quantity */}
                                                <td className="px-2 py-1 text-right w-12">
                                                    {isDraft ? (
                                                        <input
                                                            type="number"
                                                            className="w-full border rounded px-1 py-0.5"

                                                            value={it.quantity}
                                                            onChange={(e) => {
                                                                const clone = [...items];
                                                                clone[idx].quantity = Number(e.target.value);
                                                                setItems(clone);
                                                            }}
                                                        />
                                                    ) : (
                                                        it.quantity
                                                    )}
                                                </td>

                                                {/* Price */}
                                                <td className="px-2 py-1 w-28">
                                                    {isDraft ? (
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-1 py-0.5 text-right"
                                                            value={it.unitPrice}
                                                            onChange={(e) => {
                                                                const clone = [...items];
                                                                clone[idx].unitPrice = Number(e.target.value);
                                                                setItems(clone);
                                                            }}
                                                        />
                                                    ) : (
                                                        new Intl.NumberFormat("vi-VN").format(it.unitPrice)
                                                    )}
                                                </td>

                                                <td className="px-2 py-1 text-right">
                                                    {new Intl.NumberFormat("vi-VN").format(
                                                        it.quantity * it.unitPrice
                                                    )}
                                                </td>
                                                <td className="px-2 py-1 text-center w-8">
                                                    {isDraft && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const removed = items[idx];

                                                                // Nếu không phải tmp-id thì thêm vào danh sách xoá
                                                                if (!removed.id.startsWith("tmp-")) {
                                                                    setDeletedIds(prev => [...prev, removed.id]);
                                                                }

                                                                // xoá trong UI
                                                                const clone = items.filter((_, i) => i !== idx);
                                                                setItems(clone);
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer */}
                        {isDraft && (
                            <div className="border-t px-2 py-2 bg-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                    Tổng tiền:{" "}
                                    <b>
                                        {new Intl.NumberFormat("vi-VN").format(total)} {currency}
                                    </b>
                                </span>

                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
}
