import { dbOrTx, prisma, type DB } from "@/server/db/client";

function toNumber(value: unknown) {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const decimalLike = value as { toNumber?: () => number };
  if (typeof decimalLike?.toNumber === "function") return decimalLike.toNumber();

  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function makeCountMap(rows: Array<Record<string, any>>, field: string) {
  const map = new Map<string, number>();

  rows.forEach((row) => {
    const key = String(row[field] ?? "").toUpperCase();
    const count = Number(row._count?._all ?? 0);
    map.set(key, count);
  });

  return map;
}

export async function getDashboardOverviewRepo(db: DB = prisma) {
  const client = dbOrTx(db);
  const [
    watchBySaleStage,
    orderByStatus,
    shipmentByStatus,
    acquisitionByStatus,
    orderTotal,
    orderMoneyAgg,
    paidPaymentAgg,
    collectedCodAgg,
    pendingPaymentAgg,
    recentOrders,
    recentShipments,
    recentWatches,
    recentAcquisitions,
    watchMissingContent,
    watchMissingImage,
    watchSubmitted,
    watchPartialApproved,
    watchApproved,
    watchPosted,
    shipmentNoTracking,
    shipmentCodPending,
  ] = await Promise.all([
    client.watch.groupBy({
      by: ["saleStage"],
      _count: { _all: true },
    }),

    client.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    client.shipment.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    client.acquisition.groupBy({
      by: ["accquisitionStt"],
      _count: { _all: true },
    }),

    client.order.count(),

    client.order.aggregate({
      _sum: {
        subtotal: true,
        shippingAmount: true,
      },
    }),

    client.payment.aggregate({
      where: {
        direction: "IN" as any,
        status: "PAID" as any,
      },
      _sum: { amount: true },
    }),

    client.payment.aggregate({
      where: {
        direction: "IN" as any,
        status: "COLLECTED" as any,
      },
      _sum: { amount: true },
    }),

    client.payment.aggregate({
      where: {
        direction: "IN" as any,
        status: "UNPAID" as any,
      },
      _sum: { amount: true },
    }),

    client.order.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        refNo: true,
        customerName: true,
        status: true,
        updatedAt: true,
      },
    }),

    client.shipment.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        refNo: true,
        orderRefNo: true,
        customerName: true,
        status: true,
        updatedAt: true,
      },
    }),

    client.watch.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        productId: true,
        saleStage: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            title: true,
            sku: true,
          },
        },
      },
    }),

    client.acquisition.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        refNo: true,
        accquisitionStt: true,
        updatedAt: true,
        vendor: {
          select: {
            name: true,
          },
        },
      },
    }),

    client.watch.count({
      where: {
        saleStage: "PROCESSING" as any,
        watchContent: null,
      },
    }),

    client.watch.count({
      where: {
        saleStage: "PROCESSING" as any,
        product: {
          productImage: {
            none: {
              role: "GALLERY" as any,
            },
          },
        },
      },
    }),

    client.watch.count({
      where: {
        saleStage: "READY" as any,
        reviewStates: {
          some: {
            status: "SUBMITTED" as any,
          },
        },
      },
    }),

    client.watch.count({
      where: {
        saleStage: "READY" as any,
        OR: [
          {
            AND: [
              {
                reviewStates: {
                  some: {
                    targetType: "CONTENT" as any,
                    status: "APPROVED" as any,
                  },
                },
              },
              {
                reviewStates: {
                  some: {
                    targetType: "IMAGE" as any,
                    status: { not: "APPROVED" as any },
                  },
                },
              },
            ],
          },
          {
            AND: [
              {
                reviewStates: {
                  some: {
                    targetType: "IMAGE" as any,
                    status: "APPROVED" as any,
                  },
                },
              },
              {
                reviewStates: {
                  some: {
                    targetType: "CONTENT" as any,
                    status: { not: "APPROVED" as any },
                  },
                },
              },
            ],
          },
        ],
      },
    }),

    client.watch.count({
      where: {
        saleStage: "READY" as any,
        AND: [
          {
            reviewStates: {
              some: {
                targetType: "CONTENT" as any,
                status: "APPROVED" as any,
              },
            },
          },
          {
            reviewStates: {
              some: {
                targetType: "IMAGE" as any,
                status: "APPROVED" as any,
              },
            },
          },
          {
            OR: [
              { isContentDownloaded: false },
              { isImageDownloaded: false },
            ],
          },
        ],
      },
    }),

    client.watch.count({
      where: {
        isContentDownloaded: true,
        isImageDownloaded: true,
      },
    }),

    client.shipment.count({
      where: {
        status: { in: ["READY", "SHIPPED"] as any },
        OR: [{ trackingCode: null }, { trackingCode: "" }],
      },
    }),

    client.shipment.count({
      where: {
        status: "DELIVERED" as any,
        order: {
          reserveType: "COD" as any,
          paymentStatus: { not: "PAID" as any },
        },
      },
    }),
  ]);

  const subtotal = toNumber(orderMoneyAgg._sum.subtotal);
  const shippingAmount = toNumber(orderMoneyAgg._sum.shippingAmount);
  const orderValue = subtotal + shippingAmount;
  const paidAmount = toNumber(paidPaymentAgg._sum.amount);
  const collectedCodAmount = toNumber(collectedCodAgg._sum.amount);
  const pendingPaymentAmount = toNumber(pendingPaymentAgg._sum.amount);

  return {
    watchStageMap: makeCountMap(watchBySaleStage, "saleStage"),
    orderStatusMap: makeCountMap(orderByStatus, "status"),
    shipmentStatusMap: makeCountMap(shipmentByStatus, "status"),
    acquisitionStatusMap: makeCountMap(acquisitionByStatus, "accquisitionStt"),
    orderTotal,
    finance: {
      orderValue,
      paidAmount,
      collectedCodAmount,
      pendingPaymentAmount,
      remainingAmount: Math.max(0, orderValue - paidAmount - collectedCodAmount),
    },
    recentOrders,
    recentShipments,
    recentWatches,
    recentAcquisitions,
    watchReview: {
      missingContent: watchMissingContent,
      missingImage: watchMissingImage,
      submitted: watchSubmitted,
      partialApproved: watchPartialApproved,
      approved: watchApproved,
      posted: watchPosted,
    },
    shipmentOps: {
      noTracking: shipmentNoTracking,
      codPending: shipmentCodPending,
    },
  };
}
