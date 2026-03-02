"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/badges/StatusBadge";
import GenericActionMenu from "../../__components/GenericActionMenu";

type PaymentItem = {
    id: string;
    method: string;
    amount: number;
    currency: string;
    paidAt: string;
    createdAt: string;

    direction: string | null;
    status: string;
    purpose: string;
    type: string;

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

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        next.set("pageSize", String(pageSize));
        return `/admin/payments?${next.toString()}`;
    };

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Payments</h1>
                <Link href="/admin" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                    ← Admin
                </Link>
            </div>

            {/* FILTER FORM */}
            <form action="/admin/payments" method="get" className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(rawSearchParams.q as string) ?? ""}
                        placeholder="id / reference / note / SR / Order..."
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Status</label>
                    <input
                        name="status"
                        defaultValue={(rawSearchParams.status as string) ?? ""}
                        placeholder="UNPAID / PAID..."
                        className="h-9 rounded border px-2 w-40"
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

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">PaidAt</th>
                            <th className="px-3 py-2 text-left">Amount</th>
                            <th className="px-3 py-2 text-left">Purpose</th>
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
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            items.map((r) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2">{fmtDate(r.paidAt)}</td>

                                    <td className="px-3 py-2">
                                        <div className="font-medium">
                                            {Number(r.amount).toLocaleString("vi-VN")} {r.currency}
                                        </div>
                                        <div className="text-xs text-gray-500">created: {fmtDate(r.createdAt)}</div>
                                    </td>

                                    <td className="px-3 py-2 font-mono text-xs">{r.purpose}</td>

                                    <td className="px-3 py-2">
                                        <StatusBadge value={r.status} map={{}} />
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
                                                <Link className="hover:underline" href={`/admin/service-requests/${r.service_request_id}`}>
                                                    {r.service_request_id}
                                                </Link>
                                            </div>
                                        ) : null}
                                        {r.acquisition_id ? <div>Acq: {r.acquisition_id}</div> : null}
                                        {r.shipment_id ? <div>Ship: {r.shipment_id}</div> : null}
                                        {r.vendor_id ? <div>Vendor: {r.vendor_id}</div> : null}
                                        {!r.order_id && !r.service_request_id && !r.acquisition_id && !r.shipment_id ? "-" : null}
                                    </td>

                                    <td className="px-3 py-2 max-w-[420px]">
                                        {r.note ? <div className="whitespace-pre-wrap">{r.note}</div> : <span className="text-gray-400">-</span>}
                                    </td>

                                    <td className="relative px-3 py-2 text-right">
                                        <GenericActionMenu
                                            id={r.id}
                                            actions={[
                                                {
                                                    label: "Xem JSON (API)",
                                                    onClick: () => window.open(`/api/admin/payments/list?q=${r.id}`, "_blank"),
                                                },
                                            ]}
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