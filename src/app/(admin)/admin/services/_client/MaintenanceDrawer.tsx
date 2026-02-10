"use client";

import { useEffect, useMemo, useState } from "react";

type VendorOpt = { id: string; name: string };
type MaintRow = {
    id: string;
    vendorId: string | null;
    vendorName: string | null;
    servicedAt: string | null;
    notes: string | null;
    totalCost: number | null;
    createdAt: string;
};

function fmt(d?: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleString("vi-VN");
}

export default function MaintenanceDrawer({
    open,
    onClose,
    serviceRequestId,
    onChanged,
}: {
    open: boolean;
    onClose: () => void;
    serviceRequestId: string;
    onChanged?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<MaintRow[]>([]);
    const [notes, setNotes] = useState("");
    const [servicedAt, setServicedAt] = useState<string>("");
    const [totalCost, setTotalCost] = useState<string>("");

    const [vendors, setVendors] = useState<VendorOpt[]>([]);
    const [vendorId, setVendorId] = useState<string>("");

    const canFetch = open && !!serviceRequestId;

    const fetchAll = async () => {
        if (!serviceRequestId) return;
        setLoading(true);
        try {
            const [mRes, vRes] = await Promise.all([
                fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`),
                fetch(`/api/admin/vendors/dropdown`), // nếu bạn đã có endpoint vendors dropdown
            ]);

            const m = await mRes.json();
            setRows(m.items ?? []);

            const v = await vRes.json();
            const vItems: VendorOpt[] = v.items ?? v ?? [];
            setVendors(vItems);
            if (!vendorId && vItems?.[0]?.id) setVendorId(vItems[0].id);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!canFetch) return;
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canFetch, serviceRequestId]);

    const submitAddLog = async () => {
        setLoading(true);
        try {
            await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendorId: vendorId || null,
                    notes: notes || null,
                    servicedAt: servicedAt ? new Date(servicedAt).toISOString() : null,
                    totalCost: totalCost ? Number(totalCost) : null,
                }),
            });
            setNotes("");
            setServicedAt("");
            setTotalCost("");
            await fetchAll();
            onChanged?.();
        } finally {
            setLoading(false);
        }
    };

    const submitAssignVendor = async () => {
        if (!vendorId) return;
        setLoading(true);
        try {
            await fetch(`/api/admin/service-requests/${serviceRequestId}/assign-vendor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vendorId }),
            });
            await fetchAll();
            onChanged?.();
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />

            {/* panel */}
            <div className="absolute right-0 top-0 h-full w-[520px] bg-white shadow-xl border-l flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-lg">Maintenance</div>
                        <div className="text-xs text-gray-500 font-mono">{serviceRequestId}</div>
                    </div>
                    <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={onClose}>✕</button>
                </div>

                <div className="p-4 space-y-4 overflow-auto">
                    {/* Assign vendor */}
                    <div className="border rounded p-3 space-y-2">
                        <div className="text-sm font-medium">Vendor</div>
                        <div className="flex gap-2">
                            <select
                                className="h-9 flex-1 rounded border px-2"
                                value={vendorId}
                                onChange={(e) => setVendorId(e.target.value)}
                            >
                                {vendors.map((v) => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            <button
                                className="h-9 px-3 rounded bg-black text-white disabled:opacity-50"
                                disabled={!vendorId || loading}
                                onClick={submitAssignVendor}
                                type="button"
                            >
                                Assign
                            </button>
                        </div>
                        <div className="text-xs text-gray-500">
                            Assign sẽ set SR.status → IN_PROGRESS và tạo 1 maintenance log (nếu bạn implement như service bên dưới).
                        </div>
                    </div>

                    {/* Add log */}
                    <div className="border rounded p-3 space-y-2">
                        <div className="text-sm font-medium">Thêm log</div>

                        <textarea
                            className="w-full rounded border p-2 min-h-[90px]"
                            placeholder="Ghi chú bảo trì..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <input
                                className="h-9 rounded border px-2 flex-1"
                                type="datetime-local"
                                value={servicedAt}
                                onChange={(e) => setServicedAt(e.target.value)}
                            />
                            <input
                                className="h-9 rounded border px-2 w-36"
                                type="number"
                                placeholder="Cost"
                                value={totalCost}
                                onChange={(e) => setTotalCost(e.target.value)}
                            />
                            <button
                                className="h-9 px-3 rounded bg-black text-white disabled:opacity-50"
                                disabled={loading}
                                onClick={submitAddLog}
                                type="button"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                        <div className="text-sm font-semibold">Timeline</div>

                        {rows.length === 0 ? (
                            <div className="text-sm text-gray-500">Chưa có maintenance log</div>
                        ) : (
                            <div className="space-y-2">
                                {rows.map((r) => (
                                    <div key={r.id} className="border rounded p-3">
                                        <div className="flex justify-between gap-2">
                                            <div className="text-sm font-medium">{r.vendorName ?? "—"}</div>
                                            <div className="text-xs text-gray-500">{fmt(r.servicedAt ?? r.createdAt)}</div>
                                        </div>
                                        {r.totalCost != null ? (
                                            <div className="text-xs text-gray-500 mt-1">Cost: {Number(r.totalCost).toLocaleString("vi-VN")}</div>
                                        ) : null}
                                        {r.notes ? <div className="text-sm mt-2 whitespace-pre-wrap">{r.notes}</div> : null}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t text-xs text-gray-500">
                    Tip: Nếu đổi vendor giữa chừng, cứ Assign vendor lại → hệ thống tạo log mới, vẫn giữ lịch sử.
                </div>
            </div>
        </div>
    );
}
