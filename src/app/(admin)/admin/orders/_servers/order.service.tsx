"use server";

//import { prisma, DB, dbOrTx } from "@/server/db/client";
import { OrderSearchInput } from "../utils/search-params";
import * as orderRepo from "./order.repo";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import { PaymentMethod, Prisma, OrderItemKind, ReserveType, OrderStatus, OrderSource, OrderVerificationStatus, PrismaClient } from "@prisma/client";
import * as customerRepo from "@/app/(admin)/admin/customers/_server/customer.repo"
import { updateProductVariantStt } from "../../products/_server/product.repo";
import * as serviceReqtService from "../../services/_server/service_request.service";
import * as shipmentService from "../../shipments/_server/shipment.service";
import * as paymentService from "../../payments/_server/payment.service"
import { OrderDraftInput } from "./order.type";
import { genRefNo } from "../../__components/AutoGenRef";
import * as serviceRequestRepo from "../../services/_server/service_request.repo"


/* ================================
   TYPES
================================ */
const prisma = new PrismaClient();



export type CreateOrderItemInput = {
  productId?: string;
  variantId?: string;
  title: string;
  img?: string;

  quantity: number;
  listPrice: number;
  kind: OrderItemKind;
  discountType?: "PERCENT" | "AMOUNT";
  discountValue?: number;
  serviceCatalogId: string;
  taxRate?: number;
};
type ReserveInput = {
  type: ReserveType;     // HOLD | COD
  amount?: number;
  expiresAt?: Date | null;
};

type RawProductItem = {
  productId: string;
  quantity: number;
};

export type ResolvedOrderItem = {
  kind: "PRODUCT";
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  listPrice: number; // number để tạo orderItem
  primaryImageUrl?: string | null;
  productType?: string; // nếu bạn cần
};
function toNumberPrice(v: unknown): number {
  // prisma Decimal -> object có toNumber() hoặc valueOf()
  if (v == null) return 0;
  if (typeof v === "number") return v;

  // Prisma.Decimal thường có toNumber()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyV = v as any;
  if (typeof anyV?.toNumber === "function") return anyV.toNumber();

  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
type ProductRow = Prisma.ProductGetPayload<{
  select: {
    id: true;
    title: true;
    primaryImageUrl: true;
    type: true;
    variants: {
      select: {
        id: true;
        availabilityStatus: true;
        price: true;
        stockQty: true;
        createdAt: true;
      };
    };
  };
}>;

type VariantRow = ProductRow["variants"][number];

/** ============ HELPERS ============ */
function assertValidQty(productId: string, quantity: number) {
  const q = Number(quantity ?? 1);
  if (!Number.isFinite(q) || q <= 0) {
    throw new Error(`Invalid quantity for productId=${productId}`);
  }
  return q;
}

export type CreateOrderInput = {
  shipPhone?: string | null;
  customerId?: string | null;
  customerName: string;
  reserve?: ReserveInput | null;
  hasShipment: boolean;
  shipAddress: string;
  shipCity: string;
  shipDistrict: string;
  shipWard: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  orderDate: Date;
  status: OrderStatus;
  items: CreateOrderItemInput[];
  source: OrderSource;
  verificationStatus: OrderVerificationStatus;
};


function resolveReserve(
  paymentMethod: PaymentMethod,
  reserve?: ReserveInput | null
) {
  if (!reserve) return null;

  if (paymentMethod === "COD") {
    return {
      reserveType: "COD" as ReserveType,
      depositRequired: reserve.amount ?? 0,
      reserveUntil: null, // COD không giữ hàng
    };
  }

  return {
    reserveType: reserve.type,
    depositRequired: reserve.amount ?? 0,
    reserveUntil: reserve.expiresAt ?? null,
  };
}
function norm(v: unknown) {
  const s = typeof v === "string" ? v.trim() : "";
  return s; // giữ "" nếu user xóa
}
export async function serialize(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (value instanceof Date) return value.toISOString();
      if (typeof value === "object" && value?._isDecimal) return Number(value);
      return value;
    })
  );
}

export async function resolveItemsFromDb(
  tx: Prisma.TransactionClient,
  items: RawProductItem[]
): Promise<ResolvedOrderItem[]> {
  if (!items?.length) return [];

  // 1) normalize + cộng dồn qty nếu trùng productId
  const qtyByProductId = new Map<string, number>();

  for (const it of items) {
    if (!it?.productId) throw new Error("Missing productId");
    const productId = String(it.productId).trim();
    const qty = assertValidQty(productId, it.quantity);
    qtyByProductId.set(productId, (qtyByProductId.get(productId) ?? 0) + qty);
  }

  const productIds = Array.from(qtyByProductId.keys());

  // 2) query product + variants ACTIVE
  const products: ProductRow[] = await tx.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      title: true,
      primaryImageUrl: true,
      type: true,
      variants: {
        where: { availabilityStatus: "ACTIVE" }, // ✅ theo schema bạn
        orderBy: [
          { stockQty: "desc" },   // ưu tiên variant còn hàng nhiều
          { createdAt: "asc" },   // tie-break
        ],
        select: {
          id: true,
          availabilityStatus: true,
          price: true,
          stockQty: true,
          createdAt: true,
        },
      },
    },
  });

  // 3) check missing
  const productMap = new Map<string, ProductRow>(products.map((p) => [p.id, p]));
  const missing = productIds.filter((id) => !productMap.has(id));
  if (missing.length) {
    throw new Error(`Products not found: ${missing.join(", ")}`);
  }

  // 4) resolve mỗi product -> chọn 1 variant ACTIVE
  const resolved: ResolvedOrderItem[] = [];

  for (const productId of productIds) {
    const p = productMap.get(productId);
    if (!p) throw new Error(`Product not found: ${productId}`);

    const chosenVariant: VariantRow | undefined = p.variants?.[0];
    if (!chosenVariant) {
      throw new Error(`No ACTIVE variant for productId=${productId}`);
    }

    // optional: check stock if managed (bạn có isStockManaged ở ProductVariant)
    const qty = qtyByProductId.get(productId)!;
    if (chosenVariant.stockQty != null && chosenVariant.stockQty < qty) {
      throw new Error(
        `Not enough stock for productId=${productId}. Need ${qty}, available ${chosenVariant.stockQty}`
      );
    }

    resolved.push({
      kind: "PRODUCT",
      productId: p.id,
      variantId: chosenVariant.id,
      title: p.title,
      quantity: qty,
      listPrice: toNumberPrice(chosenVariant.price),
      primaryImageUrl: p.primaryImageUrl ?? null,
      productType: String(p.type),
    });
  }

  return resolved;
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

/* ================================
   QUERIES
================================ */
export async function getAdminOrderList(input: OrderSearchInput) {
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));

  const { rows, total, counts } = await orderRepo.listAdminOrders(prisma, {
    q: input.q,
    view: input.view,
    sort: input.sort,
    page,
    pageSize,
  });

  const items = rows.map((o) => ({
    id: o.id,
    refNo: o.refNo,
    customerName: o.customerName,
    shipPhone: o.shipPhone,
    status: o.status,
    reserveType: o.reserveType,
    depositRequired: Number(o.depositRequired ?? 0),
    subtotal: Number(o.subtotal ?? 0),
    currency: "VND",
    hasShipment: o.hasShipment,
    itemCount: o._count?.items ?? 0,
    notes: o.notes,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    source: o.source,
    verificationStatus: o.verificationStatus,
  }));

  return {
    items,
    total,
    counts,
    page,
    pageSize,
  };
}

export async function getAdminOrderDetail(id: string) {

  const row = await orderRepo.getOrderDetail(id, prisma);
  if (!row) throw new Error("Order không tồn tại");
  return serialize(row);
}

/* ================================
   COMMAND
================================ */

export async function createOrderWithItems(raw: any) {
  const input: CreateOrderInput = {
    shipPhone: raw.shipPhone ?? null,
    customerId: raw.customerId ?? null,
    customerName: raw.customerName,
    reserve: raw.reserve
      ? {
        type: raw.reserve.type as ReserveType,
        amount: Number(raw.reserve.amount || 0),
        expiresAt: raw.reserve.expiresAt
          ? new Date(raw.reserve.expiresAt)
          : null,
      }
      : null,
    status: raw.status as OrderStatus,
    shipAddress: raw.shipAddress ?? null,
    shipCity: raw.shipCity ?? null,
    shipDistrict: raw.shipDistrict ?? null,
    hasShipment: raw.hasShipment,
    shipWard: raw.shipWard ?? null,
    source: raw.source as OrderSource,
    verificationStatus: raw.verificationStatus as OrderVerificationStatus,
    paymentMethod: raw.paymentMethod as PaymentMethod,
    notes: raw.notes ?? null,
    orderDate:
      raw.orderDate instanceof Date
        ? raw.orderDate
        : new Date(raw.orderDate),

    items: (raw.items ?? []).map((i: any) => ({
      productId: i.productId ?? null,
      serviceCatalogId: i.serviceCatalogId ?? null,
      quantity: Number(i.quantity ?? 1),
      taxRate: i.taxRate ?? null,
    })),
  };

  return prisma.$transaction(async (tx) => {
    /* =====================================================
     * 1️⃣ Resolve CUSTOMER
     * ===================================================== */
    const resolvedCustomerId = await resolveCustomer(tx, input);
    const reserveData = resolveReserve(input.paymentMethod, input.reserve)
    /* =====================================================
     * 2️⃣ Reserve PRODUCT variants (lock inventory)
     * ===================================================== */

    const rawProductItems = input.items
      .filter((i) => i.productId) // bỏ item rỗng
      .map((i) => ({
        productId: i.productId as string,
        quantity: i.quantity,
        taxRate: i.taxRate ?? null,
      }));

    const resolvedItems = await resolveItemsFromDb(tx, rawProductItems);

    for (const item of resolvedItems) {
      if (item.kind !== "PRODUCT") continue;

      await updateProductVariantStt(tx, {
        productId: item.productId!,
        status: "RESERVED",
        fromStatuses: ["ACTIVE"],
      });
    }
    if (reserveData?.reserveType === "DEPOSIT" || reserveData?.reserveType === "COD") {
      input.status === OrderStatus.RESERVED
    } else {
      //input.status === OrderStatus.DRAFT
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
      hasShipment: input.hasShipment,
      notes: input.notes,
      createdAt: input.orderDate,
      status: input.status,
      source: input.source,
      verificationStatus: input.verificationStatus,
      reserveType: reserveData?.reserveType ?? null,
      depositRequired: reserveData?.depositRequired ?? null,
      reserveUntil: reserveData?.reserveUntil ?? null
    });

    /* =====================================================
     * 4️⃣ Create ORDER ITEMS
     * ===================================================== */
    const orderItemsPayload = resolvedItems.map((i) => {
      // nếu bạn chưa support discount/service ở endpoint này thì discountType/value luôn null
      const unitPriceAgreed = calcUnitPriceAgreed({
        listPrice: i.listPrice,
        discountType: null,
        discountValue: null,
      });

      return {
        kind: "PRODUCT" as const,
        productId: i.productId,
        variantId: i.variantId,
        title: i.title,
        quantity: i.quantity,
        listPrice: i.listPrice,
        unitPriceAgreed,

        // primaryImageUrl: i.primaryImageUrl ?? null, // nếu bạn muốn snapshot
      };
    });

    const createdItems = await orderRepo.createOrderItems(tx, order.id, orderItemsPayload);

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

export async function getOrderDetail(id: string) {
  return orderRepo.getOrderDetail(id, prisma);

}

export async function postOneOrderTx(
  tx: Prisma.TransactionClient,
  orderId: string,
) {
  const order = await orderRepo.getOrderForPost(tx, orderId);
  if (!order) throw new Error("Order not found");

  if (order.status !== OrderStatus.DRAFT) {
    throw new Error(`Order status must be DRAFT. Current: ${order.status}`);
  }
  const refNo =
    order.refNo ??
    (await genRefNo(tx, {
      model: tx.order,
      prefix: "OD",
      field: "refNo",
      padding: 6,
    }));

  await orderRepo.markPosted(tx, order.id, refNo);

  if (order.verificationStatus === OrderVerificationStatus.PENDING) {
    await orderRepo.verifyOrder(order.id, tx, OrderVerificationStatus.VERIFIED)
  }

  await paymentService.createPaymentsForOrder(tx, order);

  if (order.hasShipment) {
    // ✅ FIX: truyền order object, không truyền id
    await shipmentService.createFromOrderTx(tx, {
      id: order.id,
      orderRefNo: order.refNo,
      customerName: order.customerName,
      shipPhone: order.shipPhone,
      shipAddress: order.shipAddress,
      shipCity: (order as any).shipCity ?? null,
      shipDistrict: (order as any).shipDistrict ?? null,
      shipWard: (order as any).shipWard ?? null,
    });
  }

  if (order.items.some((i: any) => i.kind === "SERVICE")) {
    await serviceReqtService.createFromOrder(tx, order);
  }

  return { id: order.id, status: "POSTED" as const };
}

// 2) Wrapper: gọi cho trường hợp post 1 đơn lẻ (API /orders/[id]/post)
export async function postOneOrder(orderId: string, hasShipment: boolean) {
  return prisma.$transaction((tx) => postOneOrderTx(tx, orderId, hasShipment));
}

// order-post.service.ts
export async function postOrders(orderIds: string[], hasShipment: boolean) {
  return prisma.$transaction(async (tx) => {
    const orders = await orderRepo.getOrdersForPost(tx, orderIds);
    if (!orders.length) throw new Error("No orders found");

    let posted = 0;

    for (const o of orders) {
      // bulk -> bạn muốn “skip” những cái không DRAFT thì keep continue
      if (o.status !== OrderStatus.DRAFT) continue;

      // ✅ gọi core tx handler cho gọn
      await postOneOrderTx(tx, o.id, hasShipment);
      posted++;
    }

    return { count: posted };
  });
}

export async function cancelOrder(input: { id: string; reason?: string | null }) {
  const updated = await orderRepo.cancelOrder(input.id, prisma, input.reason ?? null);
  return serialize(updated);
}

export async function verifyOrder(input: { id: string; status: "VERIFIED" | "REJECTED" }) {
  const updated = await orderRepo.verifyOrder(input.id, prisma, input.status);
  return serialize(updated);
}

export async function getOrderDraftForEdit(orderId: string) {
  const data = await orderRepo.getDraftForEdit(prisma, orderId);
  if (!data) throw new Error("Order not found");
  return data;
}
export async function updateOrderDraft(orderId: string, input: OrderDraftInput) {
  return prisma.$transaction(async (tx) => {
    await orderRepo.assertCanEditDraft(tx, orderId);
    return orderRepo.updateDraft(tx, orderId, input);
  });
}

export async function getServiceCatalogOptions(opts?: { isActive?: boolean }) {
  const rows = await serviceRequestRepo.getOptions(prisma as any, opts);

  return rows.map((item) => ({
    id: item.id,
    code: item.code ?? null,
    name: item.name,
    defaultPrice:
      item.defaultPrice == null ? null : Number(item.defaultPrice),
    isActive: true,
  }));
}