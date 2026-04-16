"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ItemPopover from "../../__components/GenericPopover";
import InvoiceItemsPopover from "../components/InvoiceItemsPopover";
import InvoiceActionMenu from "../components/InvoiceActionMenu";

type InvoiceRow = {
    id: string;
    code: string | null;
    type: string;
    status: string;
    currency: string;
    grandTotal: number;
    subTotal: number;
    itemCount: number;
    customerName: string | null;
    vendorName: string | null;
    createdAt: string;
    updatedAt: string;
};

type Props = {
    items: InvoiceRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};

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
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + (cur ? ` ${cur}` : "");
}

export default function InvoiceListClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: Props) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const url = new URLSearchParams(rawSearchParams as any);

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        return `/admin/invoices?${next.toString()}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Hóa đơn</h1>
                <Link
                    href="/admin/invoices/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo hóa đơn
                </Link>
            </div>

            {/* Filters */}
            <form action="/admin/invoices" method="get" className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(rawSearchParams.q as string) ?? ""}
                        placeholder="Mã HĐ, ghi chú…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Sắp xếp</label>
                    <select
                        name="sort"
                        defaultValue={(rawSearchParams.sort as string) ?? "updatedDesc"}
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
                    <Link href="/admin/invoices" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">Code</th>
                            <th className="px-3 py-2 text-left">Loại</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-left">Khách hàng</th>
                            <th className="px-3 py-2 text-left">Vendor</th>
                            <th className="px-3 py-2 text-left">Ngày tạo</th>
                            <th className="px-3 py-2 text-left">Tổng tiền</th>
                            <th className="px-3 py-2 text-left">Số dòng</th>
                            <th className="px-3 py-2 text-left">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-500">
                                    Không có hóa đơn
                                </td>
                            </tr>
                        ) : (
                            items.map((inv) => (
                                <tr key={inv.id} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{inv.code ?? "-"}</td>
                                    <td className="px-3 py-2">{inv.type}</td>

                                    <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${inv.status === "ISSUED"
                                                ? "bg-green-100 text-green-700"
                                                : inv.status === "DRAFT"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {inv.status}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2">{inv.customerName ?? "-"}</td>
                                    <td className="px-3 py-2">{inv.vendorName ?? "-"}</td>

                                    <td className="px-3 py-2">{fmtDate(inv.createdAt)}</td>
                                    <td className="px-3 py-2">{fmtMoney(inv.grandTotal, inv.currency)}</td>

                                    <td className="px-3 py-2">
                                        <ItemPopover
                                            parentId={inv.id}
                                            type="invoices"
                                            count={inv.itemCount}
                                            currency={inv.currency}
                                            status={inv.status}
                                        />

                                    </td>

                                    <td className="relative px-3 py-2 text-right">
                                        <button
                                            className="p-2 rounded hover:bg-gray-100"
                                            onClick={() =>
                                                setOpenMenuId(openMenuId === inv.id ? null : inv.id)
                                            }
                                        >
                                            ⋮
                                        </button>

                                        <InvoiceActionMenu
                                            invoiceId={inv.id}
                                            status={inv.status}
                                            open={openMenuId === inv.id}
                                            onClose={() => setOpenMenuId(null)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={`rounded border px-3 py-1 text-sm ${page <= 1 ? "opacity-50 pointer-events-none" : ""}`}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-1 text-sm ${page >= totalPages ? "opacity-50 pointer-events-none" : ""
                            }`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
