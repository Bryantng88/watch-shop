import { prisma } from "@/server/db/client";

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

export async function getDashboardOverviewRepo() {
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
    prisma.watch.groupBy({
      by: ["saleStage"],
      _count: { _all: true },
    }),

    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    prisma.shipment.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    prisma.acquisition.groupBy({
      by: ["accquisitionStt"],
      _count: { _all: true },
    }),

    prisma.order.count(),

    prisma.order.aggregate({
      _sum: {
        subtotal: true,
        shippingFee: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        direction: "IN" as any,
        status: "PAID" as any,
      },
      _sum: { amount: true },
    }),

    prisma.payment.aggregate({
      where: {
        direction: "IN" as any,
        status: "COLLECTED" as any,
      },
      _sum: { amount: true },
    }),

    prisma.payment.aggregate({
      where: {
        direction: "IN" as any,
        status: "UNPAID" as any,
      },
      _sum: { amount: true },
    }),

    prisma.order.findMany({
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

    prisma.shipment.findMany({
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

    prisma.watch.findMany({
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

    prisma.acquisition.findMany({
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

    prisma.watch.count({
      where: {
        saleStage: "PROCESSING" as any,
        watchContent: null,
      },
    }),

    prisma.watch.count({
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

    prisma.watch.count({
      where: {
        saleStage: "READY" as any,
        reviewStates: {
          some: {
            status: "SUBMITTED" as any,
          },
        },
      },
    }),

    prisma.watch.count({
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

    prisma.watch.count({
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

    prisma.watch.count({
      where: {
        isContentDownloaded: true,
        isImageDownloaded: true,
      },
    }),

    prisma.shipment.count({
      where: {
        status: { in: ["READY", "SHIPPED"] as any },
        OR: [{ trackingCode: null }, { trackingCode: "" }],
      },
    }),

    prisma.shipment.count({
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
  const shippingFee = toNumber(orderMoneyAgg._sum.shippingFee);
  const orderValue = subtotal + shippingFee;
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
