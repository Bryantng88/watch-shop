"use server";

import { prisma, DB, dbOrTx } from "@/server/db/client";
import { OrderSearchInput, OrderListSort, OrderViewKey } from "../utils/search-params";
import * as orderRepo from "./order.repo";
import { calcUnitPriceAgreed } from "../utils/calculate-price-agreed";
import {
  PaymentMethod,
  Prisma,
  orderitemkind,
  ReserveType,
  OrderStatus,
  OrderSource,
  OrderVerificationStatus,
  PrismaClient,
} from "@prisma/client";
import * as customerRepo from "@/app/(admin)/admin/customers/_server/customer.repo";
import { updateProductVariantStt } from "../../products/_server/product.repo";
import * as serviceReqtService from "../../services/_server/service_request.service";
import * as shipmentService from "../../shipments/_server/shipment.service";
import * as paymentService from "../../payments/_server/payment.service";
import { OrderDraftInput } from "./order.type";
import { genRefNo } from "../../__components/AutoGenRef";

/* ================================
   TYPES
================================ */
//const prisma = new PrismaClient();

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
type ReserveInput = {
  type: ReserveType;
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
  listPrice: number;
  primaryImageUrl?: string | null;
  productType?: string;
};

function toNumberPrice(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;

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
  createdAt: Date;
  status: OrderStatus;
  items: CreateOrderItemInput[];
  source: OrderSource;
  verificationStatus: OrderVerificationStatus;
};

function resolveReserve(paymentMethod: PaymentMethod, reserve?: ReserveInput | null) {
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
  const s = typeof v === "string" ? v.trim() : "";
  return s;
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

  const qtyByProductId = new Map<string, number>();

  for (const it of items) {
    if (!it?.productId) throw new Error("Missing productId");
    const productId = String(it.productId).trim();
    const qty = assertValidQty(productId, it.quantity);
    qtyByProductId.set(productId, (qtyByProductId.get(productId) ?? 0) + qty);
  }

  const productIds = Array.from(qtyByProductId.keys());

  const products: ProductRow[] = await tx.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      title: true,
      primaryImageUrl: true,
      type: true,
      variants: {
        where: { availabilityStatus: "ACTIVE" },
        orderBy: [{ stockQty: "desc" }, { createdAt: "asc" }],
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

  const productMap = new Map<string, ProductRow>(products.map((p) => [p.id, p]));
  const missing = productIds.filter((id) => !productMap.has(id));
  if (missing.length) {
    throw new Error(`Products not found: ${missing.join(", ")}`);
  }

  const resolved: ResolvedOrderItem[] = [];

  for (const productId of productIds) {
    const p = productMap.get(productId);
    if (!p) throw new Error(`Product not found: ${productId}`);

    const chosenVariant: VariantRow | undefined = p.variants?.[0];
    if (!chosenVariant) {
      throw new Error(`No ACTIVE variant for productId=${productId}`);
    }

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

  const existingByPhone = await customerRepo.findCustomerByPhone(tx, shipPhone);
  if (existingByPhone) {
    const needUpdate =
      shipCity !== norm(existingByPhone.city) ||
      shipDistrict !== norm(existingByPhone.district) ||
      shipWard !== norm(existingByPhone.ward) ||
      shipAddress !== norm(existingByPhone.address);

    if (needUpdate) {
      await customerRepo.updateCustomer(tx, existingByPhone.id, {
        city: shipCity,
        district: shipDistrict,
        ward: shipWard,
        address: shipAddress,
      });
    }

    return existingByPhone.id;
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

function buildOrderBy(sort?: OrderListSort): Prisma.OrderOrderByWithRelationInput {
  switch (sort) {
    case "updatedAsc":
      return { updatedAt: "asc" };
    case "createdDesc":
      return { createdAt: "desc" };
    case "createdAsc":
      return { createdAt: "asc" };
    case "updatedDesc":
    default:
      return { updatedAt: "desc" };
  }
}

function viewToWhere(view?: OrderViewKey): Prisma.OrderWhereInput | undefined {
  switch (view) {
    case "web_pending":
      return {
        source: "WEB",
        verificationStatus: "PENDING",
      };

    case "need_action":
      return {
        source: "ADMIN",
        status: { in: ["DRAFT", "RESERVED"] },
        verificationStatus: { not: "PENDING" },
      };

    case "processing":
      return {
        status: "POSTED",
      };

    case "delivered":
      return {
        status: "SHIPPED",
      };

    case "completed":
      return {
        status: "COMPLETED",
      };

    case "cancelled":
      return {
        OR: [
          { status: "CANCELLED" },
          { verificationStatus: "REJECTED" },
          { verificationStatus: "EXPIRED" },
        ],
      };

    case "all":
    default:
      return undefined;
  }
}

function combineWhere(
  baseWhere?: Prisma.OrderWhereInput,
  extraWhere?: Prisma.OrderWhereInput
): Prisma.OrderWhereInput {
  if (baseWhere && extraWhere) {
    return { AND: [baseWhere, extraWhere] };
  }
  return baseWhere ?? extraWhere ?? {};
}

export async function getAdminOrderList(input: OrderSearchInput) {
  const { page, pageSize, q, sort, view } = input;

  const baseWhere: Prisma.OrderWhereInput = q
    ? {
      OR: [
        { refNo: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { shipPhone: { contains: q, mode: "insensitive" } },
      ],
    }
    : {};

  const viewWhere = viewToWhere(view);
  const where = combineWhere(baseWhere, viewWhere);

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const { rows, total } = await orderRepo.getOrdList(
    where,
    buildOrderBy(sort),
    skip,
    take,
    prisma
  );

  const [
    cAll,
    cWebPending,
    cNeedAction,
    cProcessing,
    cDelivered,
    cCompleted,
    cCancelled,
  ] = await Promise.all([
    prisma.order.count({ where: baseWhere }),
    prisma.order.count({ where: combineWhere(baseWhere, viewToWhere("web_pending")) }),
    prisma.order.count({ where: combineWhere(baseWhere, viewToWhere("need_action")) }),
    prisma.order.count({ where: combineWhere(baseWhere, viewToWhere("processing")) }),
    prisma.order.count({ where: combineWhere(baseWhere, viewToWhere("delivered")) }),
    prisma.order.count({ where: combineWhere(baseWhere, viewToWhere("completed")) }),
    prisma.order.count({ where: combineWhere(baseWhere, viewToWhere("cancelled")) }),
  ]);

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
    counts: {
      all: cAll,
      web_pending: cWebPending,
      need_action: cNeedAction,
      processing: cProcessing,
      delivered: cDelivered,
      completed: cCompleted,
      cancelled: cCancelled,
    },
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

// ... giữ nguyên phần còn lại của file như code hiện tại của bạn ...