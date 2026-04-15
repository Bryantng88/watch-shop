"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    ProductListBulkBar,
    ProductListFilters,
    ProductListTable,
    ProductListToolbar,
    ProductListViewTabs,
} from "./list";
import type {
    CatalogKey,
    Counts,
    ProductListPageProps,
    ProductRow,
    ViewKey,
} from "./list/types";

type FilterState = {
    q: string;
    brandId: string;
    vendorId: string;
    hasContent: string;
    hasImages: string;
    serviceState: string;
    hasSellPrice: string;
    sort: string;
};

function normalizeView(value: string | null | undefined): ViewKey {
    const view = String(value ?? "").toLowerCase();

    if (["draft", "processing", "ready", "hold", "sold", "all"].includes(view)) {
        return view as ViewKey;
    }

    return "draft";
}

function buildCounts(
    input: ProductListPageProps["counts"],
    total: number,
    currentView: ViewKey
): Counts {
    if (input && Object.values(input).some((value) => Number(value ?? 0) >= 0)) {
        return {
            draft: Number(input.draft ?? 0),
            processing: Number(input.processing ?? 0),
            ready: Number(input.ready ?? 0),
            hold: Number(input.hold ?? 0),
            sold: Number(input.sold ?? 0),
            all: Number(input.all ?? 0),
            hasContent: Number(input.hasContent ?? 0),
            hasImages: Number(input.hasImages ?? 0),
        };
    }

    return {
        draft: currentView === "draft" ? total : 0,
        processing: currentView === "processing" ? total : 0,
        ready: currentView === "ready" ? total : 0,
        hold: currentView === "hold" ? total : 0,
        sold: currentView === "sold" ? total : 0,
        all: currentView === "all" ? total : 0,
        hasContent: 0,
        hasImages: 0,
    };
}

function setParam(next: URLSearchParams, key: string, value?: string | null) {
    if (!value) next.delete(key);
    else next.set(key, value);
}

function Pagination({
    page,
    totalPages,
    total,
    onPage,
}: {
    page: number;
    totalPages: number;
    total: number;
    onPage: (page: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <div>
                Tổng: <span className="font-semibold text-slate-950">{total}</span> •
                Trang <span className="font-semibold text-slate-950">{page}</span>/
                <span className="font-semibold text-slate-950">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => onPage(Math.max(1, page - 1))}
                >
                    ← Trước
                </button>
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page >= totalPages}
                    onClick={() => onPage(Math.min(totalPages, page + 1))}
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}

function BulkSaleModal({
    open,
    count,
    value,
    saving,
    onChange,
    onClose,
    onConfirm,
}: {
    open: boolean;
    count: number;
    value: string;
    saving: boolean;
    onChange: (value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-lg font-semibold text-slate-950">Bulk sale</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Áp dụng giá sale cho {count} sản phẩm đã chọn.
                    </p>
                </div>

                <div className="space-y-2 px-5 py-4">
                    <label className="space-y-2">
                        <div className="text-sm font-medium text-slate-800">Giá sale</div>
                        <input
                            type="number"
                            min={0}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Để trống để bỏ sale"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                        />
                    </label>
                    <div className="text-xs text-slate-500">
                        Nhập giá sale cố định. Để trống để xóa sale hàng loạt.
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        disabled={saving}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ListProducts(props: ProductListPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const [rows, setRows] = useState<ProductRow[]>(props.items ?? []);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkSaleOpen, setBulkSaleOpen] = useState(false);
    const [bulkSaleValue, setBulkSaleValue] = useState("");
    const [bulkSaleSaving, setBulkSaleSaving] = useState(false);
    const [bulkServiceLoading, setBulkServiceLoading] = useState(false);

    useEffect(() => {
        setRows(props.items ?? []);
    }, [props.items]);

    const currentView = useMemo<ViewKey>(() => {
        return normalizeView(sp.get("view"));
    }, [sp]);

    const currentCatalog: CatalogKey = useMemo(() => {
        const catalog = (sp.get("catalog") || "product").toLowerCase();
        return catalog === "strap" ? "strap" : "product";
    }, [sp]);

    const isStrapCatalog = currentCatalog === "strap";

    const counts = useMemo(
        () => buildCounts(props.counts, props.total, currentView),
        [props.counts, props.total, currentView]
    );

    const [filters, setFilters] = useState<FilterState>({
        q: sp.get("q") ?? "",
        brandId: sp.get("brandId") ?? "",
        vendorId: sp.get("vendorId") ?? "",
        hasContent: sp.get("hasContent") ?? "",
        hasImages: sp.get("hasImages") ?? "",
        serviceState: sp.get("serviceState") ?? "",
        hasSellPrice: sp.get("hasSellPrice") ?? "",
        sort: sp.get("sort") ?? "updatedDesc",
    });
    const activeQuickFilters = useMemo(
        () => ({
            hasContent: filters.hasContent === "yes",
            hasImages: filters.hasImages === "yes",
        }),
        [filters.hasContent, filters.hasImages]
    );
    useEffect(() => {
        setFilters({
            q: sp.get("q") ?? "",
            brandId: sp.get("brandId") ?? "",
            vendorId: sp.get("vendorId") ?? "",
            hasContent: sp.get("hasContent") ?? "",
            hasImages: sp.get("hasImages") ?? "",
            serviceState: sp.get("serviceState") ?? "",
            hasSellPrice: sp.get("hasSellPrice") ?? "",
            sort: sp.get("sort") ?? "updatedDesc",
        });
    }, [sp]);

    useEffect(() => {
        setSelectedIds([]);
        setBulkSaleOpen(false);
        setBulkSaleValue("");
    }, [currentCatalog, currentView, props.page, props.total]);

    function pushParams(mutator: (next: URLSearchParams) => void) {
        const next = new URLSearchParams(sp.toString());
        mutator(next);
        router.push(`${pathname}?${next.toString()}`);
    }

    function handleViewChange(view: ViewKey) {
        pushParams((next) => {
            if (view === "draft") next.delete("view");
            else next.set("view", view);
            next.set("page", "1");
        });
    }

    function handleCatalogChange(catalog: CatalogKey) {
        pushParams((next) => {
            if (catalog === "product") next.delete("catalog");
            else next.set("catalog", "strap");
            next.set("page", "1");
        });
    }

    function handleApplyFilters() {
        pushParams((next) => {
            setParam(next, "q", filters.q.trim() || null);
            setParam(next, "brandId", isStrapCatalog ? null : filters.brandId || null);
            setParam(next, "vendorId", filters.vendorId || null);
            setParam(next, "hasContent", filters.hasContent || null);
            setParam(next, "hasImages", filters.hasImages || null);
            setParam(next, "serviceState", filters.serviceState || null);
            setParam(next, "hasSellPrice", filters.hasSellPrice || null);
            setParam(next, "sort", filters.sort || "updatedDesc");
            next.set("page", "1");
        });
    }
    function handleQuickFilterClick(key: "hasContent" | "hasImages") {
        pushParams((next) => {
            const current = sp.get(key);

            if (current === "yes") {
                next.delete(key);
            } else {
                next.set(key, "yes");
            }

            next.set("page", "1");
        });
    }
    function handleClearFilters() {
        setFilters({
            q: "",
            brandId: "",
            vendorId: "",
            hasContent: "",
            hasImages: "",
            serviceState: "",
            hasSellPrice: "",
            sort: "updatedDesc",
        });

        pushParams((next) => {
            [
                "q",
                "brandId",
                "vendorId",
                "hasContent",
                "hasImages",
                "serviceState",
                "hasSellPrice",
                "sort",
            ].forEach((key) => next.delete(key));
            next.set("page", "1");
        });
    }

    function handlePage(page: number) {
        pushParams((next) => {
            next.set("page", String(page));
        });
    }

    function handleToggleOne(id: string, checked: boolean) {
        setSelectedIds((prev) => {
            if (checked) return Array.from(new Set([...prev, id]));
            return prev.filter((item) => item !== id);
        });
    }

    function handleToggleAll(checked: boolean) {
        if (checked) {
            setSelectedIds(rows.map((item) => item.id));
            return;
        }
        setSelectedIds([]);
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
            window.alert("Xoá thất bại");
            return;
        }

        router.refresh();
    }

    async function handleBulkSale() {
        const trimmed = bulkSaleValue.trim();
        const salePrice = trimmed === "" ? null : Number(trimmed);

        if (salePrice != null && (!Number.isFinite(salePrice) || salePrice < 0)) {
            window.alert("Giá sale không hợp lệ");
            return;
        }

        try {
            setBulkSaleSaving(true);

            const res = await fetch("/api/admin/products/bulk-sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productIds: selectedIds, salePrice }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || data?.message || "Bulk sale thất bại");
            }

            setRows((prev) =>
                prev.map((row) =>
                    selectedIds.includes(row.id) ? { ...row, salePrice } : row
                )
            );
            setBulkSaleOpen(false);
            setBulkSaleValue("");
            router.refresh();
        } catch (error: any) {
            window.alert(error?.message || "Bulk sale thất bại");
        } finally {
            setBulkSaleSaving(false);
        }
    }

    async function handleBulkService() {
        const ids = Array.from(new Set(selectedIds.filter(Boolean)));
        if (!ids.length) return;

        try {
            setBulkServiceLoading(true);

            const res = await fetch("/api/admin/service-requests/from-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productIds: ids, scope: "WITH_PURCHASE" }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok || data?.ok === false) {
                throw new Error(data?.error || data?.message || "Tạo service request thất bại");
            }

            window.alert(data?.message || `Đã tạo ${data?.count ?? ids.length} service request`);
            setSelectedIds([]);
            router.refresh();
        } catch (error: any) {
            window.alert(error?.message || "Tạo service request thất bại");
        } finally {
            setBulkServiceLoading(false);
        }
    }

    const handleViewProduct = (id: string) => {
        router.push(`/admin/products/${id}`);
    };

    const handleEditProduct = (id: string) => {
        router.push(`/admin/products/${id}/edit`);
    };

    const handleDeleteProduct = (id: string) => {
        handleDelete(id);
    };

    const handleCreateService = async (id: string) => {
        try {
            const res = await fetch("/api/admin/service-requests/from-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productIds: [id],
                    scope: "WITH_PURCHASE",
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.ok === false) {
                throw new Error(data?.error || data?.message || "Tạo service request thất bại");
            }

            window.alert(data?.message || "Đã tạo service request");
            router.refresh();
        } catch (e: any) {
            window.alert(e?.message || "Tạo service request thất bại");
        }
    };

    const brandOptions = props.brands.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const vendorOptions = props.vendors.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    return (
        <div className="space-y-4">
            <ProductListToolbar
                selectedCount={selectedIds.length}
                catalog={currentCatalog}
                onCatalogChange={handleCatalogChange}
            />

            <ProductListViewTabs
                value={currentView}
                counts={counts}
                onChange={handleViewChange}
            />

            <ProductListFilters
                filters={filters}
                brandOptions={brandOptions}
                vendorOptions={vendorOptions}
                onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            {!isStrapCatalog ? (
                <ProductListBulkBar selectedCount={selectedIds.length}>
                    <button
                        type="button"
                        onClick={() => setBulkSaleOpen(true)}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Bulk sale
                    </button>
                    <button
                        type="button"
                        onClick={handleBulkService}
                        disabled={bulkServiceLoading}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        {bulkServiceLoading ? "Đang tạo..." : "Bulk request service"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Bỏ chọn
                    </button>
                </ProductListBulkBar>
            ) : null}

            <ProductListTable
                items={rows}
                selectedIds={selectedIds}
                canViewCost={props.canViewCost}
                counts={counts}
                activeQuickFilters={activeQuickFilters}
                onQuickFilterClick={handleQuickFilterClick}
                onToggleOne={handleToggleOne}
                onToggleAll={handleToggleAll}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onService={handleCreateService}
            />

            <Pagination
                page={props.page}
                totalPages={props.totalPages}
                total={props.total}
                onPage={handlePage}
            />

            <BulkSaleModal
                open={bulkSaleOpen}
                count={selectedIds.length}
                value={bulkSaleValue}
                saving={bulkSaleSaving}
                onChange={setBulkSaleValue}
                onClose={() => {
                    setBulkSaleOpen(false);
                    setBulkSaleValue("");
                }}
                onConfirm={handleBulkSale}
            />
        </div>
    );
}