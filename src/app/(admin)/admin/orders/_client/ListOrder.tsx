"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ItemPopover from "../../__components/GenericPopover";
import ActionMenu from "../../acquisitions/components/ActionMenu";
import { StatusBadge } from "@/components/badges/StatusBadge";
import {
    ORDER_STATUS,
    ORDER_SOURCE,
    VERIFICATION_STATUS,
    RESERVE_TYPE,
} from "@/components/badges/StatusMaps";
import SegmentTabs from "@/components/tabs/SegmenTabs";

type OrderItem = {
    id: string;
    refNo: string | null;
    customerName: string | null;
    shipPhone: string | null;
    reserveType: string | null;
    depositRequired: number;
    status: string;
    subtotal: number;
    currency: string;
    itemCount: number;
    notes: string;
    createdAt: string;
    updatedAt: string;
    source: string;
    verificationStatus: string;
};

type PageProps = {
    items: OrderItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
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

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + " " + cur;
}

/** =====================
 * Tabs / Segments
 * ===================== */
type ViewKey = "all" | "web_pending" | "need_action" | "processing" | "cancelled";

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    web_pending: "Chờ xác minh",
    need_action: "Chờ duyệt",
    processing: "Đang xử lý",
    cancelled: "Đã hủy",
};

function matchesView(o: OrderItem, view: ViewKey) {
    switch (view) {
        case "web_pending":
            return o.source === "WEB" && o.verificationStatus === "PENDING";
        case "need_action":
            // workflow bạn có thể sửa lại
            return o.status === "DRAFT" || o.status === "RESERVED";
        case "processing":
            return o.status === "POSTED";
        case "cancelled":
            return (
                o.status === "CANCELLED" ||
                o.verificationStatus === "REJECTED" ||
                o.verificationStatus === "EXPIRED"
            );
        case "all":
        default:
            return true;
    }
}

export default function OrderListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: PageProps) {
    // bulk states (giữ nguyên)
    const [rowCounts, setRowCounts] = useState<Record<string, number>>({});
    const [rowTotals, setRowTotals] = useState<Record<string, number>>({});
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkHasShipment, setBulkHasShipment] = useState(true);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const url = useMemo(
        () => new URLSearchParams(rawSearchParams as any),
        [rawSearchParams]
    );

    const currentView = useMemo(() => {
        return (((rawSearchParams.view as string) || "all") as ViewKey);
    }, [rawSearchParams.view]);

    // reset selection khi đổi tab (tránh carry selection)
    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
    }, [currentView]);

    const setViewHref = (view: ViewKey) => {
        const next = new URLSearchParams(url);
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1"); // đổi tab => về trang 1
        return `/admin/orders?${next.toString()}`;
    };

    const displayItems = useMemo(
        () => items.filter((o) => matchesView(o, currentView)),
        [items, currentView]
    );

    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: items.length,
            web_pending: items.filter(
                (o) => o.source === "WEB" && o.verificationStatus === "PENDING"
            ).length,
            need_action: items.filter((o) => o.status === "DRAFT" || o.status === "RESERVED")
                .length,
            processing: items.filter((o) => o.status === "POSTED").length,
            cancelled: items.filter(
                (o) =>
                    o.status === "CANCELLED" ||
                    o.verificationStatus === "REJECTED" ||
                    o.verificationStatus === "EXPIRED"
            ).length,
        }),
        [items]
    );

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/orders?${next.toString()}`;
    };

    const isRowSelectable = (o: OrderItem) => o.status === "DRAFT"; // rule bulk hiện tại của bạn

    const allSelectableIdsInView = useMemo(
        () => displayItems.filter(isRowSelectable).map((o) => o.id),
        [displayItems]
    );

    const allChecked =
        allSelectableIdsInView.length > 0 &&
        allSelectableIdsInView.every((id) => selectedIds.includes(id));

    const toggleAllInView = (checked: boolean) => {
        if (!checked) {
            // chỉ bỏ chọn các id trong view (đỡ ảnh hưởng view khác)
            const next = selectedIds.filter((id) => !allSelectableIdsInView.includes(id));
            setSelectedIds(next);
            setShowBulkBar(next.length > 0);
            return;
        }
        const merged = Array.from(new Set([...selectedIds, ...allSelectableIdsInView]));
        setSelectedIds(merged);
        setShowBulkBar(merged.length > 0);
    };

    // tabs props (tách ra component)
    const tabs = (Object.keys(VIEW_LABELS) as ViewKey[]).map((k) => ({
        key: k,
        label: VIEW_LABELS[k],
        count: countsByView[k],
        href: setViewHref(k),
        active: currentView === k,
    }));

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Đơn hàng</h1>
                <Link
                    href="/admin/orders/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo đơn hàng
                </Link>
            </div>

            {/* TABS (import component) */}
            <SegmentTabs tabs={tabs} />

            {/* FILTER FORM */}
            <form action="/admin/orders" method="get" className="flex flex-wrap gap-2 items-end">
                {/* giữ tab hiện tại */}
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(rawSearchParams.q as string) ?? ""}
                        placeholder="RefNo, tên KH, số ĐT…"
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
                    <Link href="/admin/orders" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* BULK BAR */}
            {showBulkBar && (
                <div className="mb-3 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">{selectedIds.length} đơn hàng đã chọn</span>

                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Duyệt các đơn đã chọn
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
                </div>
            )}

            {/* BULK CONFIRM MODAL */}
            {showBulkConfirm && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[420px] p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Duyệt đơn hàng</h3>

                        <div className="text-sm text-gray-600">
                            Bạn đang duyệt <b>{selectedIds.length}</b> đơn hàng.
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={bulkHasShipment}
                                    onChange={() => setBulkHasShipment(true)}
                                />
                                Đơn hàng có shipment (giao hàng)
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={!bulkHasShipment}
                                    onChange={() => setBulkHasShipment(false)}
                                />
                                Đơn hàng không có shipment (pickup)
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => setShowBulkConfirm(false)}
                                type="button"
                            >
                                Hủy
                            </button>

                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={async () => {
                                    await fetch("/api/admin/orders/bulk-post", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            orderIds: selectedIds,
                                            hasShipment: bulkHasShipment,
                                        }),
                                    });
                                    location.reload();
                                }}
                                type="button"
                            >
                                Xác nhận duyệt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            {/* ✅ header checkbox bulk (giữ nguyên nhưng theo view) */}
                            <th className="px-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => toggleAllInView(e.target.checked)}
                                    disabled={allSelectableIdsInView.length === 0}
                                />
                            </th>

                            <th className="px-3 py-2 text-left">RefNo</th>
                            <th className="px-3 py-2 text-left">Khách hàng</th>
                            <th className="px-3 py-2 text-left">Số ĐT</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-left">Nguồn ĐH</th>
                            <th className="px-3 py-2 text-left">Admin Phê duyệt</th>
                            <th className="px-3 py-2 text-left">Loại ĐH</th>
                            <th className="px-3 py-2 text-left">Tiền cọc</th>
                            <th className="px-3 py-2 text-left">Ngày tạo</th>
                            <th className="px-3 py-2 text-left">Tổng tiền</th>
                            <th className="px-3 py-2 text-left">Số dòng</th>
                            <th className="px-3 py-2 text-left">Ghi chú</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={14} className="py-8 text-center text-gray-500">
                                    Không có đơn hàng trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((o) => {
                                const displayCount = rowCounts[o.id] ?? o.itemCount;
                                const totalMoney = rowTotals[o.id] ?? o.subtotal;
                                const selectable = isRowSelectable(o);

                                return (
                                    <tr key={o.id} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                disabled={!selectable}
                                                checked={selectedIds.includes(o.id)}
                                                onChange={(e) => {
                                                    const next = e.target.checked
                                                        ? [...selectedIds, o.id]
                                                        : selectedIds.filter((id) => id !== o.id);

                                                    setSelectedIds(next);
                                                    setShowBulkBar(next.length > 0);
                                                }}
                                            />
                                        </td>

                                        <td className="px-3 py-2 font-medium">{o.refNo ?? "-"}</td>
                                        <td className="px-3 py-2">{o.customerName ?? "-"}</td>
                                        <td className="px-3 py-2">{o.shipPhone ?? "-"}</td>

                                        <td className="px-3 py-2">
                                            <StatusBadge value={o.status} map={ORDER_STATUS} />
                                        </td>

                                        <td className="px-3 py-2">
                                            <StatusBadge value={o.source} map={ORDER_SOURCE} />
                                        </td>

                                        <td className="px-3 py-2">
                                            <StatusBadge value={o.verificationStatus} map={VERIFICATION_STATUS} />
                                        </td>

                                        <td className="px-3 py-2">
                                            <StatusBadge value={o.reserveType ?? "NONE"} map={RESERVE_TYPE} />
                                        </td>

                                        <td className="px-3 py-2">{o.depositRequired ?? "-"}</td>
                                        <td className="px-3 py-2">{fmtDate(o.createdAt)}</td>
                                        <td className="px-3 py-2">{fmtMoney(totalMoney, o.currency)}</td>

                                        <td className="px-3 py-2">
                                            <ItemPopover
                                                parentId={o.id}
                                                type="orders"
                                                count={displayCount}
                                                currency={o.currency}
                                                status={o.status}
                                                mode="view"
                                                onUpdated={({ count, total }) => {
                                                    setRowCounts((prev) => ({ ...prev, [o.id]: count }));
                                                    setRowTotals((prev) => ({ ...prev, [o.id]: total }));
                                                }}
                                            />
                                        </td>

                                        <td className="px-3 py-2">{o.notes ?? "-"}</td>

                                        <td className="relative px-3 py-2 text-right">
                                            <ActionMenu entityId={o.id} entityType="orders" status={o.status} mode="edit" />
                                        </td>
                                    </tr>
                                );
                            })
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
                        className={cls(
                            "rounded border px-3 py-1 text-sm",
                            page <= 1 && "pointer-events-none opacity-50"
                        )}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={cls(
                            "rounded border px-3 py-1 text-sm",
                            page >= totalPages && "pointer-events-none opacity-50"
                        )}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
