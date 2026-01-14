"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ActionMenu from "../../acquisitions/components/ActionMenu";
import SegmentTabs from "@/components/tabs/SegmenTabs";

/* ==============================
 * Types
 * ============================== */
type ShipmentStatus = "DRAFT" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type ShipmentRow = {
    id: string;
    refNo: string | null;
    status: ShipmentStatus;
    createdAt: string;

    orderId?: string | null;
    orderRefNo: string | null;

    customerName: string;
    shipPhone: string;
    shipAddress: string;

    carrier: string | null;
    trackingNo: string | null;
    shippingFee: number | null;
};

type PageProps = {
    items: ShipmentRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function Badge({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "gray" | "blue" | "green" | "amber" | "red";
}) {
    const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
    const toneCls =
        tone === "blue"
            ? "bg-blue-50 text-blue-700"
            : tone === "green"
                ? "bg-green-50 text-green-700"
                : tone === "amber"
                    ? "bg-amber-50 text-amber-700"
                    : tone === "red"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-700";
    return <span className={cls(base, toneCls)}>{children}</span>;
}

function statusTone(status: ShipmentStatus) {
    switch (status) {
        case "DRAFT":
            return "gray";
        case "READY":
            return "blue";
        case "SHIPPED":
            return "amber";
        case "DELIVERED":
            return "green";
        case "CANCELLED":
            return "red";
        default:
            return "gray";
    }
}

function money(n?: number | null) {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + " VND";
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
type ViewKey = "all" | "draft" | "ready" | "shipped" | "delivered" | "cancelled";

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    draft: "Chờ duyệt",
    ready: "Chờ giao",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã huỷ",
};

function matchesView(s: ShipmentRow, view: ViewKey) {
    switch (view) {
        case "draft":
            return s.status === "DRAFT";
        case "ready":
            return s.status === "READY";
        case "shipped":
            return s.status === "SHIPPED";
        case "delivered":
            return s.status === "DELIVERED";
        case "cancelled":
            return s.status === "CANCELLED";
        case "all":
        default:
            return true;
    }
}

/* ==============================
 * Component
 * ============================== */
export default function ShipmentListClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: PageProps) {
    const router = useRouter();

    // ✅ FIX: đọc view từ URL hiện tại giống Order
    const sp = useSearchParams();

    const url = useMemo(() => {
        return new URLSearchParams(sp.toString());
    }, [sp]);

    const currentView = useMemo(() => {
        return ((sp.get("view") || "all") as ViewKey);
    }, [sp]);

    // local rows for smooth UI
    const [rows, setRows] = useState<ShipmentRow[]>(items);
    useEffect(() => setRows(items), [items]);

    const displayItems = useMemo(
        () => rows.filter((x) => matchesView(x, currentView)),
        [rows, currentView]
    );

    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: rows.length,
            draft: rows.filter((x) => x.status === "DRAFT").length,
            ready: rows.filter((x) => x.status === "READY").length,
            shipped: rows.filter((x) => x.status === "SHIPPED").length,
            delivered: rows.filter((x) => x.status === "DELIVERED").length,
            cancelled: rows.filter((x) => x.status === "CANCELLED").length,
        }),
        [rows]
    );

    const setViewHref = (view: ViewKey) => {
        const next = new URLSearchParams(url);
        if (view === "all") next.delete("view");
        else next.set("view", view);

        next.set("page", "1");
        next.set("pageSize", String(pageSize));

        return `/admin/shipments?${next.toString()}`;
    };

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/shipments?${next.toString()}`;
    };

    const tabs = (Object.keys(VIEW_LABELS) as ViewKey[]).map((k) => ({
        key: k,
        label: VIEW_LABELS[k],
        count: countsByView[k],
        href: setViewHref(k),
        active: currentView === k,
    }));

    /** ==========================
     * BULK states (y như Order)
     * ========================== */
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [bulkSaving, setBulkSaving] = useState(false);
    const [bulkErr, setBulkErr] = useState<string | null>(null);

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
        setBulkErr(null);
    }, [currentView]);

    const isRowSelectable = (s: ShipmentRow) => s.status === "DRAFT";

    const allSelectableIdsInView = useMemo(
        () => displayItems.filter(isRowSelectable).map((s) => s.id),
        [displayItems]
    );

    const allChecked =
        allSelectableIdsInView.length > 0 &&
        allSelectableIdsInView.every((id) => selectedIds.includes(id));

    const toggleAllInView = (checked: boolean) => {
        if (!checked) {
            const next = selectedIds.filter((id) => !allSelectableIdsInView.includes(id));
            setSelectedIds(next);
            setShowBulkBar(next.length > 0);
            return;
        }
        const merged = Array.from(new Set([...selectedIds, ...allSelectableIdsInView]));
        setSelectedIds(merged);
        setShowBulkBar(merged.length > 0);
    };

    async function bulkApproveToReady() {
        setBulkErr(null);
        if (selectedIds.length === 0) return;

        setBulkSaving(true);
        try {
            const res = await fetch("/api/admin/shipments/bulk-ready", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shipmentIds: selectedIds }),
            });

            if (!res.ok) throw new Error(await res.text());

            setRows((prev) =>
                prev.map((x) => (selectedIds.includes(x.id) ? { ...x, status: "READY" } : x))
            );

            setSelectedIds([]);
            setShowBulkBar(false);
            setShowBulkConfirm(false);

            router.refresh();
        } catch (e: any) {
            setBulkErr(e?.message || "Bulk duyệt thất bại");
        } finally {
            setBulkSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Shipment</h1>
                    <div className="mt-1 text-sm text-gray-600">
                        Danh sách shipment được tạo từ đơn hàng
                    </div>
                </div>

                <Link
                    href="/admin/orders"
                    className="rounded-md border px-3 py-2 hover:bg-gray-50 text-sm"
                >
                    ← Quay lại Order
                </Link>
            </div>

            {/* ✅ TABS dùng chung */}
            <SegmentTabs tabs={tabs} />

            {/* FILTER FORM */}
            <form action="/admin/shipments" method="get" className="flex flex-wrap gap-2 items-end">
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={sp.get("q") ?? ""}
                        placeholder="RefNo, tên KH, số ĐT…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Page size</label>
                    <select name="pageSize" defaultValue={String(pageSize)} className="h-9 rounded border px-2">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3" type="submit">
                        Lọc
                    </button>
                    <Link href="/admin/shipments" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* BULK BAR */}
            {showBulkBar && (
                <div className="mb-3 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">{selectedIds.length} shipment đã chọn</span>

                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Duyệt shipments đã chọn (→ READY)
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
                        <h3 className="font-semibold text-lg">Duyệt shipment</h3>

                        <div className="text-sm text-gray-600">
                            Bạn đang duyệt <b>{selectedIds.length}</b> shipment từ <b>DRAFT</b> → <b>READY</b>.
                        </div>

                        {bulkErr ? <div className="text-sm text-red-600">{bulkErr}</div> : null}

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                className="px-3 py-1 border rounded"
                                onClick={() => setShowBulkConfirm(false)}
                                type="button"
                                disabled={bulkSaving}
                            >
                                Huỷ
                            </button>

                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={bulkApproveToReady}
                                type="button"
                                disabled={bulkSaving}
                            >
                                {bulkSaving ? "Đang duyệt…" : "Xác nhận duyệt"}
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
                            <th className="px-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => toggleAllInView(e.target.checked)}
                                    disabled={allSelectableIdsInView.length === 0}
                                />
                            </th>

                            <th className="px-3 py-2 text-left">Shipment</th>
                            <th className="px-3 py-2 text-left">Khách hàng</th>
                            <th className="px-3 py-2 text-left">Vận chuyển</th>
                            <th className="px-3 py-2 text-right">Phí ship</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-right">Ngày tạo</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                                    Không có shipment trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((s) => {
                                const selectable = isRowSelectable(s);

                                return (
                                    <tr key={s.id} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                disabled={!selectable}
                                                checked={selectedIds.includes(s.id)}
                                                onChange={(e) => {
                                                    const next = e.target.checked
                                                        ? [...selectedIds, s.id]
                                                        : selectedIds.filter((id) => id !== s.id);

                                                    setSelectedIds(next);
                                                    setShowBulkBar(next.length > 0);
                                                }}
                                            />
                                        </td>

                                        <td className="px-3 py-2">
                                            <div className="font-medium">{s.refNo ?? s.id.slice(0, 8)}</div>
                                            {s.orderRefNo && (
                                                <div className="text-xs text-gray-500">Order: {s.orderRefNo}</div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2">
                                            <div className="font-medium">{s.customerName}</div>
                                            <div className="text-xs text-gray-500">{s.shipPhone}</div>
                                            {s.shipAddress && (
                                                <div className="text-xs text-gray-400 line-clamp-1">{s.shipAddress}</div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2">
                                            <div>{s.carrier ?? "-"}</div>
                                            {s.trackingNo && (
                                                <div className="text-xs text-gray-500">Tracking: {s.trackingNo}</div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 text-right font-medium">{money(s.shippingFee)}</td>

                                        <td className="px-3 py-2">
                                            <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                                        </td>

                                        <td className="px-3 py-2 text-right text-xs text-gray-500">{fmtDate(s.createdAt)}</td>

                                        <td className="relative px-3 py-2 text-right">
                                            <ActionMenu entityId={s.id} entityType="shipments" status={s.status} mode="edit" />
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
