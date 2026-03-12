"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ItemPopover from "../../__components/GenericPopover";
import ActionMenu from "../../acquisitions/components/ActionMenu";
import DotLabel from "../../__components/DotLabel";
import SegmentTabs from "@/components/tabs/SegmenTabs";
import StatusBadge from "@/components/badges/StatusBadge";

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
    hasShipment: boolean | null;
};

type ViewKey =
    | "all"
    | "web_pending"
    | "need_action"
    | "processing"
    | "delivered"
    | "completed"
    | "cancelled";

type Counts = Record<ViewKey, number>;

type PageProps = {
    items: OrderItem[];
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

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(Number(n))} ${cur}`;
}

export default function OrderListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
    counts: serverCounts,
}: PageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const [rowCounts, setRowCounts] = useState<Record<string, number>>({});
    const [rowTotals, setRowTotals] = useState<Record<string, number>>({});
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const currentView = useMemo(() => {
        const v = (sp.get("view") || "all") as ViewKey;
        return v;
    }, [sp]);

    function setView(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        if (view === "all") next.delete("view");
        else next.set("view", view);

        next.set("page", "1");
        next.set("pageSize", String(pageSize));

        router.push(`${pathname}?${next.toString()}`);
    }

    const displayItems = items;

    const countsByView: Counts = useMemo(() => {
        if (serverCounts?.all != null) {
            return {
                all: serverCounts.all ?? 0,
                web_pending: serverCounts.web_pending ?? 0,
                need_action: serverCounts.need_action ?? 0,
                processing: serverCounts.processing ?? 0,
                delivered: serverCounts.delivered ?? 0,
                completed: serverCounts.completed ?? 0,
                cancelled: serverCounts.cancelled ?? 0,
            };
        }

        return {
            all: currentView === "all" ? total : 0,
            web_pending: currentView === "web_pending" ? total : 0,
            need_action: currentView === "need_action" ? total : 0,
            processing: currentView === "processing" ? total : 0,
            delivered: currentView === "delivered" ? total : 0,
            completed: currentView === "completed" ? total : 0,
            cancelled: currentView === "cancelled" ? total : 0,
        };
    }, [serverCounts, currentView, total]);

    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
        setShowBulkConfirm(false);
    }, [currentView, page, total]);

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `${pathname}?${next.toString()}`;
    };

    const isRowSelectable = (o: OrderItem) => o.status === "DRAFT";

    const selectableIds = useMemo(
        () => displayItems.filter(isRowSelectable).map((o) => o.id),
        [displayItems]
    );

    const allChecked =
        selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

    const someChecked =
        selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

    const q = (rawSearchParams.q as string) ?? "";
    const sort = (rawSearchParams.sort as string) ?? "updatedDesc";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Đơn hàng</h1>
                <Link
                    href="/admin/orders/new"
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                    + Tạo đơn hàng
                </Link>
            </div>

            <SegmentTabs
                active={currentView}
                onChange={(v) => setView(v as ViewKey)}
                tabs={[
                    { key: "all", label: "Tất cả", count: countsByView.all },
                    { key: "web_pending", label: "Chờ xác minh", count: countsByView.web_pending },
                    { key: "need_action", label: "Chờ duyệt", count: countsByView.need_action },
                    { key: "processing", label: "Đang xử lý", count: countsByView.processing },
                    { key: "delivered", label: "Đã giao", count: countsByView.delivered },
                    { key: "completed", label: "Hoàn thành", count: countsByView.completed },
                    { key: "cancelled", label: "Đã hủy", count: countsByView.cancelled },
                ]}
            />

            <form action={pathname} method="get" className="space-y-3">
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tìm kiếm</div>
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="RefNo, tên KH, số ĐT..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Sắp xếp</div>
                        <select
                            name="sort"
                            defaultValue={sort}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="updatedDesc">Cập nhật ↓</option>
                            <option value="updatedAsc">Cập nhật ↑</option>
                            <option value="createdDesc">Tạo ↓</option>
                            <option value="createdAsc">Tạo ↑</option>
                        </select>
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
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} đơn hàng đã chọn
                    </span>

                    <button
                        className="px-3 py-1 border rounded text-sm"
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

            {showBulkConfirm && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[420px] p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Duyệt đơn hàng</h3>

                        <div className="text-sm text-gray-600">
                            Bạn đang duyệt <b>{selectedIds.length}</b> đơn hàng.
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
                                        body: JSON.stringify({ orderIds: selectedIds }),
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

            <div className="border rounded-xl overflow-hidden">
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
                                                const merged = Array.from(
                                                    new Set([...selectedIds, ...selectableIds])
                                                );
                                                setSelectedIds(merged);
                                                setShowBulkBar(merged.length > 0);
                                            } else {
                                                const next = selectedIds.filter(
                                                    (id) => !selectableIds.includes(id)
                                                );
                                                setSelectedIds(next);
                                                setShowBulkBar(next.length > 0);
                                            }
                                        }}
                                        disabled={selectableIds.length === 0}
                                    />
                                </th>

                                <th className="px-3 py-3">RefNo</th>
                                <th className="px-3 py-3">Khách hàng</th>
                                <th className="px-3 py-3">Số ĐT</th>
                                <th className="px-3 py-3">Trạng thái</th>
                                <th className="px-3 py-3">Ngày tạo</th>
                                <th className="px-3 py-3">Tổng tiền</th>
                                <th className="px-3 py-3">Số dòng</th>
                                <th className="px-3 py-3">Ghi chú</th>
                                <th className="px-3 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayItems.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-3 py-10 text-center text-gray-500">
                                        Không có đơn hàng trong tab này
                                    </td>
                                </tr>
                            ) : (
                                displayItems.map((o) => {
                                    const displayCount = rowCounts[o.id] ?? o.itemCount;
                                    const totalMoney = rowTotals[o.id] ?? o.subtotal;
                                    const selectable = isRowSelectable(o);

                                    return (
                                        <tr key={o.id} className="border-t">
                                            <td className="px-3 py-4 align-top">
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

                                            <td className="px-3 py-4 align-top">
                                                <div className="leading-tight">
                                                    <div className="font-medium text-sm">
                                                        {o.refNo ?? "-"}
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap gap-2">
                                                        {o.hasShipment ? (
                                                            <DotLabel label="Shipment" tone="green" />
                                                        ) : null}
                                                        {o.reserveType === "COD" ? (
                                                            <DotLabel label="COD" tone="green" />
                                                        ) : null}
                                                        {o.reserveType === "DEPOSIT" ? (
                                                            <DotLabel label="Deposit" tone="orange" />
                                                        ) : null}
                                                        {o.source === "WEB" ? (
                                                            <DotLabel label="Web" tone="blue" />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                {o.customerName ?? "-"}
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                {o.shipPhone ?? "-"}
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <StatusBadge status={o.status} />
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                {fmtDate(o.createdAt)}
                                            </td>

                                            <td className="px-3 py-4 align-top font-semibold">
                                                {fmtMoney(totalMoney, o.currency)}
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                <ItemPopover
                                                    parentId={o.id}
                                                    type="orders"
                                                    count={displayCount}
                                                    currency={o.currency}
                                                    status={o.status}
                                                    mode="view"
                                                    onUpdated={({ count, total }) => {
                                                        setRowCounts((prev) => ({
                                                            ...prev,
                                                            [o.id]: count,
                                                        }));
                                                        setRowTotals((prev) => ({
                                                            ...prev,
                                                            [o.id]: total,
                                                        }));
                                                    }}
                                                />
                                            </td>

                                            <td className="px-3 py-4 align-top">
                                                {o.notes ?? "-"}
                                            </td>

                                            <td className="px-3 py-4 align-top text-right">
                                                <ActionMenu
                                                    entityId={o.id}
                                                    entityType="orders"
                                                    status={o.status}
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
                        className={`rounded border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-2 ${page >= totalPages ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}