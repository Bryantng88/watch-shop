"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ActionMenu from "../../acquisitions/components/ActionMenu";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SERVICE_REQUEST_STATUS } from "@/components/badges/StatusMaps";
import DotLabel from "../../__components/DotLabel";

type ServiceReqItem = {
    id: string;

    status: string;
    createdAt: string;
    scope: string;
    customerItemNote: string;
    orderRefNo: string;
    refNo: string;
    serviceName: string;
    // optional (tùy API bạn trả)
    orderItemId?: string | null;
    orderItem?: {
        id: string;
        title?: string | null;
        serviceScope?: string | null;
        customerItemNote?: string | null;
        serviceCatalogId?: string | null;
        order?: { id: string; refNo?: string | null } | null;
    } | null;

    serviceCatalogId?: string | null;
    serviceCatalog?: { id: string; code?: string | null; name: string } | null;
    ServiceCatalog?: { id: string; code?: string | null; name: string } | null; // fallback key
};

type PageProps = {
    items: ServiceReqItem[];
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

/** =====================
 * Tabs / Segments
 * ===================== */
type ViewKey = "all" | "draft" | "in_progress" | "done" | "canceled";

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    draft: "DRAFT",
    in_progress: "IN_PROGRESS",
    done: "DONE",
    canceled: "CANCELED",
};

function matchesView(o: ServiceReqItem, view: ViewKey) {
    switch (view) {
        case "draft":
            return o.status === "DRAFT";
        case "in_progress":
            return o.status === "IN_PROGRESS";
        case "done":
            return o.status === "DONE";
        case "canceled":
            return o.status === "CANCELED";
        case "all":
        default:
            return true;
    }
}

export default function ServiceRequestListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: PageProps) {
    // bulk states
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const sp = useSearchParams();

    const url = useMemo(() => new URLSearchParams(sp.toString()), [sp]);

    const currentView = useMemo(() => (sp.get("view") || "all") as ViewKey, [sp]);

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
        return `/admin/service-requests?${next.toString()}`;
    };

    const displayItems = useMemo(
        () => items.filter((o) => matchesView(o, currentView)),
        [items, currentView]
    );

    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: items.length,
            pending: items.filter((o) => o.status === "PENDING").length,
            in_progress: items.filter((o) => o.status === "IN_PROGRESS").length,
            done: items.filter((o) => o.status === "DONE").length,
            canceled: items.filter((o) => o.status === "CANCELED").length,
        }),
        [items]
    );

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/service-requests?${next.toString()}`;
    };

    // rule bulk: cho phép select mọi status (bạn đổi rule ở đây nếu muốn)
    const isRowSelectable = (_o: ServiceReqItem) => true;

    const allSelectableIdsInView = useMemo(
        () => displayItems.filter(isRowSelectable).map((o) => o.id),
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
                <h1 className="text-xl font-semibold">Service Requests</h1>
                <Link
                    href="/admin/orders"
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    ← Orders
                </Link>
            </div>

            {/* TABS */}
            <SegmentTabs tabs={tabs} />

            {/* FILTER FORM */}
            <form
                action="/admin/service-requests"
                method="get"
                className="flex flex-wrap gap-2 items-end"
            >
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(rawSearchParams.q as string) ?? ""}
                        placeholder="ID / Order RefNo / Notes..."
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Sắp xếp</label>
                    <select
                        name="sort"
                        defaultValue={(rawSearchParams.sort as string) ?? "createdDesc"}
                        className="h-9 rounded border px-2"
                    >
                        <option value="createdDesc">Tạo ↓</option>
                        <option value="createdAsc">Tạo ↑</option>
                        <option value="updatedDesc">Cập nhật ↓</option>
                        <option value="updatedAsc">Cập nhật ↑</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3" type="submit">
                        Lọc
                    </button>
                    <Link
                        href="/admin/service-requests"
                        className="h-9 rounded border px-3 flex items-center"
                    >
                        Clear
                    </Link>
                </div>
            </form>

            {/* BULK BAR */}
            {showBulkBar && (
                <div className="mb-3 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} service request đã chọn
                    </span>

                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Thao tác hàng loạt
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

            {/* BULK CONFIRM MODAL (placeholder) */}
            {showBulkConfirm && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[420px] p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Bulk action</h3>

                        <div className="text-sm text-gray-600">
                            Bạn đang chọn <b>{selectedIds.length}</b> service request.
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
                                    // TODO: thay endpoint theo hệ thống của bạn
                                    await fetch("/api/admin/service-requests/bulk", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ ids: selectedIds }),
                                    });
                                    location.reload();
                                }}
                                type="button"
                            >
                                Xác nhận
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
                            <th className="px-3 py-2">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => toggleAllInView(e.target.checked)}
                                    disabled={allSelectableIdsInView.length === 0}
                                />
                            </th>

                            <th className="px-3 py-2 text-left">RefNo</th>
                            <th className="px-3 py-2 text-left">Dịch vụ</th>
                            <th className="px-3 py-2 text-left">Order</th>
                            <th className="px-3 py-2 text-left">Note</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-left">Ngày tạo</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-8 text-center text-gray-500">
                                    Không có dữ liệu trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((r) => {
                                const selectable = isRowSelectable(r);

                                const cat =
                                    r.serviceCatalog ??
                                    r.ServiceCatalog ??
                                    r.orderItem?.serviceCatalogId ??
                                    null;

                                const serviceName =
                                    r.serviceCatalog?.name ??
                                    r.ServiceCatalog?.name ??
                                    r.orderItem?.title ??
                                    "-";

                                const orderId = r.orderItem?.order?.id ?? null;
                                const orderRefNo = r.orderItem?.order?.refNo ?? null;

                                return (
                                    <tr key={r.id} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                disabled={!selectable}
                                                checked={selectedIds.includes(r.id)}
                                                onChange={(e) => {
                                                    const next = e.target.checked
                                                        ? [...selectedIds, r.id]
                                                        : selectedIds.filter((id) => id !== r.id);

                                                    setSelectedIds(next);
                                                    setShowBulkBar(next.length > 0);
                                                }}
                                            />
                                        </td>

                                        <td className="px-3 py-2 font-mono text-xs">

                                            <div className="font-medium">{r.refNo ?? "-"}</div>

                                            {r.scope === "CUSTOMER_OWNED" ? (
                                                <DotLabel label="Đồ Khách" tone="green" />
                                            ) : null}

                                            {r.scope === "WITH_PURCHASE" ? (
                                                <DotLabel label="Dịch Vụ" tone="blue" />
                                            ) : null}
                                        </td>

                                        <td className="px-3 py-2">
                                            <div className="font-medium">{r.serviceName}</div>
                                            {(r.serviceCatalogId || r.orderItem?.serviceCatalogId) && (
                                                <div className="text-xs text-gray-500">
                                                    catalogId:{" "}
                                                    <span className="font-mono">
                                                        {r.serviceCatalogId ?? r.orderItem?.serviceCatalogId}
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2">
                                            {r.orderRefNo ? (
                                                <Link className="hover:underline" href={`/admin/orders/${orderId}`}>
                                                    {r.orderRefNo ?? r.orderId}
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs">
                                            {r.customerItemNote}
                                        </td>



                                        <td className="px-3 py-2">
                                            <StatusBadge value={r.status} map={SERVICE_REQUEST_STATUS} />
                                        </td>

                                        <td className="px-3 py-2">{fmtDate(r.createdAt)}</td>

                                        <td className="relative px-3 py-2 text-right">
                                            {/* dùng ActionMenu cho đồng bộ hệ thống */}
                                            <ActionMenu
                                                entityId={r.id}
                                                entityType="service-requests"
                                                status={r.status}
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
