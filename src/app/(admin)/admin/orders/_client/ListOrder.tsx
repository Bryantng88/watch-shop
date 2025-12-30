"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ItemPopover from "../../__components/GenericPopover"; // popover dùng chung
import ActionMenu from "../../acquisitions/components/ActionMenu"

type OrderItem = {
    id: string;
    refNo: string | null;
    customerName: string | null;
    shipPhone: string | null;
    status: string;
    subtotal: number;
    currency: string;
    itemCount: number;
    notes: string;
    createdAt: string;
    updatedAt: string;
};

type PageProps = {
    items: OrderItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};

// =====================
// FORMATTERS
// =====================
function fmtDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + " " + cur;
}

// =====================
// MAIN COMPONENT
// =====================
export default function OrderListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams
}: PageProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [rowCounts, setRowCounts] = useState<Record<string, number>>({});
    const [rowTotals, setRowTotals] = useState<Record<string, number>>({});

    const url = new URLSearchParams(rawSearchParams as any);

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        return `/admin/orders?${next.toString()}`;
    };

    const spObj = rawSearchParams;

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Đơn hàng</h1>
                <Link
                    href="/admin/orders/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo đơn hàng
                </Link>
            </div>

            {/* FILTER FORM */}
            <form action="/admin/orders" method="get" className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(spObj.q as string) ?? ""}
                        placeholder="RefNo, tên KH, số ĐT…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Sắp xếp</label>
                    <select
                        name="sort"
                        defaultValue={(spObj.sort as string) ?? "updatedDesc"}
                        className="h-9 rounded border px-2"
                    >
                        <option value="updatedDesc">Cập nhật ↓</option>
                        <option value="updatedAsc">Cập nhật ↑</option>
                        <option value="createdDesc">Tạo ↓</option>
                        <option value="createdAsc">Tạo ↑</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3">Lọc</button>
                    <Link href="/admin/orders" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">RefNo</th>
                            <th className="px-3 py-2 text-left">Khách hàng</th>
                            <th className="px-3 py-2 text-left">Số ĐT</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-left">Ngày tạo</th>
                            <th className="px-3 py-2 text-left">Tổng tiền</th>
                            <th className="px-3 py-2 text-left">Số dòng</th>
                            <th className="px-3 py-2 text-left">Ghi chú</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-8 text-center text-gray-500">
                                    Không có đơn hàng
                                </td>
                            </tr>
                        ) : (
                            items.map((o) => {
                                const displayCount = rowCounts[o.id] ?? o.itemCount;
                                const totalMoney = rowTotals[o.id] ?? o.subtotal;

                                return (
                                    <tr key={o.id} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2 font-medium">{o.refNo ?? "-"}</td>
                                        <td className="px-3 py-2">{o.customerName ?? "-"}</td>
                                        <td className="px-3 py-2">{o.shipPhone ?? "-"}</td>

                                        <td className="px-3 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${o.status === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : o.status === "PENDING"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {o.status}
                                            </span>
                                        </td>

                                        <td className="px-3 py-2">{fmtDate(o.createdAt)}</td>

                                        <td className="px-3 py-2">{fmtMoney(totalMoney, o.currency)}</td>

                                        {/* ITEM POPOVER */}
                                        <td className="px-3 py-2">
                                            <ItemPopover
                                                parentId={o.id}
                                                type="orders"
                                                count={displayCount}
                                                currency={o.currency}
                                                status={o.status}
                                                onUpdated={({ count, total }) => {
                                                    setRowCounts((prev) => ({ ...prev, [o.id]: count }));
                                                    setRowTotals((prev) => ({ ...prev, [o.id]: total }));
                                                }}
                                            />
                                        </td>

                                        <td className="px-3 py-2">{o.notes ?? "-"}</td>

                                        <td className="relative px-3 py-2 text-right">
                                            <button
                                                className="p-2 rounded hover:bg-gray-100"
                                                onClick={() =>
                                                    setOpenMenuId(openMenuId === o.id ? null : o.id)
                                                }
                                            >
                                                ⋮
                                            </button>

                                            {openMenuId === o.id && (
                                                <ActionMenu orderId={o.id} status={o.status} />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={`rounded border px-3 py-1 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-1 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
