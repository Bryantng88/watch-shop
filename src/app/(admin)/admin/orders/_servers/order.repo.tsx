import { DB, dbOrTx } from "@/server/db/client";
import { Prisma, PaymentMethod, OrderStatus, orderitemkind, ReserveType, OrderSource, OrderVerificationStatus, PrismaClient } from "@prisma/client";
import { genRefNo } from "../../__components/AutoGenRef";
/* ================================
   TYPES
================================ */

export type CreateOrderRow = {
    customerId: string | null;
    customerName: string;
    shipPhone: string;
    shipAddress: string;
    shipCity: string;
    shipWard: string | null;
    shipDistrict: string | null;
    paymentMethod: PaymentMethod;
    notes: string | null;
    createdAt: Date;
    status: OrderStatus;
    source: OrderSource;
    verificationStatus: OrderVerificationStatus;
    reserveType: ReserveType | null;
    depositRequired: number | null;
    reserveUntil: Date | null;
};
function normalizeReserve(data: CreateOrderRow) {
    if (!data.reserveType) {
        return {
            reserveType: null,
            reserveUntil: null,
            depositRequired: null,
        };
    }

    return {
        reserveType: data.reserveType,
        reserveUntil: data.reserveUntil ?? null,
        depositRequired: data.depositRequired ?? null,
    };
}

export type CreateOrderItemRow = {
    productId?: string;
    variantId?: string;
    title: string;
    img?: string;
    quantity: number;
    kind: orderitemkind;
    listPrice: number;
    unitPriceAgreed: number; // 👈 service tính, repo chỉ lưu
    taxRate?: number;
};

/* ================================
   QUERIES
================================ */

export async function getOrdList(
    where: Prisma.OrderWhereInput,
    orderBy: Prisma.OrderOrderByWithRelationInput,
    skip: number,
    take: number,
    tx: DB
) {
    const db = dbOrTx(tx);

    const [rows, total] = await Promise.all([
        db.order.findMany({
            where,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                refNo: true,
                status: true,
                reserveType: true,
                depositRequired: true,
                customerName: true,
                shipPhone: true,
                shipCity: true,
                shipDistrict: true,
                shipWard: true,
                notes: true,
                paymentMethod: true,
                subtotal: true,
                source: true,
                verificationStatus: true,
                //orderDate: true,
                createdAt: true,
                updatedAt: true,

                _count: {
                    select: {
                        items: true,
                    },
                },
            },
        }),

        db.order.count({ where }),
    ]);

    return { rows, total };
}
/* ================================
   COMMANDS
================================ */

export async function createOrder(tx: DB, data: CreateOrderRow) {
    const db = dbOrTx(tx);
    const reserve = normalizeReserve(data);
    return db.order.create({
        data: {
            customer: data.customerId
                ? { connect: { id: data.customerId } }
                : undefined,

            customerName: data.customerName,
            shipPhone: data.shipPhone,
            shipAddress: data.shipAddress,
            shipCity: data.shipCity,
            shipWard: data.shipWard,
            shipDistrict: data.shipDistrict,
            paymentMethod: data.paymentMethod,
            notes: data.notes,
            createdAt: data.createdAt, // ✅ đúng kiểu
            status: data.status,
            subtotal: 0,
            source: data.source,
            verificationStatus: data.verificationStatus,
            reserveType: data.reserveType
                ? (data.reserveType as ReserveType)
                : null,
            depositRequired: reserve.depositRequired,
            reserveUntil: reserve.reserveUntil
        },
        select: {
            id: true,
            status: true,
            customerId: true,
            customerName: true,
            shipPhone: true,
            shipAddress: true,
            shipCity: true,
            shipWard: true,
            shipDistrict: true,
            paymentMethod: true,
            notes: true,
            createdAt: true,

            updatedAt: true,
        },
    });
}

export async function createOrderItems(
    tx: DB,
    orderId: string,
    items: CreateOrderItemRow[]
) {
    const db = dbOrTx(tx);
    if (!items.length) return [];

    const rows = items.map((i) => {
        const quantity = Number(i.quantity) || 1;
        const subtotal = i.unitPriceAgreed * quantity;
        return {
            orderId,
            productId: i.productId ?? null,
            variantId: i.variantId ?? null,
            title: i.title,
            img: i.img ?? null,
            listPrice: i.listPrice,
            kind: i.kind,
            unitPriceAgreed: i.unitPriceAgreed,
            quantity,
            subtotal,
            taxRate: i.taxRate ?? null,
        };
    });

    await db.orderItem.createMany({ data: rows });
    return rows;
}

export async function updateSubtotal(
    tx: DB,
    orderId: string,
    subtotal: number
) {
    const db = dbOrTx(tx);
    return db.order.update({
        where: { id: orderId },
        data: { subtotal },
    });
}

/* ================================
   READ
================================ */

export async function getOrderLite(tx: DB, id: string) {
    const db = dbOrTx(tx);
    return db.order.findUnique({
        where: { id },
        select: {
            id: true,
            refNo: true,
            status: true,
            customerId: true,
            customerName: true,
            shipPhone: true,
            shipAddress: true,
            shipCity: true,
            shipWard: true,
            shipDistrict: true,
            paymentMethod: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            items: {
                select: {
                    id: true,
                    productId: true,
                    title: true,
                    quantity: true,
                    unitPriceAgreed: true,
                    subtotal: true,
                },
            },
        },
    });
}


export async function getOrderDetail(id: string, tx: PrismaClient) {


    return tx.order.findUnique({
        where: { id },
        select: {
            id: true,
            refNo: true,
            status: true,
            shipAddress: true,
            shipDistrict: true,
            shipCity: true,
            shipPhone: true,
            customerName: true,
            paymentMethod: true,
            subtotal: true,
            createdAt: true,
            items: {
                select: {
                    id: true,
                    title: true,
                    quantity: true,
                    unitPriceAgreed: true,
                    listPrice: true,
                    kind: true,
                    //productType: true
                },
            },
        },
    });
}

export function getOrderForPost(
    tx: DB,
    id: string
) {
    const db = dbOrTx(tx);
    return db.order.findUnique({
        where: { id },
        include: { items: true },
    });
}

export function getOrdersForPost(
    tx: DB,
    ids: string[]
) {
    const db = dbOrTx(tx);
    return db.order.findMany({
        where: {
            id: { in: ids },
            status: "DRAFT",
        },
        include: { items: true },
    });
}

export function markPosted(
    tx: DB,
    id: string,
    hasShipment: boolean
) {
    const db = dbOrTx(tx);
    return db.order.update({
        where: { id },
        data: {
            status: "POSTED",
            hasShipment,
            updatedAt: new Date(),
        },
    });
}

export async function cancelOrder(
    id: string,
    tx: DB,
    reason?: string | null
) {
    const db = dbOrTx(tx);
    return db.order.update({
        where: { id },
        data: {
            status: "CANCELLED" as any,
            // nếu bạn có cột cancelReason/notes thì map vào đây
            notes: reason ?? undefined,
        },
    });
}

export async function verifyOrder(
    id: string,
    tx: DB,
    verificationStatus: string
) {
    const db = dbOrTx(tx);
    return db.order.update({
        where: { id },
        data: {
            verificationStatus: verificationStatus as any, // VERIFIED | REJECTED | ...
        },
    });
}