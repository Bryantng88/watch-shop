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
    // bạn có thể trả theo shape khác, mình normalize ở dưới
    serviceRequest?: {
        id: string;
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        status?: string | null;
    };
    currentVendor?: { id: string; name: string } | null;
    logs?: MaintenanceLog[];
    logCount?: number;

    // fallback (nếu API bạn đang trả kiểu cũ)
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

    // vendors options (bạn đang có api vendors list riêng thì replace vào)
    const [vendors, setVendors] = useState<VendorOpt[]>([]);
    const [vendorsLoaded, setVendorsLoaded] = useState(false);

    // panel state
    const [panelLoading, setPanelLoading] = useState(false);
    const [logs, setLogs] = useState<MaintenanceLog[]>([]);
    const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);
    const [currentVendorName, setCurrentVendorName] = useState<string | null>(null);

    // change vendor UI
    const [nextVendorId, setNextVendorId] = useState<string>("");

    // create log form
    const [notes, setNotes] = useState("");
    const [servicedAt, setServicedAt] = useState<string>("");
    const [cost, setCost] = useState<string>("");

    // load vendors once when open (hoặc bạn truyền vendors từ page xuống thì bỏ fetch)
    useEffect(() => {
        if (!open) return;
        if (vendorsLoaded) return;

        (async () => {
            try {
                // TODO: đổi endpoint vendors của bạn
                const res = await fetch("/api/admin/vendors/dropdown");
                const data = await res.json();
                const items = data.items ?? data ?? [];
                setVendors(items);
            } finally {
                setVendorsLoaded(true);
            }
        })();
    }, [open, vendorsLoaded]);

    // load maintenance panel every time open or serviceRequestId change
    useEffect(() => {
        if (!open) return;
        if (!serviceRequestId) return;

        (async () => {
            setPanelLoading(true);
            try {
                const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`);
                const data: ApiRes = await res.json();

                const srVendorId =
                    data?.serviceRequest?.vendorId ?? data?.vendorId ?? null;
                const srVendorName =
                    data?.currentVendor?.name ??
                    data?.serviceRequest?.vendorNameSnap ??
                    data?.vendorName ??
                    null;

                const items = data.logs ?? data.items ?? [];

                setCurrentVendorId(srVendorId);
                setCurrentVendorName(srVendorName);

                // default nextVendorId: set = current (để dropdown “đổi” phải chọn khác mới enable)
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

    const canChangeVendor =
        !!nextVendorId && nextVendorId !== (currentVendorId ?? "");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[720px] max-w-[95vw] p-0 overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-4 border-b">
                    <div>
                        <div className="text-2xl font-semibold">Maintenance</div>
                        <div className="text-sm text-gray-500 font-mono">{serviceRequestId}</div>
                    </div>
                    <button
                        className="rounded-md px-3 py-2 hover:bg-gray-100"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Vendor block */}
                    <div className="rounded-lg border p-4 space-y-4">
                        <div className="text-lg font-semibold">Vendor</div>

                        {/* CURRENT vendor */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                            <div className="md:col-span-4">
                                <div className="text-xs text-gray-500 mb-1">Vendor hiện tại</div>
                                <div className="h-10 rounded border bg-gray-50 px-3 flex items-center justify-between">
                                    <div className="font-medium">
                                        {currentVendorName ?? currentVendor?.name ?? "—"}
                                    </div>

                                    {currentVendorId ? (
                                        <DotLabel label="Đang assign" tone="green" />
                                    ) : (
                                        <DotLabel label="Chưa assign" tone="gray" />
                                    )}
                                </div>
                            </div>

                            {/* CHANGE vendor */}
                            <div className="md:col-span-6">
                                <div className="text-xs text-gray-500 mb-1">Đổi vendor</div>
                                <select
                                    className="h-10 w-full rounded border px-2"
                                    value={nextVendorId}
                                    onChange={(e) => setNextVendorId(e.target.value)}
                                >
                                    <option value="">— Chọn vendor —</option>
                                    {vendors.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2 text-xs text-gray-500">
                                    Chỉ bấm <b>Đổi</b> khi bạn chọn vendor khác vendor hiện tại.
                                </div>
                            </div>

                            <div className="md:col-span-2 flex md:justify-end">
                                <button
                                    className={cls(
                                        "h-10 px-4 rounded text-white",
                                        canChangeVendor ? "bg-black hover:bg-neutral-800" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    )}
                                    disabled={!canChangeVendor || loading}
                                    onClick={async () => {
                                        if (!canChangeVendor) return;
                                        setLoading(true);
                                        try {
                                            const res = await fetch(
                                                `/api/admin/service-requests/${serviceRequestId}/maintenance/assign-vendor`,
                                                {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ vendorId: nextVendorId }),
                                                }
                                            );
                                            if (!res.ok) throw new Error(await res.text());

                                            // reload panel
                                            const r2 = await fetch(
                                                `/api/admin/service-requests/${serviceRequestId}/maintenance`
                                            );
                                            const data: ApiRes = await r2.json();

                                            const srVendorId =
                                                data?.serviceRequest?.vendorId ?? data?.vendorId ?? null;
                                            const srVendorName =
                                                data?.currentVendor?.name ??
                                                data?.serviceRequest?.vendorNameSnap ??
                                                data?.vendorName ??
                                                null;

                                            const items = data.logs ?? data.items ?? [];
                                            setCurrentVendorId(srVendorId);
                                            setCurrentVendorName(srVendorName);
                                            setNextVendorId(srVendorId ?? "");
                                            setLogs(Array.isArray(items) ? items : []);
                                        } catch (e: any) {
                                            alert(e?.message || "Assign vendor failed");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    type="button"
                                >
                                    {loading ? "Đang..." : "Đổi"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add log */}
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="text-lg font-semibold">Thêm log</div>

                        <textarea
                            className="w-full rounded border p-3 min-h-[110px]"
                            placeholder="Ghi chú bảo trì..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                            <div className="md:col-span-6">
                                <div className="text-xs text-gray-500 mb-1">Thời gian</div>
                                <input
                                    type="datetime-local"
                                    className="h-10 w-full rounded border px-3"
                                    value={servicedAt}
                                    onChange={(e) => setServicedAt(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-4">
                                <div className="text-xs text-gray-500 mb-1">Cost</div>
                                <input
                                    type="number"
                                    className="h-10 w-full rounded border px-3"
                                    placeholder="Cost"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2 flex md:justify-end">
                                <button
                                    className={cls(
                                        "h-10 px-4 rounded text-white",
                                        "bg-black hover:bg-neutral-800",
                                        loading && "opacity-60"
                                    )}
                                    disabled={loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const res = await fetch(
                                                `/api/admin/service-requests/${serviceRequestId}/maintenance`,
                                                {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        vendorId: currentVendorId, // log gắn theo vendor hiện tại
                                                        notes: notes || null,
                                                        servicedAt: servicedAt ? new Date(servicedAt).toISOString() : null,
                                                        totalCost: cost === "" ? null : Number(cost),
                                                        currency: "VND",
                                                    }),
                                                }
                                            );
                                            if (!res.ok) throw new Error(await res.text());

                                            // reload panel
                                            const r2 = await fetch(
                                                `/api/admin/service-requests/${serviceRequestId}/maintenance`
                                            );
                                            const data: ApiRes = await r2.json();
                                            const items = data.logs ?? data.items ?? [];
                                            setLogs(Array.isArray(items) ? items : []);

                                            // reset
                                            setNotes("");
                                            setServicedAt("");
                                            setCost("");
                                        } catch (e: any) {
                                            alert(e?.message || "Create log failed");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    type="button"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2">
                        <div className="text-lg font-semibold">Timeline</div>

                        {panelLoading ? (
                            <div className="text-sm text-gray-500">Đang tải...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-sm text-gray-500">Chưa có log</div>
                        ) : (
                            <div className="space-y-2">
                                {logs.map((l) => (
                                    <div key={l.id} className="rounded-lg border p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-semibold">
                                                    {l.vendorName || currentVendorName || "—"}
                                                </div>
                                                {l.eventType ? (
                                                    <div className="mt-1">
                                                        <DotLabel label={String(l.eventType)} tone="blue" />
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {fmtDate(l.createdAt ?? l.servicedAt)}
                                            </div>
                                        </div>

                                        {l.totalCost != null ? (
                                            <div className="text-sm text-gray-600 mt-1">
                                                Cost: <b>{fmtMoney(l.totalCost)}</b>
                                            </div>
                                        ) : null}

                                        {l.notes ? (
                                            <div className="mt-2 text-sm whitespace-pre-wrap">{l.notes}</div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-2 text-sm text-gray-500">
                            Tip: Nếu đổi vendor giữa chừng, cứ <b>Đổi vendor</b> lại → hệ thống tạo log mới, vẫn giữ lịch sử.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}