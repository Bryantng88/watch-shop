"use server";

import { prisma } from "@/server/db/client";
import { OrderSearchInput } from "../utils/search-params";
import * as orderRepo from "./order.repo";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import type { PaymentMethod, Prisma } from "@prisma/client";
import * as customerRepo from "@/app/(admin)/admin/customers/_server/customer.repo"

/* ================================
   TYPES
================================ */

export type CreateOrderItemInput = {
  productId?: string;
  variantId?: string;
  title: string;
  img?: string;

  quantity: number;
  listPrice: number;

  discountType?: "PERCENT" | "AMOUNT";
  discountValue?: number;

  taxRate?: number;
};

export type CreateOrderInput = {
  shipPhone?: string | null;
  customerId?: string | null;
  customerName: string;

  shipAddress?: string | null;
  shipCity: string;
  shipDistrict: string;
  shipWard: string;

  paymentMethod?: PaymentMethod | null;
  notes?: string | null;
  orderDate: Date;

  items: CreateOrderItemInput[];
};

/* ================================
   QUERIES
================================ */
export async function getAdminOrderList(input: OrderSearchInput) {
  const { page, pageSize, q } = input;

  const where: Prisma.OrderWhereInput = q
    ? {
      OR: [
        { refNo: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { shipPhone: { contains: q, mode: "insensitive" } },
      ],
    }
    : {};

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const { rows, total } = await orderRepo.getOrdList(
    where,
    { updatedAt: "desc" },
    skip,
    take,
    prisma
  );

  /**
   * 🔥 QUAN TRỌNG:
   * Map _count.items → itemCount
   * Nếu không map, UI sẽ không hiển thị "Số dòng"
   */
  const items = rows.map((o) => ({
    id: o.id,
    refNo: o.refNo,
    customerName: o.customerName,
    shipPhone: o.shipPhone,
    status: o.status,
    subtotal: Number(o.subtotal ?? 0),
    //currency: o.currency ?? "VND",
    itemCount: o._count?.items ?? 0,
    notes: o.notes,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));

  return {
    items,
    total,
    page,
    pageSize,
  };
}
/* ================================
   COMMAND
================================ */

export async function createOrderWithItems(raw: any) {
  // 1️⃣ Normalize input
  const input: CreateOrderInput = {
    shipPhone: raw.shipPhone ?? null,
    customerId: raw.customerId ?? null,
    customerName: raw.customerName,

    shipAddress: raw.shipAddress ?? null,
    shipCity: raw.shipCity,
    shipDistrict: raw.shipDistrict,
    shipWard: raw.shipWard,

    paymentMethod: raw.paymentMethod ?? null,
    notes: raw.notes ?? null,
    orderDate:
      raw.orderDate instanceof Date
        ? raw.orderDate
        : new Date(raw.orderDate),

    items: (raw.items ?? []).map((i: any) => ({
      productId: i.productId,
      variantId: i.variantId,
      title: i.title,
      img: i.img,

      quantity: Number(i.quantity ?? 1),
      listPrice: Number(i.price ?? i.unitPrice ?? 0),

      discountType: i.discountType,
      discountValue: i.discountValue,
      taxRate: i.taxRate,
    })),
  };

  return prisma.$transaction(async (tx) => {
    let customerId: string | undefined;

    if (input.shipPhone) {
      const existing = await customerRepo.findByPhone(
        tx,
        input.shipPhone
      );

      if (existing) {
        customerId = existing.id;
      } else {
        const created = await customerRepo.createCustomer(tx, {
          name: input.customerName,
          phone: input.shipPhone,
          city: input.shipCity,
          ward: input.shipWard,
        });
        customerId = created.id;
      }
    }
    // 2️⃣ Create ORDER (chưa có subtotal)
    const order = await orderRepo.createOrder(tx, {
      customerId: input.customerId,
      customerName: input.customerName,
      shipPhone: input.shipPhone!,
      shipAddress: input.shipAddress,
      shipCity: input.shipCity,
      shipDistrict: input.shipDistrict,
      shipWard: input.shipWard,
      paymentMethod: input.paymentMethod!,
      notes: input.notes,
      orderDate: input.orderDate,
      status: "DRAFT",
    });

    // 3️⃣ Build OrderItems + tính subtotal
    const itemRows = input.items.map((i) => {
      const unitPriceAgreed = calcUnitPriceAgreed({
        listPrice: i.listPrice,
        discountType: i.discountType,
        discountValue: i.discountValue,
      });

      return {
        ...i,
        unitPriceAgreed,
      };
    });

    const rows = await orderRepo.createOrderItems(
      tx,
      order.id,
      itemRows
    );

    // 4️⃣ Tính subtotal ORDER (SERVER-SIDE)
    const subtotal = rows.reduce(
      (sum, i) => sum + i.subtotal,
      0
    );

    // 5️⃣ Update subtotal
    await orderRepo.updateSubtotal(tx, order.id, subtotal);

    // 6️⃣ Trả order lite
    return orderRepo.getOrderLite(tx, order.id);
  });
}

export async function getOrderDetail(id: string) {
  return orderRepo.getOrderDetail(prisma, id);
}