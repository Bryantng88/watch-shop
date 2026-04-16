"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusBadge from "@/components/badges/StatusBadge";

import {
    ORDER_STATUS,
    ORDER_SOURCE,
    VERIFICATION_STATUS,
    RESERVE_TYPE,
} from "@/components/badges/StatusMaps";

type OrderDetailItem = {
    id: string;
    title: string;
    quantity: number;
    kind?: string | null;
    listPrice: number;
    unitPriceAgreed?: number | null;
    subtotal?: number | null;
    lineTotal?: number | null;
    img?: string | null;
    productId?: string | null;
    variantId?: string | null;
    productType?: string | null;
    serviceScope?: string | null;
    customerItemNote?: string | null;
    linkedOrderItemId?: string | null;
    linkedProductTitle?: string | null;
};

type OrderDetailData = {
    id: string;
    refNo?: string | null;
    status: string;
    source?: string | null;
    verificationStatus?: string | null;
    reserveType?: string | null;
    reserveUntil?: string | null;
    customerName?: string | null;
    shipPhone?: string | null;
    shipAddress?: string | null;
    shipWard?: string | null;
    shipDistrict?: string | null;
    shipCity?: string | null;
    paymentMethod?: string | null;
    depositRequired?: number | null;
    depositPaid?: number | null;
    hasShipment?: boolean | null;
    currency?: string | null;
    subtotal?: number | null;
    notes?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    items: OrderDetailItem[];
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function fmtMoney(value?: number | null, currency = "VND") {
    if (value == null) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(Number(value))} ${currency}`;
}

function fmtDate(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function renderServiceScope(scope?: string | null) {
    if (!scope) return "-";
    if (scope === "WITH_PURCHASE") return "Đi kèm sản phẩm";
    if (scope === "CUSTOMER_ITEM") return "Đồ khách mang tới";
    return scope;
}

function Panel({
    title,
    description,
    right,
    children,
    className,
}: {
    title: string;
    description?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cx("overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm", className)}>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4 sm:px-6">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mt-1 text-sm text-neutral-500">{description}</p>
                    ) : null}
                </div>
                {right}
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </section>
    );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

function Field({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 px-4 py-3">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">{label}</div>
            <div className={cx("mt-1 text-sm text-neutral-900", mono && "font-mono text-[13px]")}>{value}</div>
        </div>
    );
}

export default function OrderDetailClient({ data }: { data: OrderDetailData }) {
    const [posting, setPosting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const currency = data.currency || "VND";
    const fullAddress = useMemo(() => {
        const parts = [data.shipAddress, data.shipWard, data.shipDistrict, data.shipCity].filter(Boolean);
        return parts.length ? parts.join(", ") : "-";
    }, [data.shipAddress, data.shipWard, data.shipDistrict, data.shipCity]);

    const totals = useMemo(() => {
        const subtotal = Number(data.subtotal || 0);
        const depositRequired = Number(data.depositRequired || 0);
        const depositPaid = Number(data.depositPaid || 0);
        return {
            subtotal,
            depositRequired,
            depositPaid,
            remainingDeposit: Math.max(depositRequired - depositPaid, 0),
        };
    }, [data.subtotal, data.depositPaid, data.depositRequired]);

    const canPost = data.status === "DRAFT" || data.status === "RESERVED";
    const canVerify = data.source === "WEB" && data.verificationStatus === "PENDING";
    const canCancel = data.status !== "CANCELLED" && data.status !== "COMPLETED";

    async function runAction(url: string, setter: (v: boolean) => void, confirmText?: string) {
        if (confirmText && !window.confirm(confirmText)) return;
        setter(true);
        try {
            const res = await fetch(url, { method: "POST" });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Thao tác thất bại");
            }
            window.location.reload();
        } catch (error: any) {
            alert(error?.message || "Thao tác thất bại");
        } finally {
            setter(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 pt-6 lg:px-6">
            <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-6">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                            >
                                ← Danh sách đơn hàng
                            </Link>
                            <Link
                                href={`/admin/orders/${data.id}/edit`}
                                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                            >
                                Chỉnh sửa
                            </Link>
                        </div>

                        <div>
                            <div className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Chi tiết đơn hàng
                            </div>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-[30px]">
                                {data.refNo?.trim() ? data.refNo : "Đơn hàng chưa phát sinh mã"}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                                <span>Mã hệ thống:</span>
                                <span className="rounded-full bg-neutral-100 px-3 py-1 font-mono text-[13px] text-neutral-700">
                                    {data.id}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge value={data.status} map={ORDER_STATUS} />
                            {data.source ? <StatusBadge value={data.source} map={ORDER_SOURCE} /> : null}
                            {data.verificationStatus ? (
                                <StatusBadge value={data.verificationStatus} map={VERIFICATION_STATUS} />
                            ) : null}
                            <StatusBadge value={data.reserveType ?? "NONE"} map={RESERVE_TYPE} />
                        </div>
                    </div>

                    <div className="min-w-[260px] rounded-[24px] border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                            Tổng giá trị đơn
                        </div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                            {fmtMoney(totals.subtotal, currency)}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-3">
                                <div className="text-xs text-neutral-500">Tiền cọc yêu cầu</div>
                                <div className="mt-1 font-semibold text-neutral-900">
                                    {fmtMoney(totals.depositRequired, currency)}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-3">
                                <div className="text-xs text-neutral-500">Đã nhận cọc</div>
                                <div className="mt-1 font-semibold text-neutral-900">
                                    {fmtMoney(totals.depositPaid, currency)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                    <Panel title="Tổng quan đơn hàng" description="Thông tin trạng thái, nguồn tạo và thời điểm xử lý của đơn hàng.">
                        <InfoGrid>
                            <Field label="Ngày tạo" value={fmtDate(data.createdAt)} />
                            <Field label="Cập nhật lần cuối" value={fmtDate(data.updatedAt)} />
                            <Field label="Phương thức thanh toán" value={data.paymentMethod || "-"} />
                            <Field label="Hình thức giữ hàng" value={data.reserveType || "-"} />
                            <Field label="Hạn giữ hàng" value={fmtDate(data.reserveUntil)} />
                            <Field label="Có giao hàng" value={data.hasShipment ? "Có" : "Không"} />
                            <Field label="Nguồn đơn" value={data.source || "-"} />
                            <Field label="Xác minh" value={data.verificationStatus || "-"} />
                        </InfoGrid>
                    </Panel>

                    <Panel title="Khách hàng & giao nhận" description="Thông tin liên hệ và địa chỉ nhận hàng của khách.">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="space-y-4">
                                <Field label="Khách hàng" value={data.customerName || "-"} />
                                <Field label="Số điện thoại" value={data.shipPhone || "-"} />
                            </div>
                            <div className="space-y-4">
                                <Field label="Địa chỉ giao hàng" value={fullAddress} />
                            </div>
                        </div>
                    </Panel>

                    <Panel
                        title="Sản phẩm & dịch vụ"
                        description="Danh sách các dòng trong đơn hàng, bao gồm sản phẩm bán ra và dịch vụ đi kèm."
                        right={
                            <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-600">
                                {data.items.length} dòng
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            {data.items.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                                    Đơn hàng chưa có sản phẩm hoặc dịch vụ.
                                </div>
                            ) : (
                                data.items.map((item, index) => {
                                    const lineTotal = item.lineTotal ?? item.subtotal ?? (item.unitPriceAgreed ?? item.listPrice) * item.quantity;
                                    const isService = item.kind === "SERVICE";
                                    return (
                                        <div
                                            key={item.id}
                                            className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white"
                                        >
                                            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                                                <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                                                    {item.img ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={item.img}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                                                            {isService ? "SERVICE" : "ITEM"}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-3">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="inline-flex rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                                                                    {item.kind || "ITEM"}
                                                                </span>
                                                                <span className="text-xs text-neutral-400">Dòng #{index + 1}</span>
                                                            </div>
                                                            <div className="mt-2 text-base font-semibold text-neutral-900 sm:text-lg">
                                                                {item.title}
                                                            </div>
                                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
                                                                {item.productType ? <span>Phân loại: {item.productType}</span> : null}
                                                                {item.variantId ? <span className="font-mono text-[12px]">Variant: {item.variantId}</span> : null}
                                                            </div>
                                                        </div>

                                                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-right">
                                                            <div className="text-xs text-neutral-500">Thành tiền</div>
                                                            <div className="mt-1 text-base font-semibold text-neutral-950">
                                                                {fmtMoney(lineTotal, currency)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                                        <Field label="Số lượng" value={item.quantity} />
                                                        <Field label="Giá niêm yết" value={fmtMoney(item.listPrice, currency)} />
                                                        <Field
                                                            label="Giá chốt"
                                                            value={fmtMoney(item.unitPriceAgreed ?? item.listPrice, currency)}
                                                        />
                                                        <Field label="Line total" value={fmtMoney(lineTotal, currency)} />
                                                    </div>

                                                    {isService ? (
                                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                                            <Field label="Phạm vi dịch vụ" value={renderServiceScope(item.serviceScope)} />
                                                            <Field
                                                                label="Áp cho sản phẩm"
                                                                value={
                                                                    item.linkedProductTitle?.trim()
                                                                        ? item.linkedProductTitle
                                                                        : item.linkedOrderItemId || "-"
                                                                }
                                                                mono={!item.linkedProductTitle}
                                                            />
                                                            <div className="lg:col-span-2">
                                                                <Field label="Ghi chú đồ khách" value={item.customerItemNote?.trim() || "-"} />
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Panel>

                    <Panel title="Ghi chú nội bộ" description="Thông tin bổ sung, lưu ý giao dịch hoặc dặn dò liên quan tới đơn hàng.">
                        <div className="min-h-[120px] whitespace-pre-wrap rounded-[24px] border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm leading-6 text-neutral-800">
                            {data.notes?.trim() ? data.notes : "Chưa có ghi chú."}
                        </div>
                    </Panel>
                </div>

                <aside className="space-y-6 xl:sticky xl:top-4 xl:self-start">
                    <Panel title="Tổng hợp thanh toán" description="Theo dõi số tiền đơn hàng và tình trạng cọc.">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                                <span className="text-sm text-neutral-600">Tạm tính</span>
                                <span className="text-sm font-semibold text-neutral-950">
                                    {fmtMoney(totals.subtotal, currency)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                                <span className="text-sm text-neutral-600">Cọc yêu cầu</span>
                                <span className="text-sm font-semibold text-neutral-950">
                                    {fmtMoney(totals.depositRequired, currency)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                                <span className="text-sm text-neutral-600">Đã nhận cọc</span>
                                <span className="text-sm font-semibold text-neutral-950">
                                    {fmtMoney(totals.depositPaid, currency)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-neutral-900 bg-neutral-900 px-4 py-3 text-white">
                                <span className="text-sm text-white/75">Cọc còn thiếu</span>
                                <span className="text-sm font-semibold">
                                    {fmtMoney(totals.remainingDeposit, currency)}
                                </span>
                            </div>
                        </div>
                    </Panel>

                    <Panel title="Thao tác" description="Các hành động nhanh dành cho vận hành đơn hàng.">
                        <div className="space-y-3">
                            <button
                                type="button"
                                disabled={!canPost || posting}
                                onClick={() => runAction(`/api/admin/orders/${data.id}/post`, setPosting)}
                                className={cx(
                                    "w-full rounded-2xl px-4 py-3 text-sm font-medium transition",
                                    canPost && !posting
                                        ? "bg-neutral-900 text-white hover:bg-neutral-800"
                                        : "cursor-not-allowed bg-neutral-100 text-neutral-400"
                                )}
                            >
                                {posting ? "Đang duyệt..." : "Duyệt đơn"}
                            </button>

                            <button
                                type="button"
                                disabled={!canVerify || verifying}
                                onClick={() => runAction(`/api/admin/orders/${data.id}/verify`, setVerifying)}
                                className={cx(
                                    "w-full rounded-2xl border px-4 py-3 text-sm font-medium transition",
                                    canVerify && !verifying
                                        ? "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                                        : "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
                                )}
                            >
                                {verifying ? "Đang xác minh..." : "Verify đơn"}
                            </button>

                            <button
                                type="button"
                                disabled={!canCancel || cancelling}
                                onClick={() =>
                                    runAction(
                                        `/api/admin/orders/${data.id}/cancel`,
                                        setCancelling,
                                        "Bạn có chắc muốn hủy đơn hàng này?"
                                    )
                                }
                                className={cx(
                                    "w-full rounded-2xl border px-4 py-3 text-sm font-medium transition",
                                    canCancel && !cancelling
                                        ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                                        : "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
                                )}
                            >
                                {cancelling ? "Đang hủy..." : "Hủy đơn"}
                            </button>

                            <Link
                                href={`/admin/orders/${data.id}/edit`}
                                className="block w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                            >
                                Mở trang chỉnh sửa
                            </Link>
                        </div>
                    </Panel>
                </aside>
            </div>
        </div>
    );
}
