import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { OrderDraftInput, OrderItemInput } from "../shared";
import { normalizeReserveType } from "../../shared/order-reserve-type";

export async function findCustomerByIdRepo(db: DB, id: string) {
  return dbOrTx(db).customer.findUnique({ where: { id } });
}

export async function findCustomerByPhoneRepo(db: DB, phone: string) {
  return dbOrTx(db).customer.findFirst({ where: { phone } });
}

export async function createCustomerRepo(
  db: DB,
  data: { name: string; phone: string; city?: string; district?: string; ward?: string; address?: string },
) {
  return dbOrTx(db).customer.create({ data });
}

export async function updateCustomerAddressRepo(
  db: DB,
  id: string,
  data: { city?: string; district?: string; ward?: string; address?: string },
) {
  return dbOrTx(db).customer.update({ where: { id }, data });
}

export async function getProductsForOrderResolutionRepo(db: DB, productIds: string[]) {
  return dbOrTx(db).product.findMany({
    where: { id: { in: productIds }, contentStatus: { not: "ARCHIVED" as any } },
    select: {
      id: true,
      title: true,
      primaryImageUrl: true,
      type: true,
      status: true,
      productVariant: {
        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          availabilityStatus: true,
          price: true,
          salePrice: true,
          listPrice: true,
          stockQty: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

export async function createOrderRepo(db: DB, data: Prisma.OrderUncheckedCreateInput) {
  return dbOrTx(db).order.create({ data, select: { id: true } });
}


async function buildOrderItemInventorySnapshots(client: ReturnType<typeof dbOrTx>, productIds: string[]) {
  const cleanIds = Array.from(new Set(productIds.map((id) => String(id ?? "").trim()).filter(Boolean)));
  if (!cleanIds.length) return new Map<string, any>();

  const rows = await client.product.findMany({
    where: { id: { in: cleanIds } },
    select: {
      id: true,
      status: true,
      watch: {
        select: {
          saleStage: true,
          stockStage: true,
          serviceStage: true,
        } as any,
      },
    },
  } as any);

  return new Map(
    rows.map((row: any) => [
      row.id,
      {
        previousProductStatus: row.status ?? null,
        previousSaleStage: row.watch?.saleStage ?? null,
        previousStockStage: row.watch?.stockStage ?? null,
        previousServiceStage: row.watch?.serviceStage ?? null,
      },
    ]),
  );
}

export async function createOrderItemsRepo(db: DB, orderId: string, items: OrderItemInput[]) {
  const client = dbOrTx(db);
  if (!items.length) return [];

  const snapshotByProductId = await buildOrderItemInventorySnapshots(
    client,
    items.map((item) => item.productId ?? null).filter(Boolean) as string[],
  );

  const rows = items.map((item) => {
    const quantity = Number(item.quantity ?? 1) || 1;
    const unitPriceAgreed = Number(item.unitPriceAgreed ?? item.listPrice ?? 0);
    const subtotal = unitPriceAgreed * quantity;
    const snapshot = item.productId ? snapshotByProductId.get(item.productId) : null;

    return {
      orderId,
      productId: item.productId ?? null,
      variantId: item.variantId ?? null,
      title: item.title,
      img: item.img ?? null,
      serviceCatalogId: item.serviceCatalogId ?? null,
      serviceScope: item.serviceScope ?? null,
      listPrice: new Prisma.Decimal(Number(item.listPrice ?? 0)),
      kind: item.kind as any,
      unitPriceAgreed: new Prisma.Decimal(unitPriceAgreed),
      quantity,
      subtotal: new Prisma.Decimal(subtotal),
      taxRate: item.taxRate == null ? null : new Prisma.Decimal(Number(item.taxRate)),
      customerItemNote: item.customerItemNote ?? null,
      linkedOrderItemId: item.linkedOrderItemId ?? null,
      createdFromFlow: (item.createdFromFlow ?? "STANDARD") as any,
      previousProductStatus: snapshot?.productStatus ?? null,
      previousStockStage: snapshot?.stockStage ?? null,
      previousServiceStage: snapshot?.serviceStage ?? null,
    } as any;
  });

  await client.orderItem.createMany({ data: rows });
  return rows;
}

export async function updateOrderSubtotalRepo(db: DB, orderId: string, subtotal: number) {
  return dbOrTx(db).order.update({ where: { id: orderId }, data: { subtotal: new Prisma.Decimal(subtotal) } });
}

export async function reserveVariantIdsForOrderRepo(
  db: DB,
  input: { variantIds: string[]; strictActiveOnly?: boolean },
) {
  if (!input.variantIds.length) return { count: 0 };
  return dbOrTx(db).productVariant.updateMany({
    where: {
      id: { in: input.variantIds },
      availabilityStatus:
        input.strictActiveOnly === false ? ({ in: ["ACTIVE", "HIDDEN"] } as any) : ("ACTIVE" as any),
    },
    data: { availabilityStatus: "RESERVED" as any },
  });
}

export async function replaceOrderDraftRepo(db: DB, orderId: string, input: OrderDraftInput) {
  const client = dbOrTx(db);

  await client.order.update({
    where: { id: orderId },
    data: {
      customerName: input.customerName,
      shipPhone: input.shipPhone ?? "",
      hasShipment: input.hasShipment,
      shipAddress: input.shipAddress ?? "",
      shipCity: input.shipCity ?? "",
      shipDistrict: input.shipDistrict ?? null,
      shipWard: input.shipWard ?? null,
      createdAt: new Date(input.createdAt),
      paymentMethod: input.paymentMethod,
      notes: input.notes ?? null,
      reserveType: normalizeReserveType(input.reserveType),
      depositRequired: input.reserve ? new Prisma.Decimal(Number(input.reserve.amount ?? 0)) : new Prisma.Decimal(0),
      reserveUntil: input.reserve?.expiresAt ? new Date(input.reserve.expiresAt) : null,
    },
    select: { id: true },
  });

  await client.orderItem.deleteMany({ where: { orderId } });
  const rows = await createOrderItemsRepo(client as any, orderId, input.items);
  const subtotal = rows.reduce((sum, row: any) => sum + Number(row.subtotal ?? 0), 0);
  await updateOrderSubtotalRepo(client as any, orderId, subtotal);

  return { id: orderId };
}
