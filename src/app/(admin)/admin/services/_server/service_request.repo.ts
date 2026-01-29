import { prisma, DB, dbOrTx } from "@/server/db/client";
import { Prisma, PrismaClient } from "@prisma/client";

type Tx = Prisma.TransactionClient | typeof prisma;
export type ServiceRequestListRow = {
  id: string;
  refNo: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  // hiển thị "Dịch vụ"
  serviceCatalog: { id: string; code: string | null; name: string } | null;

  // hiển thị "Order", "Scope", notes đồ khách mang tới...
  orderItem: {
    id: string;
    title: string;
    serviceScope: any | null; // ServiceScope enum
    customerItemNote: string | null;
    order: { id: string; refNo: string | null } | null;
  } | null;
};

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

export async function getServiceRequestList(
  where: Prisma.ServiceRequestWhereInput,
  orderBy: Prisma.ServiceRequestOrderByWithRelationInput,
  skip: number,
  take: number,
  tx: DB
) {
  const db = dbOrTx(tx);

  const [rows, total] = await Promise.all([
    db.serviceRequest.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        refNo: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        // ✅ Dịch vụ
        ServiceCatalog: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },

        // ✅ Link về Order + Scope
        orderItem: {
          select: {
            id: true,
            title: true,
            serviceScope: true,
            customerItemNote: true,
            order: {
              select: {
                id: true,
                refNo: true,
              },
            },
          },
        },
      },
    }),
    db.serviceRequest.count({ where }),
  ]);

  const mapped: ServiceRequestListRow[] = rows.map((r) => ({
    id: r.id,
    refNo: r.refNo ?? null,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    serviceCatalog: r.ServiceCatalog
      ? { id: r.ServiceCatalog.id, code: r.ServiceCatalog.code ?? null, name: r.ServiceCatalog.name }
      : null,
    orderItem: r.orderItem
      ? {
        id: r.orderItem.id,
        title: r.orderItem.title,
        serviceScope: (r.orderItem as any).serviceScope ?? null,
        customerItemNote: (r.orderItem as any).customerItemNote ?? null,
        order: r.orderItem.order
          ? { id: r.orderItem.order.id, refNo: r.orderItem.order.refNo ?? null }
          : null,
      }
      : null,
  }));

  return { rows: mapped, total };
}