"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ActionMenu from "../../acquisitions/components/ActionMenu";

import SegmentTabs from "@/components/tabs/SegmenTabs";
import StatusBadge from "@/components/badges/StatusBadge";

type ShipmentStatus = "DRAFT" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type ViewKey = "all" | "draft" | "ready" | "shipped" | "delivered" | "cancelled";

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
    currency?: string | null;
};

type Counts = Record<ViewKey, number>;

type PageProps = {
    items: ShipmentRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    counts?: Partial<Counts>;
};

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

function money(n?: number | null) {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + " VND";
}

export default function ShipmentListClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    counts: serverCounts,
}: PageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const currentView = useMemo(() => (sp.get("view") || "all") as ViewKey, [sp]);

    function setView(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        next.set("pageSize", String(pageSize));
        router.push(`${pathname}?${next.toString()}`);
    }

    const [rows, setRows] = useState<ShipmentRow[]>(items);
    useEffect(() => setRows(items), [items]);

    const displayItems = rows;

    const countsByView: Counts = useMemo(() => {
        if (serverCounts?.all != null) {
            return {
                all: serverCounts.all ?? 0,
                draft: serverCounts.draft ?? 0,
                ready: serverCounts.ready ?? 0,
                shipped: serverCounts.shipped ?? 0,
                delivered: serverCounts.delivered ?? 0,
                cancelled: serverCounts.cancelled ?? 0,
            };
        }

        return {
            all: currentView === "all" ? total : 0,
            draft: currentView === "draft" ? total : 0,
            ready: currentView === "ready" ? total : 0,
            shipped: currentView === "shipped" ? total : 0,
            delivered: currentView === "delivered" ? total : 0,
            cancelled: currentView === "cancelled" ? total : 0,
        };
    }, [serverCounts, currentView, total]);

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
    }, [currentView, page, total]);

    const isRowSelectable = (s: ShipmentRow) => s.status === "DRAFT";

    const selectableIds = useMemo(
        () => displayItems.filter(isRowSelectable).map((s) => s.id),
        [displayItems]
    );

    const allChecked =
        selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));
    const someChecked =
        selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

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

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `${pathname}?${next.toString()}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Shipments</h1>
                <Link
                    href="/admin/orders"
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                    ← Orders
                </Link>
            </div>

            <SegmentTabs
                active={currentView}
                onChange={(v) => setView(v as ViewKey)}
                tabs={[
                    { key: "all", label: "Tất cả", count: countsByView.all },
                    { key: "draft", label: "Chờ duyệt", count: countsByView.draft },
                    { key: "ready", label: "Chờ giao", count: countsByView.ready },
                    { key: "shipped", label: "Đang giao", count: countsByView.shipped },
                    { key: "delivered", label: "Đã giao", count: countsByView.delivered },
                    { key: "cancelled", label: "Đã hủy", count: countsByView.cancelled },
                ]}
            />

            <form action={pathname} method="get" className="space-y-3">
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tìm kiếm</div>
                        <input
                            name="q"
                            defaultValue={sp.get("q") ?? ""}
                            placeholder="RefNo, tên KH, số ĐT..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Page size</div>
                        <select
                            name="pageSize"
                            defaultValue={String(pageSize)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50" type="submit">
                        Lọc
                    </button>
                    <Link href={pathname} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        Clear
                    </Link>
                    <div className="ml-auto text-sm text-gray-600">
                        Đã chọn: <b>{selectedIds.length}</b>
                    </div>
                </div>
            </form>

            {showBulkBar && (
                <div className="p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">{selectedIds.length} shipment đã chọn</span>
                    <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Duyệt shipments đã chọn
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
                                Hủy
                            </button>
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={bulkApproveToReady}
                                type="button"
                                disabled={bulkSaving}
                            >
                                {bulkSaving ? "Đang duyệt..." : "Xác nhận duyệt"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-700">
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
                                                const next = selectedIds.filter((id) => !selectableIds.includes(id));
                                                setSelectedIds(next);
                                                setShowBulkBar(next.length > 0);
                                            }
                                        }}
                                        disabled={selectableIds.length === 0}
                                    />
                                </th>
                                <th className="px-3 py-3">Shipment</th>
                                <th className="px-3 py-3">Khách hàng</th>
                                <th className="px-3 py-3">Vận chuyển</th>
                                <th className="px-3 py-3">Phí ship</th>
                                <th className="px-3 py-3">Trạng thái</th>
                                <th className="px-3 py-3">Ngày tạo</th>
                                <th className="px-3 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-10 text-center text-gray-500">
                                        Không có shipment trong tab này
                                    </td>
                                </tr>
                            ) : (
                                displayItems.map((s) => {
                                    const selectable = isRowSelectable(s);

                                    return (
                                        <tr key={s.id} className="border-t">
                                            <td className="px-3 py-4 align-middle">
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

                                            <td className="px-3 py-4 align-top">
                                                <div className="leading-tight">
                                                    <div className="font-medium text-sm">{s.refNo ?? s.id.slice(0, 8)}</div>
                                                    {s.orderRefNo ? (
                                                        <div className="mt-1 text-[11px] text-gray-400 uppercase tracking-wide">
                                                            order · {s.orderRefNo}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div className="font-medium">{s.customerName}</div>
                                                <div className="text-xs text-gray-500 mt-1">{s.shipPhone}</div>
                                                {s.shipAddress ? (
                                                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                        {s.shipAddress}
                                                    </div>
                                                ) : null}
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <div>{s.carrier ?? "-"}</div>
                                                {s.trackingNo ? (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Tracking: {s.trackingNo}
                                                    </div>
                                                ) : null}
                                            </td>

                                            <td className="px-3 py-4 align-middle font-semibold">{money(s.shippingFee)}</td>

                                            <td className="px-3 py-4 align-middle">
                                                <StatusBadge status={s.status} />
                                            </td>

                                            <td className="px-3 py-4 align-middle">{fmtDate(s.createdAt)}</td>

                                            <td className="px-3 py-4 align-middle text-right">
                                                <ActionMenu
                                                    entityId={s.id}
                                                    entityType="shipments"
                                                    status={s.status}
                                                    mode="edit"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-700">
                <div>
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={`rounded border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                        ← Trước
                    </Link>
                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-2 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}