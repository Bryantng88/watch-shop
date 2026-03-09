// src/app/(admin)/admin/payments/_client/PaymentListClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ViewKey = "all" | "unpaid" | "paid" | "canceled";

type PaymentItem = {
    id: string;
    refNo: string | null;

    method: string;
    amount: number;
    currency: string;
    paidAt: string | null;
    createdAt: string;

    reference: string | null;
    note: string | null;

    direction: string | null;
    status: string;
    purpose: string;
    type: string;

    order_id: string | null;
    service_request_id: string | null;
    vendor_id: string | null;
    acquisition_id: string | null;
    shipment_id: string | null;
};

type Counts = {
    all: number;
    unpaid: number;
    paid: number;
    canceled: number;
};

type PageProps = {
    items: PaymentItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    counts?: Counts;
};

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

function fmtDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function fmtMoney(v?: number | null) {
    if (v == null) return "-";
    return Number(v).toLocaleString("vi-VN");
}

function purposeDotClass(type?: string) {
    switch ((type || "").toUpperCase()) {
        case "ORDER":
            return "bg-emerald-500";
        case "SERVICE":
            return "bg-indigo-500";
        case "SHIPMENT":
            return "bg-orange-500";
        case "ACQUISITION":
            return "bg-pink-500";
        default:
            return "bg-gray-400";
    }
}

function directionPill(direction?: string | null) {
    const d = (direction || "").toUpperCase();
    if (d === "IN") {
        return (
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                IN
            </span>
        );
    }
    if (d === "OUT") {
        return (
            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                OUT
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            -
        </span>
    );
}

function statusPillClass(status?: string) {
    switch ((status || "").toUpperCase()) {
        case "PAID":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "UNPAID":
            return "border-gray-200 bg-gray-50 text-gray-700";
        case "CANCELED":
            return "border-red-200 bg-red-50 text-red-700";
        default:
            return "border-gray-200 bg-gray-50 text-gray-700";
    }
}

const VIEW_LABELS: Record<ViewKey, string> = {
    all: "Tất cả",
    unpaid: "UNPAID",
    paid: "PAID",
    canceled: "CANCELED",
};

export default function PaymentListClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
    counts,
}: PageProps) {
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const sp = useSearchParams();

    const url = useMemo(() => new URLSearchParams(sp.toString()), [sp]);

    // ✅ Tab đọc từ STATUS, không đọc từ view nữa
    const currentView = useMemo((): ViewKey => {
        const status = (sp.get("status") || "").toUpperCase();
        if (status === "UNPAID") return "unpaid";
        if (status === "PAID") return "paid";
        if (status === "CANCELED") return "canceled";
        return "all";
    }, [sp]);

    // reset selection khi đổi tab / page
    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [currentView, page]);

    useEffect(() => {
        setShowBulkBar(selectedIds.length > 0);
    }, [selectedIds.length]);

    // ✅ server đã filter theo status rồi => không filter lại ở client
    const displayItems = useMemo(() => items, [items]);

    const countsByView: Record<ViewKey, number> = useMemo(
        () => ({
            all: counts?.all ?? 0,
            unpaid: counts?.unpaid ?? 0,
            paid: counts?.paid ?? 0,
            canceled: counts?.canceled ?? 0,
        }),
        [counts]
    );

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/payments?${next.toString()}`;
    };



    // ✅ tab set status, không set view
    const setViewHref = (view: ViewKey) => {
        const next = new URLSearchParams(url);

        if (view === "all") next.delete("status");
        else if (view === "unpaid") next.set("status", "UNPAID");
        else if (view === "paid") next.set("status", "PAID");
        else if (view === "canceled") next.set("status", "CANCELED");

        next.set("page", "1");
        next.set("pageSize", String(pageSize));
        return `/admin/payments?${next.toString()}`;
    };

    const tabs = (Object.keys(VIEW_LABELS) as ViewKey[]).map((k) => ({
        key: k,
        label: VIEW_LABELS[k],
        count: countsByView[k],
        href: setViewHref(k),
        active: currentView === k,
    }));

    // select all on current page
    const allSelectableIdsInView = useMemo(() => displayItems.map((o) => o.id), [displayItems]);

    const allChecked =
        allSelectableIdsInView.length > 0 &&
        allSelectableIdsInView.every((id) => selectedIds.includes(id));

    const someChecked =
        allSelectableIdsInView.some((id) => selectedIds.includes(id)) && !allChecked;

    const buildFilterHref = (patch: Record<string, string | null>) => {
        const next = new URLSearchParams(url);

        Object.entries(patch).forEach(([k, v]) => {
            if (!v) next.delete(k);
            else next.set(k, v);
        });

        next.set("page", "1");
        next.set("pageSize", String(pageSize));

        return `/admin/payments?${next.toString()}`;
    };

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Payments</h1>

                <Link
                    href="/admin"
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    ← Admin
                </Link>
            </div>

            {/* TABS */}
            <div className="flex items-end gap-8 border-b">
                {tabs.map((t) => (
                    <Link
                        key={t.key}
                        href={t.href}
                        className={cls(
                            "pb-2 text-sm",
                            t.active ? "border-b-2 border-black font-semibold text-black" : "text-gray-500"
                        )}
                    >
                        {t.label}
                        <span
                            className={cls(
                                "ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs",
                                t.active ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                            )}
                        >
                            {t.count}
                        </span>
                    </Link>
                ))}
            </div>

            {/* FILTER FORM */}
            <form
                action="/admin/payments"
                method="get"
                className="space-y-3"
            >
                {/* Giữ status từ tab */}
                {currentView === "unpaid" && <input type="hidden" name="status" value="UNPAID" />}
                {currentView === "paid" && <input type="hidden" name="status" value="PAID" />}
                {currentView === "canceled" && <input type="hidden" name="status" value="CANCELED" />}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                    <div>
                        <div className="mb-1 text-xs text-gray-500">Tìm kiếm</div>
                        <input
                            name="q"
                            defaultValue={(rawSearchParams.q as string) ?? ""}
                            placeholder="id / refNo / reference / note / SR..."
                            className="h-10 w-full rounded-md border px-3 text-sm"
                        />
                    </div>

                    <div>
                        <div className="mb-1 text-xs text-gray-500">Purpose</div>
                        <input
                            name="purpose"
                            defaultValue={(rawSearchParams.purpose as string) ?? ""}
                            placeholder="ORDER_FULL / MAINTENANCE_COST..."
                            className="h-10 w-full rounded-md border px-3 text-sm"
                        />
                    </div>

                    <div>
                        <div className="mb-1 text-xs text-gray-500">Direction</div>
                        <select
                            name="direction"
                            defaultValue={(rawSearchParams.direction as string) ?? ""}
                            className="h-10 w-full rounded-md border px-3 text-sm bg-white"
                        >
                            <option value="">(All)</option>
                            <option value="IN">IN</option>
                            <option value="OUT">OUT</option>
                        </select>
                    </div>

                    <div>
                        <div className="mb-1 text-xs text-gray-500">Method</div>
                        <select
                            name="method"
                            defaultValue={(rawSearchParams.method as string) ?? ""}
                            className="h-10 w-full rounded-md border px-3 text-sm bg-white"
                        >
                            <option value="">(All)</option>
                            <option value="CASH">CASH</option>
                            <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                            <option value="COD">COD</option>
                        </select>
                    </div>

                    <div>
                        <div className="mb-1 text-xs text-gray-500">Sắp xếp</div>
                        <select
                            name="sort"
                            defaultValue={(rawSearchParams.sort as string) ?? "createdDesc"}
                            className="h-10 w-full rounded-md border px-3 text-sm bg-white"
                        >
                            <option value="createdDesc">Tạo ↓</option>
                            <option value="createdAsc">Tạo ↑</option>
                            <option value="paidDesc">Paid ↓</option>
                            <option value="paidAsc">Paid ↑</option>
                            <option value="amountDesc">Amount ↓</option>
                            <option value="amountAsc">Amount ↑</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                        type="submit"
                    >
                        Lọc
                    </button>

                    <Link
                        href="/admin/payments"
                        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Clear
                    </Link>

                    <div className="ml-auto text-sm text-gray-600">
                        Đã chọn: <b>{selectedIds.length}</b>
                    </div>
                </div>
            </form>

            {/* BULK BAR */}
            {showBulkBar && (
                <div className="mb-3 flex items-center gap-4 rounded border bg-blue-50 p-3">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} payment đã chọn
                    </span>

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
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="w-10 px-3 py-3">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someChecked;
                                    }}
                                    onChange={(e) => {
                                        if (!e.target.checked) {
                                            const next = selectedIds.filter(
                                                (id) => !allSelectableIdsInView.includes(id)
                                            );
                                            setSelectedIds(next);
                                            setShowBulkBar(next.length > 0);
                                            return;
                                        }

                                        const merged = Array.from(
                                            new Set([...selectedIds, ...allSelectableIdsInView])
                                        );
                                        setSelectedIds(merged);
                                        setShowBulkBar(merged.length > 0);
                                    }}
                                />
                            </th>

                            <th className="px-3 py-3 text-left">RefNo</th>
                            <th className="px-3 py-3 text-left">Amount</th>
                            <th className="px-3 py-3 text-left">Note</th>
                            <th className="px-3 py-3 text-left">Status</th>
                            <th className="px-3 py-3 text-left">Method</th>
                            <th className="px-3 py-3 text-left">Ngày tạo</th>
                            <th className="px-3 py-3 text-left">Link</th>
                            <th className="px-3 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-10 text-center text-gray-500">
                                    Không có dữ liệu trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((row) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-3 py-4 align-top">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={(e) => {
                                                const next = e.target.checked
                                                    ? [...selectedIds, row.id]
                                                    : selectedIds.filter((id) => id !== row.id);

                                                setSelectedIds(Array.from(new Set(next)));
                                                setShowBulkBar(next.length > 0);
                                            }}
                                        />
                                    </td>

                                    {/* RefNo */}
                                    <td className="px-3 py-4 align-top">
                                        <div className="flex items-start gap-2">
                                            <span
                                                className={cls(
                                                    "mt-1 inline-block h-2 w-2 rounded-full",
                                                    purposeDotClass(row.type)
                                                )}
                                            />
                                            <div>
                                                <div className="font-medium">
                                                    {row.refNo && row.refNo.trim() ? row.refNo : "-"}
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {row.purpose} • {row.type}
                                                </div>
                                                <div className="mt-2">
                                                    {directionPill(row.direction)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-3 py-4 align-top">
                                        <div className="text-base font-semibold">
                                            {fmtMoney(row.amount)}
                                        </div>
                                        <div className="text-xs text-gray-500">{row.currency}</div>
                                    </td>

                                    {/* Note */}
                                    <td className="px-3 py-4 align-top">
                                        <div className="text-sm">{row.note || "-"}</div>
                                        <div className="mt-1 text-xs text-gray-500">ID: {row.id}</div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-4 align-top">
                                        <span
                                            className={cls(
                                                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                                                statusPillClass(row.status)
                                            )}
                                        >
                                            {String(row.status || "-").toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Method */}
                                    <td className="px-3 py-4 align-top font-medium">
                                        {row.method || "-"}
                                    </td>

                                    {/* Dates */}
                                    <td className="px-3 py-4 align-top">
                                        <div className="text-sm">{fmtDate(row.createdAt)}</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            Paid: {fmtDate(row.paidAt)}
                                        </div>
                                    </td>

                                    {/* Link */}
                                    <td className="px-3 py-4 align-top">
                                        <div className="space-y-1 text-sm">
                                            {row.order_id ? (
                                                <div>
                                                    <span className="font-medium text-blue-600">Order</span>{" "}
                                                    <span className="text-gray-600">{row.order_id}</span>
                                                </div>
                                            ) : null}

                                            {row.service_request_id ? (
                                                <div>
                                                    <span className="font-medium text-blue-600">SR</span>{" "}
                                                    <span className="text-gray-600">{row.service_request_id}</span>
                                                </div>
                                            ) : null}

                                            {row.vendor_id ? (
                                                <div>
                                                    <span className="font-medium text-blue-600">Vendor</span>{" "}
                                                    <span className="text-gray-600">{row.vendor_id}</span>
                                                </div>
                                            ) : null}

                                            {row.shipment_id ? (
                                                <div>
                                                    <span className="font-medium text-blue-600">Shipment</span>{" "}
                                                    <span className="text-gray-600">{row.shipment_id}</span>
                                                </div>
                                            ) : null}

                                            {row.acquisition_id ? (
                                                <div>
                                                    <span className="font-medium text-blue-600">Acq</span>{" "}
                                                    <span className="text-gray-600">{row.acquisition_id}</span>
                                                </div>
                                            ) : null}

                                            {!row.order_id &&
                                                !row.service_request_id &&
                                                !row.vendor_id &&
                                                !row.shipment_id &&
                                                !row.acquisition_id ? (
                                                <span className="text-gray-400">-</span>
                                            ) : null}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-3 py-4 text-right align-top">
                                        <button
                                            type="button"
                                            className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                                            onClick={() => {
                                                navigator.clipboard?.writeText(row.id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* FOOTER PAGINATION */}
            <div className="flex items-center justify-between text-sm text-gray-700">
                <div>
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={cls(
                            "rounded-lg border px-3 py-2 hover:bg-gray-50",
                            page <= 1 && "pointer-events-none opacity-50"
                        )}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={cls(
                            "rounded-lg border px-3 py-2 hover:bg-gray-50",
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