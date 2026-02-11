"use client";

import { useEffect, useState } from "react";

type LogRow = {
    id: string;
    createdAt: string;
    servicedAt?: string | null;
    notes?: string | null;
    vendorName?: string | null;
    totalCost?: number | null;
    billed?: boolean | null;
};

function fmt(d?: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function MaintenanceLogModal({
    open,
    onClose,
    serviceRequestId,
    title,
}: {
    open: boolean;
    onClose: () => void;
    serviceRequestId: string;
    title?: string;
}) {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<LogRow[]>([]);

    useEffect(() => {
        if (!open) return;
        if (!serviceRequestId) return;

        (async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, { cache: "no-store" });
                const data = await res.json();
                setItems(data.items ?? []);
            } finally {
                setLoading(false);
            }
        })();
    }, [open, serviceRequestId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[720px] max-w-[95vw] p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">Maintenance logs</h3>
                        {title ? <div className="text-xs text-gray-500 mt-1">{title}</div> : null}
                    </div>
                    <button className="text-sm px-2 py-1 rounded hover:bg-gray-100" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div className="py-10 text-center text-gray-500">Đang tải logs…</div>
                ) : items.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">Chưa có log</div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-3 py-2 text-left">Thời gian</th>
                                    <th className="px-3 py-2 text-left">Vendor</th>
                                    <th className="px-3 py-2 text-left">Ghi chú</th>
                                    <th className="px-3 py-2 text-right">Chi phí</th>
                                    <th className="px-3 py-2 text-center">Billed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((x) => (
                                    <tr key={x.id} className="border-b last:border-b-0">
                                        <td className="px-3 py-2 whitespace-nowrap">{fmt(x.servicedAt ?? x.createdAt)}</td>
                                        <td className="px-3 py-2">{x.vendorName ?? "-"}</td>
                                        <td className="px-3 py-2">{x.notes ?? "-"}</td>
                                        <td className="px-3 py-2 text-right font-mono">{x.totalCost ?? 0}</td>
                                        <td className="px-3 py-2 text-center">{x.billed ? "✓" : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-end">
                    <button className="px-3 py-2 rounded border" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
}
