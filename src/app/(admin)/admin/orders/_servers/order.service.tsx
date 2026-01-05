"use server";

import { prisma, DB, dbOrTx } from "@/server/db/client";
import { OrderSearchInput } from "../utils/search-params";
import * as orderRepo from "./order.repo";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import { PaymentMethod, Prisma, orderitemkind } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import * as customerRepo from "@/app/(admin)/admin/customers/_server/customer.repo"
import { updateProductVariantStt } from "../../products/_server/product.repo";
import * as serviceReqtService from "../../services/_server/service_request.service";
import * as shipmentService from "../../shipment/_server/shipment.service";
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
  kind: orderitemkind;
  discountType?: "PERCENT" | "AMOUNT";
  discountValue?: number;
  serviceCatalogId: string;
  taxRate?: number;
};

export type CreateOrderInput = {
  shipPhone?: string | null;
  customerId?: string | null;
  customerName: string;
  reserve: ReserveInput
  shipAddress: string;
  shipCity: string;
  shipDistrict: string;
  shipWard: string;
  paymentMethod: PaymentMethod,
  notes: string | null;
  orderDate: Date;

  items: CreateOrderItemInput[];
};

type ReserveInput = {
  enabled: boolean;
  amount: number;
  expiresAt?: string | null;
};

function resolveReserve(
  paymentMethod: PaymentMethod,
  reserve?: ReserveInput | null
) {
  // 1. Không reserve
  if (!reserve?.enabled) {
    return {
      reservetype: null,
      reserveuntil: null,
      depositrequired: null,
    };
  }

  // 2. COD → bắt buộc cọc, KHÔNG expire
  if (paymentMethod === "COD") {
    return {
      reservetype: "COD",
      reserveuntil: null,           // ❗ COD không giữ theo ngày
      depositrequired: reserve.amount,
    };
  }

  // 3. Không COD → HOLD
  return {
    reservetype: "HOLD",
    reserveuntil: reserve.expiresAt
      ? new Date(reserve.expiresAt)
      : null,
    depositrequired: reserve.amount,
  };
}

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
    reserve: raw.reserve,
    paymentMethod: raw.paymentMethod as PaymentMethod,
    notes: raw.notes ?? null,
    orderDate:
      raw.orderDate instanceof Date
        ? raw.orderDate
        : new Date(raw.orderDate),

    items: (raw.items ?? []).map((i: any) => ({
      kind: i.kind as "PRODUCT" | "SERVICE" | "DISCOUNT",
      productId: i.productId ?? null,
      variantId: i.variantId ?? null,
      serviceCatalogId: i.serviceCatalogId ?? null,
      title: i.title,
      quantity: Number(i.quantity ?? 1),
      listPrice: Number(i.price ?? i.unitPrice ?? 0),
      taxRate: i.taxRate ?? null,
    })),
  };
  const reserveData = resolveReserve(input.paymentMethod, input.reserve)
  return prisma.$transaction(async (tx) => {
    /* =====================================================
     * 1️⃣ Resolve CUSTOMER
     * ===================================================== */

    /* =====================================================
     * 2️⃣ Reserve PRODUCT variants (lock inventory)
     * ===================================================== */
    for (const item of input.items) {
      if (item.kind !== "PRODUCT") continue;

      await updateProductVariantStt(tx, {
        productId: item.productId!,
        status: "RESERVED",
        fromStatuses: ["ACTIVE"],
      });
    }

    /* =====================================================
     * 3️⃣ Create ORDER (DRAFT)
     * ===================================================== */
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
      createdAt: input.orderDate,
      status: "DRAFT",
    });

    /* =====================================================
     * 4️⃣ Create ORDER ITEMS
     * ===================================================== */
    const orderItems = input.items.map((i) => {
      const unitPriceAgreed = calcUnitPriceAgreed({
        listPrice: i.listPrice,
        discountType: i.discountType,
        discountValue: i.discountValue,
      });

      return {
        kind: i.kind,
        productId: i.kind === "PRODUCT" ? i.productId : undefined,
        variantId: i.kind === "PRODUCT" ? i.variantId : undefined,
        serviceCatalogId:
          i.kind === "SERVICE" ? i.serviceCatalogId : undefined,
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

    /* =====================================================
     * 5️⃣ Compute & update SUBTOTAL
     * ===================================================== */
    const subtotal = createdItems.reduce(
      (sum, i) => sum + i.subtotal,
      0
    );

    await orderRepo.updateSubtotal(tx, order.id, subtotal);

    /* =====================================================
     * 6️⃣ Return lite order
     * ===================================================== */
    return orderRepo.getOrderLite(tx, order.id);
  });
}

function norm(v: unknown) {
  const s = typeof v === "string" ? v.trim() : "";
  return s; // giữ "" nếu user xóa
}

async function resolveCustomer(
  tx: Prisma.TransactionClient,
  input: CreateOrderInput
): Promise<string | null> {
  const shipCity = norm(input.shipCity);
  const shipDistrict = norm(input.shipDistrict);
  const shipWard = norm(input.shipWard);
  const shipAddress = norm(input.shipAddress);
  const shipPhone = norm(input.shipPhone);

  // 1) Nếu có customerId => ưu tiên update theo ID
  if (input.customerId) {
    const existing = await customerRepo.findCustomerById(tx, input.customerId);
    if (!existing) return null;

    const needUpdate =
      shipCity !== norm(existing.city) ||
      shipDistrict !== norm(existing.district) ||
      shipWard !== norm(existing.ward) ||
      shipAddress !== norm(existing.address);

    if (needUpdate) {
      await customerRepo.updateCustomer(tx, existing.id, {
        city: shipCity,
        district: shipDistrict,
        ward: shipWard,
        address: shipAddress,
      });
    }

    return existing.id;
  }

  // 2) Không có customerId => resolve theo phone
  if (!shipPhone) return null;

  const existing = await customerRepo.findByPhone(tx, shipPhone);

  if (existing) {
    const needUpdate =
      shipCity !== norm(existing.city) ||
      shipDistrict !== norm(existing.district) ||
      shipWard !== norm(existing.ward) ||
      shipAddress !== norm(existing.address);

    if (needUpdate) {
      await customerRepo.updateCustomer(tx, existing.id, {
        city: shipCity,
        district: shipDistrict,
        ward: shipWard,
        address: shipAddress,
      });
    }

    return existing.id;
  }

  // 3) Không có => create
  const created = await customerRepo.createCustomer(tx, {
    name: input.customerName,
    phone: shipPhone,
    city: shipCity,
    district: shipDistrict,
    ward: shipWard,
    address: shipAddress,
  });

  return created.id;
}


export async function getOrderDetail(id: string) {
  return orderRepo.getOrderDetail(prisma, id);
}


// order-post.service.ts
export async function postOrders(
  orderIds: string[],
  hasShipment: boolean
) {
  return prisma.$transaction(async (tx) => {
    const orders = await orderRepo.getOrdersForPost(tx, orderIds);
    if (!orders.length) {
      throw new Error("No orders found");
    }

    for (const order of orders) {
      console.log('service order test : ' + order.status)

      if (order.status !== OrderStatus.DRAFT) continue;

      // 1. mark posted
      await orderRepo.markPosted(tx, order.id, hasShipment);

      // 2. shipment
      if (hasShipment) {
        await shipmentService.createFromOrder(tx, order);
      }

      // 3. service request
      if (order.items.some(i => i.kind === "SERVICE")) {
        await serviceReqtService.createFromOrder(tx, order);
      }

      // 4. inventory (sau)
      // await productRepo.markVariantsSold(tx, order.items);
    }

    return { count: orders.length };
  });
}
