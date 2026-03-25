
import { prisma, DB, dbOrTx } from "@/server/db/client";
import { Prisma, ServiceRequestStatus, ProductStatus, ServiceScope, ServiceType } from "@prisma/client";

export type ServiceRequestListRow = {
  id: string;
  refNo: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  scope: string | null;
  productTitle: string | null;
  serviceCatalog: { id: string; code: string | null; name: string } | null;
  vendorName: string | null;
  technicianName: string | null;
  maintenanceCount: number;
  orderItem: {
    id: string;
    title: string | null;
    serviceScope: string | null;
    customerItemNote: string | null;
    order: { id: string; refNo: string | null } | null;
  } | null;
};

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
        scope: true,
        vendorNameSnap: true,
        technicianNameSnap: true,
        product: { select: { id: true, title: true } },
        ServiceCatalog: { select: { id: true, code: true, name: true } },
        _count: { select: { maintenance: true } },
        orderItem: {
          select: {
            id: true,
            title: true,
            serviceScope: true,
            customerItemNote: true,
            order: { select: { id: true, refNo: true } },
          },
        },
      },
    }),
    db.serviceRequest.count({ where }),
  ]);

  const mapped: ServiceRequestListRow[] = rows.map((r) => ({
    id: r.id,
    refNo: r.refNo ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    scope: r.scope ?? null,
    productTitle: r.product?.title ?? null,
    status: r.status,
    vendorName: r.vendorNameSnap ?? null,
    technicianName: r.technicianNameSnap ?? null,
    serviceCatalog: r.ServiceCatalog ? { id: r.ServiceCatalog.id, code: r.ServiceCatalog.code ?? null, name: r.ServiceCatalog.name } : null,
    maintenanceCount: r._count.maintenance,
    orderItem: r.orderItem ? {
      id: r.orderItem.id,
      title: r.orderItem.title ?? null,
      serviceScope: (r.orderItem as any).serviceScope ?? null,
      customerItemNote: (r.orderItem as any).customerItemNote ?? null,
      order: r.orderItem.order ? { id: r.orderItem.order.id, refNo: r.orderItem.order.refNo ?? null } : null,
    } : null,
  }));

  return { rows: mapped, total };
}

export async function getOptions(tx: DB, opts?: { isActive?: boolean }) {
  const db = dbOrTx(tx);
  return db.serviceCatalog.findMany({
    where: typeof opts?.isActive === 'boolean' ? { isActive: opts.isActive } : {},
    orderBy: [{ name: 'asc' }],
    select: { id: true, code: true, name: true, defaultPrice: true },
  });
}

export async function createMany(tx: DB, data: Prisma.ServiceRequestCreateManyInput[]) {
  const db = dbOrTx(tx);
  return db.serviceRequest.createMany({ data });
}

export async function createOne(tx: DB, data: Prisma.ServiceRequestCreateInput) {
  const db = dbOrTx(tx);
  return db.serviceRequest.create({ data });
}

export async function findProductForService(tx: DB, productId: string) {
  const db = dbOrTx(tx);
  return db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      status: true,
      brand: { select: { name: true } },
      watchSpec: { select: { model: true, ref: true } },
      variants: {
        orderBy: [{ stockQty: 'desc' }, { createdAt: 'asc' }],
        select: { id: true },
        take: 1,
      },
    },
  });
}

export async function findDefaultTechnician(tx: DB) {
  const db = dbOrTx(tx);

  return db.user.findFirst({
    where: {
      isActive: true,
      roles: {
        some: { name: "TECHNICIAN" },
      },
    },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function createTechnicalCheckRequest(
  tx: DB,
  input: {
    refNo?: string | null;
    productId: string;
    variantId?: string | null;
    notes?: string | null;
    billable?: boolean;
    type?: ServiceType;
    scope?: ServiceScope | null;
    status?: ServiceRequestStatus;
    brandSnapshot?: string | null;
    modelSnapshot?: string | null;
    refSnapshot?: string | null;
    technicianId?: string | null;
    technicianNameSnap?: string | null;
  }
) {
  const db = dbOrTx(tx);

  return db.serviceRequest.create({
    data: {
      refNo: input.refNo ?? null,
      type: input.type ?? ServiceType.PAID,
      billable: input.billable ?? false,
      productId: input.productId,
      variantId: input.variantId ?? null,
      scope: input.scope ?? ServiceScope.WITH_PURCHASE,
      status: input.status ?? ServiceRequestStatus.DRAFT,
      notes: input.notes ?? null,
      brandSnapshot: input.brandSnapshot ?? null,
      modelSnapshot: input.modelSnapshot ?? null,
      refSnapshot: input.refSnapshot ?? null,
      technicianId: input.technicianId ?? null,
      technicianNameSnap: input.technicianNameSnap ?? null,
    },
  });
}

export async function markProductInService(tx: DB, productId: string) {
  const db = dbOrTx(tx);

  return db.product.update({
    where: { id: productId },
    data: {
      status: ProductStatus.IN_SERVICE,
    },
  });
}

export async function countOpenTechnicalRequests(tx: DB, productId: string) {
  const db = dbOrTx(tx);

  return db.serviceRequest.count({
    where: {
      productId,
      status: {
        in: ["DRAFT", "IN_PROGRESS"] as any,
      },
    },
  });
}

export async function markProductPosted(tx: DB, productId: string) {
  const db = dbOrTx(tx);

  return db.product.update({
    where: { id: productId },
    data: {
      status: ProductStatus.POSTED,
    },
  });
}
export async function listServiceCatalogRepo(tx: DB, opts?: { isActive?: boolean }) {
  const db = dbOrTx(tx);
  return db.serviceCatalog.findMany({
    where: typeof opts?.isActive === 'boolean' ? { isActive: opts.isActive } : {},
    orderBy: { name: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      detail: true,
      defaultPrice: true,
      durationMin: true,
      isActive: true,
    },
  });
}

export async function findVendorsLite(tx: DB) {
  const db = dbOrTx(tx);
  return db.vendor.findMany({ select: { id: true, name: true }, orderBy: { updatedAt: 'desc' } });
}

export async function completeServiceRequestOne(tx: DB, input: { id: string; completedAt?: Date | null }) {
  const db = dbOrTx(tx);
  return db.serviceRequest.update({
    where: { id: input.id },
    data: {
      status: ServiceRequestStatus.COMPLETED,
      updatedAt: input.completedAt ?? new Date(),
    },
    select: {
      id: true,
      status: true,
      vendorId: true,
      vendorNameSnap: true,
      technicianId: true,
      technicianNameSnap: true,
      productId: true,
      variantId: true,
      brandSnapshot: true,
      modelSnapshot: true,
      refSnapshot: true,
      serialSnapshot: true,
    },
  });
}
