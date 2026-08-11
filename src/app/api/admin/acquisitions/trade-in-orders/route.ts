import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requireAnyPermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export async function GET(req: NextRequest) {
  const auth = await requireAnyPermissionApi([
    PERMISSIONS.WATCH_ACQUISITION_CREATE,
    PERMISSIONS.ACQUISITION_CREATE_ALL,
  ]);
  if (auth instanceof Response) return auth;

  const q = String(req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ items: [] });

  const rows = await prisma.order.findMany({
    where: {
      OR: [
        { refNo: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { shipPhone: { contains: q } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      refNo: true,
      status: true,
      customerId: true,
      customerName: true,
      shipPhone: true,
      createdAt: true,
      orderItem: {
        where: { kind: "PRODUCT" },
        orderBy: { createdAt: "asc" },
        select: { id: true, title: true },
      },
    },
  });

  const unlinkedPhones = Array.from(new Set(
    rows.filter((row) => !row.customerId).map((row) => row.shipPhone).filter((phone): phone is string => Boolean(phone)),
  ));
  const customersByPhone = unlinkedPhones.length
    ? await prisma.customer.findMany({
        where: { phone: { in: unlinkedPhones } },
        select: { id: true, phone: true },
      })
    : [];
  const customerIdByPhone = new Map(customersByPhone.map((customer) => [customer.phone, customer.id]));
  const effectiveCustomerId = (row: (typeof rows)[number]) =>
    row.customerId ?? (row.shipPhone ? customerIdByPhone.get(row.shipPhone) ?? null : null);
  const customerIds = Array.from(new Set(rows.map(effectiveCustomerId).filter((id): id is string => Boolean(id))));
  const purchasedRows = customerIds.length
    ? await prisma.orderItem.findMany({
        where: {
          kind: "PRODUCT",
          productId: { not: null },
          product: { type: "WATCH", status: "SOLD" },
          order: {
            customerId: { in: customerIds },
            status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED", "POSTED"] },
          },
          acquisitionItem: {
            none: {
              acquisition: {
                type: "TRADE_IN",
                accquisitionStt: { not: "CANCELED" },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderId: true,
          productId: true,
          variantId: true,
          title: true,
          img: true,
          order: { select: { customerId: true, refNo: true, createdAt: true } },
          product: { select: { primaryImageUrl: true, storefrontImageKey: true } },
        },
      })
    : [];

  const purchasedProductIds = Array.from(new Set(purchasedRows.map((item) => item.productId).filter((id): id is string => Boolean(id))));
  const saleHistory = purchasedProductIds.length
    ? await prisma.orderItem.findMany({
        where: {
          kind: "PRODUCT",
          productId: { in: purchasedProductIds },
          order: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED", "POSTED"] } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: { id: true, productId: true },
      })
    : [];
  const latestSaleByProductId = new Map<string, string>();
  for (const item of saleHistory) {
    if (item.productId && !latestSaleByProductId.has(item.productId)) latestSaleByProductId.set(item.productId, item.id);
  }

  const purchasedByCustomerId = new Map<string, typeof purchasedRows>();
  for (const item of purchasedRows) {
    if (!item.productId || latestSaleByProductId.get(item.productId) !== item.id) continue;
    const customerId = item.order.customerId;
    if (!customerId) continue;
    purchasedByCustomerId.set(customerId, [...(purchasedByCustomerId.get(customerId) ?? []), item]);
  }

  return NextResponse.json({
    items: rows.map((row) => ({
      id: row.id,
      refNo: row.refNo,
      status: row.status,
      customerId: effectiveCustomerId(row),
      customerName: row.customerName,
      customerPhone: row.shipPhone,
      createdAt: row.createdAt,
      sourceOrderItemId: row.orderItem[0]?.id ?? null,
      productTitle: row.orderItem[0]?.title ?? null,
      purchasedWatches: effectiveCustomerId(row)
        ? (purchasedByCustomerId.get(effectiveCustomerId(row)!) ?? []).map((item) => ({
            sourceOrderItemId: item.id,
            sourceOrderId: item.orderId,
            sourceOrderRefNo: item.order.refNo,
            productId: item.productId,
            variantId: item.variantId,
            title: item.title,
            imageUrl: item.img ?? item.product?.primaryImageUrl ?? null,
            imageKey: item.product?.storefrontImageKey ?? null,
            purchasedAt: item.order.createdAt,
          }))
        : [],
    })),
  });
}
