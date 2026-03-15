"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotify } from "@/components/feedback/AppToastProvider";

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
    const router = useRouter();
    const notify = useNotify();

    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState<CatalogOpt[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loadingCatalogs, setLoadingCatalogs] = useState(false);

    const [rows, setRows] = useState<ServiceRow[]>([
        { key: uid(), serviceCatalogId: "", notes: "" },
    ]);

    const resetRows = (firstCatalogId = "") => {
        setRows([{ key: uid(), serviceCatalogId: firstCatalogId, notes: "" }]);
    };

    useEffect(() => {
        if (!open || loaded) return;

        let cancelled = false;

        (async () => {
            try {
                setLoadingCatalogs(true);

                const res = await fetch("/api/admin/service-catalog/dropdown", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.message || data?.error || "Không tải được danh mục dịch vụ");
                }

                const items: CatalogOpt[] = data?.items ?? data ?? [];

                if (cancelled) return;

                setCatalogs(items);

                const firstId = items?.[0]?.id ?? "";
                resetRows(firstId);
                setLoaded(true);
            } catch (error: any) {
                if (cancelled) return;
                notify.error({
                    title: "Không tải được dữ liệu",
                    message: error?.message || "Không tải được danh mục dịch vụ",
                });
            } finally {
                if (!cancelled) {
                    setLoadingCatalogs(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, loaded, notify]);

    useEffect(() => {
        if (open) return;

        setLoading(false);
        const firstId = catalogs?.[0]?.id ?? "";
        resetRows(firstId);
    }, [open, catalogs]);

    const canSubmit = useMemo(() => {
        const validRows = rows.filter((r) => r.serviceCatalogId);
        return Boolean(productId) && validRows.length > 0 && !loading && !loadingCatalogs;
    }, [rows, productId, loading, loadingCatalogs]);

    const addRow = () => {
        const firstId = catalogs?.[0]?.id ?? "";
        setRows((prev) => [
            ...prev,
            { key: uid(), serviceCatalogId: firstId, notes: "" },
        ]);
    };

    const removeRow = (key: string) => {
        setRows((prev) => {
            if (prev.length <= 1) return prev;
            return prev.filter((r) => r.key !== key);
        });
    };

    const updateRow = (key: string, patch: Partial<ServiceRow>) => {
        setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    };

    const handleSubmit = async () => {
        const services = rows
            .filter((r) => r.serviceCatalogId)
            .map((r) => ({
                serviceCatalogId: r.serviceCatalogId,
                notes: r.notes?.trim() ? r.notes.trim() : null,
            }));

        if (!productId) {
            notify.error({
                title: "Thiếu dữ liệu",
                message: "Không tìm thấy sản phẩm để tạo service request",
            });
            return;
        }

        if (!services.length) {
            notify.warning({
                title: "Chưa chọn dịch vụ",
                message: "Vui lòng chọn ít nhất một dịch vụ",
            });
            return;
        }

        try {
            setLoading(true);

            const payload = {
                productId,
                scope: "INTERNAL",
                services,
            };

            const res = await fetch("/api/admin/service-requests/from-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.ok === false) {
                throw new Error(
                    data?.message || data?.error || "Tạo service request thất bại"
                );
            }

            notify.success({
                title: "Thành công",
                message: data?.message || "Tạo service request thành công",
            });

            onClose();
            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Tạo thất bại",
                message: error?.message || "Tạo service request thất bại",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-[720px] rounded-lg bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tạo Service Request (nhiều dịch vụ)</h3>
                    <button
                        className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                        onClick={onClose}
                        type="button"
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                {loadingCatalogs ? (
                    <div className="rounded border border-dashed p-6 text-sm text-gray-500">
                        Đang tải danh mục dịch vụ...
                    </div>
                ) : catalogs.length === 0 ? (
                    <div className="rounded border border-dashed p-6 text-sm text-gray-500">
                        Chưa có dịch vụ nào trong danh mục.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rows.map((r, idx) => (
                            <div key={r.key} className="rounded border p-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm font-medium">Dịch vụ #{idx + 1}</div>

                                    <button
                                        type="button"
                                        className="rounded border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                                        onClick={() => removeRow(r.key)}
                                        disabled={rows.length <= 1 || loading}
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                                    <div className="space-y-1 md:col-span-5">
                                        <label className="text-xs text-gray-600">Chọn dịch vụ</label>
                                        <select
                                            className="h-9 w-full rounded border px-2"
                                            value={r.serviceCatalogId}
                                            onChange={(e) =>
                                                updateRow(r.key, {
                                                    serviceCatalogId: e.target.value,
                                                })
                                            }
                                            disabled={loading}
                                        >
                                            {catalogs.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.code ? `${c.code} — ` : ""}
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1 md:col-span-7">
                                        <label className="text-xs text-gray-600">
                                            Ghi chú (INTERNAL)
                                        </label>
                                        <textarea
                                            className="min-h-[72px] w-full rounded border p-2"
                                            placeholder="VD: kiểm tra máy, test sai số..."
                                            value={r.notes}
                                            onChange={(e) =>
                                                updateRow(r.key, { notes: e.target.value })
                                            }
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-4">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="rounded border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                            onClick={addRow}
                            disabled={loading || loadingCatalogs || catalogs.length === 0}
                        >
                            + Thêm dịch vụ
                        </button>

                        <div className="flex justify-end gap-2">
                            <button
                                className="rounded border px-3 py-2"
                                onClick={onClose}
                                type="button"
                                disabled={loading}
                            >
                                Hủy
                            </button>

                            <button
                                className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                                type="button"
                            >
                                {loading ? "Đang tạo..." : "Tạo services"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}