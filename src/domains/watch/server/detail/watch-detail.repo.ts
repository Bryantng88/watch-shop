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

export async function getAdminWatchMediaEditDetail(db: DB, productId: string) {
  const client = dbOrTx(db);

  return client.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      productId: true,
      acquisitionId: true,
      gender: true,
      siteChannel: true,
      stockStage: true,
      saleStage: true,
      serviceStage: true,
      movementType: true,
      movementCalibre: true,
      style: true,
      yearText: true,
      hasBox: true,
      hasPapers: true,
      specStatus: true,
      notes: true,
      conditionGrade: true,
      isContentDownloaded: true,
      isImageDownloaded: true,
      serialNumber: true,
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          sku: true,
          primaryImageUrl: true,
          storefrontImageKey: true,
          seoTitle: true,
          seoDescription: true,
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
          productCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          postTargets: {
            include: {
              postTarget: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              fileKey: true,
              role: true,
              isForAdmin: true,
              isForStorefront: true,
              sortOrder: true,
              alt: true,
            },
          },
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
    },
  });
}

export async function getAdminWatchDetail(db: DB, productId: string) {
  return getAdminWatchRow(db, productId);
}

export async function getLatestWatchVariantForAdmin(_db: DB, _productId: string) {
  void _db;
  void _productId;
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
      select: {
        id: true,
        acquisitionId: true,
        status: true,
        unitCost: true,
        createdAt: true,
        updatedAt: true,
        acquisition: {
          select: {
            refNo: true,
            accquisitionStt: true,
            type: true,
            createdAt: true,
            updatedAt: true,
            vendor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    client.orderItem.findMany({
      where: { productId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        orderId: true,
        unitPriceAgreed: true,
        listPrice: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            refNo: true,
            status: true,
            customerName: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    }),
  ]);

  return {
    acquisitions: acquisitionItems.map((item) => ({
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

    orders: orderItems.map((item) => ({
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
    select: {
      id: true,
      refNo: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      serviceCatalog: {
        select: {
          name: true,
        },
      },
      orderItem: {
        select: {
          customerItemNote: true,
        },
      },
      vendor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return rows.map((item) => ({
    id: item.id,
    issue: item.refNo ?? item.serviceCatalog?.name ?? "Service request",
    title: item.refNo ?? "Service request",
    status: item.status ?? null,
    note: item.notes ?? item.orderItem?.customerItemNote ?? null,
    description: item.notes ?? null,
    vendor: item.vendor ?? null,
    vendorName: item.vendor?.name ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}
