"use client";

import { useEffect, useState } from "react";

type VendorLite = { id: string; name: string };

function normalizeVendorItems(payload: unknown): VendorLite[] {
    if (Array.isArray(payload)) return payload as VendorLite[];
    if (payload && typeof payload === "object" && Array.isArray((payload as any).items)) {
        return (payload as any).items as VendorLite[];
    }
    return [];
}

export default function BulkAssignVendorModal({
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
    const [vendors, setVendors] = useState<VendorLite[]>([]);
    const [vendorId, setVendorId] = useState<string>("");
    const [loaded, setLoaded] = useState(false);

    const selectedIds = serviceRequestIds ?? [];
    const selectedCount = selectedIds.length;

    useEffect(() => {
        if (!open || loaded) return;

        (async () => {
            try {
                const res = await fetch("/api/admin/vendors/dropdown", { cache: "no-store" });
                const data = await res.json();
                const items = normalizeVendorItems(data);
                setVendors(items);
                setVendorId(items?.[0]?.id ?? "");
                setLoaded(true);
            } catch (err) {
                console.error("load vendors failed", err);
            }
        })();
    }, [open, loaded]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-[520px] space-y-4 rounded-lg bg-white p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Chuyển vendor</h3>
                    <button className="rounded px-2 py-1 text-sm hover:bg-gray-100" onClick={onClose} type="button">
                        ✕
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    Bạn đang chọn <b>{selectedCount}</b> service request.
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-600">Chọn vendor</label>
                    <select
                        className="h-9 w-full rounded border px-2"
                        value={vendorId}
                        onChange={(e) => setVendorId(e.target.value)}
                        disabled={vendors.length === 0}
                    >
                        {vendors.length === 0 ? (
                            <option value="">Không có vendor</option>
                        ) : (
                            vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))
                        )}
                    </select>

                    <div className="text-xs text-gray-500">Sau khi thợ kiểm tra, chỉ chuyển vendor cho các case cần outsource.</div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button className="rounded border px-3 py-2" onClick={onClose} type="button">
                        Hủy
                    </button>

                    <button
                        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
                        disabled={!vendorId || loading || selectedCount === 0}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await fetch("/api/admin/service-requests/bulk-assign-vendor", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ ids: selectedIds, vendorId }),
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error ?? "Bulk assign vendor failed");

                                onAssigned?.();
                            } catch (e: any) {
                                alert(e?.message ?? "Bulk assign vendor failed");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        type="button"
                    >
                        {loading ? "Đang cập nhật..." : "Chuyển vendor"}
                    </button>
                </div>
            </div>
        </div>
    );
}
