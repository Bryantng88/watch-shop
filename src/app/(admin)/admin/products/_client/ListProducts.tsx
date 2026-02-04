"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/badges/StatusBadge";
import ProductStatusBadge from "./DraftBadge";
import RowActionsMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import InlineImagePicker from "@/app/(admin)/admin/products/_components/InlineImagePicker";
import DotLabel from "../../__components/DotLabel";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import { PRODUCT_STATUS } from "@/components/badges/StatusMaps";
import type { BrandLite, ProductListItem } from "@/features/products/types";
import CreateServiceRequestModal from "./CreateServiceRequestModal";

type PageProps = {
    items: ProductListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;

    brands: BrandLite[];
    productTypes: Array<{ label: string; value: string }>;
};

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function fmtDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** =====================
 * Tabs / Segments
 * ===================== */
type ViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "hold" | "sold";

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    draft: "Chờ duyệt",
    posted: "Chờ service",
    in_service: "Đang service",
    hold: "Ký gửi/ Giữ hàng",
    sold: "Đã bán",
};

function matchesView(p: ProductListItem, view: ViewKey) {
    const status = String((p as any).status ?? "").toUpperCase();

    switch (view) {
        case "draft":
            return status === "DRAFT";
        case "posted":
            return status === "POSTED"
        case "in_service":
            return ["INACTIVE", "ARCHIVED", "DISABLED", "HIDDEN"]
        case "all":
        default:
            return true;
    }
}

/** ✅ điều kiện để được bulk post */
function hasValidPrice(p: ProductListItem) {
    const price = Number((p as any).minPrice ?? 0);
    return Number.isFinite(price) && price > 0;
}
function hasValidImage(p: ProductListItem) {
    const img = (p as any).primaryImageUrl;
    return typeof img === "string" && img.trim().length > 0;
}

export default function AdminProductListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
    brands,
}: PageProps) {
    const sp = useSearchParams();
    const url = useMemo(() => new URLSearchParams(sp.toString()), [sp]);
    const currentView = useMemo(() => (sp.get("view") || "all") as ViewKey, [sp]);

    // ===== Bulk states (giống orders)
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [openService, setOpenService] = useState(false);
    const [serviceProductId, setServiceProductId] = useState<string | null>(null);

    // reset selection khi đổi tab
    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
    }, [currentView]);

    const setViewHref = (view: ViewKey) => {
        const next = new URLSearchParams(url);
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        return `/admin/products?${next.toString()}`;
    };

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/products?${next.toString()}`;
    };

    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: items.length,
            draft: items.filter((p) => matchesView(p, "draft")).length,
            posted: items.filter((p) => matchesView(p, "posted")).length,
            archived: items.filter((p) => matchesView(p, "archived")).length,
        }),
        [items]
    );

    const displayItems = useMemo(
        () => items.filter((p) => matchesView(p, currentView)),
        [items, currentView]
    );

    const tabs = (Object.keys(VIEW_LABELS) as ViewKey[]).map((k) => ({
        key: k,
        label: VIEW_LABELS[k],
        count: countsByView[k],
        href: setViewHref(k),
        active: currentView === k,
    }));

    // ✅ rule selectable for bulk
    const isRowSelectable = (p: ProductListItem) => hasValidPrice(p) && hasValidImage(p);

    const selectableIdsInView = useMemo(
        () => displayItems.filter(isRowSelectable).map((p) => p.id),
        [displayItems]
    );

    const allChecked =
        selectableIdsInView.length > 0 && selectableIdsInView.every((id) => selectedIds.includes(id));

    const toggleAllInView = (checked: boolean) => {
        if (!checked) {
            const next = selectedIds.filter((id) => !selectableIdsInView.includes(id));
            setSelectedIds(next);
            setShowBulkBar(next.length > 0);
            return;
        }
        const merged = Array.from(new Set([...selectedIds, ...selectableIdsInView]));
        setSelectedIds(merged);
        setShowBulkBar(merged.length > 0);
    };

    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
            alert("Xoá thất bại!");
            return;
        }
        location.reload();
    }

    async function updateProduct(id: string, payload: Partial<ProductListItem>) {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            alert("Cập nhật thất bại!");
            return;
        }
        location.reload();
    }

    async function updateProductImage(productId: string, key: string) {
        const res = await fetch(`/api/admin/products/${productId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ files: [{ key }] }),
        });
        if (!res.ok) {
            alert(await res.text());
            return;
        }
        location.reload();
    }

    const selectedProducts = useMemo(
        () => items.filter((p) => selectedIds.includes(p.id)),
        [items, selectedIds]
    );

    const selectedInvalid = useMemo(() => {
        // về lý thuyết không có vì checkbox disabled, nhưng check thêm cho chắc
        return selectedProducts.filter((p) => !isRowSelectable(p));
    }, [selectedProducts]);

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Sản phẩm</h1>

                <Link
                    href="/admin/products/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo sản phẩm
                </Link>
            </div>

            {/* TABS */}
            <SegmentTabs tabs={tabs} />

            {/* FILTER FORM */}
            <form action="/admin/products" method="get" className="flex flex-wrap gap-2 items-end">
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(rawSearchParams.q as string) ?? ""}
                        placeholder="Tên / mã / brand…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Sắp xếp</label>
                    <select
                        name="sort"
                        defaultValue={(rawSearchParams.sort as string) ?? "updatedDesc"}
                        className="h-9 rounded border px-2"
                    >
                        <option value="updatedDesc">Cập nhật ↓</option>
                        <option value="updatedAsc">Cập nhật ↑</option>
                        <option value="createdDesc">Tạo ↓</option>
                        <option value="createdAsc">Tạo ↑</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3" type="submit">
                        Lọc
                    </button>
                    <Link href="/admin/products" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* BULK BAR */}
            {showBulkBar && (
                <div className="mb-3 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">{selectedIds.length} sản phẩm đã chọn</span>

                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-60"
                        disabled={selectedIds.length === 0}
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        POST các sản phẩm đã chọn
                    </button>

                    <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => {
                            setSelectedIds([]);
                            setShowBulkBar(false);
                        }}
                        type="button"
                    >
                        Bỏ chọn
                    </button>

                    <div className="text-xs text-gray-600 ml-auto">
                        Điều kiện: có <b>giá</b> & <b>hình</b>
                    </div>
                </div>
            )}

            {/* BULK CONFIRM MODAL */}
            {showBulkConfirm && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[520px] p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Duyệt (POST) sản phẩm</h3>

                        <div className="text-sm text-gray-700">
                            Bạn đang duyệt <b>{selectedIds.length}</b> sản phẩm.
                        </div>

                        {selectedInvalid.length > 0 ? (
                            <div className="rounded border bg-red-50 p-3 text-sm text-red-700">
                                Có <b>{selectedInvalid.length}</b> sản phẩm không đạt điều kiện (thiếu giá hoặc hình).
                                Vui lòng bỏ chọn chúng.
                            </div>
                        ) : (
                            <div className="rounded border bg-gray-50 p-3 text-sm text-gray-700">
                                Điều kiện đã đạt: đủ <b>giá</b> và <b>hình</b>.
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => setShowBulkConfirm(false)}
                                type="button"
                            >
                                Hủy
                            </button>

                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                                disabled={selectedIds.length === 0 || selectedInvalid.length > 0}
                                onClick={async () => {
                                    // ✅ TODO: đổi endpoint theo hệ thống của bạn
                                    // ví dụ giống order: /api/admin/products/bulk-post
                                    const res = await fetch("/api/admin/products/bulk-post", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ productIds: selectedIds }),
                                    });

                                    if (!res.ok) {
                                        alert(await res.text());
                                        return;
                                    }
                                    location.reload();
                                }}
                                type="button"
                            >
                                Xác nhận POST
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            {/* ✅ bulk checkbox header */}
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => toggleAllInView(e.target.checked)}
                                    disabled={selectableIdsInView.length === 0}
                                />
                            </th>

                            <th className="px-4 py-2 text-left">Ảnh</th>
                            <th className="px-4 py-2 text-left">Tên</th>
                            <th className="px-4 py-2 text-left">Vendor</th>
                            <th className="px-4 py-2 text-left">Giá bán</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Cập nhật</th>
                            <th className="px-4 py-2 text-left">Tạo lúc</th>
                            <th className="px-4 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-10 text-center text-gray-400 italic">
                                    Không có sản phẩm trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((p) => {
                                const selectable = isRowSelectable(p);
                                const checked = selectedIds.includes(p.id);

                                const priceOk = hasValidPrice(p);
                                const imgOk = hasValidImage(p);

                                return (
                                    <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                                        {/* ✅ row checkbox */}
                                        <td className="px-4 py-2 align-middle">
                                            <input
                                                type="checkbox"
                                                disabled={!selectable}
                                                checked={checked}
                                                onChange={(e) => {
                                                    const next = e.target.checked
                                                        ? [...selectedIds, p.id]
                                                        : selectedIds.filter((id) => id !== p.id);

                                                    setSelectedIds(next);
                                                    setShowBulkBar(next.length > 0);
                                                }}
                                                title={
                                                    selectable
                                                        ? "Chọn để bulk POST"
                                                        : `Không thể chọn: ${!priceOk ? "thiếu giá" : ""}${!priceOk && !imgOk ? " + " : ""
                                                        }${!imgOk ? "thiếu hình" : ""}`
                                                }
                                            />
                                        </td>

                                        {/* IMAGE */}
                                        <td className="px-4 py-2 align-middle">
                                            <InlineImagePicker
                                                imageUrl={(p as any).primaryImageUrl ?? null}
                                                onPick={(fileKey) => updateProductImage(p.id, fileKey)}
                                            />
                                        </td>

                                        {/* TITLE */}
                                        <td className="px-4 py-2">
                                            <div className="leading-tight">
                                                <div className="font-medium">{(p as any).title ?? "-"}</div>

                                                {/* dot label luôn xuống hàng */}
                                                {(p as any).priceVisibility === "SHOW" ? (
                                                    <div className="mt-1">
                                                        <DotLabel label="Hiển thị giá" tone="green" />
                                                    </div>
                                                ) : null}

                                                {/* gợi ý lý do không selectable (nhỏ gọn) */}
                                                {!selectable ? (
                                                    <div className="mt-1 text-xs text-amber-700">
                                                        Thiếu {priceOk ? "" : "giá"}
                                                        {!priceOk && !imgOk ? " & " : ""}
                                                        {imgOk ? "" : "hình"} → không bulk POST được
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{p.vendorName}</td>

                                        {/* PRICE */}
                                        <td className="px-4 py-2 ">
                                            <input
                                                type="number"
                                                defaultValue={(p as any).minPrice ?? ""}
                                                className="w-28 rounded border px-2 py-1 text-right"
                                                onBlur={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (!Number.isFinite(value)) return;
                                                    if (value !== Number((p as any).minPrice ?? 0)) {
                                                        updateProduct(p.id, { ...(p as any), minPrice: value } as any);
                                                    }
                                                }}
                                            />
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-4 py-2">
                                            <StatusBadge value={p.status} map={PRODUCT_STATUS} />

                                        </td>


                                        {/* UPDATED */}
                                        <td className="px-4 py-2">{fmtDate((p as any).updatedAt)}</td>

                                        {/* CREATED */}
                                        <td className="px-4 py-2">{fmtDate((p as any).createdAt)}</td>

                                        {/* ACTIONS */}
                                        <td className="px-4 py-2 text-right">
                                            <RowActionsMenu
                                                onView={() => (window.location.href = `/admin/products/${p.id}`)}
                                                onEdit={() => (window.location.href = `/admin/products/${p.id}/edit`)}
                                                onDelete={() => handleDelete(p.id)}
                                                // ✅ thêm action mới (bạn sửa RowActionsMenu component để nhận prop này)
                                                onService={() => {
                                                    setServiceProductId(p.id);
                                                    setOpenService(true);
                                                }}
                                            />


                                        </td>
                                    </tr>
                                );
                            })

                        )}

                        <CreateServiceRequestModal
                            open={openService}
                            onClose={() => setOpenService(false)}
                            productId={serviceProductId ?? ""}
                        />
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={cls("rounded border px-3 py-1 text-sm", page <= 1 && "pointer-events-none opacity-50")}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={cls("rounded border px-3 py-1 text-sm", page >= totalPages && "pointer-events-none opacity-50")}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
