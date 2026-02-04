"use client";

import { useEffect, useState } from "react";

type CatalogOpt = { id: string; code: string; name: string };

export default function CreateServiceRequestModal({
    open,
    onClose,
    productId,
}: {
    open: boolean;
    onClose: () => void;
    productId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState<CatalogOpt[]>([]);
    const [serviceCatalogId, setServiceCatalogId] = useState("");
    const [notes, setNotes] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (loaded) return;

        (async () => {
            const res = await fetch("/api/admin/service-catalog/dropdown");
            const data = await res.json();
            const items = data.items ?? data ?? [];
            setCatalogs(items);
            setServiceCatalogId(items?.[0]?.id ?? "");
            setLoaded(true);
        })();
    }, [open, loaded]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[520px] p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Tạo Service Request</h3>
                    <button className="text-sm px-2 py-1 rounded hover:bg-gray-100" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-600">Chọn dịch vụ</label>
                    <select
                        className="h-9 w-full rounded border px-2"
                        value={serviceCatalogId}
                        onChange={(e) => setServiceCatalogId(e.target.value)}
                    >
                        {catalogs.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.code ? `${c.code} — ` : ""}{c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-600">Ghi chú kỹ thuật (INTERNAL)</label>
                    <textarea
                        className="w-full rounded border p-2 min-h-[90px]"
                        placeholder="VD: kiểm tra máy, test sai số, cần đại tu trước khi bán..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button className="px-3 py-2 rounded border" onClick={onClose} type="button">
                        Hủy
                    </button>

                    <button
                        className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
                        disabled={!serviceCatalogId || loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await fetch("/api/admin/service-requests/from-product", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        productId,
                                        serviceCatalogId,
                                        scope: "INTERNAL",
                                        notes,
                                    }),
                                });
                                const data = await res.json();
                                // điều hướng qua detail service request
                                window.location.href = `/admin/service-requests/${data.id}`;
                            } finally {
                                setLoading(false);
                            }
                        }}
                        type="button"
                    >
                        Tạo service
                    </button>
                </div>
            </div>
        </div>
    );
}
