"use server";

import { OrderSearchInput } from "../utils/search-params";
import * as orderRepo from "./order.repo";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import {
  ServiceScope,
  PaymentMethod,
  Prisma,
  OrderItemKind,
  ReserveType,
  OrderStatus,
  OrderSource,
  OrderVerificationStatus,
  PrismaClient,
} from "@prisma/client";
import * as customerRepo from "@/app/(admin)/admin/customers/_server/customer.repo";
import * as serviceReqtService from "../../services/_server/service_request.service";
import * as shipmentService from "../../shipments/_server/shipment.service";
import * as paymentService from "../../payments/_server/payment.service";
import { OrderDraftInput } from "./order.type";
import { genRefNo } from "../../__components/AutoGenRef";

const prisma = new PrismaClient();

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
  unitPriceAgreed?: number;
  kind: OrderItemKind;
  discountType?: "PERCENT" | "AMOUNT";
  discountValue?: number;
  serviceCatalogId: string;
  taxRate?: number;
  createdFromFlow?: "STANDARD" | "QUICK_ORDER";
  serviceScope?: "WITH_PURCHASE" | "CUSTOMER_ITEM" | null;
  linkedOrderItemId?: string | null;
  customerItemNote?: string | null;
};

type ReserveInput = {
  type: ReserveType;
  amount?: number;
  expiresAt?: Date | null;
};

type RawProductItem = {
  productId: string;
  quantity: number;
};

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
  quickFromProductId?: string | null;
  quickFlowType?: "STANDARD" | "QUICK_ORDER" | null;
};

export type ResolvedOrderItem = {
  kind: "PRODUCT";
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  listPrice: number;
  primaryImageUrl?: string | null;
  productType?: string;
  variantAvailabilityStatus?: string | null;
  productStatus?: string | null;
};

/* ================================
   HELPERS
================================ */

function toNumberPrice(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;

  const anyV = v as any;
  if (typeof anyV?.toNumber === "function") return anyV.toNumber();

  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function assertValidQty(productId: string, quantity: number) {
  const q = Number(quantity ?? 1);
  if (!Number.isFinite(q) || q <= 0) {
    throw new Error(`Invalid quantity for productId=${productId}`);
  }
  return q;
}

function resolveReserve(
  paymentMethod: PaymentMethod,
  reserve?: ReserveInput | null
) {
  if (!reserve) return null;

  if (paymentMethod === "COD") {
    return {
      reserveType: "COD" as ReserveType,
      depositRequired: reserve.amount ?? 0,
      reserveUntil: null,
    };
  }

  return {
    reserveType: reserve.type,
    depositRequired: reserve.amount ?? 0,
    reserveUntil: reserve.expiresAt ?? null,
  };
}

function norm(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function serialize(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (value instanceof Date) return value.toISOString();
      if (typeof value === "object" && value?._isDecimal) return Number(value);
      return value;
    })
  );
}

function toPlain<T>(value: T): T {
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map((item) => toPlain(item)) as T;
  }

  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (typeof value === "object") {
    if ((value as any)?.constructor?.name === "Decimal") {
      return Number(value) as T;
    }

    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      out[k] = toPlain(v);
    }
    return out as T;
  }

  return value;
}

/* ================================
   PRODUCT RESOLUTION FOR ORDER
================================ */

export async function resolveItemsFromDb(
  tx: Prisma.TransactionClient,
  items: RawProductItem[],
  opts?: {
    strictActiveOnly?: boolean;
  }
): Promise<ResolvedOrderItem[]> {
  if (!items?.length) return [];

  const strictActiveOnly = opts?.strictActiveOnly !== false;
  const qtyByProductId = new Map<string, number>();

  for (const it of items) {
    if (!it?.productId) throw new Error("Missing productId");

    const productId = String(it.productId).trim();
    const qty = assertValidQty(productId, it.quantity);

    qtyByProductId.set(productId, (qtyByProductId.get(productId) ?? 0) + qty);
  }

  const productIds = Array.from(qtyByProductId.keys());
  const products = await orderRepo.getProductsForOrderResolution(tx as any, productIds);

  const productMap = new Map<string, any>(products.map((p: any) => [p.id, p]));
  const missing = productIds.filter((id) => !productMap.has(id));

  if (missing.length) {
    throw new Error(`Products not found: ${missing.join(", ")}`);
  }

  const resolved: ResolvedOrderItem[] = [];

  for (const productId of productIds) {
    const p = productMap.get(productId);
    if (!p) throw new Error(`Product not found: ${productId}`);

    const productStatus = String(p.status || "").toUpperCase();

    if (productStatus === "SOLD") {
      throw new Error(`Product already SOLD: ${productId}`);
    }

    if (productStatus === "CONSIGNED_TO") {
      throw new Error(`Product is consigned: ${productId}`);
    }

    const variants = Array.isArray(p.variants) ? p.variants : [];
    if (!variants.length) {
      throw new Error(`No variant for productId=${productId}`);
    }

    const chosenVariant =
      strictActiveOnly
        ? variants.find(
          (v: any) => String(v.availabilityStatus || "").toUpperCase() === "ACTIVE"
        )
        : variants.find((v: any) =>
          ["ACTIVE", "HIDDEN"].includes(
            String(v.availabilityStatus || "").toUpperCase()
          )
        ) ?? variants[0];

    if (!chosenVariant) {
      throw new Error(
        strictActiveOnly
          ? `No ACTIVE variant for productId=${productId}`
          : `No sellable variant for productId=${productId}`
      );
    }

    const qty = qtyByProductId.get(productId)!;

    if (
      chosenVariant.stockQty != null &&
      Number(chosenVariant.stockQty) > 0 &&
      Number(chosenVariant.stockQty) < qty
    ) {
      throw new Error(
        `Not enough stock for productId=${productId}. Need ${qty}, available ${chosenVariant.stockQty}`
      );
    }

    resolved.push({
      kind: "PRODUCT",
      productId: p.id,
      variantId: chosenVariant.id,
      title: p.title ?? "",
      quantity: qty,
      listPrice: toNumberPrice(chosenVariant.price),
      primaryImageUrl: p.primaryImageUrl ?? null,
      productType: String(p.type ?? ""),
      variantAvailabilityStatus: chosenVariant.availabilityStatus ?? null,
      productStatus: p.status ?? null,
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

export async function getOrderDetail(id: string) {
  return orderRepo.getOrderDetail(id, prisma);
}

/* ================================
   CREATE / UPDATE
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
        expiresAt: raw.reserve.expiresAt ? new Date(raw.reserve.expiresAt) : null,
      }
      : null,
    status: (raw.status as OrderStatus) ?? OrderStatus.DRAFT,
    shipAddress: raw.shipAddress ?? null,
    shipCity: raw.shipCity ?? null,
    shipDistrict: raw.shipDistrict ?? null,
    hasShipment: Boolean(raw.hasShipment),
    shipWard: raw.shipWard ?? null,
    source: (raw.source as OrderSource) ?? OrderSource.ADMIN,
    verificationStatus:
      (raw.verificationStatus as OrderVerificationStatus) ??
      OrderVerificationStatus.VERIFIED,
    paymentMethod:
      (raw.paymentMethod as PaymentMethod) ?? PaymentMethod.BANK_TRANSFER,
    notes: raw.notes ?? null,
    orderDate:
      raw.createdAt
        ? new Date(raw.createdAt)
        : raw.orderDate instanceof Date
          ? raw.orderDate
          : new Date(),
    quickFromProductId: raw.quickFromProductId ?? null,
    quickFlowType: raw.quickFlowType ?? "STANDARD",
    items: (raw.items ?? []).map((i: any) => ({
      productId: i.productId ?? null,
      variantId: i.variantId ?? null,
      title: i.title ?? "",
      img: i.img ?? null,
      quantity: Number(i.quantity ?? 1),
      listPrice: Number(i.listPrice ?? 0),
      unitPriceAgreed: Number(i.unitPriceAgreed ?? i.listPrice ?? 0),
      kind: i.kind ?? "PRODUCT",
      discountType: i.discountType ?? null,
      discountValue: i.discountValue ?? null,
      serviceCatalogId: i.serviceCatalogId ?? null,
      taxRate: i.taxRate ?? null,
      createdFromFlow: i.createdFromFlow ?? raw.quickFlowType ?? "STANDARD",
      serviceScope: i.serviceScope ?? null,
      linkedOrderItemId: i.linkedOrderItemId ?? null,
      customerItemNote: i.customerItemNote ?? null,
    })) as CreateOrderItemInput[],
  };

  return prisma.$transaction(async (tx) => {
    const resolvedCustomerId = await resolveCustomer(tx, input);
    const reserveData = resolveReserve(input.paymentMethod, input.reserve);

    const rawProductItems = input.items
      .filter((i) => i.kind === "PRODUCT" && i.productId)
      .map((i) => ({
        productId: i.productId as string,
        quantity: Number(i.quantity ?? 1),
      }));

    const strictActiveOnly = input.quickFlowType === "QUICK_ORDER" ? false : true;

    const resolvedProductItems = await resolveItemsFromDb(tx, rawProductItems, {
      strictActiveOnly,
    });

    const variantIdsToReserve = resolvedProductItems
      .map((item) => item.variantId)
      .filter(Boolean);

    await orderRepo.reserveVariantIdsForOrder(tx as any, {
      variantIds: variantIdsToReserve,
      strictActiveOnly,
    });

    const order = await orderRepo.createOrder(tx, {
      customerId: resolvedCustomerId,
      customerName: input.customerName,
      shipPhone: input.shipPhone ?? "",
      shipAddress: input.shipAddress,
      shipCity: input.shipCity,
      shipDistrict: input.shipDistrict,
      shipWard: input.shipWard,
      paymentMethod: input.paymentMethod,
      hasShipment: input.hasShipment,
      notes: input.notes,
      createdAt: input.orderDate,
      status: input.status,
      source: input.source,
      verificationStatus: input.verificationStatus,
      reserveType: reserveData?.reserveType ?? null,
      depositRequired: reserveData?.depositRequired ?? null,
      reserveUntil: reserveData?.reserveUntil ?? null,
      quickFromProductId: input.quickFromProductId ?? null,
      quickFlowType: input.quickFlowType ?? "STANDARD",
    });

    const productOrderItemsPayload = resolvedProductItems.map((i) => {
      const inputMatched = input.items.find(
        (x) => x.kind === "PRODUCT" && x.productId === i.productId
      );

      const manualPrice =
        inputMatched?.listPrice != null && Number(inputMatched.listPrice) > 0
          ? Number(inputMatched.listPrice)
          : i.listPrice;

      const manualUnitPrice =
        inputMatched?.unitPriceAgreed != null &&
          Number(inputMatched.unitPriceAgreed) > 0
          ? Number(inputMatched.unitPriceAgreed)
          : null;

      const unitPriceAgreed =
        manualUnitPrice ??
        calcUnitPriceAgreed({
          listPrice: manualPrice,
          discountType: null,
          discountValue: null,
        });

      return {
        kind: "PRODUCT" as const,
        productId: i.productId,
        variantId: i.variantId,
        title: i.title,
        img: i.primaryImageUrl ?? null,
        quantity: i.quantity,
        listPrice: manualPrice,
        unitPriceAgreed,
        serviceCatalogId: null as any,
        serviceScope: null as any,
        taxRate: null,
        customerItemNote: null as any,
        createdFromFlow:
          inputMatched?.createdFromFlow ?? input.quickFlowType ?? "STANDARD",
      };
    });

    const serviceOrderItemsPayload = input.items
      .filter((i) => i.kind === "SERVICE")
      .map((i) => ({
        kind: "SERVICE" as const,
        productId: null,
        variantId: null,
        title: i.title,
        img: i.img ?? null,
        quantity: Number(i.quantity ?? 1),
        listPrice: Number(i.listPrice ?? 0),
        unitPriceAgreed: Number(i.unitPriceAgreed ?? i.listPrice ?? 0),
        serviceCatalogId: i.serviceCatalogId ?? null,
        serviceScope: (i.serviceScope ?? "CUSTOMER_ITEM") as any,
        taxRate: i.taxRate ?? null,
        customerItemNote: i.customerItemNote ?? null,
        createdFromFlow: i.createdFromFlow ?? input.quickFlowType ?? "STANDARD",
      }));

    const orderItemsPayload = [
      ...productOrderItemsPayload,
      ...serviceOrderItemsPayload,
    ];

    const createdItems = await orderRepo.createOrderItems(
      tx,
      order.id,
      orderItemsPayload as any
    );

    const subtotal = createdItems.reduce(
      (sum, i: any) => sum + Number(i.subtotal ?? 0),
      0
    );

    await orderRepo.updateSubtotal(tx, order.id, subtotal);

    return orderRepo.getOrderLite(tx, order.id);
  });
}

/* ================================
   POST ORDER
================================ */

export async function postOneOrderTx(
  tx: Prisma.TransactionClient,
  orderId: string,
  _hasShipment?: boolean
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
    await orderRepo.verifyOrder(order.id, tx as any, OrderVerificationStatus.VERIFIED);
  }

  await paymentService.createPaymentsForOrder(tx as any, order);

  if (order.hasShipment) {
    await shipmentService.createFromOrderTx(tx as any, {
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
    await serviceReqtService.createFromOrderTx(tx as any, order);

  }

  return { id: order.id, status: "POSTED" as const };
}

export async function postOneOrder(orderId: string, hasShipment: boolean) {
  return prisma.$transaction((tx) => postOneOrderTx(tx, orderId, hasShipment));
}

export async function postOrders(orderIds: string[], hasShipment: boolean) {
  return prisma.$transaction(async (tx) => {
    const orders = await orderRepo.getOrdersForPost(tx, orderIds);
    if (!orders.length) throw new Error("No orders found");

    let posted = 0;

    for (const o of orders) {
      if (o.status !== OrderStatus.DRAFT) continue;
      await postOneOrderTx(tx, o.id, hasShipment);
      posted++;
    }

    return { count: posted };
  });
}

/* ================================
   OTHER COMMANDS
================================ */

export async function cancelOrder(input: { id: string; reason?: string | null }) {
  const updated = await orderRepo.cancelOrder(input.id, prisma, input.reason ?? null);
  return serialize(updated);
}

export async function verifyOrder(input: {
  id: string;
  status: "VERIFIED" | "REJECTED";
}) {
  const updated = await orderRepo.verifyOrder(input.id, prisma, input.status);
  return serialize(updated);
}

export async function getOrderDraftForEdit(orderId: string) {
  const data = await orderRepo.getDraftForEdit(prisma, orderId);
  if (!data) throw new Error("Order not found");

  const normalized = {
    ...data,
    reserve: data.reserveType
      ? {
        type: data.reserveType,
        amount: Number(data.depositRequired ?? 0),
        expiresAt: data.reserveUntil ?? null,
      }
      : null,
    items: (data.items ?? []).map((it: any) => ({
      ...it,
      listPrice: Number(it.listPrice ?? 0),
      unitPriceAgreed: Number(it.unitPriceAgreed ?? it.listPrice ?? 0),
      quantity: Number(it.quantity ?? 1),
      taxRate: it.taxRate == null ? null : Number(it.taxRate),
    })),
  };

  return toPlain(normalized);
}

export async function updateOrderDraft(orderId: string, input: OrderDraftInput) {
  return prisma.$transaction(async (tx) => {
    await orderRepo.assertCanEditDraft(tx, orderId);
    return orderRepo.updateDraft(tx as any, orderId, input);
  });
}

export async function getServiceCatalogOptions(opts?: { isActive?: boolean }) {
  const rows = await prisma.serviceCatalog.findMany({
    where:
      typeof opts?.isActive === "boolean"
        ? { isActive: opts.isActive }
        : { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      code: true,
      name: true,
      defaultPrice: true,
      isActive: true,
    },
  });

  return rows.map((item) => ({
    id: item.id,
    code: item.code ?? null,
    name: item.name,
    defaultPrice: item.defaultPrice == null ? null : Number(item.defaultPrice),
    isActive: item.isActive,
  }));
}