"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, PackageCheck, RotateCcw, Truck, X } from "lucide-react";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
    Button,
    FieldLabel,
    Input,
    Select,
    Textarea,
    moneyPreview,
} from "@/domains/shared/ui/form/fields";
import { ShipmentStatusSignalIcon } from "@/domains/shared/ui/icons";
import { SHIPMENT_CARRIER_OPTIONS } from "@/domains/shipment/shared/shipment-carriers";

export type ShipmentManageOrder = {
    id: string;
    refNo?: string | null;
    status?: string | null;
    activeShipmentId?: string | null;
    shipmentStatus?: string | null;
    fulfillmentStatus?: string | null;
    hasShipment?: boolean | null;
    customerName?: string | null;
    customerPhone?: string | null;
    shipPhone?: string | null;
    paymentMethod?: string | null;
};

type ShipmentDetail = {
    id: string;
    refNo?: string | null;
    orderId: string;
    orderRefNo?: string | null;
    customerName?: string | null;
    shipPhone?: string | null;
    shipAddress?: string | null;
    shipCity?: string | null;
    shipDistrict?: string | null;
    shipWard?: string | null;
    carrier?: string | null;
    trackingCode?: string | null;
    shippingAmount?: number | string | null;
    shippingFeePayer?: string | null;
    shippingAmountPayer?: string | null;
    currency?: string | null;
    status?: string | null;
    notes?: string | null;
    order?: {
        id?: string | null;
        refNo?: string | null;
        status?: string | null;
        paymentMethod?: string | null;
    } | null;
};

type FormState = {
    shipPhone: string;
    shipAddress: string;
    shipCity: string;
    shipDistrict: string;
    shipWard: string;
    carrier: string;
    trackingCode: string;
    shippingAmount: string;
    payer: "BUSINESS" | "CUSTOMER";
    method: string;
    reference: string;
    note: string;
};

const PAYMENT_METHOD_OPTIONS = [
    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
    { value: "CASH", label: "Tiền mặt" },
    { value: "MOMO", label: "Momo" },
    { value: "PAYPAL", label: "PayPal" },
    { value: "CREDIT_CARD", label: "Thẻ" },
];

function parseAmount(value: string) {
    const n = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(value?: number | string | null, currency = "VND") {
    const amount = Number(value ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) return `0 ${currency}`;
    return `${new Intl.NumberFormat("vi-VN").format(amount)} ${currency}`;
}

function fullAddress(shipment?: ShipmentDetail | null) {
    return [
        shipment?.shipAddress,
        shipment?.shipWard,
        shipment?.shipDistrict,
        shipment?.shipCity,
    ]
        .filter(Boolean)
        .join(", ");
}

function normalizeStatus(value?: string | null) {
    return String(value ?? "").toUpperCase();
}

function canEditShipment(shipment?: ShipmentDetail | null) {
    return ["READY", "SHIPPED"].includes(normalizeStatus(shipment?.status));
}

function canUpdateFeeAndShip(shipment?: ShipmentDetail | null) {
    return ["READY", "SHIPPED"].includes(normalizeStatus(shipment?.status));
}

function canDeliver(shipment?: ShipmentDetail | null) {
    return normalizeStatus(shipment?.status) === "SHIPPED";
}

function canReturn(shipment?: ShipmentDetail | null) {
    return ["SHIPPED", "DELIVERED"].includes(normalizeStatus(shipment?.status));
}

function canReceiveReturn(shipment?: ShipmentDetail | null) {
    return normalizeStatus(shipment?.status) === "RETURNING";
}

function isSelfDeliveryCarrier(carrier?: string | null) {
    const key = normalizeStatus(carrier);
    return key === "SELF_DELIVERY" || key === "SELF";
}

function initialForm(): FormState {
    return {
        shipPhone: "",
        shipAddress: "",
        shipCity: "",
        shipDistrict: "",
        shipWard: "",
        carrier: "",
        trackingCode: "",
        shippingAmount: "",
        payer: "CUSTOMER",
        method: "BANK_TRANSFER",
        reference: "",
        note: "",
    };
}

export default function ShipmentManageModal({
    open,
    order,
    onClose,
    onUpdated,
}: {
    open: boolean;
    order: ShipmentManageOrder | null;
    onClose: () => void;
    onUpdated?: () => void;
}) {
    const notify = useNotify();
    const progress = useAppProgress();
    const dialog = useAppDialog();

    const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
    const [form, setForm] = useState<FormState>(() => initialForm());
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const shipmentId = order?.activeShipmentId ?? null;
    const amount = useMemo(() => parseAmount(form.shippingAmount), [form.shippingAmount]);
    const isSelfDelivery = isSelfDeliveryCarrier(form.carrier);
    const invalidShippingAmount = !isSelfDelivery && amount < 0;
    const currency = shipment?.currency ?? "VND";
    const payerLabel = form.payer === "CUSTOMER" ? "Khách trả - không tạo payment" : "Doanh nghiệp trả - tạo payment OUT";

    useEffect(() => {
        if (!open) return;

        setShipment(null);
        setForm(initialForm());

        if (!shipmentId) return;

        let mounted = true;
        setLoading(true);

        fetch(`/api/admin/shipments/${shipmentId}`)
            .then(async (res) => {
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json?.error || "Không thể tải shipment.");
                return json as ShipmentDetail;
            })
            .then((data) => {
                if (!mounted) return;
                const payer = String(data.shippingFeePayer ?? data.shippingAmountPayer ?? "CUSTOMER").toUpperCase();

                setShipment(data);
                setForm({
                    shipPhone: data.shipPhone ?? "",
                    shipAddress: data.shipAddress ?? "",
                    shipCity: data.shipCity ?? "",
                    shipDistrict: data.shipDistrict ?? "",
                    shipWard: data.shipWard ?? "",
                    carrier: data.carrier ?? "",
                    trackingCode: data.trackingCode ?? "",
                    shippingAmount: data.shippingAmount && Number(data.shippingAmount) > 0 ? String(Number(data.shippingAmount)) : "",
                    payer: payer === "BUSINESS" ? "BUSINESS" : "CUSTOMER",
                    method: "BANK_TRANSFER",
                    reference: "",
                    note: data.notes ?? "",
                });
            })
            .catch((error: any) => {
                if (!mounted) return;
                notify.error({
                    title: "Không thể tải shipment",
                    message: error?.message || "Có lỗi xảy ra.",
                });
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [open, shipmentId, notify]);

    if (!open || !order) return null;

    function patch(next: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...next }));
    }

    async function mutate(input: {
        url: string;
        method?: "POST" | "PATCH";
        body?: unknown;
        progressTitle: string;
        progressMessage?: string;
        successTitle: string;
        successMessage?: string;
        errorTitle: string;
        closeAfter?: boolean;
    }) {
        setSubmitting(true);
        progress.show({
            title: input.progressTitle,
            message: input.progressMessage ?? "Hệ thống đang xử lý giao hàng.",
        });

        try {
            const res = await fetch(input.url, {
                method: input.method ?? "POST",
                headers: { "Content-Type": "application/json" },
                body: input.body ? JSON.stringify(input.body) : undefined,
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Không thể cập nhật shipment.");

            notify.success({
                title: input.successTitle,
                message: input.successMessage || json?.message || "Thao tác đã hoàn tất.",
            });

            onUpdated?.();
            if (input.closeAfter) onClose();
            else if (shipmentId) {
                const fresh = await fetch(`/api/admin/shipments/${shipmentId}`).then((r) => r.json());
                setShipment(fresh);
            }
        } catch (error: any) {
            notify.error({
                title: input.errorTitle,
                message: error?.message || "Có lỗi xảy ra.",
            });
            throw error;
        } finally {
            progress.hide();
            setSubmitting(false);
        }
    }

    function saveShipmentInfo() {
        if (!shipmentId) return;

        return mutate({
            url: `/api/admin/shipments/${shipmentId}`,
            method: "PATCH",
            body: {
                shipPhone: form.shipPhone.trim() || null,
                shipAddress: form.shipAddress.trim() || null,
                shipCity: form.shipCity.trim() || null,
                shipDistrict: form.shipDistrict.trim() || null,
                shipWard: form.shipWard.trim() || null,
                carrier: form.carrier.trim() || null,
                trackingCode: form.trackingCode.trim() || null,
                notes: form.note.trim() || null,
            },
            progressTitle: "Đang lưu shipment",
            successTitle: "Đã lưu shipment",
            successMessage: "Thông tin giao hàng đã được cập nhật.",
            errorTitle: "Không thể lưu shipment",
        });
    }

    function updateFeeAndShip() {
        if (!shipmentId) return;
        if (invalidShippingAmount) return;

        return mutate({
            url: `/api/admin/shipments/${shipmentId}/fee`,
            body: {
                amount: Math.max(0, amount),
                payer: form.payer,
                method: form.method,
                carrier: form.carrier.trim() || null,
                trackingCode: form.trackingCode.trim() || null,
                reference: form.reference.trim() || null,
                note: form.note.trim() || null,
            },
            progressTitle: "Đang cập nhật vận chuyển",
            successTitle: "Đã cập nhật vận chuyển",
            successMessage:
                form.payer === "CUSTOMER"
                    ? "Shipment đã cập nhật. Khách trả phí nên không tạo payment chi phí."
                    : "Shipment đã cập nhật và payment chi phí vận chuyển đã được ghi nhận.",
            errorTitle: "Không thể cập nhật vận chuyển",
        });
    }

    async function markDelivered() {
        if (!shipmentId || !shipment) return;

        const cod = String(order.paymentMethod ?? shipment.order?.paymentMethod ?? "").toUpperCase() === "COD";
        const ok = await dialog.confirm({
            tone: "success",
            title: cod ? "Xác nhận đã giao COD?" : "Xác nhận đã giao hàng?",
            message: cod
                ? "Shipment sẽ chuyển sang Đã giao. Payment COD sẽ ở trạng thái đã thu bởi đơn vị vận chuyển/chờ đối soát."
                : "Shipment sẽ chuyển sang Đã giao. Order sẽ được đồng bộ lại trạng thái vận hành.",
            confirmText: cod ? "Đã giao COD" : "Đã giao",
            cancelText: "Hủy",
        });

        if (!ok) return;

        return mutate({
            url: `/api/admin/shipments/${shipmentId}/deliver`,
            body: { note: form.note.trim() || null },
            progressTitle: "Đang hoàn tất shipment",
            successTitle: "Đã hoàn tất shipment",
            successMessage: "Shipment đã được đánh dấu đã giao.",
            errorTitle: "Không thể hoàn tất shipment",
            closeAfter: true,
        });
    }

    async function markReturning() {
        if (!shipmentId) return;

        const ok = await dialog.confirm({
            tone: "danger",
            title: "Chuyển shipment sang đang hoàn?",
            message: "Shipment sẽ chuyển sang Đang hoàn. Order và watch vẫn được giữ cho đến khi nhận lại hàng.",
            confirmText: "Chuyển đang hoàn",
            cancelText: "Hủy",
        });

        if (!ok) return;

        return mutate({
            url: `/api/admin/shipments/${shipmentId}/return`,
            body: { note: form.note.trim() || null },
            progressTitle: "Đang cập nhật hoàn hàng",
            successTitle: "Đã chuyển shipment sang đang hoàn",
            errorTitle: "Không thể chuyển hoàn hàng",
            closeAfter: true,
        });
    }

    function receiveReturn() {
        if (!shipmentId) return;

        return mutate({
            url: `/api/admin/shipments/${shipmentId}/receive-return`,
            body: {
                amount: Math.max(0, amount),
                method: form.method,
                reference: form.reference.trim() || null,
                note: form.note.trim() || null,
            },
            progressTitle: "Đang nhận hàng hoàn",
            successTitle: "Đã nhận hàng hoàn",
            successMessage: "Shipment đã kết thúc vòng đời hoàn trả.",
            errorTitle: "Không thể nhận hàng hoàn",
            closeAfter: true,
        });
    }

    const editable = canEditShipment(shipment);
    const canFee = canUpdateFeeAndShip(shipment);
    const canDone = canDeliver(shipment);
    const canReturning = canReturn(shipment);
    const canReceive = canReceiveReturn(shipment);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                            Shipment domain
                        </div>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                            Quản lý giao hàng
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {order.refNo || shipment?.orderRefNo || shipment?.order?.refNo || order.id}
                            {order.customerName ? ` · ${order.customerName}` : ""}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        disabled={submitting}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!shipmentId ? (
                    <div className="px-6 py-8">
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
                            Order này chưa có active shipment để xử lý. Nếu order đã post mà vẫn thiếu shipment,
                            cần rà lại flow post/create shipment ở server.
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex min-h-[320px] items-center justify-center gap-3 text-sm font-medium text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang tải shipment...
                    </div>
                ) : !shipment ? (
                    <div className="px-6 py-8">
                        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
                            Không tìm thấy shipment hoặc shipment đã bị xóa.
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 border-b border-slate-100 px-6 py-5 md:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Shipment</div>
                                <div className="mt-1 font-semibold text-slate-950">{shipment.refNo || shipment.id}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Trạng thái</div>
                                <div className="mt-2"><ShipmentStatusSignalIcon status={shipment.status} /></div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Phí ship</div>
                                <div className="mt-1 font-semibold text-slate-950">{formatMoney(shipment.shippingAmount, currency)}</div>
                                <div className="mt-1 text-xs text-slate-500">{payerLabel}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Tracking</div>
                                <div className="mt-1 truncate font-semibold text-slate-950">{shipment.trackingCode || "Chưa có"}</div>
                            </div>
                        </div>

                        <div className="grid flex-1 gap-0 overflow-y-auto md:grid-cols-[1.35fr_0.9fr]">
                            <div className="space-y-5 px-6 py-5">
                                <section>
                                    <div className="mb-3 flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-slate-400" />
                                        <h3 className="text-sm font-semibold text-slate-950">Thông tin vận chuyển</h3>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <FieldLabel>Số điện thoại nhận hàng</FieldLabel>
                                            <Input disabled={!editable || submitting} value={form.shipPhone} onChange={(event) => patch({ shipPhone: event.target.value })} />
                                        </div>
                                        <div>
                                            <FieldLabel>Tỉnh / thành</FieldLabel>
                                            <Input disabled={!editable || submitting} value={form.shipCity} onChange={(event) => patch({ shipCity: event.target.value })} />
                                        </div>
                                        <div>
                                            <FieldLabel>Quận / huyện</FieldLabel>
                                            <Input disabled={!editable || submitting} value={form.shipDistrict} onChange={(event) => patch({ shipDistrict: event.target.value })} />
                                        </div>
                                        <div>
                                            <FieldLabel>Phường / xã</FieldLabel>
                                            <Input disabled={!editable || submitting} value={form.shipWard} onChange={(event) => patch({ shipWard: event.target.value })} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <FieldLabel>Địa chỉ</FieldLabel>
                                            <Input disabled={!editable || submitting} value={form.shipAddress} onChange={(event) => patch({ shipAddress: event.target.value })} />
                                            <div className="mt-2 text-xs text-slate-400">{fullAddress(shipment) || "Chưa có địa chỉ đầy đủ"}</div>
                                        </div>
                                        <div>
                                            <FieldLabel>Đơn vị vận chuyển</FieldLabel>
                                            <Select
                                                disabled={!editable || submitting}
                                                value={form.carrier}
                                                onChange={(event) => patch({ carrier: event.target.value })}
                                                options={[{ value: "", label: "Chọn đơn vị vận chuyển" }, ...SHIPMENT_CARRIER_OPTIONS]}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Mã vận đơn</FieldLabel>
                                            <Input disabled={!editable || submitting} value={form.trackingCode} onChange={(event) => patch({ trackingCode: event.target.value })} placeholder="Tracking code" />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="mb-3 flex items-center gap-2">
                                        <PackageCheck className="h-4 w-4 text-slate-400" />
                                        <h3 className="text-sm font-semibold text-slate-950">Phí ship & payment vận chuyển</h3>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <FieldLabel>Phí ship</FieldLabel>
                                            <Input disabled={!canFee || submitting} value={form.shippingAmount} onChange={(event) => patch({ shippingAmount: event.target.value })} placeholder={isSelfDelivery ? "Có thể nhập 0" : "Ví dụ: 50000"} />
                                            <div className="mt-2 text-xs font-semibold text-slate-500">
                                                {amount > 0 ? moneyPreview(form.shippingAmount) : "0 VND"}
                                            </div>
                                        </div>
                                        <div>
                                            <FieldLabel>Người chịu phí ship</FieldLabel>
                                            <Select
                                                disabled={!canFee || submitting}
                                                value={form.payer}
                                                onChange={(event) => patch({ payer: event.target.value as "BUSINESS" | "CUSTOMER" })}
                                                options={[
                                                    { value: "CUSTOMER", label: "Khách hàng trả - không tạo payment" },
                                                    { value: "BUSINESS", label: "Doanh nghiệp trả - tạo payment OUT" },
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Phương thức trả phí</FieldLabel>
                                            <Select disabled={!canFee || submitting || form.payer === "CUSTOMER"} value={form.method} onChange={(event) => patch({ method: event.target.value })} options={PAYMENT_METHOD_OPTIONS} />
                                        </div>
                                        <div>
                                            <FieldLabel>Mã tham chiếu payment</FieldLabel>
                                            <Input disabled={!canFee || submitting || form.payer === "CUSTOMER"} value={form.reference} onChange={(event) => patch({ reference: event.target.value })} placeholder="Mã giao dịch / biên nhận" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <FieldLabel>Ghi chú shipment</FieldLabel>
                                            <Textarea disabled={submitting} value={form.note} onChange={(event) => patch({ note: event.target.value })} placeholder="Ghi chú nội bộ" />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <aside className="space-y-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5 md:border-l md:border-t-0">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="text-sm font-semibold text-slate-950">Luồng xử lý</div>
                                    <div className="mt-3 space-y-2 text-xs text-slate-500">
                                        <div>1. Lưu thông tin vận chuyển nếu cần chỉnh địa chỉ/tracking.</div>
                                        <div>2. Cập nhật phí ship & chuyển shipment sang đang giao.</div>
                                        <div>3. Hoàn tất shipment khi giao thành công.</div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-5 text-blue-700">
                                    Nếu khách hàng trả phí ship, hệ thống chỉ lưu phí vào shipment và không tạo payment chi phí. Nếu doanh nghiệp trả, hệ thống tạo payment OUT loại shipment cost.
                                </div>

                                <div className="space-y-2">
                                    <Button type="button" variant="outline" className="w-full justify-center" disabled={!editable || submitting} onClick={saveShipmentInfo}>
                                        Lưu thông tin shipment
                                    </Button>

                                    <Button type="button" className="w-full justify-center" disabled={!canFee || submitting || invalidShippingAmount} onClick={updateFeeAndShip}>
                                        Cập nhật phí ship & giao hàng
                                    </Button>

                                    <Button type="button" className="w-full justify-center bg-emerald-600 hover:bg-emerald-700" disabled={!canDone || submitting} onClick={markDelivered}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Hoàn tất shipment
                                    </Button>

                                    <Button type="button" variant="outline" className="w-full justify-center text-rose-600 hover:bg-rose-50" disabled={!canReturning || submitting} onClick={markReturning}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Chuyển đang hoàn
                                    </Button>

                                    <Button type="button" variant="outline" className="w-full justify-center" disabled={!canReceive || submitting} onClick={receiveReturn}>
                                        Nhận hàng hoàn
                                    </Button>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
