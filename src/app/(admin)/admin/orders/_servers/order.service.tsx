"use server";

import { prisma } from "@/server/db/client";
import { OrderSearchInput } from "../utils/search-params";
import * as orderRepo from "./order.repo";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import type { PaymentMethod, Prisma, orderitemkind } from "@prisma/client";
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
  kind?: orderitemkind;
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
  const input: CreateOrderInput = {
    shipPhone: raw.shipPhone ?? null,
    customerId: raw.customerId ?? null,
    customerName: raw.customerName,

    shipAddress: raw.shipAddress ?? null,
    shipCity: raw.shipCity ?? null,
    shipDistrict: raw.shipDistrict ?? null,
    shipWard: raw.shipWard ?? null,

    paymentMethod: raw.paymentMethod ?? null,
    notes: raw.notes ?? null,
    orderDate:
      raw.orderDate instanceof Date
        ? raw.orderDate
        : new Date(raw.orderDate),

    items: (raw.items ?? []).map((i: any) => ({
      kind: i.kind as "PRODUCT" | "SERVICE",

      // PRODUCT
      productId: i.productId ?? null,
      variantId: i.variantId ?? null,

      // SERVICE
      serviceCatalogId: i.serviceCatalogId ?? null,

      title: i.title,
      quantity: Number(i.quantity ?? 1),
      listPrice: Number(i.price ?? i.unitPrice ?? 0),

      discountType: i.discountType ?? null,
      discountValue: i.discountValue ?? null,
      taxRate: i.taxRate ?? null,
    })),
  };

  return prisma.$transaction(async (tx) => {
    /** -----------------------------
     * 1️⃣ Resolve customer
     * ----------------------------- */
    let resolvedCustomerId = input.customerId ?? null;

    if (!resolvedCustomerId && input.shipPhone) {
      const existing = await customerRepo.findByPhone(tx, input.shipPhone);

      if (existing) {
        resolvedCustomerId = existing.id;
      } else {
        const created = await customerRepo.createCustomer(tx, {
          name: input.customerName,
          phone: input.shipPhone,
          city: input.shipCity,
          district: input.shipDistrict,
          ward: input.shipWard,
          address: input.shipAddress,
        });
        resolvedCustomerId = created.id;
      }
    }

    /** -----------------------------
     * 2️⃣ Create ORDER (DRAFT)
     * ----------------------------- */
    const order = await orderRepo.createOrder(tx, {
      customerId: resolvedCustomerId,
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

    /** -----------------------------
     * 3️⃣ Build OrderItems
     * ----------------------------- */
    const orderItems = input.items.map((i) => {
      const unitPriceAgreed = calcUnitPriceAgreed({
        listPrice: i.listPrice,
        discountType: i.discountType,
        discountValue: i.discountValue,
      });

      return {
        kind: i.kind,

        productId: i.kind === "PRODUCT" ? i.productId : null,
        variantId: i.kind === "PRODUCT" ? i.variantId : null,

        serviceCatalogId:
          i.kind === "SERVICE" ? i.serviceCatalogId : null,

        title: i.title,
        quantity: i.quantity,
        listPrice: i.listPrice,
        unitPriceAgreed,
      };
    });

    const createdItems = await orderRepo.createOrderItems(
      tx,
      order.id,
      orderItems
    );

    /** -----------------------------
     * 4️⃣ Compute subtotal
     * ----------------------------- */
    const subtotal = createdItems.reduce(
      (sum, i) => sum + i.subtotal,
      0
    );

    await orderRepo.updateSubtotal(tx, order.id, subtotal);

    /** -----------------------------
     * 5️⃣ Return lite order
     * ----------------------------- */
    return orderRepo.getOrderLite(tx, order.id);
  });
}

export async function getOrderDetail(id: string) {
  return orderRepo.getOrderDetail(prisma, id);
}