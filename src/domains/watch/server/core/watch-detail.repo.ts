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
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
      watchMedia: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getAdminEditWatchDetail(db: DB, productId: string) {
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
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
      watchMedia: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
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
      serviceState: {
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

export async function getWatchTradeHistory(_db: DB, _productId: string) {
  return [];
}

export async function getWatchServiceHistory(db: DB, productId: string) {
  const client = dbOrTx(db);

  return client.serviceRequest.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      vendor: true,
    },
  });
}