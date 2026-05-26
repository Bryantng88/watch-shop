"use client";

import PaymentWorkspace, {
    type PaymentOwner,
    type PaymentListItem,
} from "./PaymentWorkspace";

type LegacyOrder = {
    id: string;
    refNo?: string | null;
    customerName?: string | null;
    totalAmount?: number | null;
    subtotal?: number | null;
    shippingAmount?: number | null;
    remainingAmount?: number | null;
    codAmount?: number | null;
};

type Props = {
    open: boolean;
    order?: LegacyOrder | null;
    submitting?: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    onCreatePayment: (payload: {
        ownerType: "ORDER";
        ownerId: string;
        amount: number;
        method: string;
        note?: string | null;
        markPaidNow: boolean;
    }) => void | Promise<void>;
    onCompletePayment: (payload: {
        paymentId: string;
        reference?: string | null;
        note?: string | null;
    }) => void | Promise<void>;
    onCancelPayment?: (payload: {
        paymentId: string;
        note?: string | null;
    }) => void | Promise<void>;
};

function toNumber(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function orderTotal(order: LegacyOrder) {
    const total = toNumber(order.totalAmount);
    if (total > 0) return total;
    return toNumber(order.subtotal) + toNumber(order.shippingAmount);
}

export default function PaymentManageModal({
    open,
    order,
    submitting,
    onClose,
    onUpdated,
    onCreatePayment,
    onCompletePayment,
    onCancelPayment,
}: Props) {
    if (!order) return null;

    const owner: PaymentOwner = {
        type: "ORDER",
        id: order.id,
        code: order.refNo,
        title: order.customerName,
        direction: "IN",
        totalAmount: orderTotal(order),
        remainingAmount: order.remainingAmount ?? null,
        codAmount: order.codAmount ?? 0,
        listEndpoint: `/api/admin/orders/${order.id}/payment`,
    };

    return (
        <PaymentWorkspace
            open={open}
            owner={owner}
            submitting={submitting}
            onClose={onClose}
            onUpdated={onUpdated}
            onCreatePayment={onCreatePayment as any}
            onCompletePayment={onCompletePayment}
            onCancelPayment={onCancelPayment}
        />
    );
}

export type { PaymentListItem };