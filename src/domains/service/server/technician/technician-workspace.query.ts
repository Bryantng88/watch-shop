import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import type {
  TechnicianData,
  TechnicianView,
} from "../../shared/technician-workspace";
export function technicianStageWhere(
  view: TechnicianView,
): Prisma.TechnicalIssueWhereInput {
  if (view === "IN_PROGRESS") return { executionStatus: "IN_PROGRESS" };
  if (view === "READY")
    return {
      OR: [
        { executionStatus: "CONFIRMED" },
        { executionStatus: "OPEN", isConfirmed: true },
      ],
    };
  if (view === "INSPECT")
    return { executionStatus: "OPEN", isConfirmed: false };
  if (view === "DONE") return { executionStatus: "DONE" };
  if (view === "CANCELED") return { executionStatus: "CANCELED" };
  if (view === "ALL") return {};
  return { executionStatus: { in: ["OPEN", "CONFIRMED", "IN_PROGRESS"] } };
}
export async function getTechnicianWorkspace(input: {
  q: string;
  view: TechnicianView;
  page: number;
}): Promise<TechnicianData> {
  const actor = await requirePermission("SERVICE_VIEW");
  const search: Prisma.TechnicalIssueWhereInput = input.q
    ? {
        OR: [
          { summary: { contains: input.q, mode: "insensitive" } },
          {
            serviceRequest: {
              refNo: { contains: input.q, mode: "insensitive" },
            },
          },
          {
            serviceRequest: {
              product: { title: { contains: input.q, mode: "insensitive" } },
            },
          },
          {
            serviceRequest: {
              product: { sku: { contains: input.q, mode: "insensitive" } },
            },
          },
        ],
      }
    : {};
  const where = { AND: [search, technicianStageWhere(input.view)] };
  const pageSize = 25;
  const total = await prisma.technicalIssue.count({ where });
  const page = Math.max(
    1,
    Math.min(input.page, Math.ceil(total / pageSize) || 1),
  );
  const [rows, active, processing, ready, inspect, details, vendors] =
    await Promise.all([
      prisma.technicalIssue.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: [
          { expectedCompletionAt: { sort: "asc", nulls: "last" } },
          { openedAt: "desc" },
          { id: "asc" },
        ],
        select: {
          id: true,
          summary: true,
          note: true,
          updatedAt: true,
          executionStatus: true,
          isConfirmed: true,
          area: true,
          actionMode: true,
          vendorId: true,
          vendorNameSnap: true,
          user: { select: { name: true } },
          technicalDetailCatalogId: true,
          expectedWorkingDays: true,
          expectedCompletionAt: true,
          actualCost: true,
          estimatedCost: true,
          resolutionNote: true,
          priority: true,
          serviceRequest: {
            select: {
              id: true,
              refNo: true,
              product: {
                select: { title: true, sku: true, primaryImageUrl: true },
              },
            },
          },
        },
      }),
      prisma.technicalIssue.count({
        where: { AND: [search, technicianStageWhere("ACTIVE")] },
      }),
      prisma.technicalIssue.count({
        where: { AND: [search, technicianStageWhere("IN_PROGRESS")] },
      }),
      prisma.technicalIssue.count({
        where: { AND: [search, technicianStageWhere("READY")] },
      }),
      prisma.technicalIssue.count({
        where: { AND: [search, technicianStageWhere("INSPECT")] },
      }),
      prisma.technicalDetailCatalog.findMany({
        where: { isActive: true },
        orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, area: true, code: true, name: true },
      }),
      prisma.vendor.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);
  return {
    items: rows.map((row) => ({
      ...row,
      summary: row.summary || "Phiếu kỹ thuật",
      note: row.note ?? "",
      updatedAt: row.updatedAt.toISOString(),
      vendorName: row.vendorNameSnap,
      technicianName: row.user?.name ?? null,
      actualCost: row.actualCost === null ? null : Number(row.actualCost),
      estimatedCost:
        row.estimatedCost === null ? null : Number(row.estimatedCost),
      resolutionNote: row.resolutionNote ?? "",
      expectedCompletionAt: row.expectedCompletionAt?.toISOString() ?? null,
      serviceRequest: {
        id: row.serviceRequest.id,
        refNo: row.serviceRequest.refNo ?? row.serviceRequest.id,
        productTitle: row.serviceRequest.product?.title ?? "Đồng hồ",
        sku: row.serviceRequest.product?.sku ?? null,
        imageUrl: row.serviceRequest.product?.primaryImageUrl ?? null,
      },
    })),
    total,
    page,
    pageSize,
    view: input.view,
    q: input.q,
    counts: { active, processing, ready, inspect },
    details,
    vendors,
    canUpdate:
      actor.roles.includes("ADMIN") ||
      actor.permissions.includes("SERVICE_UPDATE"),
  };
}
