import { prisma, DB, dbOrTx } from "@/server/db/client";
import { Prisma, PrismaClient } from "@prisma/client";

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


export async function createMany(tx: DB, data: Prisma.ServiceRequestCreateManyInput[]) {
  const db = dbOrTx(tx)
  return db.serviceRequest.createMany({ data });
}

export async function getServiceCatalogList(
  where: Prisma.ServiceCatalogWhereInput,
  orderBy: Prisma.ServiceCatalogOrderByWithRelationInput,
  skip: number,
  take: number,
  prisma: PrismaClient
) {
  const [rows, total] = await prisma.$transaction([
    prisma.serviceCatalog.findMany({
      where,
      orderBy,
      skip,
      take,
      // select tuỳ bạn, để an toàn + nhẹ query
      select: {
        id: true,
        code: true,
        name: true,
        defaultPrice: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.serviceCatalog.count({ where }),
  ]);

  return { rows, total };
}