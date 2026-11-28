import { readConsignment } from "@/domains/consignment/shared/contract";
import type { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { authorizeTaskItemDetail } from "@/domains/task/server/core/task-item-detail.service";
import { buildAccessWhere } from "@/domains/task/server/core/task.repo.shared";
import { authCanViewAllTasks } from "@/domains/task/server/task-auth";
import { personalWorkViewAccessWhere } from "@/domains/personal-work/server/personal-work-access";
import type { WatchServiceProjection } from "../../shared/watch-detail.projection";
import type { WatchOperationalOverview, WatchRelatedWork } from "../../shared/watch-operational-overview";

type Viewer = { id: string; permissions: string[]; roles: string[] };
/** Read-only watch overview. Existing task/personal-work policies decide visibility. */
export async function getWatchOperationalOverview(db: DB, productId: string, viewer: Viewer, service: WatchServiceProjection): Promise<WatchOperationalOverview | null> {
  const watch = await db.watch.findUnique({ where: { productId }, select: { id: true, acquisitionId:true, saleStage: true, stockStage: true, product: { select: { status: true } } } });
  if (!watch) return null;
  const productStatus = String(watch.product.status);
  const sale = String(watch.saleStage);
  const acquisition=watch.acquisitionId?await db.acquisition.findUnique({where:{id:watch.acquisitionId},select:{consignment:true}}):null;
  const received=readConsignment(acquisition?.consignment);
  const consign = received?.direction === "IN" && received.status === "ACTIVE" ? "CONSIGNED_FROM" : [productStatus, sale].find(status => ["CONSIGNED_TO", "CONSIGNED_FROM"].includes(status)) ?? "NONE";
  const result: WatchOperationalOverview = {
    sale: productStatus === "SOLD" || sale === "SOLD" ? "SOLD" : sale,
    stock: String(watch.stockStage), consignment: productStatus === "SOLD" || sale === "SOLD" ? "NONE" : consign,
    serviceCompleted: service.requests.filter(request => ["COMPLETED", "DELIVERED"].includes(request.status)).length,
    serviceOpen: service.activeRequestCount,
    workVisible: Boolean(viewer.id) && (viewer.permissions.includes("TASK_VIEW") || viewer.permissions.includes("ADMIN") || viewer.roles.includes("ADMIN")),
    active: [], completed: [],
  };
  if (!result.workVisible) return result;
  const serviceIds = service.requests.map(request => request.id);
  const issueIds = service.requests.flatMap(request => request.issues.map(issue => issue.id));
  const watchIds = [watch.id, productId];
  const targets: Prisma.TaskExecutionWhereInput[] = [
    { targetType: "WATCH", targetId: { in: watchIds } },
    ...(serviceIds.length ? [{ targetType: "SERVICE_REQUEST" as const, targetId: { in: serviceIds } }] : []),
    ...(issueIds.length ? [{ targetType: "TECHNICAL_ISSUE" as const, targetId: { in: issueIds } }] : []),
  ];
  const parentLinks: Prisma.TaskWhereInput[] = [
    { watchId: watch.id }, { workCase: { watchId: watch.id } },
    ...(serviceIds.length ? [{ serviceRequestId: { in: serviceIds } }] : []),
    ...(issueIds.length ? [{ technicalIssueId: { in: issueIds } }] : []),
  ];
  const linked: Prisma.TaskItemWhereInput = { OR: [
    { executions: { some: { actionType: { not: "CANCELLED" }, OR: targets } } },
    { task: { OR: parentLinks } },
  ] };
  const [business, personal, legacy] = await Promise.all([
    db.taskItem.findMany({ where: { AND: [linked, { personalOwnerUserId: null, OR: [{ taskId: null }, { task: { kind: { not: "PERSONAL" } } }] }] },
      select: { id: true, title: true, status: true, updatedAt: true, completedAt: true, note: true, userId: true, assignedToUserId: true, assignedToUser: { select: { name: true } }, task: { select: { kind: true, createdByUserId: true, assignedToUserId: true } } }, orderBy: [{ updatedAt: "desc" }, { id: "asc" }] }),
    db.taskItem.findMany({ where: { AND: [linked, personalWorkViewAccessWhere(viewer.id)] },
      select: { id: true, title: true, status: true, updatedAt: true, completedAt: true, assignedToUser: { select: { name: true } } }, orderBy: [{ updatedAt: "desc" }, { id: "asc" }] }),
    db.task.findMany({ where: { AND: [buildAccessWhere(viewer.id, authCanViewAllTasks(viewer)), { taskItems: { none: {} } }, { OR: parentLinks }] },
      select: { id: true, title: true, status: true, updatedAt: true, completedAt: true, assignedToUser: { select: { name: true } } }, orderBy: [{ updatedAt: "desc" }, { id: "asc" }] }),
  ]);
  const authorized = business.filter(item => { try { authorizeTaskItemDetail(item, viewer); return true; } catch { return false; } });
  const unique = new Map<string, WatchRelatedWork>();
  for (const item of [...authorized, ...personal, ...legacy]) {
    if (item.status === "CANCELLED") continue;
    unique.set(item.id, { id: item.id, title: item.title, status: item.status, assignee: item.assignedToUser?.name ?? null, updatedAt: item.updatedAt.toISOString(), completedAt: item.completedAt?.toISOString() ?? null });
  }
  const items = [...unique.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
  result.active = items.filter(item => item.status !== "DONE");
  result.completed = items.filter(item => item.status === "DONE");
  return result;
}
