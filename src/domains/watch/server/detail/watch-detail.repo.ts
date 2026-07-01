import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";

export async function getAdminWatchRow(db: DB, productId: string) {
  const client = dbOrTx(db);

  return client.watch.findUnique({
    where: { productId },
    include: {
      product: {
        include: {
          brand: true,
          vendor: true,
          productCategory: true,
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
          postTargets: {
            include: {
              postTarget: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
      reviewStates: true,

    },
  });
}

export async function getAdminEditWatchDetail(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    include: {
      product: {
        include: {
          brand: true,
          vendor: true,
          productCategory: true,
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
          postTargets: {
            include: { postTarget: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
      reviewStates: true,
    },
  });

  if (!watch) return null;

  const openTaskCount = await client.task.count({
    where: {
      watchId: watch.id,
      status: { in: ["TODO", "IN_PROGRESS"] },
    },
  });

  return {
    ...watch,
    taskSummary: {
      watchImage: openTaskCount,
      watchContent: openTaskCount,
      watchReview: openTaskCount,
    },
    watchReview: openTaskCount,
  };
}

export async function getAdminWatchDetail(db: DB, productId: string) {
  return getAdminWatchRow(db, productId);
}

export async function getLatestWatchVariantForAdmin(_db: DB, _productId: string) {
  return null;
}

export async function getOpenServiceWatches(db: DB) {
  const client = dbOrTx(db);

  return client.watch.findMany({
    where: {
      serviceStage: {
        in: ["PENDING", "IN_SERVICE"],
      },
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          status: true,
        },
      },
      watchPrice: {
        select: {
          salePrice: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getWatchTradeHistory(db: DB, productId: string) {
  const client = dbOrTx(db);

  const [acquisitionItems, orderItems] = await Promise.all([
    client.acquisitionItem.findMany({
      where: { productId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        acquisition: {
          include: {
            vendor: true,
          },
        },
      },
    }),

    client.orderItem.findMany({
      where: { productId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        order: true,
      },
    }),
  ]);

  return {
    acquisitions: acquisitionItems.map((item: any) => ({
      id: item.id,
      type: "ACQUISITION",
      acquisitionId: item.acquisitionId,
      code: item.acquisition?.refNo ?? item.acquisitionId,
      acquisitionCode: item.acquisition?.refNo ?? item.acquisitionId,
      status: item.acquisition?.accquisitionStt ?? item.status ?? null,
      acquisitionType: item.acquisition?.type ?? null,
      unitCost: item.unitCost ?? null,
      amount: item.unitCost ?? null,
      vendor: item.acquisition?.vendor ?? null,
      vendorName: item.acquisition?.vendor?.name ?? null,
      createdAt: item.acquisition?.createdAt ?? item.createdAt,
      updatedAt: item.acquisition?.updatedAt ?? item.updatedAt,
    })),

    orders: orderItems.map((item: any) => ({
      id: item.id,
      type: "ORDER",
      orderId: item.orderId,
      code: item.order?.refNo ?? item.orderId,
      orderCode: item.order?.refNo ?? item.orderId,
      status: item.order?.status ?? null,
      salePrice: item.unitPriceAgreed ?? item.listPrice ?? null,
      amount: item.unitPriceAgreed ?? item.listPrice ?? null,
      customerName: item.order?.customerName ?? null,
      createdAt: item.order?.createdAt ?? item.createdAt,
      updatedAt: item.order?.updatedAt ?? item.updatedAt,
    })),
  };
}

export async function getWatchServiceHistory(db: DB, productId: string) {
  const client = dbOrTx(db);

  const rows = await client.serviceRequest.findMany({
    where: { productId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    include: {
      vendor: true,
    },
  });

  return rows.map((item: any) => ({
    id: item.id,
    issue: item.refNo ?? item.serviceName ?? "Service request",
    title: item.refNo ?? "Service request",
    status: item.status ?? null,
    note: item.notes ?? item.customerItemNote ?? null,
    description: item.notes ?? null,
    vendor: item.vendor ?? null,
    vendorName: item.vendor?.name ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}
