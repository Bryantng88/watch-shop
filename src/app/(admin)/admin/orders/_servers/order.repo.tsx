import { DB, dbOrTx } from "@/server/db/client";
import type { Prisma, PaymentMethod, OrderStatus } from "@prisma/client";
import { genRefNo } from "../../components/AutoGenRef";

/* ================================
   TYPES
================================ */

export type CreateOrderRow = {
    customerId: string | null;
    customerName: string;
    shipPhone: string;
    shipAddress: string;
    shipCity: string | null;
    shipWard: string | null;
    shipDistrict: string | null;
    paymentMethod: PaymentMethod;
    notes: string | null;
    createdAt: Date;
    status: OrderStatus;
};

export type CreateOrderItemRow = {
    productId?: string;
    variantId?: string;
    title: string;
    img?: string;
    quantity: number;

    listPrice: number;
    discountType?: "PERCENT" | "AMOUNT";
    discountValue?: number;

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

                customerName: true,
                shipPhone: true,
                shipCity: true,
                shipDistrict: true,
                shipWard: true,

                paymentMethod: true,
                subtotal: true,

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

    const refNo = await genRefNo(db, {
        model: db.order, // ✅ đúng model
        prefix: "OD",
    });

    return db.order.create({
        data: {
            refNo,
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
        },
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
            discountType: i.discountType ?? null,
            discountValue: i.discountValue ?? null,

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


export async function getOrderDetail(tx: DB, id: string) {
    const db = dbOrTx(tx);

    return db.order.findUnique({
        where: { id },
        select: {
            id: true,
            refNo: true,
            status: true,
            items: {
                select: {
                    id: true,
                    title: true,
                    quantity: true,
                    unitPriceAgreed: true,
                    //productType: true
                },
            },
        },
    });
}