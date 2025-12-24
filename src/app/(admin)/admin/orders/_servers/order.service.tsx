// app/(admin)/admin/orders/_server/order.service.ts
"use server";

import { prisma, DB } from "@/server/db/client";
import { repoOrder } from "./order.repo";
import { OrderSearchInput } from "../utils/search-params";

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

export async function createOrderWithItems(input: any) {
    return prisma.$transaction(async (tx) => {
        // ==========================
        // Customer
        // ==========================
        const customerId = input.customerId || null;

        // ==========================
        // Order
        // ==========================
        const order = await tx.order.create({
            data: {
                customerId,
                customerName: input.customerName,
                phone: input.phone,
                shippingAddress: input.shippingAddress,
                paymentMethod: input.paymentMethod,
                notes: input.notes,
                orderDate: input.orderDate,
                status: "DRAFT", // đồng bộ với hệ thống
            },
        });

        // ==========================
        // Order items
        // ==========================
        await tx.orderItem.createMany({
            data: input.items.map((i: any) => ({
                orderId: order.id,
                productId: i.productId,
                title: i.title,
                productType: i.productType,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.quantity * i.unitPrice,
            })),
        });

        return order;
    });
}