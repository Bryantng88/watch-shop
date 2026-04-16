"use client";

import { useEffect, useMemo, useState } from "react";
import DotLabel from "../../__components/DotLabel";

type MaintenanceLog = {
    id: string;
    vendorName?: string | null;
    notes?: string | null;
    diagnosis?: string | null;
    workSummary?: string | null;
    totalCost?: number | null;
    servicedAt?: string | null;
    createdAt?: string | null;
    eventType?: string | null;
    processingMode?: string | null;
    ServiceCatalog?: { id: string; code: string | null; name: string } | null;
};

type ApiRes = {
    sr?: {
        id: string;
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        status?: string | null;
    } | null;
    serviceRequest?: {
        id: string;
        vendorId?: string | null;
        vendorNameSnap?: string | null;
        status?: string | null;
    } | null;
    logs?: MaintenanceLog[];
    items?: MaintenanceLog[];
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
    const [panelLoading, setPanelLoading] = useState(false);
    const [logs, setLogs] = useState<MaintenanceLog[]>([]);
    const [currentVendorName, setCurrentVendorName] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !serviceRequestId) return;

        let cancelled = false;

        (async () => {
            setPanelLoading(true);
            try {
                const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/maintenance`, {
                    cache: "no-store",
                });
                const data: ApiRes = await res.json();
                if (!res.ok) throw new Error("Load service logs failed");
                if (cancelled) return;

                const sr = data.sr ?? data.serviceRequest ?? null;
                const items = Array.isArray(data.logs ?? data.items) ? (data.logs ?? data.items)! : [];

                setCurrentVendorName(sr?.vendorNameSnap ?? null);
                setStatus(sr?.status ?? null);
                setLogs(items);
            } catch (err: any) {
                if (!cancelled) alert(err?.message || "Load service logs failed");
            } finally {
                if (!cancelled) setPanelLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, serviceRequestId]);

    const totalCost = useMemo(() => logs.reduce((sum, log) => sum + Number(log.totalCost ?? 0), 0), [logs]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 p-4">
            <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b px-6 py-4">
                    <div>
                        <div className="text-2xl font-semibold">Log service</div>
                        <div className="text-sm text-gray-500">{title || serviceRequestId}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span>Trạng thái: <span className="font-medium text-gray-700">{status || "-"}</span></span>
                            <span>Vendor: <span className="font-medium text-gray-700">{currentVendorName || "-"}</span></span>
                            <span>Tổng chi phí log: <span className="font-medium text-gray-700">{fmtMoney(totalCost)}</span></span>
                        </div>
                    </div>
                    <button className="rounded-md px-3 py-2 hover:bg-gray-100" onClick={onClose} type="button">
                        Đóng
                    </button>
                </div>

                <div className="max-h-[calc(85vh-96px)] overflow-auto p-6">
                    {panelLoading ? (
                        <div className="text-sm text-gray-500">Đang tải...</div>
                    ) : logs.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-6 text-sm text-gray-500">
                            Chưa có dòng log nào cho service request này.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log, idx) => (
                                <div key={log.id} className="rounded-xl border p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-sm font-semibold">Dòng #{idx + 1}</div>
                                                <DotLabel tone="blue">{log.ServiceCatalog?.name || log.eventType || "NOTE"}</DotLabel>
                                                {log.processingMode ? (
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                                        {log.processingMode}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {fmtDate(log.servicedAt || log.createdAt)}
                                            </div>
                                        </div>

                                        <div className={cls("text-sm font-medium", log.totalCost ? "text-gray-900" : "text-gray-400")}>
                                            {fmtMoney(log.totalCost ?? null)}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid gap-2 text-sm text-gray-700">
                                        <div>Vendor: <span className="font-medium">{log.vendorName || "-"}</span></div>
                                        {log.diagnosis ? <div>Chẩn đoán: <span className="whitespace-pre-wrap">{log.diagnosis}</span></div> : null}
                                        {log.workSummary ? <div>Xử lý: <span className="whitespace-pre-wrap">{log.workSummary}</span></div> : null}
                                        <div>Ghi chú: <span className="whitespace-pre-wrap">{log.notes || "-"}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
