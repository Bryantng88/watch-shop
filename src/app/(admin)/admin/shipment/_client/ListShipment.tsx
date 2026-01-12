"use client";

import Link from "next/link";
import { useMemo } from "react";

/* ==============================
 * Types
 * ============================== */
export type ShipmentRow = {
    id: string;
    refNo: string | null;
    status: string;
    createdAt: string; // ✅ server đã serialize

    orderRefNo: string | null;
    customerName: string;
    shipPhone: string;
    shipAddress: string;

    carrier: string | null;
    trackingNo: string | null;
    shippingFee: number | null;
};

type PageProps = {
    items: ShipmentRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};

/* ==============================
 * Helpers
 * ============================== */
function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function Badge({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "gray" | "blue" | "green" | "amber" | "red";
}) {
    const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
    const toneCls =
        tone === "blue"
            ? "bg-blue-50 text-blue-700"
            : tone === "green"
                ? "bg-green-50 text-green-700"
                : tone === "amber"
                    ? "bg-amber-50 text-amber-700"
                    : tone === "red"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-700";

    return <span className={cls(base, toneCls)}>{children}</span>;
}

function statusTone(status: string) {
    switch (status) {
        case "DRAFT":
            return "gray";
        case "READY":
            return "blue";
        case "SHIPPED":
            return "amber";
        case "DELIVERED":
            return "green";
        case "CANCELLED":
            return "red";
        default:
            return "gray";
    }
}

function money(n?: number | null) {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + " VND";
}

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

function firstParam(v: string | string[] | undefined) {
    return Array.isArray(v) ? v[0] : v;
}

/* ==============================
 * Component
 * ============================== */
export default function ListShipmentClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: PageProps) {
    const url = useMemo(() => new URLSearchParams(rawSearchParams as any), [rawSearchParams]);

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/shipments?${next.toString()}`;
    };

    const q = firstParam(rawSearchParams.q) ?? "";
    const status = firstParam(rawSearchParams.status) ?? "";
    const currentPageSize = firstParam(rawSearchParams.pageSize) ?? String(pageSize);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Shipment</h1>
                    <div className="mt-1 text-sm text-gray-600">
                        Danh sách shipment được tạo từ đơn hàng
                    </div>
                </div>

                <Link
                    href="/admin/orders"
                    className="rounded-md border px-3 py-2 hover:bg-gray-50 text-sm"
                >
                    ← Quay lại Order
                </Link>
            </div>

            {/* Filter */}
            <form action="/admin/shipments" method="get" className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="RefNo, OrderRefNo, tên KH, số ĐT…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Trạng thái</label>
                    <select name="status" defaultValue={status} className="h-9 rounded border px-2">
                        <option value="">Tất cả</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="READY">READY</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Page size</label>
                    <select name="pageSize" defaultValue={currentPageSize} className="h-9 rounded border px-2">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3" type="submit">
                        Lọc
                    </button>

                    <Link
                        href="/admin/shipments"
                        className="h-9 rounded border px-3 flex items-center"
                    >
                        Clear
                    </Link>
                </div>
            </form>

            {/* Table */}
            <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">Shipment</th>
                            <th className="px-3 py-2 text-left">Khách hàng</th>
                            <th className="px-3 py-2 text-left">Vận chuyển</th>
                            <th className="px-3 py-2 text-right">Phí ship</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-right">Ngày tạo</th>
                            <th className="px-3 py-2 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                                    Chưa có shipment nào
                                </td>
                            </tr>
                        ) : (
                            items.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    {/* Shipment */}
                                    <td className="px-3 py-2">
                                        <div className="font-medium">{s.refNo ?? s.id.slice(0, 8)}</div>
                                        {s.orderRefNo && (
                                            <div className="text-xs text-gray-500">Order: {s.orderRefNo}</div>
                                        )}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-3 py-2">
                                        <div className="font-medium">{s.customerName || "-"}</div>
                                        <div className="text-xs text-gray-500">{s.shipPhone || "-"}</div>
                                        {s.shipAddress && (
                                            <div className="text-xs text-gray-400 line-clamp-1">{s.shipAddress}</div>
                                        )}
                                    </td>

                                    {/* Carrier */}
                                    <td className="px-3 py-2">
                                        <div>{s.carrier ?? "-"}</div>
                                        {s.trackingNo && (
                                            <div className="text-xs text-gray-500">Tracking: {s.trackingNo}</div>
                                        )}
                                    </td>

                                    {/* Fee */}
                                    <td className="px-3 py-2 text-right font-medium">{money(s.shippingFee)}</td>

                                    {/* Status */}
                                    <td className="px-3 py-2">
                                        <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                                    </td>

                                    {/* Created */}
                                    <td className="px-3 py-2 text-right text-xs text-gray-500">
                                        {fmtDate(s.createdAt)}
                                    </td>

                                    {/* Action */}
                                    <td className="px-3 py-2 text-right">
                                        <Link
                                            href={`/admin/shipments/${s.id}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Xem
                                        </Link>
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
                        className={cls(
                            "rounded border px-3 py-1 text-sm",
                            page <= 1 && "pointer-events-none opacity-50"
                        )}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={cls(
                            "rounded border px-3 py-1 text-sm",
                            page >= totalPages && "pointer-events-none opacity-50"
                        )}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
