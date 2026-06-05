import {
    OrderStatus,
    PaymentDirection,
    PaymentMethod,
    PaymentPurpose,
    PaymentStatus,
    PaymentType,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { syncWatchInventoryFromOrderId } from "@/domains/order/server/order-watch-sync.service";
import type {
    CreatePaymentInput,
    PaymentListItem,
    PaymentOwnerType,
    PaymentSummary,
} from "../shared";
import {
    assertPaymentStatusCollectedExists,
    buildPaymentRef,
    money,
    toNumber,
    toPlain,
    type Tx,
} from "./payment.utils";

const COLLECTED = assertPaymentStatusCollectedExists();

const ORDER_PAYMENT_PURPOSES = [
    PaymentPurpose.ORDER_DEPOSIT,
    PaymentPurpose.ORDER_REMAIN,
    PaymentPurpose.ORDER_FULL,
] as const;

const SERVICE_PAYMENT_PURPOSES = [
    PaymentPurpose.SERVICE_REQUEST,
    PaymentPurpose.MAINTENANCE_COST,
    PaymentPurpose.SERVICE_FEE,
] as const;

function paymentScopeWhere(ownerType: PaymentOwnerType, ownerId: string) {
    const base = ownerWhere(ownerType, ownerId);

    if (ownerType === "ORDER") {
        return {
            ...base,
            type: PaymentType.ORDER,
            purpose: { in: ORDER_PAYMENT_PURPOSES as any },
        };
    }

    if (ownerType === "ACQUISITION") {
        return {
            ...base,
            type: PaymentType.ACQUISITION,
        };
    }

    if (ownerType === "SERVICE") {
        return {
            ...base,
            type: PaymentType.SERVICE,
            purpose: { in: SERVICE_PAYMENT_PURPOSES as any },
        };
    }

    return base;
}

function normalizePaymentMethod(
    value: unknown,
    fallback: PaymentMethod = PaymentMethod.BANK_TRANSFER,
): PaymentMethod {
    const raw = String(value ?? "").trim().toUpperCase();
    if (raw === "CASH") return PaymentMethod.CASH;
    if (raw === "COD") return PaymentMethod.COD;
    if (raw === "BANK_TRANSFER") return PaymentMethod.BANK_TRANSFER;
    return fallback;
}

function activePaymentStatuses() {
    return [PaymentStatus.UNPAID, COLLECTED, PaymentStatus.PAID] as any;
}

function ownerWhere(ownerType: PaymentOwnerType, ownerId: string) {
    if (ownerType === "ORDER") return { order_id: ownerId };
    if (ownerType === "ACQUISITION") return { acquisition_id: ownerId };
    if (ownerType === "SERVICE") return { service_request_id: ownerId };
    if (ownerType === "SHIPMENT") return { shipment_id: ownerId };

    throw new Error("Payment owner không hợp lệ.");
}

function resolvePaymentOwner(payment: any): {
    ownerType: PaymentOwnerType;
    ownerId: string;
} {
    if (payment.order_id) return { ownerType: "ORDER", ownerId: payment.order_id };
    if (payment.acquisition_id) return { ownerType: "ACQUISITION", ownerId: payment.acquisition_id };
    if (payment.service_request_id) return { ownerType: "SERVICE", ownerId: payment.service_request_id };
    if (payment.shipment_id) return { ownerType: "SHIPMENT", ownerId: payment.shipment_id };

    throw new Error("Payment chưa có owner.");
}

async function getPaymentOwnerSeedTx(
    tx: Tx,
    ownerType: PaymentOwnerType,
    ownerId: string,
) {
    if (ownerType === "ORDER") {
        const order = await tx.order.findUnique({
            where: { id: ownerId },
            select: {
                id: true,
                subtotal: true,
                shippingAmount: true,
                status: true,
                paymentMethod: true,
                depositRequired: true,
            },
        });

        if (!order) throw new Error("Order không tồn tại.");

        const totalDue = toNumber(order.subtotal);
        const depositAmount = Math.min(
            Math.max(0, toNumber(order.depositRequired)),
            totalDue,
        );

        return {
            ownerType,
            ownerId: order.id,
            totalDue,
            depositAmount,
            direction: PaymentDirection.IN,
            defaultMethod: normalizePaymentMethod(order.paymentMethod, PaymentMethod.BANK_TRANSFER),
            status: String(order.status ?? ""),
        };
    }

    if (ownerType === "ACQUISITION") {
        const acquisition = await tx.acquisition.findUnique({
            where: { id: ownerId },
            select: {
                id: true,
                totalAmount: true,
                accquisitionStt: true,
            },
        });

        if (!acquisition) throw new Error("Phiếu nhập không tồn tại.");

        return {
            ownerType,
            ownerId: acquisition.id,
            totalDue: toNumber(acquisition.totalAmount),
            depositAmount: 0,
            direction: PaymentDirection.OUT,
            defaultMethod: PaymentMethod.BANK_TRANSFER,
            status: String(acquisition.accquisitionStt ?? ""),
        };
    }

    if (ownerType === "SERVICE") {
        const serviceRequest = await tx.serviceRequest.findUnique({
            where: { id: ownerId },
            select: {
                id: true,
                status: true,
                billable: true,
                technicalIssue: {
                    select: {
                        executionStatus: true,
                        actualCost: true,
                        estimatedCost: true,
                    },
                },
            },
        });

        if (!serviceRequest) throw new Error("Service request không tồn tại.");

        const billable = serviceRequest.billable !== false;
        const activeIssues = (serviceRequest.technicalIssue ?? []).filter((issue: any) => {
            const status = String(issue.executionStatus ?? "").toUpperCase();
            return status !== "CANCELED" && status !== "CANCELLED";
        });

        const actualTotal = activeIssues.reduce(
            (sum: number, issue: any) => sum + toNumber(issue.actualCost),
            0,
        );
        const estimatedTotal = activeIssues.reduce(
            (sum: number, issue: any) => sum + toNumber(issue.estimatedCost),
            0,
        );

        return {
            ownerType,
            ownerId: serviceRequest.id,
            totalDue: billable ? (actualTotal > 0 ? actualTotal : estimatedTotal) : 0,
            depositAmount: 0,
            direction: PaymentDirection.IN,
            defaultMethod: PaymentMethod.BANK_TRANSFER,
            status: String(serviceRequest.status ?? ""),
        };
    }

    throw new Error(`Payment owner ${ownerType} chưa được hỗ trợ.`);
}

async function getPaymentExposureTx(
    tx: Tx,
    ownerType: PaymentOwnerType,
    ownerId: string,
) {
    const seed = await getPaymentOwnerSeedTx(tx, ownerType, ownerId);

    const aggregate = await tx.payment.aggregate({
        where: {
            ...paymentScopeWhere(ownerType, ownerId),
            direction: seed.direction,
            status: { in: activePaymentStatuses() },
        } as any,
        _sum: { amount: true },
    });

    const activeTotal = toNumber(aggregate._sum.amount);

    return {
        ...seed,
        activeTotal,
        availableToCreate: Math.max(0, seed.totalDue - activeTotal),
    };
}

export async function getPaymentSummaryTx(
    tx: Tx,
    ownerType: PaymentOwnerType,
    ownerId: string,
): Promise<PaymentSummary> {
    const seed = await getPaymentOwnerSeedTx(tx, ownerType, ownerId);

    const [paid, collected, unpaid] = await Promise.all([
        tx.payment.aggregate({
            where: {
                ...paymentScopeWhere(ownerType, ownerId),
                direction: seed.direction,
                status: PaymentStatus.PAID,
            } as any,
            _sum: { amount: true },
        }),
        tx.payment.aggregate({
            where: {
                ...paymentScopeWhere(ownerType, ownerId),
                direction: seed.direction,
                status: COLLECTED,
            } as any,
            _sum: { amount: true },
        }),
        tx.payment.aggregate({
            where: {
                ...paymentScopeWhere(ownerType, ownerId),
                direction: seed.direction,
                status: PaymentStatus.UNPAID,
            } as any,
            _sum: { amount: true },
        }),
    ]);

    const paidTotal = toNumber(paid._sum.amount);
    const collectedTotal = toNumber(collected._sum.amount);
    const unpaidTotal = toNumber(unpaid._sum.amount);

    return {
        totalDue: seed.totalDue,
        paidTotal,
        collectedTotal,
        unpaidTotal,
        remaining: Math.max(0, seed.totalDue - paidTotal),
        depositRequired: seed.depositAmount,
        depositPaid: seed.depositAmount > 0 ? Math.min(seed.depositAmount, paidTotal) : 0,
    };
}

export async function listPaymentsTx(
    tx: Tx,
    ownerType: PaymentOwnerType,
    ownerId: string,
): Promise<PaymentListItem[]> {
    const rows = await tx.payment.findMany({
        where: paymentScopeWhere(ownerType, ownerId) as any,
        orderBy: [{ createdAt: "asc" }],
    });

    return rows.map((row: any) => {
        const resolvedOwner = resolvePaymentOwner(row);

        return {
            id: row.id,
            refNo: row.refNo ?? null,
            ownerType: resolvedOwner.ownerType,
            ownerId: resolvedOwner.ownerId,
            type: row.type,
            direction: row.direction,
            purpose: row.purpose ?? null,
            method: row.method ?? null,
            status: row.status,
            amount: toNumber(row.amount),
            currency: row.currency ?? "VND",
            paidAt: row.paidAt ?? null,
            reference: row.reference ?? null,
            note: row.note ?? null,
            createdAt: row.createdAt ?? null,
            updatedAt: row.updatedAt ?? null,
        };
    });
}

async function createPaymentRowTx(
    tx: Tx,
    input: {
        ownerType: PaymentOwnerType;
        ownerId: string;
        amount: number;
        direction: PaymentDirection;
        type: PaymentType | string;
        purpose: PaymentPurpose | string;
        method: PaymentMethod;
        note?: string | null;
        status?: PaymentStatus | string;
    },
) {
    if (input.amount <= 0) return null;

    return tx.payment.create({
        data: {
            refNo: await buildPaymentRef(tx),
            ...ownerWhere(input.ownerType, input.ownerId),
            type: input.type as any,
            direction: input.direction,
            purpose: input.purpose as any,
            method: input.method,
            amount: money(input.amount),
            currency: "VND",
            status: (input.status ?? PaymentStatus.UNPAID) as any,
            paidAt: null,
            note: input.note ?? null,
        } as any,
    });
}

export async function createInitialPaymentForAcquisitionTx(
    tx: Tx,
    acquisitionId: string,
) {
    const seed = await getPaymentOwnerSeedTx(tx, "ACQUISITION", acquisitionId);

    if (seed.totalDue <= 0) {
        throw new Error("Không thể tạo payment cho phiếu nhập có tổng giá trị bằng 0.");
    }

    const existing = await tx.payment.findFirst({
        where: {
            acquisition_id: acquisitionId,
            type: "ACQUISITION" as any,
            purpose: "ACQUISITION_FULL" as any,
        },
        select: { id: true },
    });

    if (existing) return existing;

    return createPaymentRowTx(tx, {
        ownerType: "ACQUISITION",
        ownerId: acquisitionId,
        amount: seed.totalDue,
        direction: PaymentDirection.OUT,
        type: "ACQUISITION" as any,
        purpose: "ACQUISITION_FULL" as any,
        method: PaymentMethod.BANK_TRANSFER,
        note: "Payment mặc định cho phiếu nhập.",
    });
}

export async function createInitialPaymentsForOrderTx(tx: Tx, orderId: string) {
    const seed = await getPaymentOwnerSeedTx(tx, "ORDER", orderId);
    if (seed.totalDue <= 0) return [];

    const existing = await tx.payment.findFirst({
        where: {
            order_id: orderId,
            type: PaymentType.ORDER,
            purpose: {
                in: [
                    PaymentPurpose.ORDER_DEPOSIT,
                    PaymentPurpose.ORDER_FULL,
                    PaymentPurpose.ORDER_REMAIN,
                ],
            },
        },
        select: { id: true },
    });

    if (existing) return [existing];

    const rows = [];
    const hasDeposit = seed.depositAmount > 0 && seed.depositAmount < seed.totalDue;
    const isCod = seed.defaultMethod === PaymentMethod.COD;

    if (!hasDeposit && !isCod) {
        const full = await createPaymentRowTx(tx, {
            ownerType: "ORDER",
            ownerId: orderId,
            amount: seed.totalDue,
            direction: PaymentDirection.IN,
            type: PaymentType.ORDER,
            purpose: PaymentPurpose.ORDER_FULL,
            method: seed.defaultMethod,
            note: "Payment toàn bộ đơn hàng",
        });

        if (full) rows.push(full);
        return rows;
    }

    if (seed.depositAmount > 0) {
        const deposit = await createPaymentRowTx(tx, {
            ownerType: "ORDER",
            ownerId: orderId,
            amount: seed.depositAmount,
            direction: PaymentDirection.IN,
            type: PaymentType.ORDER,
            purpose: PaymentPurpose.ORDER_DEPOSIT,
            method: PaymentMethod.BANK_TRANSFER,
            note: isCod ? "Payment cọc đơn COD" : "Payment cọc đơn hàng",
        });

        if (deposit) rows.push(deposit);
    }

    if (isCod) {
        const remainingAmount = Math.max(0, seed.totalDue - seed.depositAmount);

        if (remainingAmount > 0) {
            const codRemain = await createPaymentRowTx(tx, {
                ownerType: "ORDER",
                ownerId: orderId,
                amount: remainingAmount,
                direction: PaymentDirection.IN,
                type: PaymentType.ORDER,
                purpose: PaymentPurpose.ORDER_REMAIN,
                method: PaymentMethod.COD,
                note: "Phần còn lại thu COD khi giao hàng.",
            });

            if (codRemain) rows.push(codRemain);
        }
    }

    return rows;
}

export async function ensureServiceRequestPaymentTx(tx: Tx, serviceRequestId: string) {
    const exposure = await getPaymentExposureTx(tx, "SERVICE", serviceRequestId);

    if (exposure.totalDue <= 0) return null;

    const status = String(exposure.status ?? "").toUpperCase();
    if (status === "DRAFT" || status === "CANCELED" || status === "CANCELLED") return null;

    if (exposure.availableToCreate <= 0) return null;

    return createPaymentRowTx(tx, {
        ownerType: "SERVICE",
        ownerId: serviceRequestId,
        amount: exposure.availableToCreate,
        direction: PaymentDirection.IN,
        type: PaymentType.SERVICE,
        purpose: PaymentPurpose.SERVICE_REQUEST,
        method: exposure.defaultMethod,
        note: "Payment dịch vụ được tạo khi đóng service request.",
    });
}

export async function listServicePayments(serviceRequestId: string) {
    return prisma.$transaction((tx) => listPaymentsTx(tx, "SERVICE", serviceRequestId));
}

export async function getServicePaymentSummary(serviceRequestId: string) {
    return prisma.$transaction((tx) => getPaymentSummaryTx(tx, "SERVICE", serviceRequestId));
}

export async function recomputeOrderPaymentRollupTx(tx: Tx, orderId: string) {
    const summary = await getPaymentSummaryTx(tx, "ORDER", orderId);

    const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
            id: true,
            status: true,
            hasShipment: true,
            shipments: {
                orderBy: { updatedAt: "desc" },
                select: { status: true },
            },
        },
    });

    if (!order) throw new Error("Order không tồn tại.");
    if (order.status === OrderStatus.CANCELLED) return summary;

    const status = String(order.status ?? "").toUpperCase();
    const lockedStatuses = ["RETURNING", "RETURNED"];
    const fullyPaid = summary.totalDue > 0 && summary.paidTotal >= summary.totalDue;
    const shipmentCompleted =
        !order.hasShipment ||
        (order.shipments ?? []).some(
            (shipment) => String(shipment.status ?? "").toUpperCase() === "DELIVERED",
        );

    const completed = fullyPaid && shipmentCompleted && !lockedStatuses.includes(status);

    await tx.order.update({
        where: { id: orderId },
        data: {
            depositPaid: summary.depositRequired > 0 ? money(summary.depositPaid) : null,
            paymentStatus: fullyPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            status: completed ? OrderStatus.COMPLETED : order.status,
            updatedAt: new Date(),
        },
    });

    await syncWatchInventoryFromOrderId(tx, orderId);
    return getPaymentSummaryTx(tx, "ORDER", orderId);
}

async function recomputePaymentOwnerRollupTx(
    tx: Tx,
    ownerType: PaymentOwnerType,
    ownerId: string,
) {
    if (ownerType === "ORDER") {
        return recomputeOrderPaymentRollupTx(tx, ownerId);
    }

    return getPaymentSummaryTx(tx, ownerType, ownerId);
}

export async function createPayment(input: CreatePaymentInput) {
    return prisma.$transaction(async (tx) => {
        const exposure = await getPaymentExposureTx(tx, input.ownerType, input.ownerId);

        if (exposure.ownerType === "ORDER") {
            if (exposure.status === "DRAFT") throw new Error("Cần post order trước khi tạo payment.");
            if (exposure.status === "CANCELLED") throw new Error("Không thể tạo payment cho order đã hủy.");
        }

        if (exposure.ownerType === "ACQUISITION") {
            if (exposure.status !== "POSTED") {
                throw new Error("Chỉ tạo payment cho phiếu nhập đã POSTED.");
            }
        }

        if (exposure.ownerType === "SERVICE") {
            if (exposure.status === "DRAFT") throw new Error("Cần bắt đầu service trước khi tạo payment.");
            if (exposure.status === "CANCELED" || exposure.status === "CANCELLED") {
                throw new Error("Không thể tạo payment cho service request đã hủy.");
            }
            if (exposure.totalDue <= 0) {
                throw new Error("Service request chưa có chi phí để tạo payment.");
            }
        }

        if (exposure.availableToCreate <= 0) {
            throw new Error("Owner đã có đủ payment đang mở. Vui lòng hoàn tất hoặc hủy payment hiện có trước khi tạo thêm.");
        }

        const method = normalizePaymentMethod(input.method, exposure.defaultMethod);

        if (input.ownerType === "ORDER" && method === PaymentMethod.COD) {
            throw new Error("COD không tạo payment thủ công.");
        }

        const amount = input.amount == null ? exposure.availableToCreate : Number(input.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Số tiền payment không hợp lệ.");
        }

        if (amount > exposure.availableToCreate) {
            throw new Error(
                `Số tiền payment vượt quá số còn được tạo: ${Math.round(
                    exposure.availableToCreate,
                ).toLocaleString("vi-VN")} VND.`,
            );
        }

        const payment = await createPaymentRowTx(tx, {
            ownerType: input.ownerType,
            ownerId: input.ownerId,
            amount,
            direction: exposure.direction,
            type: input.ownerType as any,
            purpose:
                (input.purpose as any) ??
                (input.ownerType === "ACQUISITION"
                    ? "ACQUISITION_FULL"
                    : input.ownerType === "SERVICE"
                        ? PaymentPurpose.SERVICE_REQUEST
                        : PaymentPurpose.ORDER_REMAIN),
            method,
            note:
                input.note ??
                (input.ownerType === "ACQUISITION"
                    ? "Payment bổ sung cho phiếu nhập."
                    : input.ownerType === "SERVICE"
                        ? "Payment bổ sung cho service request."
                        : "Payment bổ sung cho đơn hàng."),
        });

        if (!payment) throw new Error("Không thể tạo payment.");

        if (input.markPaidNow) {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: PaymentStatus.PAID,
                    paidAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            await recomputePaymentOwnerRollupTx(tx, input.ownerType, input.ownerId);
        }

        return toPlain(payment);
    });
}

export async function completePayment(input: {
    paymentId: string;
    paidAt?: Date | string | null;
    reference?: string | null;
    note?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        if (!input.paymentId) throw new Error("Thiếu paymentId.");

        const payment = await tx.payment.findUnique({
            where: { id: input.paymentId },
            select: {
                id: true,
                order_id: true,
                acquisition_id: true,
                service_request_id: true,
                shipment_id: true,
                status: true,
            },
        });

        if (!payment) throw new Error("Payment không tồn tại.");
        if (payment.status === PaymentStatus.PAID) throw new Error("Payment này đã hoàn tất.");
        if (["CANCELED", "CANCELLED"].includes(String(payment.status))) {
            throw new Error("Không thể hoàn tất payment đã hủy.");
        }

        const owner = resolvePaymentOwner(payment);

        await tx.payment.update({
            where: { id: payment.id },
            data: {
                status: PaymentStatus.PAID,
                paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
                reference: input.reference ?? undefined,
                note: input.note ?? undefined,
                updatedAt: new Date(),
            },
        });

        const summary = await recomputePaymentOwnerRollupTx(tx, owner.ownerType, owner.ownerId);

        return toPlain({
            paymentId: payment.id,
            ownerType: owner.ownerType,
            ownerId: owner.ownerId,
            summary,
        });
    });
}

export async function cancelPayment(input: {
    paymentId: string;
    note?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        if (!input.paymentId) throw new Error("Thiếu paymentId để hủy payment.");

        const payment = await tx.payment.findUnique({
            where: { id: input.paymentId },
            select: {
                id: true,
                order_id: true,
                acquisition_id: true,
                service_request_id: true,
                shipment_id: true,
                status: true,
            },
        });

        if (!payment) throw new Error("Payment không tồn tại.");

        const status = String(payment.status ?? "").toUpperCase();

        if (status === "PAID") {
            throw new Error("Không thể hủy payment đã hoàn tất. Cần xử lý refund/điều chỉnh riêng.");
        }

        if (status === "CANCELED" || status === "CANCELLED") {
            throw new Error("Payment này đã bị hủy.");
        }

        const owner = resolvePaymentOwner(payment);

        await tx.payment.update({
            where: { id: payment.id },
            data: {
                status: "CANCELED" as any,
                note: input.note ?? "Payment bị hủy.",
                updatedAt: new Date(),
            },
        });

        const summary = await recomputePaymentOwnerRollupTx(tx, owner.ownerType, owner.ownerId);

        return toPlain({
            paymentId: payment.id,
            ownerType: owner.ownerType,
            ownerId: owner.ownerId,
            summary,
        });
    });
}

export async function markOrderShipmentDeliveredAndCollectCod(input: {
    orderId: string;
    note?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: input.orderId },
            select: {
                id: true,
                status: true,
                hasShipment: true,
                paymentMethod: true,
            },
        });

        if (!order) throw new Error("Order không tồn tại.");
        if (order.status === OrderStatus.DRAFT) throw new Error("Cần post order trước khi giao hàng.");
        if (order.status === OrderStatus.CANCELLED) throw new Error("Không thể giao order đã hủy.");
        if (!order.hasShipment) throw new Error("Order này không có shipment.");

        await (tx as any).shipment.upsert({
            where: { orderId: order.id },
            create: {
                orderId: order.id,
                status: "DELIVERED",
                deliveredAt: new Date(),
                updatedAt: new Date(),
            },
            update: {
                status: "DELIVERED",
                deliveredAt: new Date(),
                updatedAt: new Date(),
            },
        });

        const summary = await getPaymentSummaryTx(tx, "ORDER", order.id);
        const remainingCodAmount = Math.max(
            0,
            summary.totalDue - summary.paidTotal - summary.collectedTotal,
        );

        if (order.paymentMethod === PaymentMethod.COD && remainingCodAmount > 0) {
            const existingCodRemain = await tx.payment.findFirst({
                where: {
                    order_id: order.id,
                    type: PaymentType.ORDER,
                    direction: PaymentDirection.IN,
                    purpose: PaymentPurpose.ORDER_REMAIN,
                    method: PaymentMethod.COD,
                    status: { in: [PaymentStatus.UNPAID, COLLECTED] as any },
                },
                select: { id: true },
            });

            if (existingCodRemain) {
                await tx.payment.update({
                    where: { id: existingCodRemain.id },
                    data: {
                        status: COLLECTED,
                        note:
                            input.note ??
                            "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
                        updatedAt: new Date(),
                    } as any,
                });
            } else {
                await createPaymentRowTx(tx, {
                    ownerType: "ORDER",
                    ownerId: order.id,
                    amount: remainingCodAmount,
                    direction: PaymentDirection.IN,
                    type: PaymentType.ORDER,
                    purpose: PaymentPurpose.ORDER_REMAIN,
                    method: PaymentMethod.COD,
                    status: COLLECTED,
                    note:
                        input.note ??
                        "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
                });
            }
        }

        const nextSummary = await recomputeOrderPaymentRollupTx(tx, order.id);
        return toPlain({ orderId: order.id, summary: nextSummary });
    });
}


export async function finalizeOrderByPaidAmount(input: {
    orderId: string;
    note?: string | null;
}) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: input.orderId },
            select: {
                id: true,
                refNo: true,
                status: true,
                hasShipment: true,
                subtotal: true,
                notes: true,
                shipments: {
                    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
                    select: { id: true, status: true },
                },
            },
        });

        if (!order) throw new Error("Order không tồn tại.");

        const orderStatus = String(order.status ?? "").toUpperCase();
        if (orderStatus === "DRAFT") {
            throw new Error("Cần post order trước khi chốt theo tiền đã nhận.");
        }
        if (orderStatus === "CANCELLED" || orderStatus === "CANCELED") {
            throw new Error("Không thể chốt order đã hủy.");
        }
        if (orderStatus === "RETURNING" || orderStatus === "RETURNED") {
            throw new Error("Không thể chốt order đang/đã hoàn.");
        }

        const shipmentDelivered =
            !order.hasShipment ||
            (order.shipments ?? []).some(
                (shipment) => String(shipment.status ?? "").toUpperCase() === "DELIVERED",
            );

        if (!shipmentDelivered) {
            throw new Error("Chỉ chốt theo tiền đã nhận khi order không cần giao hàng hoặc shipment đã DELIVERED.");
        }

        const paid = await tx.payment.aggregate({
            where: {
                ...paymentScopeWhere("ORDER", order.id),
                direction: PaymentDirection.IN,
                status: PaymentStatus.PAID,
            } as any,
            _sum: { amount: true },
        });

        const paidTotal = toNumber(paid._sum.amount);
        if (paidTotal <= 0) {
            throw new Error("Order chưa có payment đã nhận tiền để chốt.");
        }

        await tx.payment.updateMany({
            where: {
                ...paymentScopeWhere("ORDER", order.id),
                direction: PaymentDirection.IN,
                status: { in: [PaymentStatus.UNPAID, COLLECTED] as any },
            } as any,
            data: {
                status: PaymentStatus.CANCELED,
                note:
                    input.note ??
                    "Payment còn mở đã được hủy khi chốt order theo tiền đã nhận.",
                updatedAt: new Date(),
            },
        });

        const currentNote = String(input.note ?? "").trim();
        const finalizedNote =
            currentNote ||
            `Chốt order theo tiền đã nhận: ${Math.round(paidTotal).toLocaleString("vi-VN")} VND.`;

        const updated = await tx.order.update({
            where: { id: order.id },
            data: {
                subtotal: money(paidTotal),
                depositPaid: money(paidTotal),
                paymentStatus: PaymentStatus.PAID,
                status: OrderStatus.COMPLETED,
                notes: [order.notes, finalizedNote].filter(Boolean).join("\n") || finalizedNote,
                updatedAt: new Date(),
            },
        });

        await syncWatchInventoryFromOrderId(tx, order.id);

        const summary = await getPaymentSummaryTx(tx, "ORDER", order.id);
        return toPlain({ order: updated, summary });
    });
}

export async function listPayments(ownerType: PaymentOwnerType, ownerId: string) {
    return prisma.$transaction(async (tx) =>
        toPlain(await listPaymentsTx(tx, ownerType, ownerId)),
    );
}

export async function getPaymentSummary(ownerType: PaymentOwnerType, ownerId: string) {
    return prisma.$transaction(async (tx) =>
        toPlain(await getPaymentSummaryTx(tx, ownerType, ownerId)),
    );
}

/**
 * Backward-compatible exports cho order routes cũ.
 */
export async function listOrderPayments(orderId: string) {
    return listPayments("ORDER", orderId);
}

export async function getOrderPaymentSummary(orderId: string) {
    return getPaymentSummary("ORDER", orderId);
}

export async function listAcquisitionPayments(acquisitionId: string) {
    return listPayments("ACQUISITION", acquisitionId);
}

export async function getAcquisitionPaymentSummary(acquisitionId: string) {
    return getPaymentSummary("ACQUISITION", acquisitionId);
}