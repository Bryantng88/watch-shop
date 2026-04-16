"use client";

import { useEffect, useState } from "react";

type TechnicianLite = { id: string; name: string; email?: string };

function normalizeItems(payload: unknown): TechnicianLite[] {
    if (Array.isArray(payload)) return payload as TechnicianLite[];
    if (payload && typeof payload === "object" && Array.isArray((payload as any).items)) {
        return (payload as any).items as TechnicianLite[];
    }
    return [];
}

export default function BulkAssignTechnicianModal({
    open,
    onClose,
    serviceRequestIds,
    onAssigned,
}: {
    open: boolean;
    onClose: () => void;
    serviceRequestIds?: string[];
    onAssigned?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<TechnicianLite[]>([]);
    const [technicianId, setTechnicianId] = useState<string>("");
    const [note, setNote] = useState("");
    const [loaded, setLoaded] = useState(false);

    const selectedIds = serviceRequestIds ?? [];
    const selectedCount = selectedIds.length;

    useEffect(() => {
        if (!open || loaded) return;

        (async () => {
            try {
                const res = await fetch("/api/admin/users/technicians", { cache: "no-store" });
                const data = await res.json();
                const next = normalizeItems(data);
                setItems(next);
                setTechnicianId(next?.[0]?.id ?? "");
                setLoaded(true);
            } catch (err) {
                console.error("load technicians failed", err);
            }
        })();
    }, [open, loaded]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-[560px] space-y-4 rounded-lg bg-white p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Gán thợ tiếp nhận</h3>
                    <button className="rounded px-2 py-1 text-sm hover:bg-gray-100" onClick={onClose} type="button">
                        ✕
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    Bạn đang chọn <b>{selectedCount}</b> service request. Thợ sẽ tiếp nhận sơ bộ trước, sau đó mới chuyển vendor nếu cần.
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-600">Chọn thợ</label>
                    <select
                        className="h-9 w-full rounded border px-2"
                        value={technicianId}
                        onChange={(e) => setTechnicianId(e.target.value)}
                        disabled={items.length === 0}
                    >
                        {items.length === 0 ? (
                            <option value="">Không có tài khoản thợ phù hợp</option>
                        ) : (
                            items.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}{v.email ? ` • ${v.email}` : ""}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-600">Ghi chú giao việc (tuỳ chọn)</label>
                    <textarea
                        className="min-h-[96px] w-full rounded border px-3 py-2 text-sm"
                        placeholder="Ví dụ: kiểm tra sơ bộ, xác nhận có cần gửi vendor hay không..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button className="rounded border px-3 py-2" onClick={onClose} type="button">
                        Hủy
                    </button>

                    <button
                        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
                        disabled={!technicianId || loading || selectedCount === 0}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await fetch("/api/admin/service-requests/bulk-assign-technician", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ ids: selectedIds, technicianId, note: note.trim() || null }),
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error ?? "Bulk assign technician failed");
                                onAssigned?.();
                            } catch (e: any) {
                                alert(e?.message ?? "Bulk assign technician failed");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        type="button"
                    >
                        {loading ? "Đang cập nhật..." : "Gán thợ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
