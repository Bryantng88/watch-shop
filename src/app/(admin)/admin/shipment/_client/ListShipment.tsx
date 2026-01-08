"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ==============================
 * Types
 * ============================== */
type ShipmentRow = {
    id: string;
    code: string | null;
    status: string;
    createdAt: Date;

    orderRefNo: string | null;
    customerName: string;
    shipPhone: string;
    shipAddress: string;

    carrier: string | null;
    trackingNo: string | null;
    shippingFee: number | null;
};

export type ShipmentListData = {
    page: number;
    pageSize: number;
    total: number;
    rows: ShipmentRow[];
};

type Props = {
    data: ShipmentListData;
};
function Badge({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "gray" | "blue" | "green" | "amber" | "red";
}) {
    const base =
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
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
    return <span className={`${base} ${toneCls}`}>{children}</span>;
}

function statusTone(status: ShipmentRow["status"]) {
    switch (status) {
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
    return new Intl.NumberFormat("vi-VN").format(n) + " VND";
}

/* ==============================
 * Component
 * ============================== */
export default function ShipmentListClient({ data }: Props) {
    const [rows, setRows] = useState<ShipmentRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let aborted = false;

        setLoading(true);
        fetch("/api/admin/shipments")
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
                if (aborted) return;
                setRows(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!aborted) setRows([]);
            })
            .finally(() => {
                if (!aborted) setLoading(false);
            });

        return () => {
            aborted = true;
        };
    }, []);

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
                        {loading && (
                            <tr>
                                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                                    Đang tải…
                                </td>
                            </tr>
                        )}

                        {!loading && rows.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                                    Chưa có shipment nào
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            rows.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    {/* Shipment */}
                                    <td className="px-3 py-2">
                                        <div className="font-medium">
                                            {s.code ?? s.id.slice(0, 8)}
                                        </div>
                                        {s.orderRefNo && (
                                            <div className="text-xs text-gray-500">
                                                Order: {s.orderRefNo}
                                            </div>
                                        )}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-3 py-2">
                                        <div className="font-medium">{s.customerName}</div>
                                        <div className="text-xs text-gray-500">{s.shipPhone}</div>
                                        {s.shipAddress && (
                                            <div className="text-xs text-gray-400 line-clamp-1">
                                                {s.shipAddress}
                                            </div>
                                        )}
                                    </td>

                                    {/* Carrier */}
                                    <td className="px-3 py-2">
                                        <div>{s.carrier ?? "-"}</div>
                                        {s.trackingNo && (
                                            <div className="text-xs text-gray-500">
                                                Tracking: {s.trackingNo}
                                            </div>
                                        )}
                                    </td>

                                    {/* Fee */}
                                    <td className="px-3 py-2 text-right font-medium">
                                        {money(s.shippingFee)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-2">
                                        <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                                    </td>

                                    {/* Created */}
                                    <td className="px-3 py-2 text-right text-xs text-gray-500">
                                        {new Date(s.createdAt).toLocaleString("vi-VN")}
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
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
