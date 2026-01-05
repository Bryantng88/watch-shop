import { prisma, DB, dbOrTx } from "@/server/db/client";
import { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient | typeof prisma;

export async function listServiceCatalogRepo(
  tx: DB,
  opts?: {
    isActive?: boolean;
  }
) {
  const db = dbOrTx(tx)
  return db.serviceCatalog.findMany({
    where: {
      ...(opts?.isActive !== undefined
        ? { isActive: opts.isActive }
        : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      detail: true,          // enum ServiceDetail
      defaultPrice: true,
      durationMin: true,
      isActive: true,
    },
  });
}



export function createServiceRequest(
  tx: DB,
  data: {
    orderItemId: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }
) {
  const db = dbOrTx(tx)
  return db.serviceRequest.create({
    data: {
      orderItemId: data.orderItemId,
      //title: data.title,
      //quantity: data.quantity,
      //unitPrice: data.unitPrice,
      status: "PENDING",
    },
  });
}


