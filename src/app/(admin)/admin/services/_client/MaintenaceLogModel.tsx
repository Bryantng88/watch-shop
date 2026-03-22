"use client";

import { useEffect, useMemo, useState } from "react";
import DotLabel from "../../__components/DotLabel";

type VendorOpt = { id: string; name: string };

type MaintenanceLog = {
    id: string;
    vendorName?: string | null;
    notes?: string | null;
    totalCost?: number | null;
    servicedAt?: string | null;
    createdAt?: string | null;
    eventType?: string | null;
};

type ApiRes = {
    serviceRequest?: {
        id: string;
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        status?: string | null;
    };
    currentVendor?: { id: string; name: string } | null;
    logs?: MaintenanceLog[];
    logCount?: number;
    items?: MaintenanceLog[];
    vendorId?: string | null;
    vendorName?: string | null;
};

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function fmtDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + ` ${cur}`;
}

function normalizeVendorItems(payload: unknown): VendorOpt[] {
    if (Array.isArray(payload)) return payload as VendorOpt[];
    if (payload && typeof payload === "object" && Array.isArray((payload as any).items)) {
        return (payload as any).items as VendorOpt[];
    }
    return [];
}

export default function MaintenanceDrawer({
    open,
    onClose,
    serviceRequestId,
}: {
    open: boolean;
    onClose: () => void;
    serviceRequestId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState<VendorOpt[]>([]);
    const [vendorsLoaded, setVendorsLoaded] = useState(false);
    const [panelLoading, setPanelLoading] = useState(false);
    const [logs, setLogs] = useState<MaintenanceLog[]>([]);
    const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);
    const [currentVendorName, setCurrentVendorName] = useState<string | null>(null);
    const [nextVendorId, setNextVendorId] = useState<string>("");
    const [notes, setNotes] = useState("");
    const [servicedAt, setServicedAt] = useState<string>("");
    const [cost, setCost] = useState<string>("");

    useEffect(() => {
        if (!open || vendorsLoaded) return;

        (async () => {
            try {
                const res = await fetch("/api/admin/vendors/dropdown");
                const data = await res.json();
                const items = normalizeVendorItems(data);
                setVendors(items);
            } finally {
                setVendorsLoaded(true);
            }
        })();
    }, [open, vendorsLoaded]);

    useEffect(() => {
        if (!open || !serviceRequestId) return;

        (async () => {
            setPanelLoading(true);
            try {
                const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`);
                const data: ApiRes = await res.json();

                const srVendorId = data?.serviceRequest?.vendorId ?? data?.vendorId ?? null;
                const srVendorName =
                    data?.currentVendor?.name ?? data?.serviceRequest?.vendorNameSnap ?? data?.vendorName ?? null;

                const items = data.logs ?? data.items ?? [];

                setCurrentVendorId(srVendorId);
                setCurrentVendorName(srVendorName);
                setNextVendorId(srVendorId ?? "");
                setLogs(Array.isArray(items) ? items : []);
            } finally {
                setPanelLoading(false);
            }
        })();
    }, [open, serviceRequestId]);

    const currentVendor = useMemo(() => {
        if (!currentVendorId) return null;
        return vendors.find((v) => v.id === currentVendorId) ?? null;
    }, [vendors, currentVendorId]);

    const canChangeVendor = !!nextVendorId && nextVendorId !== (currentVendorId ?? "");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[720px] max-w-[95vw] p-0 overflow-hidden shadow-xl">
                <div className="flex items-start justify-between px-6 py-4 border-b">
                    <div>
                        <div className="text-2xl font-semibold">Maintenance</div>
                        <div className="text-sm text-gray-500 font-mono">{serviceRequestId}</div>
                    </div>
                    <button className="rounded-md px-3 py-2 hover:bg-gray-100" onClick={onClose} type="button">
                        Đóng
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[80vh] overflow-auto">
                    <section className="rounded-xl border p-4 space-y-3">
                        <div className="text-sm font-semibold">Vendor</div>
                        <div className="text-sm text-gray-500">
                            Hiện tại: <span className="font-medium text-gray-900">{currentVendorName || currentVendor?.name || "-"}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                            <div>
                                <label className="text-xs text-gray-500">Đổi vendor</label>
                                <select
                                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                                    value={nextVendorId}
                                    onChange={(e) => setNextVendorId(e.target.value)}
                                    disabled={vendors.length === 0}
                                >
                                    <option value="">-- Chọn vendor --</option>
                                    {vendors.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                disabled={!canChangeVendor || loading}
                                className="h-10 rounded-lg bg-black px-4 text-sm font-medium text-white disabled:opacity-50"
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/assign-vendor`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ vendorId: nextVendorId || null }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok) throw new Error(data?.error || "Assign vendor failed");
                                        setCurrentVendorId(nextVendorId || null);
                                        const found = vendors.find((v) => v.id === nextVendorId);
                                        setCurrentVendorName(found?.name ?? null);
                                    } catch (err: any) {
                                        alert(err?.message || "Assign vendor failed");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                {loading ? "Đang lưu..." : "Assign vendor"}
                            </button>
                        </div>
                    </section>

                    <section className="rounded-xl border p-4 space-y-3">
                        <div className="text-sm font-semibold">Tạo log maintenance</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500">Serviced at</label>
                                <input
                                    type="datetime-local"
                                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                                    value={servicedAt}
                                    onChange={(e) => setServicedAt(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Chi phí</label>
                                <input
                                    type="number"
                                    className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500">Ghi chú</label>
                            <textarea
                                className="mt-1 min-h-[100px] w-full rounded-lg border px-3 py-2 text-sm"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Nhập ghi chú maintenance..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                disabled={loading || !notes.trim()}
                                className="h-10 rounded-lg bg-black px-4 text-sm font-medium text-white disabled:opacity-50"
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                vendorId: nextVendorId || currentVendorId || null,
                                                notes: notes.trim() || null,
                                                servicedAt: servicedAt || null,
                                                totalCost: cost ? Number(cost) : null,
                                            }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok) throw new Error(data?.error || "Create maintenance log failed");
                                        setNotes("");
                                        setServicedAt("");
                                        setCost("");
                                        const refresh = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`);
                                        const refreshData: ApiRes = await refresh.json();
                                        setLogs(Array.isArray(refreshData.logs ?? refreshData.items) ? (refreshData.logs ?? refreshData.items)! : []);
                                    } catch (err: any) {
                                        alert(err?.message || "Create maintenance log failed");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                {loading ? "Đang lưu..." : "Lưu log"}
                            </button>
                        </div>
                    </section>

                    <section className="rounded-xl border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">Lịch sử maintenance</div>
                            <div className="text-xs text-gray-500">{logs.length} log</div>
                        </div>

                        {panelLoading ? (
                            <div className="text-sm text-gray-500">Đang tải...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-sm text-gray-500">Chưa có log maintenance.</div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((log) => (
                                    <div key={log.id} className="rounded-xl border p-4">
                                        <div className="flex flex-wrap items-center gap-2 justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <DotLabel tone="blue">{log.eventType || "NOTE"}</DotLabel>
                                                <div className="text-sm text-gray-500 truncate">{fmtDate(log.servicedAt || log.createdAt)}</div>
                                            </div>
                                            <div className={cls("text-sm font-medium", log.totalCost ? "text-gray-900" : "text-gray-400")}>
                                                {fmtMoney(log.totalCost ?? null)}
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-500">Vendor: {log.vendorName || "-"}</div>
                                        <div className="mt-2 whitespace-pre-wrap text-sm text-gray-900">{log.notes || "-"}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
