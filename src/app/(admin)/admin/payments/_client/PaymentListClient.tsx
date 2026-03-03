// src/app/(admin)/admin/payments/_client/PaymentListClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import SegmentTabs from "@/components/tabs/SegmenTabs";
import { StatusBadge } from "@/components/badges/StatusBadge";
import DotLabel from "../../__components/DotLabel";
import GenericActionMenu from "../../__components/GenericActionMenu";

// Nếu bạn có map riêng cho PAYMENT status thì import map đó.
// Tạm thời dùng map service (nếu bạn đã có map payment thì đổi lại).
import { SERVICE_REQUEST_STATUS as PAYMENT_STATUS_MAP } from "@/components/badges/StatusMaps";

type PaymentStatus = "UNPAID" | "PAID" | "CANCELED" | string;
type PaymentDirection = "IN" | "OUT" | null;
type PaymentType = "ORDER" | "SHIPMENT" | "INVOICE" | "ACQUISITION" | "SERVICE" | "OTHER" | string;
type PaymentPurpose =
    | "ORDER_DEPOSIT"
    | "ORDER_REMAIN"
    | "ORDER_FULL"
    | "SERVICE_REQUEST"
    | "MAINTENANCE_COST"
    | "SERVICE_FEE"
    | "SHIPMENT_DEPOSIT"
    | "SHIPMENT_REMAIN"
    | "SHIPMENT_FULL"
    | "ACQUISITION_DEPOSIT"
    | "ACQUISITION_REMAIN"
    | "ACQUISITION_FULL"
    | string;

export type PaymentItem = {
    id: string;

    createdAt: string;
    paidAt?: string | null;

    amount: number; // bạn đang serialize Decimal -> Number rồi
    currency: string; // "VND"
    status: PaymentStatus;

    direction?: PaymentDirection; // IN/OUT/null
    method?: string | null; // CASH/BANK_TRANSFER/COD...
    purpose?: PaymentPurpose | null;
    type?: PaymentType | null;

    reference?: string | null;
    note?: string | null;

    order_id?: string | null;
    service_request_id?: string | null;
    vendor_id?: string | null;
    acquisition_id?: string | null;
    shipment_id?: string | null;
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

function fmtDateTime(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    const time = dt.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const date = dt.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    return { time, date };
}

function fmtMoney(n?: number | null) {
    if (n == null) return "-";
    // format VND kiểu 3.500.000
    const s = Math.round(n).toString();
    const parts: string[] = [];
    let i = s.length;
    while (i > 3) {
        parts.unshift(s.slice(i - 3, i));
        i -= 3;
    }
    parts.unshift(s.slice(0, i));
    return parts.join(".");
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

function DirectionDot({ dir }: { dir?: PaymentDirection }) {
    if (!dir) return <span className="text-gray-400">-</span>;
    if (dir === "IN") return <DotLabel label="IN" tone="green" />;
    return <DotLabel label="OUT" tone="orange" />;
}

function PurposeBadge({ purpose }: { purpose?: string | null }) {
    if (!purpose) return <span className="text-gray-400">-</span>;
    return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
            {purpose}
        </span>
    );
}

function TypeBadge({ type }: { type?: string | null }) {
    if (!type) return <span className="text-gray-400">-</span>;
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            {type}
        </span>
    );
}

function MonoId({ v, prefix }: { v?: string | null; prefix?: string }) {
    if (!v) return <span className="text-gray-400">-</span>;
    return (
        <div className="max-w-[260px]">
            {prefix ? <div className="text-xs font-medium text-gray-700">{prefix}</div> : null}
            <div className="truncate font-mono text-[11px] text-gray-500" title={v}>
                {v}
            </div>
        </div>
    );
}

export default function PaymentListClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: PageProps) {
    const sp = useSearchParams();
    const url = useMemo(() => new URLSearchParams(sp.toString()), [sp]);

    // bulk states
    const [showBulkBar, setShowBulkBar] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const currentView = useMemo(() => (sp.get("view") || "all") as ViewKey, [sp]);

    // reset selection khi đổi tab
    useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [currentView]);

    const setViewHref = (view: ViewKey) => {
        const next = new URLSearchParams(url);
        if (view === "all") next.delete("view");
        else next.set("view", view);
        next.set("page", "1");
        return `/admin/payments?${next.toString()}`;
    };

    const displayItems = useMemo(() => items.filter((o) => matchesView(o, currentView)), [items, currentView]);

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

    // rule bulk: cho phép select mọi status
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
                        placeholder="UNPAID / PAID / ..."
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Purpose</label>
                    <input
                        name="purpose"
                        defaultValue={(rawSearchParams.purpose as string) ?? ""}
                        placeholder="ORDER_FULL / MAINTENANCE_COST..."
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Direction</label>
                    <input
                        name="direction"
                        defaultValue={(rawSearchParams.direction as string) ?? ""}
                        placeholder="IN / OUT"
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

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-2 w-[42px]">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => toggleAllInView(e.target.checked)}
                                    disabled={allSelectableIdsInView.length === 0}
                                />
                            </th>

                            <th className="px-3 py-2 text-left w-[130px]">CreatedAt</th>
                            <th className="px-3 py-2 text-left w-[150px]">Amount</th>
                            <th className="px-3 py-2 text-left w-[170px]">Purpose</th>
                            <th className="px-3 py-2 text-left w-[120px]">Type</th>
                            <th className="px-3 py-2 text-left w-[120px]">Status</th>
                            <th className="px-3 py-2 text-left w-[110px]">Direction</th>
                            <th className="px-3 py-2 text-left w-[140px]">Method</th>
                            <th className="px-3 py-2 text-left w-[120px]">Ref</th>
                            <th className="px-3 py-2 text-left">Link</th>
                            <th className="px-3 py-2 text-left w-[260px]">Note</th>
                            <th className="px-3 py-2 text-right w-[70px]">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="py-8 text-center text-gray-500">
                                    Không có dữ liệu trong tab này
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((p, idx) => {
                                const selectable = isRowSelectable(p);
                                const created = fmtDateTime(p.createdAt);
                                const paid = fmtDateTime(p.paidAt ?? null);

                                return (
                                    <tr key={p.id} className={cls("border-b hover:bg-gray-50", idx % 2 === 1 && "bg-gray-50/30")}>
                                        <td className="px-3 py-3 align-top">
                                            <input
                                                type="checkbox"
                                                disabled={!selectable}
                                                checked={selectedIds.includes(p.id)}
                                                onChange={(e) => {
                                                    const next = e.target.checked
                                                        ? [...selectedIds, p.id]
                                                        : selectedIds.filter((id) => id !== p.id);

                                                    setSelectedIds(next);
                                                    setShowBulkBar(next.length > 0);
                                                }}
                                            />
                                        </td>

                                        {/* CreatedAt (2 lines) */}
                                        <td className="px-3 py-3 align-top">
                                            <div className="leading-5">{created.time}</div>
                                            <div className="text-gray-600">{created.date}</div>
                                            {p.paidAt ? (
                                                <div className="mt-1 text-[11px] text-gray-500">
                                                    paid: {paid.time} {paid.date}
                                                </div>
                                            ) : null}
                                        </td>

                                        {/* Amount (primary) */}
                                        <td className="px-3 py-3 align-top">
                                            <div className="text-base font-semibold leading-5">{fmtMoney(p.amount)}</div>
                                            <div className="text-xs text-gray-600 font-medium">{p.currency ?? "VND"}</div>
                                        </td>

                                        {/* Purpose badge */}
                                        <td className="px-3 py-3 align-top">
                                            <PurposeBadge purpose={p.purpose ?? null} />
                                        </td>

                                        {/* Type badge */}
                                        <td className="px-3 py-3 align-top">
                                            <TypeBadge type={p.type ?? null} />
                                        </td>

                                        {/* Status badge */}
                                        <td className="px-3 py-3 align-top">
                                            <StatusBadge value={p.status} map={PAYMENT_STATUS_MAP} />
                                        </td>

                                        {/* Direction Dot */}
                                        <td className="px-3 py-3 align-top">
                                            <DirectionDot dir={p.direction ?? null} />
                                        </td>

                                        {/* Method */}
                                        <td className="px-3 py-3 align-top">
                                            <span className={cls("text-xs", !p.method && "text-gray-400")}>
                                                {p.method ?? "-"}
                                            </span>
                                        </td>

                                        {/* Ref */}
                                        <td className="px-3 py-3 align-top">
                                            {p.reference ? (
                                                <div className="font-mono text-[11px] truncate max-w-[110px]" title={p.reference}>
                                                    {p.reference}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* Link (Order/SR/Vendor/Shipment/Acq) */}
                                        <td className="px-3 py-3 align-top">
                                            <div className="space-y-1">
                                                {p.order_id ? (
                                                    <Link href={`/admin/orders/${p.order_id}`} className="block hover:underline">
                                                        <MonoId v={p.order_id} prefix="Order" />
                                                    </Link>
                                                ) : null}

                                                {p.service_request_id ? (
                                                    <Link
                                                        href={`/admin/services?open=${encodeURIComponent(p.service_request_id)}`}
                                                        className="block hover:underline"
                                                    >
                                                        <MonoId v={p.service_request_id} prefix="SR" />
                                                    </Link>
                                                ) : null}

                                                {p.vendor_id ? (
                                                    <Link href={`/admin/vendors/${p.vendor_id}`} className="block hover:underline">
                                                        <MonoId v={p.vendor_id} prefix="Vendor" />
                                                    </Link>
                                                ) : null}

                                                {p.shipment_id ? (
                                                    <Link href={`/admin/shipments/${p.shipment_id}`} className="block hover:underline">
                                                        <MonoId v={p.shipment_id} prefix="Shipment" />
                                                    </Link>
                                                ) : null}

                                                {p.acquisition_id ? (
                                                    <Link href={`/admin/acquisitions/${p.acquisition_id}`} className="block hover:underline">
                                                        <MonoId v={p.acquisition_id} prefix="Acquisition" />
                                                    </Link>
                                                ) : null}

                                                {!p.order_id && !p.service_request_id && !p.vendor_id && !p.shipment_id && !p.acquisition_id ? (
                                                    <span className="text-gray-400">-</span>
                                                ) : null}
                                            </div>
                                        </td>

                                        {/* Note */}
                                        <td className="px-3 py-3 align-top">
                                            {p.note ? (
                                                <div className="text-sm text-gray-700 line-clamp-2" title={p.note}>
                                                    {p.note}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* Action */}
                                        <td className="relative px-3 py-3 text-right align-top">
                                            <GenericActionMenu
                                                id={p.id}
                                                actions={[
                                                    {
                                                        label: "Xem chi tiết",
                                                        onClick: () => (window.location.href = `/admin/payments/${p.id}`),
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