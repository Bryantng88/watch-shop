"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    ProductListBulkBar,
    ProductListFilters,
    ProductListTable,
    ProductListToolbar,
    ProductListViewTabs,
    ProductReadinessModal,
} from "./list";
import type { CatalogKey, Counts, ProductListPageProps, ProductRow, ViewKey } from "./list/types";

type FilterState = {
    q: string;
    sku: string;
    type: string;
    brandId: string;
    vendorId: string;
    image: string;
    sort: string;
};

function buildCounts(input: ProductListPageProps["counts"], total: number, currentView: ViewKey): Counts {
    if (input && Object.values(input).some((value) => Number(value ?? 0) >= 0)) {
        return {
            all: Number(input.all ?? 0),
            draft: Number(input.draft ?? 0),
            posted: Number(input.posted ?? 0),
            in_service: Number(input.in_service ?? 0),
            hold: Number(input.hold ?? 0),
            sold: Number(input.sold ?? 0),
        };
    }

    return {
        all: currentView === "all" ? total : 0,
        draft: currentView === "draft" ? total : 0,
        posted: currentView === "posted" ? total : 0,
        in_service: currentView === "in_service" ? total : 0,
        hold: currentView === "hold" ? total : 0,
        sold: currentView === "sold" ? total : 0,
    };
}

function setParam(next: URLSearchParams, key: string, value?: string | null) {
    if (!value) next.delete(key);
    else next.set(key, value);
}

function BulkPostConfirm({
    open,
    count,
    onClose,
    onConfirm,
    loading,
}: {
    open: boolean;
    count: number;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-lg font-semibold text-slate-950">Bulk post sản phẩm</h3>
                    <p className="mt-1 text-sm text-slate-500">Bạn đang chuẩn bị post {count} sản phẩm đã chọn.</p>
                </div>
                <div className="flex justify-end gap-3 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Đang post..." : "Xác nhận post"}
                    </button>
                </div>
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
                    <p className="mt-1 text-sm text-slate-500">Áp dụng giá sale cho {count} sản phẩm đã chọn.</p>
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
                    <div className="text-xs text-slate-500">Nhập giá sale cố định. Để trống để xóa sale hàng loạt.</div>
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
                Tổng: <span className="font-semibold text-slate-950">{total}</span> • Trang <span className="font-semibold text-slate-950">{page}</span>/<span className="font-semibold text-slate-950">{totalPages}</span>
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

export default function ListProducts(props: ProductListPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const [rows, setRows] = useState<ProductRow[]>(props.items ?? []);
    const [pendingImageProductId, setPendingImageProductId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkPostOpen, setBulkPostOpen] = useState(false);
    const [bulkPostLoading, setBulkPostLoading] = useState(false);
    const [bulkSaleOpen, setBulkSaleOpen] = useState(false);
    const [bulkSaleValue, setBulkSaleValue] = useState("");
    const [bulkSaleSaving, setBulkSaleSaving] = useState(false);
    const [bulkServiceLoading, setBulkServiceLoading] = useState(false);
    const [readinessProduct, setReadinessProduct] = useState<ProductRow | null>(null);

    useEffect(() => {
        setRows(props.items ?? []);
    }, [props.items]);

    const currentView: ViewKey = useMemo(() => {
        const view = (sp.get("view") || "draft").toLowerCase();
        if (["all", "draft", "posted", "in_service", "hold", "sold"].includes(view)) {
            return view as ViewKey;
        }
        return "draft";
    }, [sp]);

    const currentCatalog: CatalogKey = useMemo(() => {
        const catalog = (sp.get("catalog") || "product").toLowerCase();
        return catalog === "strap" ? "strap" : "product";
    }, [sp]);

    const isStrapCatalog = currentCatalog === "strap";

    const counts = useMemo(() => buildCounts(props.counts, props.total, currentView), [props.counts, props.total, currentView]);

    const [filters, setFilters] = useState<FilterState>({
        q: sp.get("q") ?? "",
        sku: sp.get("sku") ?? "",
        type: sp.get("type") ?? "",
        brandId: sp.get("brandId") ?? "",
        vendorId: sp.get("vendorId") ?? "",
        image: sp.get("hasImages") ?? "",
        sort: sp.get("sort") ?? "updatedDesc",
    });

    useEffect(() => {
        setFilters({
            q: sp.get("q") ?? "",
            sku: sp.get("sku") ?? "",
            type: sp.get("type") ?? "",
            brandId: sp.get("brandId") ?? "",
            vendorId: sp.get("vendorId") ?? "",
            image: sp.get("hasImages") ?? "",
            sort: sp.get("sort") ?? "updatedDesc",
        });
    }, [sp]);

    useEffect(() => {
        setSelectedIds([]);
        setBulkPostOpen(false);
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
            next.delete("type");
            next.delete("brandId");
            next.set("page", "1");
        });
    }

    function handleApplyFilters() {
        pushParams((next) => {
            setParam(next, "q", filters.q.trim() || null);
            setParam(next, "sku", isStrapCatalog ? null : filters.sku.trim() || null);
            setParam(next, "type", isStrapCatalog ? null : filters.type || null);
            setParam(next, "brandId", isStrapCatalog ? null : filters.brandId || null);
            setParam(next, "vendorId", filters.vendorId || null);
            setParam(next, "hasImages", filters.image || null);
            setParam(next, "sort", filters.sort || "updatedDesc");
            next.set("page", "1");
        });
    }

    function handleClearFilters() {
        setFilters({
            q: "",
            sku: "",
            type: "",
            brandId: "",
            vendorId: "",
            image: "",
            sort: "updatedDesc",
        });

        pushParams((next) => {
            ["q", "sku", "type", "brandId", "vendorId", "hasImages", "sort"].forEach((key) => next.delete(key));
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

    async function handleImageUploaded(productId: string, fileKey: string) {
        try {
            setPendingImageProductId(productId);

            const res = await fetch(`/api/admin/products/${productId}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: [{ key: fileKey }] }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || data?.message || "Cập nhật ảnh thất bại");
            }

            const nextCover = data?.coverImageUrl || fileKey;
            setRows((prev) => prev.map((row) => (row.id === productId ? { ...row, primaryImageUrl: nextCover, imagesCount: Math.max(Number(row.imagesCount ?? 0), 1) } : row)));
            router.refresh();
        } catch (error: any) {
            window.alert(error?.message || "Cập nhật ảnh thất bại");
        } finally {
            setPendingImageProductId(null);
        }
    }

    function handlePriceSaved(productId: string, patch: Partial<ProductRow>) {
        setRows((prev) => prev.map((row) => (row.id === productId ? { ...row, ...patch } : row)));
    }

    async function handleBulkPost() {
        try {
            setBulkPostLoading(true);

            const res = await fetch("/api/admin/products/bulk-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productIds: selectedIds }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.message || data?.error || "Bulk post thất bại");
            }

            if (Array.isArray(data?.failed) && data.failed.length > 0) {
                const preview = data.failed.slice(0, 3).map((item: any) => {
                    const title = item?.title || item?.id || "Unknown";
                    const reasons = Array.isArray(item?.reasons) ? item.reasons.join(" | ") : "";
                    return `- ${title}: ${reasons}`;
                });

                window.alert(
                    `Đã post ${data?.count ?? 0} sản phẩm. Còn ${data.failed.length} sản phẩm chưa đạt điều kiện.\n\n${preview.join("\n")}`
                );
            }

            setBulkPostOpen(false);
            setSelectedIds([]);
            router.refresh();
        } catch (error: any) {
            window.alert(error?.message || "Bulk post thất bại");
        } finally {
            setBulkPostLoading(false);
        }
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

            setRows((prev) => prev.map((row) => (selectedIds.includes(row.id) ? { ...row, salePrice } : row)));
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

    const typeOptions = isStrapCatalog ? [] : props.productTypes.map((item) => ({ label: item.label, value: item.value }));
    const brandOptions = isStrapCatalog ? [] : props.brands.map((item) => ({ label: item.name, value: item.id }));
    const vendorOptions = props.vendors.map((item) => ({ label: item.name, value: item.id }));

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                        <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                            <button
                                type="button"
                                onClick={() => setCatalog("product")}
                                className={cx(
                                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                                    !isStrapCatalog
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                                )}
                            >
                                Sản phẩm
                            </button>

                            <button
                                type="button"
                                onClick={() => setCatalog("strap")}
                                className={cx(
                                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                                    isStrapCatalog
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                                )}
                            >
                                Dây
                            </button>
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                                {isStrapCatalog ? "Quản lý dây" : "Danh sách sản phẩm"}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Đồng bộ phong cách với service request detail: sạch, rõ trạng thái, thao tác nhanh và sẵn sàng production.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {!isStrapCatalog && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                                    Đã chọn
                                </div>
                                <div className="mt-1 text-xl font-semibold text-slate-950">{selectedIds.length}</div>
                            </div>
                        )}

                        <Link
                            href={isStrapCatalog ? "/admin/acquisitions/new?focus=strap" : "/admin/products/new"}
                            className="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            {isStrapCatalog ? "+ Nhập dây" : "+ Tạo sản phẩm"}
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 border-t border-slate-100 px-5 py-4 sm:grid-cols-2 xl:grid-cols-6">
                    {segmentTabs.map((tab) => {
                        const active = currentView === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setView(tab.key)}
                                className={cx(
                                    "rounded-2xl border px-4 py-3 text-left transition",
                                    active
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <div className={cx("text-xs font-medium uppercase tracking-[0.14em]", active ? "text-slate-300" : "text-slate-500")}>
                                    {tab.label}
                                </div>
                                <div className="mt-2 text-2xl font-semibold">{tab.count}</div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <div className="hidden">
                <SegmentTabs
                    active={currentView}
                    onChange={(v) => setView(v as string)}
                    tabs={segmentTabs as any}
                />
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white">
                <form
                    className="space-y-4 p-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters({
                            q: formQ,
                            sku: formSku,
                            type: formType,
                            brandId: formBrandId,
                            vendorId: formVendorId,
                            hasImages: formHasImages,
                            sort: formSort,
                        });
                    }}
                >
                    <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${isStrapCatalog ? "xl:grid-cols-5" : "xl:grid-cols-7"}`}>
                        <div>
                            <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Tìm kiếm</div>
                            <input
                                value={formQ}
                                onChange={(e) => setFormQ(e.target.value)}
                                placeholder={isStrapCatalog ? "Tên dây / chất liệu..." : "Tên / brand..."}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            />
                        </div>

                        {!isStrapCatalog && (
                            <div>
                                <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">SKU</div>
                                <input
                                    value={formSku}
                                    onChange={(e) => setFormSku(e.target.value)}
                                    placeholder="SKU..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                                />
                            </div>
                        )}

                        {!isStrapCatalog && (
                            <>
                                <div>
                                    <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Type</div>
                                    <select
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                                    >
                                        <option value="">(All)</option>
                                        {props.productTypes.map((x) => (
                                            <option key={x.value} value={x.value}>
                                                {x.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Brand</div>
                                    <select
                                        value={formBrandId}
                                        onChange={(e) => setFormBrandId(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                                    >
                                        <option value="">(All)</option>
                                        {props.brands.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div>
                            <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Vendor</div>
                            <select
                                value={formVendorId}
                                onChange={(e) => setFormVendorId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            >
                                <option value="">(All)</option>
                                {props.vendors.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Image</div>
                            <select
                                value={formHasImages}
                                onChange={(e) => setFormHasImages(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            >
                                <option value="">(All)</option>
                                <option value="yes">Có ảnh</option>
                                <option value="no">Chưa có ảnh</option>
                            </select>
                        </div>

                        <div>
                            <div className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Sắp xếp</div>
                            <select
                                value={formSort}
                                onChange={(e) => setFormSort(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            >
                                <option value="updatedDesc">Cập nhật ↓</option>
                                <option value="updatedAsc">Cập nhật ↑</option>
                                <option value="createdDesc">Tạo ↓</option>
                                <option value="createdAsc">Tạo ↑</option>
                                <option value="titleAsc">Title A → Z</option>
                                <option value="titleDesc">Title Z → A</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button type="submit" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            Lọc
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Clear
                        </button>

                        {!isStrapCatalog && (
                            <div className="ml-auto text-sm text-gray-600">
                                Đã chọn: <b>{selectedIds.length}</b>
                            </div>
                        )}
                    </div>
                </form>
            </section>

            {!isStrapCatalog && showBulkBar && (
                <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-sky-700">
                        {selectedIds.length} product đã chọn
                    </span>

                    <button
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Bulk post
                    </button>

                    <button
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => setShowBulkSaleModal(true)}
                        type="button"
                    >
                        Bulk sale
                    </button>

                    <button
                        className="rounded border px-3 py-1 text-sm"
                        onClick={() => {
                            setSelectedIds([]);
                            setShowBulkBar(false);
                        }}
                        type="button"
                    >
                        Bỏ chọn
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={!selectedIds.length || bulkServiceLoading}
                        onClick={() => createTechnicalServiceRequests(selectedIds)}
                    >
                        {bulkServiceLoading ? "Đang tạo..." : "Bulk request service"}
                    </button>
                </section>
            )}

            {!isStrapCatalog && showBulkConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-950">Post products</h3>

                        <div className="text-sm text-slate-600">
                            Bạn đang post <b>{selectedIds.length}</b> sản phẩm.
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                onClick={() => setShowBulkConfirm(false)}
                                type="button"
                            >
                                Hủy
                            </button>

                            <button
                                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                onClick={async () => {
                                    const res = await fetch("/api/admin/products/bulk-post", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ productIds: selectedIds }),
                                    });
                                    const data = await res.json().catch(() => null);
                                    if (!res.ok) {
                                        alert(data?.message || data?.error || "Bulk post thất bại");
                                        return;
                                    }

                                    if (Array.isArray(data?.failed) && data.failed.length > 0) {
                                        const firstFailed = data.failed.slice(0, 3).map((item: any) => {
                                            const title = item?.title || item?.id || "Unknown";
                                            const reasons = Array.isArray(item?.reasons)
                                                ? item.reasons.join(" | ")
                                                : "";
                                            return `- ${title}: ${reasons}`;
                                        });

                                        alert(
                                            `Đã post ${data?.count ?? 0} sản phẩm. Còn ${data.failed.length} sản phẩm chưa đạt điều kiện.\n\n${firstFailed.join("\n")}`
                                        );
                                    }

                                    setShowBulkConfirm(false);
                                    setSelectedIds([]);
                                    setShowBulkBar(false);
                                    router.refresh();
                                }}
                                type="button"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isStrapCatalog && showBulkSaleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-950">Bulk sale</h3>

                        <div className="text-sm text-slate-600">
                            Áp dụng giá sale cho <b>{selectedIds.length}</b> sản phẩm.
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Giá sale</div>
                            <input
                                type="number"
                                min={0}
                                value={bulkSaleValue}
                                onChange={(e) => setBulkSaleValue(e.target.value)}
                                className="w-full rounded border px-3 py-2"
                                placeholder="Để trống để xóa sale"
                            />
                            <div className="text-xs text-gray-500">
                                Nhập giá sale cố định. Để trống để bỏ sale hàng loạt.
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                onClick={() => {
                                    setShowBulkSaleModal(false);
                                    setBulkSaleValue("");
                                }}
                                type="button"
                                disabled={bulkSaleSaving}
                            >
                                Hủy
                            </button>

                            <button
                                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                onClick={applyBulkSale}
                                type="button"
                                disabled={bulkSaleSaving}
                            >
                                {bulkSaleSaving ? "Đang lưu..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    {isStrapCatalog ? (
                        <table className="min-w-full text-sm text-slate-700">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    <th className="px-3 py-3">Ảnh</th>
                                    <th className="px-3 py-3">Tên dây</th>
                                    <th className="px-3 py-3">Spec</th>
                                    <th className="px-3 py-3 text-right">Tồn kho</th>
                                    <th className="px-3 py-3 text-right">Giá nhập</th>
                                    <th className="px-3 py-3 text-right">Giá bán</th>
                                    <th className="px-3 py-3">Vendor</th>
                                    <th className="px-3 py-3">Cập nhật</th>
                                    <th className="px-3 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-3 py-14 text-center text-slate-500">
                                            Không có dây nào trong tab này
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => (
                                        <tr key={p.id} className="border-t border-slate-100 transition hover:bg-slate-50/80 [&>td]:align-middle">
                                            <td className="min-w-[76px] w-[76px] px-4 py-5">
                                                <InlineImagePicker
                                                    imageUrl={p.primaryImageUrl ?? null}
                                                    onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                />
                                            </td>

                                            <td className="px-3 py-5">
                                                <div className="text-sm font-medium">{p.title || "-"}</div>
                                            </td>

                                            <td className="px-3 py-5">
                                                <StrapSpecText p={p} />
                                            </td>

                                            <td className="px-3 py-5 text-right font-semibold">
                                                {Number(p.stockQty ?? 0)}
                                            </td>

                                            <td className="px-3 py-5 text-right">
                                                {fmtMoney(p.purchasePrice)}
                                            </td>

                                            <td className="px-3 py-5 text-right">
                                                {props.canEditPrice ? (
                                                    <InlineMoneyEditor
                                                        productId={p.id}
                                                        field="minPrice"
                                                        value={p.minPrice}
                                                        label="Giá bán"
                                                        onSaved={(v) => patchLocalPrice(p.id, v)}
                                                    />
                                                ) : (
                                                    <div className="font-semibold">{fmtMoney(p.minPrice)}</div>
                                                )}
                                            </td>

                                            <td className="px-3 py-5">{p.vendorName || "-"}</td>

                                            <td className="px-3 py-5">{fmtDT(p.updatedAt)}</td>

                                            <td className="px-3 py-5 text-right">
                                                <RowActionsMenu
                                                    onEdit={() => router.push(`/admin/products/${p.id}/edit`)}
                                                    onDelete={() => handleDelete(p.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="min-w-full text-sm text-slate-700">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    <th className="w-10 px-3 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allChecked}
                                            ref={(el) => {
                                                if (el) el.indeterminate = someChecked;
                                            }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    const merged = Array.from(new Set([...selectedIds, ...selectableIds]));
                                                    setSelectedIds(merged);
                                                    setShowBulkBar(merged.length > 0);
                                                } else {
                                                    setSelectedIds([]);
                                                    setShowBulkBar(false);
                                                }
                                            }}
                                        />
                                    </th>

                                    <th className="px-3 py-3">Ảnh</th>
                                    <th className="px-3 py-3">Tên</th>
                                    <th className="px-3 py-3">SKU</th>
                                    <th className="px-3 py-3">Vendor</th>
                                    <th className="px-3 py-3 whitespace-nowrap">Trạng thái</th>
                                    <th className="px-3 py-3 whitespace-nowrap">Phiếu nhập</th>
                                    <th className="px-3 py-3 text-right">Giá bán</th>
                                    <th className="px-3 py-3 text-right">Sale</th>
                                    {props.canViewCost && <th className="px-3 py-3 text-right">Giá mua</th>}
                                    <th className="px-3 py-3">Bài đăng</th>
                                    <th className="px-3 py-3">Cập nhật</th>
                                    <th className="px-3 py-3">Tạo lúc</th>
                                    <th className="px-3 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={props.canViewCost ? 12 : 11}
                                            className="px-3 py-14 text-center text-slate-500"
                                        >
                                            Không có dữ liệu trong tab này
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((p) => {
                                        const checked = selectedIds.includes(p.id);
                                        const postState = getPostReadinessState(p);

                                        return (
                                            <tr key={p.id} className="border-t border-slate-100 transition hover:bg-slate-50/80 [&>td]:align-middle">
                                                <td className="px-3 py-5">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedIds((prev) => Array.from(new Set([...prev, p.id])));
                                                            } else {
                                                                setSelectedIds((prev) => prev.filter((id) => id !== p.id));
                                                            }
                                                        }}
                                                    />
                                                </td>

                                                <td className="px-4 py-5">
                                                    <div className="origin-left scale-[1.05]">
                                                        <InlineImagePicker
                                                            imageUrl={p.primaryImageUrl ?? null}
                                                            onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                                        />
                                                    </div>
                                                </td>

                                                <td className="px-3 py-5">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-semibold leading-5 text-slate-950">{p.title || "-"}</div>

                                                        <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                                                            {`${(p.brand || "-").toLowerCase()} · ${(p.type || "-").toLowerCase()}`}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5 text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
                                                    {p.variantSnapshot?.sku || "-"}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">{p.vendorName || "-"}</td>

                                                <td className="whitespace-nowrap px-3 py-5 align-middle">
                                                    <span className={getInventoryStatusTextClass(p.status)}>
                                                        {getProductInventoryStatusText(p.status)}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">
                                                    {p.acquisitionId && p.acquisitionRefNo ? (
                                                        <Link
                                                            href={`/admin/acquisitions/${p.acquisitionId}/edit`}
                                                            className="font-medium text-sky-700 hover:underline"
                                                        >
                                                            {p.acquisitionRefNo}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5 text-right align-middle">
                                                    {props.canEditPrice ? (
                                                        <InlineMoneyEditor
                                                            productId={p.id}
                                                            field="minPrice"
                                                            value={p.minPrice}
                                                            label="Giá bán"
                                                            onSaved={(v) => patchLocalPrice(p.id, v)}
                                                        />
                                                    ) : (
                                                        <div className="tabular-nums text-[17px] font-semibold leading-none text-slate-950">
                                                            {fmtMoney(p.minPrice)}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-3 py-5 text-right">
                                                    {props.canEditPrice ? (
                                                        <InlineMoneyEditor
                                                            productId={p.id}
                                                            field="salePrice"
                                                            value={p.salePrice}
                                                            label="Giá sale"
                                                            onSaved={(v) => patchLocalSalePrice(p.id, v)}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-medium text-emerald-700">
                                                            {p.salePrice != null ? fmtMoney(p.salePrice) : "-"}
                                                        </div>
                                                    )}
                                                </td>

                                                {props.canViewCost && (
                                                    <td className="px-3 py-5 text-right">
                                                        <div className="text-sm">{fmtMoney(p.purchasePrice)}</div>
                                                    </td>
                                                )}

                                                <td className="whitespace-nowrap px-3 py-5 align-middle">
                                                    <div className="flex flex-col justify-center">
                                                        <div className="flex h-[20px] items-center">
                                                            <StatusBadge status={getContentStatusBadgeValue(p)} />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openReadinessDetail(p);
                                                            }}
                                                            className="mt-1 text-left"
                                                        >
                                                            <div className="flex flex-col">
                                                                <MiniDotLabel label={postState.label} tone={postState.tone} />
                                                                {!isWomenWatch(p) && hasMissingCoreReadinessInfo(p) && hasMissingImageReadiness(p) && (
                                                                    <MiniDotLabel label="Missing Image" tone="gray" className="mt-0.5" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">
                                                    <div className="text-sm leading-5 text-slate-600">{fmtDT(p.updatedAt)}</div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-5">
                                                    <div className="text-sm leading-5 text-slate-600">{fmtDT(p.createdAt)}</div>
                                                </td>

                                                <td className="px-3 py-5 text-right">
                                                    <RowActionsMenu
                                                        onView={() => router.push(`/admin/products/${p.id}`)}
                                                        onEdit={() => router.push(`/admin/products/${p.id}/edit`)}
                                                        onDelete={() => handleDelete(p.id)}
                                                        onService={() => {
                                                            createTechnicalServiceRequests([p.id]);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    Tổng: <b>{props.total}</b> • Trang <b>{props.page}</b>/<b>{props.totalPages}</b>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        disabled={props.page <= 1}
                        onClick={() => goPage(Math.max(1, props.page - 1))}
                    >
                        ← Trước
                    </button>

                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        disabled={props.page >= props.totalPages}
                        onClick={() => goPage(Math.min(props.totalPages, props.page + 1))}
                    >
                        Sau →
                    </button>
                </div>
            </div>

            <ReadinessDetailModal
                open={openReadinessModal}
                product={readinessProduct}
                onClose={() => {
                    setOpenReadinessModal(false);
                    setReadinessProduct(null);
                }}
                onEdit={(id) => router.push(`/admin/products/${id}/edit`)}
            />
        </div>
    );
}
