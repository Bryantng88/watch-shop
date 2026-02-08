"use client";

import { useEffect, useMemo, useState } from "react";

type CatalogOpt = { id: string; code: string; name: string };

type ServiceRow = {
    key: string;
    serviceCatalogId: string;
    notes: string;
};

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

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
    const [loaded, setLoaded] = useState(false);

    // nhiều service rows
    const [rows, setRows] = useState<ServiceRow[]>([
        { key: uid(), serviceCatalogId: "", notes: "" },
    ]);

    // load dropdown 1 lần khi mở lần đầu
    useEffect(() => {
        if (!open) return;
        if (loaded) return;

        (async () => {
            const res = await fetch("/api/admin/service-catalog/dropdown");
            const data = await res.json();
            const items: CatalogOpt[] = data.items ?? data ?? [];

            setCatalogs(items);

            // set default row[0] nếu có
            const firstId = items?.[0]?.id ?? "";
            setRows([{ key: uid(), serviceCatalogId: firstId, notes: "" }]);

            setLoaded(true);
        })();
    }, [open, loaded]);

    // reset state khi đóng (tuỳ bạn: nếu muốn giữ lại thì bỏ phần này)
    useEffect(() => {
        if (open) return;
        setLoading(false);
        // giữ loaded để không fetch lại
        // reset rows về 1 dòng trống (hoặc giữ nguyên)
        setRows((prev) => prev.slice(0, 1).map((r) => ({ ...r, notes: "" })));
    }, [open]);

    const canSubmit = useMemo(() => {
        const validRows = rows.filter((r) => r.serviceCatalogId);
        return productId && validRows.length > 0 && !loading;
    }, [rows, productId, loading]);

    const addRow = () => {
        const firstId = catalogs?.[0]?.id ?? "";
        setRows((prev) => [...prev, { key: uid(), serviceCatalogId: firstId, notes: "" }]);
    };

    const removeRow = (key: string) => {
        setRows((prev) => {
            if (prev.length <= 1) return prev; // luôn giữ ít nhất 1 dòng
            return prev.filter((r) => r.key !== key);
        });
    };

    const updateRow = (key: string, patch: Partial<ServiceRow>) => {
        setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[720px] p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Tạo Service Request (nhiều dịch vụ)</h3>
                    <button
                        className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                {/* LIST ROWS */}
                <div className="space-y-3">
                    {rows.map((r, idx) => (
                        <div key={r.key} className="rounded border p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Dịch vụ #{idx + 1}</div>

                                <button
                                    type="button"
                                    className="text-xs px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
                                    onClick={() => removeRow(r.key)}
                                    disabled={rows.length <= 1}
                                >
                                    Xóa
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-5 space-y-1">
                                    <label className="text-xs text-gray-600">Chọn dịch vụ</label>
                                    <select
                                        className="h-9 w-full rounded border px-2"
                                        value={r.serviceCatalogId}
                                        onChange={(e) => updateRow(r.key, { serviceCatalogId: e.target.value })}
                                    >
                                        {catalogs.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.code ? `${c.code} — ` : ""}
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-7 space-y-1">
                                    <label className="text-xs text-gray-600">Ghi chú (INTERNAL)</label>
                                    <textarea
                                        className="w-full rounded border p-2 min-h-[72px]"
                                        placeholder="VD: kiểm tra máy, test sai số..."
                                        value={r.notes}
                                        onChange={(e) => updateRow(r.key, { notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <button
                        type="button"
                        className="px-3 py-2 rounded border hover:bg-gray-50"
                        onClick={addRow}
                    >
                        + Thêm dịch vụ
                    </button>

                    <div className="flex justify-end gap-2">
                        <button className="px-3 py-2 rounded border" onClick={onClose} type="button">
                            Hủy
                        </button>

                        <button
                            className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
                            disabled={!canSubmit}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const payload = {
                                        productId,
                                        scope: "INTERNAL",
                                        services: rows
                                            .filter((r) => r.serviceCatalogId)
                                            .map((r) => ({
                                                serviceCatalogId: r.serviceCatalogId,
                                                notes: r.notes?.trim() ? r.notes.trim() : null,
                                            })),
                                    };

                                    const res = await fetch("/api/admin/service-requests/from-product", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    if (!res.ok) {
                                        const text = await res.text();     // ✅ đọc text để không nổ json
                                        alert(text || "Tạo service thất bại");
                                        return;
                                    }
                                    const data = await res.json(); // nếu API trả items: [{id, refNo}, ...]
                                    // bạn có thể điều hướng tới list hoặc item đầu tiên
                                    // window.location.href = `/admin/service-requests`;
                                    onClose();
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            type="button"
                        >
                            {loading ? "Đang tạo..." : "Tạo services"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
