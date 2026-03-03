"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import SegmentTabs from "@/components/tabs/SegmenTabs";
import { StatusBadge } from "@/components/badges/StatusBadge";
// TODO: tạo PAYMENT_STATUS map giống SERVICE_REQUEST_STATUS
// import { PAYMENT_STATUS } from "@/components/badges/StatusMaps";
import GenericActionMenu from "../../__components/GenericActionMenu";

type PaymentItem = {
    id: string;

    status: string; // PaymentStatus
    purpose: string; // PaymentPurpose
    type: string; // PaymentType
    direction: string | null; // paymentdirection?
    method: string; // PaymentMethod

    amount: number;
    currency: string;

    paidAt: string;
    createdAt: string;

    reference: string | null;
    note: string | null;

    order_id: string | null;
    service_request_id: string | null;
    vendor_id: string | null;
    acquisition_id: string | null;
    shipment_id: string | null;
};

type PageProps = {
    items: PaymentItem[];
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
    return new Date(d).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtMoney(amount?: number | null, currency?: string | null) {
    if (amount == null) return "-";
    const x = Number(amount);
    const label = Number.isFinite(x) ? x.toLocaleString("vi-VN") : String(amount);
    return `${label}${currency ? ` ${currency}` : ""}`;
}

/** =====================
 * Tabs / Segments
 * ===================== */
type ViewKey = "all" | "unpaid" | "paid" | "canceled";

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    unpaid: "UNPAID",
    paid: "PAID",
    canceled: "CANCELED",
};

function matchesView(o: PaymentItem, view: ViewKey) {
    switch (view) {
        case "unpaid":
            return o.status === "UNPAID";
        case "paid":
            return o.status === "PAID";
        case "canceled":
            return o.status === "CANCELED";
        case "all":
        default:
            return true;
    }
}

export default function PaymentListPageClient({
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
        return `/admin/payments?${next.toString()}`;
    };

    const displayItems = useMemo(
        () => items.filter((o) => matchesView(o, currentView)),
        [items, currentView]
    );

    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: items.length,
            unpaid: items.filter((o) => o.status === "UNPAID").length,
            paid: items.filter((o) => o.status === "PAID").length,
            canceled: items.filter((o) => o.status === "CANCELED").length,
        }),
        [items]
    );

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/payments?${next.toString()}`;
    };

    // rule bulk: cho phép select mọi status (bạn đổi rule ở đây nếu muốn)
    const isRowSelectable = (_o: PaymentItem) => true;

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
                <h1 className="text-xl font-semibold">Payments</h1>
                <Link href="/admin" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                    ← Admin
                </Link>
            </div>

            {/* TABS */}
            <SegmentTabs tabs={tabs} />

            {/* FILTER FORM */}
            <form action="/admin/payments" method="get" className="flex flex-wrap gap-2 items-end">
                {currentView !== "all" && <input type="hidden" name="view" value={currentView} />}

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(rawSearchParams.q as string) ?? ""}
                        placeholder="id / reference / note / SR..."
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Status</label>
                    <input
                        name="status"
                        defaultValue={(rawSearchParams.status as string) ?? ""}
                        placeholder="UNPAID / PAID..."
                        className="h-9 rounded border px-2 w-44"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Purpose</label>
                    <input
                        name="purpose"
                        defaultValue={(rawSearchParams.purpose as string) ?? ""}
                        placeholder="ORDER_FULL / MAINTENANCE_COST..."
                        className="h-9 rounded border px-2 w-56"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Direction</label>
                    <input
                        name="direction"
                        defaultValue={(rawSearchParams.direction as string) ?? ""}
                        placeholder="IN / OUT"
                        className="h-9 rounded border px-2 w-28"
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
                        <option value="paidDesc">Paid ↓</option>
                        <option value="paidAsc">Paid ↑</option>
                        <option value="amountDesc">Amount ↓</option>
                        <option value="amountAsc">Amount ↑</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3" type="submit">
                        Lọc
                    </button>
                    <Link href="/admin/payments" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            {/* BULK BAR */}
            {showBulkBar && (
                <div className="mb-3 p-3 bg-blue-50 border rounded flex items-center gap-4">
                    <span className="font-medium text-blue-700">{selectedIds.length} payment đã chọn</span>

                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => setShowBulkConfirm(true)}
                        type="button"
                    >
                        Bulk action
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
                            Bạn đang chọn <b>{selectedIds.length}</b> payment.
                        </div>

                        <div className="text-xs text-gray-500">
                            TODO: ở đây bạn có thể làm “Mark PAID”, “Mark UNPAID”, “Cancel”, v.v…
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
                                    // await fetch("/api/admin/payments/bulk-update", { ... })
                                    setShowBulkConfirm(false);
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

                            <th className="px-3 py-2 text-left">PaidAt</th>
                            <th className="px-3 py-2 text-left">Amount</th>
                            <th className="px-3 py-2 text-left">Purpose</th>
                            <th className="px-3 py-2 text-left">Type</th>

                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-left">Direction</th>
                            <th className="px-3 py-2 text-left">Method</th>
                            <th className="px-3 py-2 text-left">Ref</th>
                            <th className="px-3 py-2 text-left">Link</th>
                            <th className="px-3 py-2 text-left">Note</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="py-8 text-center text-gray-500">
                                    Không có dữ liệu trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((r) => {
                                const selectable = isRowSelectable(r);

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

                                        <td className="px-3 py-2">{fmtDate(r.paidAt)}</td>

                                        <td className="px-3 py-2">
                                            <div className="font-medium">{fmtMoney(r.amount, r.currency)}</div>
                                            <div className="text-xs text-gray-500">created: {fmtDate(r.createdAt)}</div>
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs">{r.purpose}</td>
                                        <td className="px-3 py-2 font-mono text-xs">{r.type}</td>
                                        <td className="px-3 py-2">
                                            {/* thay map ở đây nếu bạn đã có PAYMENT_STATUS */}
                                            <StatusBadge value={r.status} map={{} as any} />
                                        </td>

                                        <td className="px-3 py-2 font-mono text-xs">{r.direction ?? "-"}</td>
                                        <td className="px-3 py-2 font-mono text-xs">{r.method}</td>
                                        <td className="px-3 py-2 font-mono text-xs">{r.reference ?? "-"}</td>

                                        <td className="px-3 py-2 text-xs space-y-1">
                                            {r.order_id ? (
                                                <div>
                                                    Order:{" "}
                                                    <Link className="hover:underline" href={`/admin/orders/${r.order_id}`}>
                                                        {r.order_id}
                                                    </Link>
                                                </div>
                                            ) : null}

                                            {r.service_request_id ? (
                                                <div>
                                                    SR:{" "}
                                                    <Link
                                                        className="hover:underline"
                                                        href={`/admin/service-requests/${r.service_request_id}`}
                                                    >
                                                        {r.service_request_id}
                                                    </Link>
                                                </div>
                                            ) : null}

                                            {r.vendor_id ? <div>Vendor: {r.vendor_id}</div> : null}
                                            {r.acquisition_id ? <div>Acq: {r.acquisition_id}</div> : null}
                                            {r.shipment_id ? <div>Ship: {r.shipment_id}</div> : null}

                                            {!r.order_id &&
                                                !r.service_request_id &&
                                                !r.vendor_id &&
                                                !r.acquisition_id &&
                                                !r.shipment_id ? (
                                                <span className="text-gray-400">-</span>
                                            ) : null}
                                        </td>

                                        <td className="px-3 py-2 max-w-[420px]">
                                            {r.note ? (
                                                <div className="whitespace-pre-wrap">{r.note}</div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="relative px-3 py-2 text-right">
                                            <GenericActionMenu
                                                id={r.id}
                                                actions={[
                                                    {
                                                        label: "Copy ID",
                                                        onClick: async () => {
                                                            await navigator.clipboard.writeText(r.id);
                                                        },
                                                    },
                                                    {
                                                        label: "Xem JSON (API)",
                                                        onClick: () => window.open(`/api/admin/payments/list?q=${r.id}`, "_blank"),
                                                    },
                                                ]}
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