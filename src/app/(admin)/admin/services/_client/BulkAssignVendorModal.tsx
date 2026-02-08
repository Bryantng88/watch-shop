// src/app/(admin)/admin/services/_client/BulkAssignVendorModal.tsx
"use client";

import { useEffect, useState } from "react";

type VendorLite = { id: string; name: string };

export default function BulkAssignVendorModal({
    open,
    onClose,
    selectedCount,
    selectedIds,
}: {
    open: boolean;
    onClose: () => void;
    selectedCount: number;
    selectedIds: string[];
}) {
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState<VendorLite[]>([]);
    const [vendorId, setVendorId] = useState<string>("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (loaded) return;

        (async () => {
            const res = await fetch("/api/admin/vendors/dropdown", { cache: "no-store" });
            const data = await res.json();
            const items = data.items ?? [];
            setVendors(items);
            setVendorId(items?.[0]?.id ?? "");
            setLoaded(true);
        })();
    }, [open, loaded]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[520px] p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Bulk assign vendor</h3>
                    <button className="text-sm px-2 py-1 rounded hover:bg-gray-100" onClick={onClose}>
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
                    >
                        {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>

                    <div className="text-xs text-gray-500">
                        Tip: bạn cũng có thể “gỡ vendor” bằng cách chọn trống (nếu bạn muốn, mình thêm option “— Unassign —”).
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button className="px-3 py-2 rounded border" onClick={onClose} type="button">
                        Hủy
                    </button>

                    <button
                        className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
                        disabled={!vendorId || loading || selectedIds.length === 0}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await fetch("/api/admin/service-requests/bulk-assign-vendor", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ ids: selectedIds, vendorId }),
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error ?? "Bulk assign failed");

                                location.reload();
                            } catch (e: any) {
                                alert(e?.message ?? "Bulk assign failed");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        type="button"
                    >
                        {loading ? "Đang cập nhật..." : "Assign vendor"}
                    </button>
                </div>
            </div>
        </div>
    );
}
