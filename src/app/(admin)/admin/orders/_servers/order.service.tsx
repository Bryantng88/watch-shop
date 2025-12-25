// app/(admin)/admin/orders/_server/order.service.ts
"use server";

import { prisma, DB } from "@/server/db/client";
import * as repoOrder from "./order.repo";
import { OrderSearchInput } from "../utils/search-params";
import { PaymentMethod } from "@prisma/client";

type CreateOrderInput = {
    orderCode?: string;
    customerId?: string;
    customerName: string;
    shipPhone: string;
    shipAddress: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    orderDate?: Date;
    items: CreateOrderItemRow[];
};

type CreateOrderItemRow = {
    productId?: string;
    variantId?: string;
    title: string;
    img?: string;

    quantity: number;
    listPrice: number;

    discountType?: 'PERCENT' | 'AMOUNT';
    discountValue?: number;

    unitPriceAgreed?: number; // override nếu cần
    taxRate?: number;
};


export async function getAdminOrderList(input: OrderSearchInput) {
    const { page, pageSize, q } = input;

    const where = q
        ? {
            OR: [
                { refNo: { contains: q, mode: "insensitive" } },
                { customerName: { contains: q, mode: "insensitive" } },
                { customerPhone: { contains: q, mode: "insensitive" } },
            ],
        }
        : {};

    return repoOrder.getList({ page, pageSize, where });
}

export async function createOrderWithItems(input: CreateOrderInput) {
    return prisma.$transaction(async (tx) => {
        const order = await repoOrder.createOrder(tx, {
            customerId: input.customerId ?? null,
            customerName: input.customerName,
            shipPhone: input.shipPhone,
            shipAddress: input.shipAddress,
            paymentMethod: input.paymentMethod,
            notes: input.notes ?? null,
            orderDate: input.orderDate ?? new Date(),
            status: 'DRAFT',
        });

        await repoOrder.createOrderItems(
            tx,
            order.id,
            input.items
        );

        return order;
    });
}
