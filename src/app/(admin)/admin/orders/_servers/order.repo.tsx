// app/(admin)/admin/orders/_server/order.repo.ts
import { DB, dbOrTx } from "@/server/db/client";
import type { Prisma, PaymentMethod, OrderStatus } from "@prisma/client";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import { genRefNo } from "../../components/AutoGenRef";

export type CreateOrderRow = {
    customerId: string | null;
    customerName: string;
    shipPhone: string;
    shipAddress: string;
    paymentMethod: PaymentMethod;
    notes: string | null;
    orderDate: Date;
    status: OrderStatus; // nếu bạn có enum OrderStatus thì đổi thành OrderStatus
};

export type CreateOrderItemRow = {
    productId?: string;
    variantId?: string;
    title: string;
    img?: string;
    quantity: number;

    listPrice: number;

    discountType?: 'PERCENT' | 'AMOUNT';
    discountValue?: number;

    taxRate?: number; // ví dụ: 8
    unitPriceAgreed?: number; // optional override

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
}





export async function createOrder(tx: DB, data: CreateOrderRow) {
    const db = dbOrTx(tx);
    const refNo = await genRefNo(db, {
        model: db.acquisition,
        prefix: "OD",
    });

    return db.order.create({
        data: {
            orderCode: refNo,
            customerId: data.customerId,
            customerName: data.customerName,
            shipPhone: data.shipPhone,
            shipAddress: data.shipAddress,
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
            shipPhone: true,
            shipAddress: true,
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

    const rows = items.map((i) => {
        const listPrice = Number(i.listPrice);

        const unitPriceAgreed =
            i.unitPriceAgreed ??
            calcUnitPriceAgreed({
                listPrice,
                discountType: i.discountType,
                discountValue: i.discountValue,
            });

        const quantity = i.quantity ?? 1;
        const subtotal = unitPriceAgreed * quantity;

        return {
            orderId,
            productId: i.productId,
            variantId: i.variantId,

            title: i.title,
            img: i.img ?? null,

            listPrice: listPrice,
            discountType: i.discountType ?? null,
            discountValue: i.discountValue ?? null,

            unitPriceAgreed,
            quantity,
            subtotal,

            taxRate: i.taxRate ?? null,
        };
    });

    return db.orderItem.createMany({
        data: rows,
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