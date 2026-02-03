"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ProductStatusBadge from "./DraftBadge";
import RowActionsMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import InlineImagePicker from "@/app/(admin)/admin/products/_components/InlineImagePicker";
import DotLabel from "../../__components/DotLabel";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import { StatusBadge } from "@/components/badges/StatusBadge";

import type { BrandLite, ProductListItem } from "@/features/products/types";
import { PRODUCT_STATUS } from "@/components/badges/StatusMaps";

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
type ViewKey = "all" | "draft" | "active" | "archived";

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    draft: "Nháp",
    active: "Đang bán",
    archived: "Ẩn",
};

// tuỳ schema thật của bạn, bạn chỉnh lại các điều kiện này 1 lần là xong
function matchesView(p: ProductListItem, view: ViewKey) {
    const content = String((p as any).contentStatus ?? "").toUpperCase();
    const avail = String((p as any).availabilityStatus ?? "").toUpperCase();

    switch (view) {
        case "draft":
            return content === "DRAFT";

        case "active":
            // hệ bạn đang dùng gì thì đổi ở đây
            return ["ACTIVE", "AVAILABLE"].includes(avail);

        case "archived":
            return ["INACTIVE", "ARCHIVED", "DISABLED", "HIDDEN"].includes(avail);

        case "all":
        default:
            return true;
    }
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

    // counts theo data page đang có (giống OrderList hiện tại của bạn)
    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: items.length,
            draft: items.filter((p) => matchesView(p, "draft")).length,
            active: items.filter((p) => matchesView(p, "active")).length,
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

    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;

        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
            alert("Xoá thất bại!");
            return;
        }
        // format OrderList: server fetch -> sau khi xoá thì reload để đồng bộ
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

            {/* FILTER FORM (giống orders) */}
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

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-2 text-left">Ảnh</th>
                            <th className="px-4 py-2 text-left">Tên</th>
                            <th className="px-4 py-2 text-right">Giá bán</th>
                            <th className="px-4 py-2 text-left">Tình trạng duyệt</th>
                            <th className="px-4 py-2 text-left">Cập nhật</th>
                            <th className="px-4 py-2 text-left">Tạo lúc</th>
                            <th className="px-4 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center text-gray-400 italic">
                                    Không có sản phẩm trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
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

                                            {/* label phụ: luôn xuống hàng */}
                                            {(p as any).priceVisibility === "SHOW" ? (
                                                <div className="mt-1">
                                                    <DotLabel label="Hiển thị giá" tone="green" />
                                                </div>
                                            ) : null}
                                        </div>
                                    </td>

                                    {/* PRICE – INLINE EDIT */}
                                    <td className="px-4 py-2 text-right">
                                        <input
                                            type="number"
                                            defaultValue={(p as any).minPrice ?? ""}
                                            className="w-28 rounded border px-2 py-1 text-right"
                                            onBlur={(e) => {
                                                const value = Number(e.target.value);
                                                if (Number.isNaN(value)) return;
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
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
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
