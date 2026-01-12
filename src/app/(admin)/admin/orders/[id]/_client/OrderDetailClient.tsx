"use client";

import Link from "next/link";
import { useMemo } from "react";
import { StatusBadge } from "@/components/badges/StatusBadge";
import {
    ORDER_STATUS,
    ORDER_SOURCE,
    VERIFICATION_STATUS,
    RESERVE_TYPE,
} from "@/components/badges/StatusMaps";

type OrderDetailItem = {
    id: string;
    title: string;
    kind?: string | null; // PRODUCT | SERVICE...
    quantity: number;
    listPrice: number;
    lineTotal: number;
};

type OrderDetailData = {
    id: string;
    refNo: string | null;

    status: string;
    source: string;
    verificationStatus: string;
    reserveType: string | null;

    customerName: string | null;
    shipPhone: string | null;

    shipAddress?: string | null;
    shipWard?: string | null;
    shipDistrict?: string | null;
    shipCity?: string | null;

    paymentMethod?: string | null;
    depositRequired?: number | null;

    currency: string;
    subtotal: number;

    createdAt: string;
    updatedAt: string;

    notes?: string | null;

    items: OrderDetailItem[];
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

function Section({
    title,
    children,
    right,
}: {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {right}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-sm text-gray-900">{value}</div>
        </div>
    );
}

export default function OrderDetailClient({ data }: { data: OrderDetailData }) {
    const fullAddress = useMemo(() => {
        const parts = [
            data.shipAddress,
            data.shipWard,
            data.shipDistrict,
            data.shipCity,
        ].filter(Boolean);
        return parts.length ? parts.join(", ") : "-";
    }, [data]);

    const canPost = data.status === "DRAFT" || data.status === "RESERVED";
    const canVerify = data.source === "WEB" && data.verificationStatus === "PENDING";
    const canCancel = data.status !== "CANCELLED";

    return (
        <div className="space-y-4">
            {/* Top bar */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">Chi tiết đơn hàng</h1>
                    <div className="text-xs text-gray-500">
                        ID: <span className="font-mono">{data.id}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge value={data.status} map={ORDER_STATUS} />
                        <StatusBadge value={data.source} map={ORDER_SOURCE} />
                        <StatusBadge value={data.verificationStatus} map={VERIFICATION_STATUS} />
                        <StatusBadge value={data.reserveType ?? "NONE"} map={RESERVE_TYPE} />
                    </div>
                </div>

                <Link
                    href="/admin/orders"
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    ← Quay lại danh sách
                </Link>
            </div>

            {/* 2 columns */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* LEFT */}
                <div className="lg:col-span-8 space-y-4">
                    <Section
                        title="Tóm tắt"
                        right={
                            <div className="text-sm text-gray-600">
                                RefNo: <b>{data.refNo ?? "-"}</b>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Tạo lúc" value={fmtDate(data.createdAt)} />
                            <Field label="Cập nhật" value={fmtDate(data.updatedAt)} />
                            <Field label="Phương thức thanh toán" value={data.paymentMethod ?? "-"} />
                            <Field label="Tiền cọc" value={fmtMoney(data.depositRequired ?? 0, data.currency)} />
                        </div>
                    </Section>

                    <Section title="Khách hàng & giao hàng">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-4">
                                <Field label="Tên khách" value={data.customerName ?? "-"} />
                                <Field label="Số điện thoại" value={data.shipPhone ?? "-"} />
                            </div>
                            <div className="space-y-4">
                                <Field label="Địa chỉ" value={fullAddress} />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Danh sách sản phẩm"
                        right={
                            <div className="text-sm text-gray-600">
                                {data.items.length} dòng • Tạm tính:{" "}
                                <b>{fmtMoney(data.subtotal, data.currency)}</b>
                            </div>
                        }
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Tên</th>
                                        <th className="px-3 py-2 text-left">Loại</th>
                                        <th className="px-3 py-2 text-right">SL</th>
                                        <th className="px-3 py-2 text-right">Đơn giá</th>
                                        <th className="px-3 py-2 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((it) => (
                                        <tr key={it.id} className="border-b">
                                            <td className="px-3 py-2 font-medium">{it.title}</td>
                                            <td className="px-3 py-2 text-gray-600">{it.kind ?? "-"}</td>
                                            <td className="px-3 py-2 text-right">{it.quantity}</td>
                                            <td className="px-3 py-2 text-right">
                                                {fmtMoney(it.listPrice, data.currency)}
                                            </td>
                                            <td className="px-3 py-2 text-right font-medium">
                                                {fmtMoney(it.lineTotal, data.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <div className="w-full max-w-sm rounded-lg border bg-gray-50 p-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span className="font-semibold">
                                        {fmtMoney(data.subtotal, data.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Ghi chú">
                        <div className="text-sm text-gray-800 whitespace-pre-wrap">
                            {data.notes?.trim() ? data.notes : "-"}
                        </div>
                    </Section>
                </div>

                {/* RIGHT (sticky sidebar) */}
                <div className="lg:col-span-4">
                    <div className="space-y-4 lg:sticky lg:top-4">
                        <div className="rounded-lg border bg-white p-4">
                            <div className="text-xs text-gray-500">Tổng tiền</div>
                            <div className="mt-1 text-2xl font-semibold">
                                {fmtMoney(data.subtotal, data.currency)}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                <div className="rounded-md bg-gray-50 p-2">
                                    <div className="text-xs text-gray-500">Trạng thái</div>
                                    <div className="mt-1">
                                        <StatusBadge value={data.status} map={ORDER_STATUS} />
                                    </div>
                                </div>
                                <div className="rounded-md bg-gray-50 p-2">
                                    <div className="text-xs text-gray-500">Xác minh</div>
                                    <div className="mt-1">
                                        <StatusBadge value={data.verificationStatus} map={VERIFICATION_STATUS} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-4 space-y-2">
                            <div className="text-sm font-semibold">Hành động</div>

                            <button
                                disabled={!canPost}
                                className={cls(
                                    "w-full rounded-md px-3 py-2 text-sm font-medium",
                                    canPost ? "bg-black text-white hover:bg-neutral-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                                onClick={async () => {
                                    await fetch(`/api/admin/orders/${data.id}/bulk-post`, { method: "POST" });
                                    location.reload();
                                }}
                            >
                                Duyệt (POST)
                            </button>

                            <button
                                disabled={!canVerify}
                                className={cls(
                                    "w-full rounded-md border px-3 py-2 text-sm font-medium",
                                    canVerify ? "hover:bg-gray-50" : "bg-gray-50 text-gray-400 cursor-not-allowed"
                                )}
                                onClick={async () => {
                                    await fetch(`/api/admin/orders/${data.id}/verify`, { method: "POST" });
                                    location.reload();
                                }}
                            >
                                Verify
                            </button>

                            <button
                                disabled={!canCancel}
                                className={cls(
                                    "w-full rounded-md border px-3 py-2 text-sm font-medium text-red-600",
                                    canCancel ? "hover:bg-red-50" : "bg-gray-50 text-gray-400 cursor-not-allowed"
                                )}
                                onClick={async () => {
                                    if (!confirm("Bạn có chắc muốn hủy đơn?")) return;
                                    await fetch(`/api/admin/orders/${data.id}/cancel`, { method: "POST" });
                                    location.reload();
                                }}
                            >
                                Hủy đơn
                            </button>

                            <Link
                                href={`/admin/orders/${data.id}/edit`}
                                className="block w-full rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-gray-50"
                            >
                                Sửa (nếu có)
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
