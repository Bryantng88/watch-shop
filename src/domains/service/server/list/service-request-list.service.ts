import { Prisma, ServiceRequestStatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import * as repo from "../repository/service-request.repo";
import type {
  ServiceRequestSearchInput,
  ServiceRequestListSort,
  ServiceRequestViewKey,
} from "./service-request-search-params";

export type ServiceRequestListItem = {
  id: string;
  refNo: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  serviceName: string | null;
  serviceCode: string | null;
  orderId: string | null;
  orderRefNo: string | null;
  scope: string | null;
  customerItemNote: string | null;
  vendorName: string | null;
  technicianName: string | null;
  maintenanceCount: number;
  issueCount: number;
  openIssueCount: number;
  productId: string | null;
  source: string | null;
  productTitle: string | null;
  primaryImageUrl: string | null;
  skuSnapshot: string | null;
};

function buildOrderBy(sort?: ServiceRequestListSort): Prisma.ServiceRequestOrderByWithRelationInput {
  switch (sort) {
    case "createdAsc": return { createdAt: "asc" };
    case "createdDesc": return { createdAt: "desc" };
    case "updatedAsc": return { updatedAt: "asc" };
    case "updatedDesc":
    default: return { updatedAt: "desc" };
  }
}

export function serviceRequestViewWhere(view?: ServiceRequestViewKey): Prisma.ServiceRequestWhereInput | undefined {
  switch (view) {
    case "draft": return { status: ServiceRequestStatus.DRAFT };
    case "in_progress": return { status: { in: [ServiceRequestStatus.DIAGNOSING, ServiceRequestStatus.WAIT_APPROVAL, ServiceRequestStatus.IN_PROGRESS] } };
    case "done": return { status: { in: [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.DELIVERED] } };
    case "canceled": return { status: ServiceRequestStatus.CANCELED };
    default: return undefined;
  }
}

function combineWhere(a?: Prisma.ServiceRequestWhereInput, b?: Prisma.ServiceRequestWhereInput): Prisma.ServiceRequestWhereInput {
  if (a && b) return { AND: [a, b] };
  return a ?? b ?? {};
}

function buildSearchWhere(q?: string | null): Prisma.ServiceRequestWhereInput {
  const keyword = String(q ?? "").trim();
  if (!keyword) return {};

  return {
    OR: [
      { id: { contains: keyword, mode: "insensitive" } },
      { refNo: { contains: keyword, mode: "insensitive" } },
      { notes: { contains: keyword, mode: "insensitive" } },
      { vendorNameSnap: { contains: keyword, mode: "insensitive" } },
      { technicianNameSnap: { contains: keyword, mode: "insensitive" } },
      { skuSnapshot: { contains: keyword, mode: "insensitive" } as any },
      { product: { is: { title: { contains: keyword, mode: "insensitive" } } } },
      { serviceCatalog: { is: { name: { contains: keyword, mode: "insensitive" } } } },
      { orderItem: { is: { order: { is: { refNo: { contains: keyword, mode: "insensitive" } } } } } },
    ],
  };
}

export async function getAdminServiceRequestList(input: ServiceRequestSearchInput) {
  const { page, pageSize, q, sort, view } = input;
  const baseWhere = buildSearchWhere(q);
  const where = combineWhere(baseWhere, serviceRequestViewWhere(view));
  const skip = (page - 1) * pageSize;

  const { rows, total } = await repo.getServiceRequestList(where, buildOrderBy(sort), skip, pageSize, prisma);

  const [cAll, cDraft, cInProgress, cDone, cCanceled] = await Promise.all([
    prisma.serviceRequest.count({ where: baseWhere }),
    prisma.serviceRequest.count({ where: combineWhere(baseWhere, serviceRequestViewWhere("draft")) }),
    prisma.serviceRequest.count({ where: combineWhere(baseWhere, serviceRequestViewWhere("in_progress")) }),
    prisma.serviceRequest.count({ where: combineWhere(baseWhere, serviceRequestViewWhere("done")) }),
    prisma.serviceRequest.count({ where: combineWhere(baseWhere, serviceRequestViewWhere("canceled")) }),
  ]);

  const items: ServiceRequestListItem[] = rows.map((r) => ({
    id: r.id,
    refNo: r.refNo ?? null,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    serviceName: r.serviceCatalog?.name ?? "Kiểm tra kỹ thuật",
    serviceCode: r.serviceCatalog?.code ?? null,
    orderId: r.orderItem?.order?.id ?? null,
    orderRefNo: r.orderItem?.order?.refNo ?? null,
    scope: r.scope ?? null,
    vendorName: r.vendorName ?? null,
    technicianName: r.technicianName ?? null,
    customerItemNote: r.orderItem?.customerItemNote ?? null,
    maintenanceCount: r.maintenanceCount ?? 0,
    issueCount: r.issueCount ?? 0,
    openIssueCount: r.openIssueCount ?? 0,
    productId: r.productId ?? null,
    source: r.orderItem?.order?.id ? "SERVICE_FROM_ORDER" : "QUICK_SERVICE_FROM_WATCH",
    productTitle: r.productTitle ?? null,
    primaryImageUrl: r.primaryImageUrl ?? null,
    skuSnapshot: r.skuSnapshot ?? null,
  }));

  return { items, total, page, pageSize, counts: { all: cAll, draft: cDraft, in_progress: cInProgress, done: cDone, canceled: cCanceled } };
}
