// app/(admin)/admin/orders/_server/order.repo.ts
import { DB, dbOrTx } from "@/server/db/client";
import type { Prisma, PaymentMethod, OrderStatus } from "@prisma/client";

export type CreateOrderRow = {
    customerId: string | null;
    customerName: string;
    phone: string | null;
    shippingAddress: string | null;
    paymentMethod: PaymentMethod;
    notes: string | null;
    orderDate: Date;
    status: OrderStatus; // nếu bạn có enum OrderStatus thì đổi thành OrderStatus
};

export type CreateOrderItemRow = {
    productId: string;
    title: string;
    productType: string; // hoặc ProductType
    quantity: number;
    unitPrice: number;
};


export async function getList({ page, pageSize, where }: any) {
    const [total, items] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { updatedAt: "desc" },
            include: {
                _count: { select: { items: true } }
            }
        }),
    ]);

    return {
        items,
        total,
        page,
        pageSize,
    };
},





export async function createOrder(tx: DB, data: CreateOrderRow) {
    const db = dbOrTx(tx);
    return db.order.create({
        data: {
            customerId: data.customerId,
            customerName: data.customerName,
            phone: data.phone,
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod,
            notes: data.notes,
            orderDate: "DRAFT",
            status: data.status,
        },
        select: {
            id: true,
            status: true,
            customerId: true,
            customerName: true,
            phone: true,
            shippingAddress: true,
            paymentMethod: true,
            notes: true,
            orderDate: true,
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
    if (!items.length) return;
    return db.orderItem.createMany({
        data: items.map((i) => ({
            orderId,
            productId: i.productId,
            title: i.title,
            productType: i.productType as any,
            quantity: i.quantity,
            unitPrice: i.unitPrice as any,
            subtotal: (i.quantity || 0) * (i.unitPrice || 0),
            unitPriceAgreed: 
        })),
    });
}

export async function getOrderLite(tx: DB, id: string) {
    const db = dbOrTx(tx);
    return db.order.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            customerId: true,
            customerName: true,
            phone: true,
            shippingAddress: true,
            paymentMethod: true,
            notes: true,
            orderDate: true,
            createdAt: true,
            updatedAt: true,
            items: {
                select: {
                    id: true,
                    productId: true,
                    title: true,
                    productType: true,
                    quantity: true,
                    unitPrice: true,
                    totalPrice: true,
                },
            },
        },
    });
}
