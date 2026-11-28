import { dbOrTx, type DB } from "@/server/db/client";

export async function getOrderDetailRepo(db: DB, id: string) {
  const client = dbOrTx(db);

  return client.order.findUnique({
    where: { id },
    select: {
      id: true,
      customerId: true,
      refNo: true,
      status: true,
      paymentStatus: true,
      source: true,
      verificationStatus: true,
      reserveType: true,
      reserveUntil: true,
      depositRequired: true,
      depositPaid: true,
      customerName: true,
      shipPhone: true,
      shipAddress: true,
      shipWard: true,
      shipDistrict: true,
      shipCity: true,
      paymentMethod: true,
      hasShipment: true,
      notes: true,
      subtotal: true,
      shippingAmount: true,
      shipments: { select: { id: true, status: true } },
      createdAt: true,
      updatedAt: true,
      orderItem: {
        orderBy: [{ createdAt: "asc" }],
        select: {
          id: true,
          productId: true,
          variantId: true,
          title: true,
          img: true,
          quantity: true,
          kind: true,
          productType: true,
          listPrice: true,
          unitPriceAgreed: true,
          subtotal: true,
          serviceScope: true,
          linkedOrderItemId: true,
          customerItemNote: true,
          linkedOrderItem: { select: { title: true } },
        },
      },
    },
  });
}

export async function getOrderDraftForEditRepo(db: DB, orderId: string) {
  const client = dbOrTx(db);

  return client.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      customerId: true,
      status: true,
      refNo: true,
      customerName: true,
      shipPhone: true,
      hasShipment: true,
      shipAddress: true,
      shipCity: true,
      shipDistrict: true,
      shipWard: true,
      createdAt: true,
      paymentMethod: true,
      notes: true,
      reserveType: true,
      depositRequired: true,
      reserveUntil: true,
      orderItem: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          kind: true,
          productId: true,
          variantId: true,
          title: true,
          quantity: true,
          listPrice: true,
          unitPriceAgreed: true,
          img: true,
          serviceCatalogId: true,
          serviceScope: true,
          linkedOrderItemId: true,
          customerItemNote: true,
          taxRate: true,
        },
      },
    },
  });
}

export async function assertCanEditOrderDraftRepo(db: DB, orderId: string) {
  const client = dbOrTx(db);
  const order = await client.order.findUnique({ where: { id: orderId }, select: { status: true } });
  if (!order) throw new Error("Order không tồn tại");
  if (order.status !== "DRAFT" && order.status !== "RESERVED") {
    throw new Error(`Order không thể chỉnh sửa ở trạng thái ${order.status}`);
  }
}

// Read-only composition for Order editing; Acquisition remains the write owner.
export async function getOrderTradeInForEditRepo(db: DB, orderId: string) {
  return dbOrTx(db).acquisition.findFirst({
      where: {
        type: "TRADE_IN",
        acquisitionItem: { some: { orderItem: { orderId } } },
      },
      orderBy: { createdAt: "desc" },
      select: {
        totalAmount: true,
        notes: true,
        audienceSegment: true,
        acquisitionItem: {
          orderBy: { createdAt: "asc" },
          take: 1,
          select: {
            productId: true,
            productTitle: true,
            unitCost: true,
            product: { select: { sku: true } },
          },
        },
      },
  });
}
